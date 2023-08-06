import { Section, Song } from "../../types/songs";
import { useState } from 'react';
import { keyToString } from "../../utils/chords";
import SectionDetails from "./SectionDetails";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css'; // optional
import styles from './SongDetails.module.scss';

// dummy song for testing
const song: Song = {
    name: "So Right",
    artist: "Carly Rae Jepsen",
    capo: 0,
    key: {
        noteLetter: "A",
        accidental: "",
        isMajor: true,
    },
    sections: [
        {
            title: "verse",
            key: {
                noteLetter: "N/A",
                accidental: "",
                isMajor: true,
            },
            chords: [
                {
                    chord: {
                        noteLetter: "A",
                        accidental: "",
                        chordType: "",
                    },
                    lyric: "we can get it so right",
                }, {
                    chord: {
                        noteLetter: "E",
                        accidental: "b",
                        chordType: "",
                    },
                    lyric: "sometimes we can get it so right",
                },
            ]
        }, {
            title: "verse",
            key: {
                noteLetter: "C",
                accidental: "",
                isMajor: true,
            },
            chords: [
                {
                    chord: {
                        noteLetter: "G",
                        accidental: "#",
                        chordType: "",
                    },
                    lyric: "dream slow",
                }, {
                    chord: {
                        noteLetter: "N/A",
                        accidental: "",
                        chordType: "",
                    },
                    lyric: "last night",
                },
            ]
        }
    ]
};

export default function SongDetails() {

    // transpose must be between 0 and 11
    const [transpose, setTranspose] = useState<number>(0);
    const [isNumericView, setIsNumericView] = useState<boolean>(false);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.controlContainer}>
                <label onClick={() => setIsNumericView(!isNumericView)}>Numeric View</label>
                <div className={styles.transpose}>
                    <label onClick={() => setTranspose(transpose - 1 < 0 ? 11 : transpose - 1)}>-</label>
                    <label>transpose {transpose}</label>
                    <label onClick={() => setTranspose(transpose + 1 > 11 ? 0 : transpose + 1)}>+</label>
                </div>
            </div>
            <div className={styles.songDetailsContainer}>
                <label>{song.name}</label>
                <label>{song.artist}</label>
                <label>key: {keyToString(song.key)}</label>
                <div className={styles.capoContainer}>
                    <label>capo: {song.capo}</label>
                    {
                        transpose !== 0 &&  <Tippy content="To play in original Key">
                            <label>capo: { song.capo - transpose < 0 ? song.capo - transpose + 12 : song.capo - transpose }</label>
                        </Tippy>
                    }
                </div>
            </div>
            <div className={styles.sectionsContainer}>
                {
                    song.sections.map((section: Section, index: number)  => (
                        <div key={index}>
                            <SectionDetails section={section} transpose={transpose} songKey={song.key} isNumericView={isNumericView}/>
                        </div>
                    ))
                }
            </div>
        </div>

    )
}