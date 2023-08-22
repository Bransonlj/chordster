import { useState } from 'react'
import { Control, Controller, UseFieldArrayInsert, UseFieldArrayRemove, UseFieldArraySwap, UseFormRegister, useWatch } from "react-hook-form"
import { ChordLyric, Song } from "../../types/songs"
import { Chord } from "../../types/chords";
import AsyncSelect from 'react-select/async'
import { chordToString, getAllChords } from '../../utils/chords';
import _ from 'lodash'
import { defaultChordLyric, isDefaultChordLyric } from '../../utils/songs';
import SwapGroup from './SwapGroup';
import styles from "./ChordForm.module.scss";
import { customStyle } from '../../utils/react-select';
import IconButton from '../Components/IconButton';

const allChords: Chord[] = getAllChords();

function CloneChord({ control, insert, sectionIndex, chordIndex }: {control: Control<Song>, insert: UseFieldArrayInsert<Song, `sections.${number}.chords`>, sectionIndex: number, chordIndex: number}) {
    const chordValue = useWatch({
      control,
      name: `sections.${sectionIndex}.chords.${chordIndex}`
    });
  
    return (
        <IconButton onClick={() => insert(chordIndex + 1, chordValue)} src='/copy-icon.png' />
    )
  }

function DeleteChord({ control, remove, sectionIndex, chordIndex, numChords }: {control: Control<Song>, remove: UseFieldArrayRemove, sectionIndex: number, chordIndex: number, numChords: number}) {

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
        <IconButton disabled={numChords === 1} onClick={ () => handleDeleteChord(chordValue) } src='/trashcan-icon.png' />
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
            styles={customStyle}
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
            <div className={styles.controlsContainer}>
                <DeleteChord control={control} remove={remove} sectionIndex={sectionIndex} chordIndex={chordIndex} numChords={numChords} />
                <CloneChord control={control} sectionIndex={sectionIndex} chordIndex={chordIndex} insert={insert}></CloneChord>
                <SwapGroup isSwapUp index={chordIndex} swap={swap} />
                <SwapGroup isSwapUp={false} index={chordIndex} swap={swap} length={numChords} />
                <IconButton onClick={() => insert(chordIndex + 1, defaultChordLyric)} src='/plus-icon.png' />
            </div>
            <Controller
                name={ `sections.${sectionIndex}.chords.${chordIndex}.chord` }
                control={ control }
                render={ ({ field: { onChange } }) => (
                    <SelectChord onChange={onChange} chord={chordLyric.chord}/>
                ) }
            />
            <div>
                <input placeholder='Enter lyrics...' {...register(`sections.${sectionIndex}.chords.${chordIndex}.lyric`)} />
            </div>
        </div>
    )
    }