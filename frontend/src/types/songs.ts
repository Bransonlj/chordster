import { Chord, Key, defaultChord, defaultKey } from "./chords";
import { SongUser } from "./user";

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

// data type when creating song and sent to API server
export type Song = {
    name: SongName;
    artist: Artist;
    capo: Capo;
    key: Key;
    sections: Section[];
}

export type SongEntry = {
    song: Song;
    user: SongUser;
    _id: string;
}

// summarised data type received from API server
export type SongEntrySummary = {
    song: {
        name: SongName;
        artist: Artist;
    };
    user: SongUser;
    _id: string;
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
