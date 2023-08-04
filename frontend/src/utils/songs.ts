import _ from "lodash";
import { ChordLyric, Section, defaultChordLyric, defaultSection } from "../types/songs";

// custom equality checker which ignores other fields like _id
export function isDefaultChordLyric(chordLyric: ChordLyric): boolean {
    return _.isEqual(chordLyric.chord, defaultChordLyric.chord) 
        && chordLyric.lyric === defaultChordLyric.lyric;
}

export function isDefaultSection(section: Section): boolean {
    return _.isEqual(section.key, defaultSection.key) 
        && _.isEqual(section.chords, defaultSection.chords)
        && section.title === defaultSection.title;
}