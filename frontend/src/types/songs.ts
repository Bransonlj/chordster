import { Chord, Key, defaultChord, defaultKey } from "./chords";

export type Lyric = string | undefined;
export type SectionTitle = string | undefined;
export type SongName = string | undefined;
export type Artist = string | undefined;
export type Capo = number;

export type ChordLyric = {
    chord: Chord;
    lyric: Lyric;
}

export type Section = {
    title: SectionTitle;
    key: Key;
    chords: ChordLyric[];
}

export type Song = {
    name: SongName;
    artist: Artist;
    capo: Capo;
    key: Key;
    sections: Section[];
}

export const defaultChordLyric: ChordLyric = {
    chord: defaultChord,
    lyric: "",
}

export const defaultSection: Section = {
    title: "",
    key: defaultKey,
    chords: [defaultChordLyric],
}

export const defaultSong: Song = {
    name: "",
    artist: "",
    capo: 0,
    key: defaultKey,
    sections: [defaultSection],
}
