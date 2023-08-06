import { Control, Controller, FieldErrors, UseFieldArrayInsert, UseFieldArrayRemove, UseFormRegister, useFieldArray, useWatch } from "react-hook-form";
import { ChordLyric, Section, Song, defaultChordLyric } from "../../types/songs";
import ChordForm from "./ChordForm";
import Select from 'react-select'
import { Chord, Key } from "../../types/chords";
import { getAllKeys, keyToString } from "../../utils/chords";
import _ from "lodash";
import { isDefaultChordLyric } from "../../utils/songs";
import SwapGroup from "./SwapGroup";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css'; // optional

interface SectionProps {
    section: Section;
    sectionIndex: number;
    control: Control<Song>;
    register: UseFormRegister<Song>;
    errors: FieldErrors<Song>;
}

const allKeys: Key[] = getAllKeys();

function CloneChord({ control, insert, sectionIndex, chordIndex }: {control: Control<Song>, insert: UseFieldArrayInsert<Song, `sections.${number}.chords`>, sectionIndex: number, chordIndex: number}) {
    const chordValue = useWatch({
      control,
      name: `sections.${sectionIndex}.chords.${chordIndex}`
    });
  
    return (
      <label onClick={() => insert(chordIndex + 1, chordValue)}>Copy</label>
    )
  }

function DeleteChord({ control, remove, sectionIndex, chordIndex }: {control: Control<Song>, remove: UseFieldArrayRemove, sectionIndex: number, chordIndex: number}) {

    function handleDeleteChord(chordLyric: ChordLyric) {
        if (isDefaultChordLyric(chordLyric)) {
            remove(chordIndex);
        } else if (window.confirm("Delete chord?")) {
            console.log(chordLyric, defaultChordLyric);
            remove(chordIndex);
        }
    } 
    const chordValue = useWatch({
        control, 
        name: `sections.${sectionIndex}.chords.${chordIndex}`
    })

    return (
        <label onClick={ () => handleDeleteChord(chordValue) }>Delete Chord</label>
    )
}

export function SectionForm( { section, sectionIndex, control, register, errors }: SectionProps ) {

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: `sections.${sectionIndex}.chords` as const, // unique name for your Field Array
        rules: { minLength: 1 },
    });

    return (
        <>
        <div className="songForm__sectionName">
            <label>Section Title</label>
            <input {...register(`sections.${sectionIndex}.title`, { required:true })} />
            {
                errors.sections?.[sectionIndex]?.title && <div>Error, title cannot be empty</div>
            }
        </div>
        <div className="songForm__sectionKey"> 
            <Tippy content="Section Key will overide Song Key. If you want to use Song Key for this section, select N/A. Numeric chords will not be available if no Song or Section key is selected">
                <label>Section key</label>
            </Tippy>
            <Controller
                name={ `sections.${sectionIndex}.key` } // for register
                control={ control }
                render={ ({ field: { onChange } }) => (
                <Select
                    options={ allKeys }
                    getOptionLabel={(key: Key) => keyToString(key)}
                    getOptionValue={(key: Key) => keyToString(key)}
                    onChange={ selectedOption => onChange(selectedOption) }
                    defaultValue={ (allKeys.find((key: Key) => _.isEqual(key, section.key))) }
                />
                ) }
            />
        </div>

        { fields.map((field, chordIndex) => (
            <div key={field.id} className="songForm__chordContainer">
                <ChordForm chordLyric={field} sectionIndex={sectionIndex} chordIndex={chordIndex} register={register} control={control} />
                <DeleteChord control={control} remove={remove} sectionIndex={sectionIndex} chordIndex={chordIndex} />
                <CloneChord control={control} sectionIndex={sectionIndex} chordIndex={chordIndex} insert={insert}></CloneChord>
                <SwapGroup isSwapUp index={chordIndex} swap={swap} />
                <SwapGroup isSwapUp={false} index={chordIndex} swap={swap} length={fields.length} />
            </div>
        
        )) }

        <label onClick={ () => append(defaultChordLyric) }>Add Chord</label>
        </>
        
    )
}