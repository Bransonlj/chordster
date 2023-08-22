import { Control, Controller, FieldErrors, UseFieldArrayInsert, UseFieldArrayRemove, UseFieldArraySwap, UseFormRegister, useFieldArray, useWatch } from "react-hook-form";
import { ChordLyric, Section, Song, defaultChordLyric, defaultSection } from "../../types/songs";
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
import { customStyle } from "../../utils/react-select";
import IconButton from "../Components/IconButton";

function CloneSection({ control, insert, sectionIndex }: {control: Control<Song>, insert: UseFieldArrayInsert<Song, "sections">, sectionIndex:number}) {
    const sectionValue: Section = useWatch({
      control,
      name: `sections.${sectionIndex}`
    });
  
    return (
        <IconButton  onClick={() => insert(sectionIndex + 1, sectionValue)} src='/copy-icon.png' />
    )
}

function DeleteSection({ control, remove, sectionIndex, numSections }: {control: Control<Song>, remove: UseFieldArrayRemove, sectionIndex: number, numSections: number}) {
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
        <IconButton disabled={ numSections === 1 } onClick={ () => handleDeleteSection(sectionValue) } src='/trashcan-icon.png' />

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
            <div className={styles.sectionContainer}>
                <h2>Section {sectionIndex + 1}</h2>
                <div className={styles.sectionInfo}>
                    <label>Section Title</label>
                    <input {...register(`sections.${sectionIndex}.title`, { required:true })} />
                    {
                        errors.sections?.[sectionIndex]?.title && <div>Error, title cannot be empty</div>
                    }
                    <Tippy content="Section Key will overide Song Key. If you want to use Song Key for this section, select N/A. Numeric chords will not be available if no Song or Section key is selected">
                        <label>Section key</label>
                    </Tippy>
                    <Controller
                        name={ `sections.${sectionIndex}.key` } // for register
                        control={ control }
                        render={ ({ field: { onChange } }) => (
                        <Select
                            styles={customStyle}
                            options={ allKeys }
                            getOptionLabel={(key: Key) => keyToString(key)}
                            getOptionValue={(key: Key) => keyToString(key)}
                            onChange={ selectedOption => onChange(selectedOption) }
                            defaultValue={ (allKeys.find((key: Key) => _.isEqual(key, section.key))) }
                        />
                        ) }
                    />
                </div>
                <div className={styles.chordContainer}>
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
            </div>
            <div className={styles.controlsContainer}>
                <DeleteSection control={control} remove={removeSection} sectionIndex={sectionIndex} numSections={numSections} />
                <CloneSection control={control} sectionIndex={sectionIndex} insert={insertSection}></CloneSection>
                <SwapGroup isSwapUp index={sectionIndex} swap={swapSection} />
                <SwapGroup isSwapUp={false} index={sectionIndex} swap={swapSection} length={numSections} />
                <IconButton onClick={() => insertSection(sectionIndex + 1, defaultSection)} src='/plus-icon.png' />
            </div>
        </div>
    )
}