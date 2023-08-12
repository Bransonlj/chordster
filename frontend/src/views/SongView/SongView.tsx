import { Section, Song, SongEntry, defaultSong } from "../../types/songs";
import { useEffect, useState } from 'react';
import { keyToString } from "../../utils/chords";
import SectionDetails from "./SectionDetails";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css'; // optional
import styles from './SongDetails.module.scss';
import { useParams } from "react-router-dom";
import { SongUser } from "../../types/user";
import { useAuth } from "../../context/AuthContext";

export default function SongView() {

    const { id } = useParams()

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [song, setSong] = useState<Song>(defaultSong);
    const [songUser, setSongUser] = useState<SongUser>({username: "", id: ""});
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const { user } = useAuth();

    console.log(user)

    useEffect(() => {
        if (user) {
            fetch(`/api/song/${id}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
            })
            .then(res => res.json())
            .then(res => {
                setSong(res.song); 
                setSongUser(res.user); 
                setIsLoading(false);
                setCanEdit(res.canEdit);
            })
            .catch(err => {setError(err.message); setIsLoading(false);});
        } else {
            fetch(`/api/song/${id}`, {
                method: "GET",
            })
            .then(res => res.json())
            .then(res => {
                setSong(res.song); 
                setSongUser(res.user); 
                setIsLoading(false);
                setCanEdit(res.canEdit);
            })
            .catch(err => {setError(err.message); setIsLoading(false);});
        }
    }, [user])

    const handleEdit = () => {
        // Allow free entry into edit page with :id url params.
        // only check authorization on put request, when submitting, if it is an edit (url params not null).
        // send req to API, /:id (PUT), req authorization, and must match song 

        //or dont allow free entry into edit page. Check authorization when entering edit page.
    }
    // transpose must be between 0 and 11
    const [transpose, setTranspose] = useState<number>(0);
    const [isNumericView, setIsNumericView] = useState<boolean>(false);

    if (isLoading) {
        return (
            <div>
                Loading
            </div>
        )
    }
    if (error) {
        return (
            <div>
                {error}
            </div>
        )
    }

    return (
        <div className={styles.mainContainer}>
            <label>Created by: {songUser.username}</label>
            <button type="button" disabled={!canEdit}>Edit {canEdit ? "yes" : "no"}</button>
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