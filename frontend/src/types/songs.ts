import { Chord, Key } from "./chords";
import { Rating } from "./rating";
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
    ratings: [Rating];
    averageScore: number;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

// summarised data type received from API server
export type SongEntrySummary = {
    song: {
        name: SongName;
        artist: Artist;
    };
    user: SongUser;
    averageScore: number;
    _id: string;
    totalRatings: number;
}