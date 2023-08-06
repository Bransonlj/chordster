import { Chord, Key } from "../../types/chords";
import { ChordLyric } from "../../types/songs"
import { chordToString, numericToString, toNumericChord, transposeChord } from "../../utils/chords";
import styles from './ChordLyricDetails.module.scss';

interface ChordLyricDetailsProps {
    chordLyric: ChordLyric;
    transpose: number;
    chordKey: Key;
    isNumericView: boolean;
}

function displayChord(chord: Chord, transpose: number, chordKey: Key, isNumericView: boolean): string {
    if (isNumericView) {
        return numericToString(toNumericChord(chord, chordKey));
    } else {
        return chordToString(transposeChord(chord, transpose));
    }
}

export default function ChordLyricDetails({ chordLyric, transpose, chordKey, isNumericView }: ChordLyricDetailsProps) {

    return (
        <div className={styles.mainContainer}>
            <label className={styles.chordContainer}>{displayChord(chordLyric.chord, transpose, chordKey, isNumericView)}</label>
            <label>{chordLyric.lyric}</label>
        </div>
    )
}