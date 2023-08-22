import _ from "lodash";
import { ChordLyric, Section, Song } from "../types/songs";
import { defaultChord, defaultKey } from "./chords";

// custom equality checker which ignores other fields like _id
export function isDefaultChordLyric(chordLyric: ChordLyric): boolean {
    return _.isEqual(chordLyric.chord, defaultChordLyric.chord) 
        && chordLyric.lyric === defaultChordLyric.lyric;
}

export function isDefaultSection(section: Section, sectionindex: number): boolean {
    const defaultSection = getDefaultSection(sectionindex)
    return _.isEqual(section.key, defaultSection.key) 
        && _.isEqual(section.chords, defaultSection.chords)
        && section.title === defaultSection.title;
}

export const defaultChordLyric: ChordLyric = {
    chord: defaultChord,
    lyric: "",
}

export const getDefaultSection = (index: number): Section => {
    return {
        title: `Section ${index + 1}`,
        key: defaultKey,
        chords: [defaultChordLyric],
    }
}

export const defaultSong: Song = {
    name: "",
    artist: "",
    capo: 0,
    key: defaultKey,
    sections: [getDefaultSection(0)],
}