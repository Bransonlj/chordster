import { Section, Song, SongEntry, defaultSong } from "../../types/songs";
import { useEffect, useState } from 'react';
import { keyToString } from "../../utils/chords";
import SectionDetails from "./SectionDetails";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css'; // optional
import styles from './SongDetails.module.scss';
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFetchSong } from "../../hooks/useFetchSong";

export default function SongView() {

    const { id } = useParams()
    // transpose must be between 0 and 11
    const [transpose, setTranspose] = useState<number>(0);
    const [isNumericView, setIsNumericView] = useState<boolean>(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    const { songEntry , error } = useFetchSong(user, `/api/song/${id}`, 
        user ? {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        } : {}
    );

    const { error: deleteError, isSuccess: deleteSuccess, isLoading: isDeleting, fetchSong: handleDelete } = useFetchSong(user, `/api/song/protected/${id}`,
        {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user?.token}`
            },
        }, false);

    useEffect(() => {
        if (deleteSuccess) {
            alert("successfully deleted")
            navigate("/song/list")
        }
    }, [deleteSuccess]);

    async function onDelete() {
        if (confirm("delete song?")) {
            await handleDelete();
        }
    }

    if (!songEntry) {
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

    const song = songEntry.song;
    const songUser = songEntry.user
    // soft check for edit button. Do secure check with token auth when rendering edit page.
    const isOwner: boolean = songUser.username === user?.username;

    return (
        <div className={styles.mainContainer}>
            <label>Created by: {songUser.username}</label>
            <button type="button" disabled={!isOwner} onClick={() => navigate(`/song/edit/${id}`)}>Edit</button>
            <button type="button" disabled={!isOwner} onClick={onDelete}>Delete</button>
            { isDeleting && <label>Deleting</label> }
            { deleteError && <label>{ deleteError }</label> }
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