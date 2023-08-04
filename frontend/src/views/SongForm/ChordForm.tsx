import { useState } from 'react'
import { Control, Controller, UseFormRegister } from "react-hook-form"
import { ChordLyric, Song } from "../../types/songs"
import { Chord } from "../../types/chords";
import AsyncSelect from 'react-select/async'
import { chordToString, getAllChords } from '../../utils/chords';
import _ from 'lodash'

interface ChordProps {
    chordLyric: ChordLyric,
    sectionIndex: number,
    chordIndex: number,
    control: Control<Song>,
    register: UseFormRegister<Song>,
}

const allChords: Chord[] = getAllChords();

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
            getOptionValue={(chord: Chord) => chordToString(chord)}
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

export default function ChordForm ({ chordLyric, sectionIndex, chordIndex, register, control }: ChordProps) {
    return (
        <>
            <label>Chord</label>
            <Controller
                name={ `sections.${sectionIndex}.chords.${chordIndex}.chord` }
                control={ control }
                render={ ({ field: { onChange } }) => (
                    <SelectChord onChange={onChange} chord={chordLyric.chord}/>
                ) }
            />
            <div className="songForm__lyric">
                <label>Lyrics</label>
                <input
                {...register(`sections.${sectionIndex}.chords.${chordIndex}.lyric`)} 
                />
            </div>
        </>
    )
    }