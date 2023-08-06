import { Key } from "../../types/chords";
import { ChordLyric, Section } from "../../types/songs"
import { isEmptyKey, keyToString } from "../../utils/chords";
import ChordLyricDetails from "./ChordLyricDetails";

interface SectionDetailsProps {
    section: Section;
    transpose: number;
    songKey: Key;
    isNumericView: boolean;
}

export default function SectionDetails({ section, transpose, songKey, isNumericView }: SectionDetailsProps) {
    return (
        <div>
            <label>{section.title}</label>
            <label>key: {keyToString(section.key)}</label>
            <div>
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