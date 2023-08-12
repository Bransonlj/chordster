import { Key } from "../../types/chords";
import { ChordLyric, Section } from "../../types/songs"
import { isEmptyKey, keyToString } from "../../utils/chords";
import ChordLyricDetails from "./ChordLyricDetails";
import styles from './SectionDetails.module.scss'

interface SectionDetailsProps {
    section: Section;
    transpose: number;
    songKey: Key;
    isNumericView: boolean;
}

export default function SectionDetails({ section, transpose, songKey, isNumericView }: SectionDetailsProps) {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.sectionDetailsContainer}>
                <label>{section.title}</label>
                <label>key: {keyToString(section.key)}</label>
            </div>
            <div className={styles.chordsContainer}>
                {
                    section.chords.map((chordLyric: ChordLyric, index: number) => (
                        <div key={index}>
                            <ChordLyricDetails chordLyric={chordLyric} transpose={transpose} chordKey={isEmptyKey(section.key) ? songKey : section.key} isNumericView={isNumericView}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}