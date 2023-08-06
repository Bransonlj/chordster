import { useState } from 'react'
import { Control, Controller, UseFieldArrayInsert, UseFieldArrayRemove, UseFieldArraySwap, UseFormRegister, useWatch } from "react-hook-form"
import { ChordLyric, Song, defaultChordLyric } from "../../types/songs"
import { Chord } from "../../types/chords";
import AsyncSelect from 'react-select/async'
import { chordToString, getAllChords } from '../../utils/chords';
import _ from 'lodash'
import { isDefaultChordLyric } from '../../utils/songs';
import SwapGroup from './SwapGroup';
import styles from "./ChordForm.module.scss";

const allChords: Chord[] = getAllChords();

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


const filterChords = (inputValue: string) => {
    return allChords.filter((chord: Chord) =>
      chordToString(chord).toLowerCase().startsWith(inputValue.toLowerCase())
    );
  };
  
  const loadOptions = (inputValue: string, callback: any) => {
    setTimeout(() => {
      callback(filterChords(inputValue));
    }, 1000);
  };

function SelectChord({ onChange, chord }: {onChange: any, chord: Chord}) {

    const [menuIsOpen, setMenuIsOpen] = useState(false);
  
    return (
        <AsyncSelect 
            cacheOptions 
            loadOptions={loadOptions} 
            getOptionLabel={(chord: Chord) => chordToString(chord)}
            getOptionValue={(chord: Chord) => chordToString(chord)} // not needed?
            onChange={ selectedOption => onChange(selectedOption) }
            defaultValue={ allChords.find((chordOption: Chord) => _.isEqual(chordOption, chord)) }
            placeholder="Enter..."
            defaultOptions 
            onInputChange={(value) => {
                if (value) {
                setMenuIsOpen(true);
                } else {
                setMenuIsOpen(false);
                }
            }}
            menuIsOpen={menuIsOpen}
        />
    )
}

interface ChordProps {
    chordLyric: ChordLyric;
    sectionIndex: number;
    chordIndex: number;
    control: Control<Song>;
    register: UseFormRegister<Song>;
    remove: UseFieldArrayRemove;
    insert: UseFieldArrayInsert<Song, `sections.${number}.chords`>;
    swap: UseFieldArraySwap;
    numChords: number
}

export default function ChordForm ({ chordLyric, sectionIndex, chordIndex, register, control, remove, insert, swap, numChords }: ChordProps) {
    return (
        <div className={styles.mainContainer}>
            <label>Chord</label>
            <Controller
                name={ `sections.${sectionIndex}.chords.${chordIndex}.chord` }
                control={ control }
                render={ ({ field: { onChange } }) => (
                    <SelectChord onChange={onChange} chord={chordLyric.chord}/>
                ) }
            />
            <div>
                <label>Lyrics</label>
                <input {...register(`sections.${sectionIndex}.chords.${chordIndex}.lyric`)} />
            </div>
            <div className={styles.controlsContainer}>
                <DeleteChord control={control} remove={remove} sectionIndex={sectionIndex} chordIndex={chordIndex} />
                <CloneChord control={control} sectionIndex={sectionIndex} chordIndex={chordIndex} insert={insert}></CloneChord>
                <SwapGroup isSwapUp index={chordIndex} swap={swap} />
                <SwapGroup isSwapUp={false} index={chordIndex} swap={swap} length={numChords} />
            </div>
        </div>
    )
    }