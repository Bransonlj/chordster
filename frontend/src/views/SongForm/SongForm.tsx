import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Song } from "../../types/songs";
import { SectionForm } from "./SectionForm";
import _ from "lodash";
import Select from 'react-select'
import { Key } from "../../types/chords";
import { getAllKeys, keyToString } from "../../utils/chords";
import styles from './SongForm.module.scss';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFetchSong } from "../../hooks/useFetchSong";
import { customStyle } from "../../utils/react-select";
import { defaultSong } from "../../utils/songs";

const allKeys: Key[] = getAllKeys();
    
export default function SongForm({song, songId}: {song?: Song, songId?: string}) {

    const isEdit = !!songId;
    const {user} = useAuth();
    const navigate = useNavigate()

    const { error: submitError, isSuccess, isLoading, fetchSong } = useFetchSong(user, `/api/song/protected/${songId ?? ''}`, {}, false);
    const { control, register, reset, formState: { errors }, handleSubmit, getValues } = useForm<Song>({
        defaultValues: defaultSong,
    });
    const { fields: sections, append: appendSection, remove: removeSection, swap: swapSection, insert: insertSection } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "sections", // unique name for your Field Array
        rules: { minLength: 1 },
    });

    useEffect(() => {
        if (song) {
            reset(song);
        }
    }, [song]) 

    useEffect(() => {
        if (isSuccess) {
            alert(isEdit ? "successfully updated" : "successfully added")
            navigate('/song/list')
        }
    }, [isSuccess])

    const onSubmit = handleSubmit((data) => {
        const method = isEdit ? "PUT" : "POST";
        fetchSong({
            method: method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": 'application/json',
                'Authorization': `Bearer ${user?.token}`,
            }
        });
    })

    return (
        <div className={styles.mainContainer}>
            {isLoading && <label>Loading</label>}
            {submitError && <label>{submitError}</label>}
            <form onSubmit={onSubmit} className={styles.formContainer}>
                <div className={styles.headerContainer}>
                        <label>Song Name:</label>
                        <input {...register("name", { required: true })} />
                        <span>{ errors.name && 'Song Name is required' }</span>
                        <label>Artist:</label>
                        <input {...register("artist", { required: true })} />                   
                        <span>{ errors.artist && 'Artist is required' }</span>                  
                        <label>Capo:</label>
                        <input {...register("capo", { required: true, min: 0, max: 11 })} type='number' min={0} max={11}/>
                        <span>{ errors.capo && 'Capo value is required' }</span>
                        <label>Song Key:</label>
                        <Controller
                            name={ `key` } // for register
                            control={ control }
                            render={ ({ field: { onChange } }) => (
                                <Select
                                    styles={customStyle}
                                    options={ allKeys }
                                    getOptionLabel={(key: Key) => keyToString(key)}
                                    getOptionValue={(key: Key) => keyToString(key)}
                                    onChange={ selectedOption => onChange(selectedOption) }
                                    defaultValue={ song?.key }
                                />
                            ) }
                        />
                </div>
                <div className={styles.sectionsContainer}>
                    {   
                        sections.map((field, sectionIndex) => (
                            <SectionForm 
                                key={field.id}
                                section={field} 
                                sectionIndex={sectionIndex} 
                                control={control} 
                                register={register} 
                                errors={errors}
                                removeSection={removeSection}
                                insertSection={insertSection}
                                swapSection={swapSection}
                                numSections={sections.length} 
                                getValues={getValues}/>

                        ))
                    }
                </div>
                <div>
                    <button type="submit">{isEdit ? "Save" : "Submit"}</button>
                </div>

            </form>
        </div>
    )
}