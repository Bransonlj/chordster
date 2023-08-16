import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Song, defaultSection, defaultSong } from "../../types/songs";
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

const allKeys: Key[] = getAllKeys();

export default function SongForm({song, songId}: {song?: Song, songId?: string}) {

    const isEdit = !!songId;
    const {user} = useAuth();
    const navigate = useNavigate()

    const { error: submitError, isSuccess, isLoading, fetchSong } = useFetchSong(user, `/api/song/protected/${songId ?? ''}`, {}, false);
    const { control, register, reset, formState: { errors }, handleSubmit } = useForm<Song>({
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
        <div>
            {isLoading && <label>Loading</label>}
            {submitError && <label>{submitError}</label>}
            <form onSubmit={onSubmit} className={styles.formContainer}>
                <label>Song Name: </label>
                <input {...register("name", { required: true })} />
                {
                    errors.name && <div>Enter name</div>
                }
                <label>Artist: </label>
                <input {...register("artist", { required: true })} />
                {
                    errors.artist && <div>Enter artist</div>
                }
                <label>Capo: </label>
                <input {...register("capo", { required: true, min: 0, max: 11 })} type='number'/>
                {
                    errors.capo && <div>Enter capo</div>
                }
                <label>Song Key: </label>
                <Controller
                    name={ `key` } // for register
                    control={ control }
                    render={ ({ field: { onChange } }) => (
                        <Select
                            options={ allKeys }
                            getOptionLabel={(key: Key) => keyToString(key)}
                            getOptionValue={(key: Key) => keyToString(key)}
                            onChange={ selectedOption => onChange(selectedOption) }
                            defaultValue={ song?.key }
                        />
                    ) }
                />
                <div>
                    <label onClick={ () => appendSection(defaultSection) }>Add Section</label>
                    <input type="submit"/>
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
                            numSections={sections.length} />

                    ))
                }
                </div>
                <div>
                    <label onClick={ () => appendSection(defaultSection) }>Add Section</label>
                    <button type="submit">{isEdit ? "Save" : "Submit"}</button>
                </div>

            </form>
        </div>
    )
}