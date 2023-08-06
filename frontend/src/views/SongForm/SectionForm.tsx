import { Control, Controller, FieldErrors, UseFieldArrayInsert, UseFieldArrayRemove, UseFieldArraySwap, UseFormRegister, useFieldArray, useWatch } from "react-hook-form";
import { ChordLyric, Section, Song, defaultChordLyric } from "../../types/songs";
import ChordForm from "./ChordForm";
import Select from 'react-select'
import { Chord, Key } from "../../types/chords";
import { getAllKeys, keyToString } from "../../utils/chords";
import _ from "lodash";
import { isDefaultChordLyric, isDefaultSection } from "../../utils/songs";
import SwapGroup from "./SwapGroup";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css'; // optional
import styles from './SectionForm.module.scss';

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

interface SectionProps {
    section: Section;
    sectionIndex: number;
    control: Control<Song>;
    register: UseFormRegister<Song>;
    errors: FieldErrors<Song>;
    removeSection: UseFieldArrayRemove;
    insertSection: UseFieldArrayInsert<Song, "sections">;
    swapSection: UseFieldArraySwap;
    numSections: number;
}

const allKeys: Key[] = getAllKeys();

export function SectionForm( { section, sectionIndex, control, register, errors, removeSection, insertSection, swapSection, numSections }: SectionProps ) {

    const { fields: chords, append: appendChord, remove: removeChord, swap: swapChord, insert: insertChord } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: `sections.${sectionIndex}.chords` as const, // unique name for your Field Array
        rules: { minLength: 1 },
    });

    return (
        <div className={styles.mainContainer}>
            <div className={styles.controlsContainer}>
                <DeleteSection control={control} remove={removeSection} sectionIndex={sectionIndex} />
                <CloneSection control={control} sectionIndex={sectionIndex} insert={insertSection}></CloneSection>
                <SwapGroup isSwapUp index={sectionIndex} swap={swapSection} />
                <SwapGroup isSwapUp={false} index={sectionIndex} swap={swapSection} length={numSections} />
                <label onClick={ () => appendChord(defaultChordLyric) }>Add Chord</label>
            </div>
            <div>
                <label>Section Title</label>
                <input {...register(`sections.${sectionIndex}.title`, { required:true })} />
                {
                    errors.sections?.[sectionIndex]?.title && <div>Error, title cannot be empty</div>
                }
            </div>
            <div> 
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
            { chords.map((field, chordIndex) => (
                    <ChordForm 
                        key={field.id}
                        chordLyric={field} 
                        sectionIndex={sectionIndex} 
                        chordIndex={chordIndex} 
                        register={register} 
                        control={control} 
                        remove={removeChord} 
                        insert={insertChord} 
                        swap={swapChord} 
                        numChords={chords.length}/>
            )) }
        </div>
    )
}