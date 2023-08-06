import { useForm, useFieldArray, useWatch, Control, UseFieldArrayRemove, UseFieldArrayInsert, Controller } from "react-hook-form";
import { Section, Song, defaultSection, defaultSong } from "../../types/songs";
import { SectionForm } from "./SectionForm";
import _ from "lodash";
import Select from 'react-select'
import { isDefaultSection } from "../../utils/songs";
import SwapGroup from "./SwapGroup";
import { Key } from "../../types/chords";
import { getAllKeys, keyToString } from "../../utils/chords";

function CloneSection({ control, insert, sectionIndex }: {control: Control<Song>, insert: UseFieldArrayInsert<Song, "sections">, sectionIndex:number}) {
    const sectionValue: Section = useWatch({
      control,
      name: `sections.${sectionIndex}`
    });
  
    return (
      <label onClick={() => insert(sectionIndex + 1, sectionValue)}>Copy</label>
    )
}

function DeleteSection({ control, remove, sectionIndex }: {control: Control<Song>, remove: UseFieldArrayRemove, sectionIndex: number}) {
    function handleDeleteSection(section: Section) {
        if (isDefaultSection(section)) {
            remove(sectionIndex)
        } else if (window.confirm("Delete section?")) {
            remove(sectionIndex);
        }
    }

    const sectionValue = useWatch({
      control,
      name: `sections.${sectionIndex}`
    })
  
    return (
      <label onClick={ () => handleDeleteSection(sectionValue) }>Delete Section</label>
    )
  }

  const allKeys: Key[] = getAllKeys();

export default function SongForm() {

    // load song from here if edit mode
    const loadedSong: Song = defaultSong;

    const { control, register, reset, formState: { errors }, handleSubmit } = useForm<Song>({
        defaultValues: loadedSong,
    });
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "sections", // unique name for your Field Array
        rules: { minLength: 1 },
    });

    const onSubmit = handleSubmit((data) => {
        alert(JSON.stringify(data));
    })

    return (
        <div>
            <form onSubmit={onSubmit}>
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
                            defaultValue={ (allKeys.find((key: Key) => _.isEqual(key, loadedSong.key))) }
                        />
                    ) }
                />
                {   
                    fields.map((field, sectionIndex) => (
                        // important to include key with field's id
                        <div key={field.id}> 
                            <SectionForm section={field} sectionIndex={sectionIndex} control={control} register={register} errors={errors} />
                            <div className="songForm__sectionButtonContainer">
                            <DeleteSection control={control} remove={remove} sectionIndex={sectionIndex} />
                            <CloneSection control={control} sectionIndex={sectionIndex} insert={insert}></CloneSection>
                            <SwapGroup isSwapUp index={sectionIndex} swap={swap} />
                            <SwapGroup isSwapUp={false} index={sectionIndex} swap={swap} length={fields.length} />
                            </div>
                        </div>
                    ))
                }
                <div className="songForm__songButtons">
                    <label onClick={ () => append(defaultSection) }>Add Section</label>
                    <input type="submit" className="songForm__submitButton" />
                </div>

            </form>
        </div>
    )
}