import { Section, Song, SongEntry, defaultSong } from "../../types/songs";
import { useEffect, useState } from 'react';
import { keyToString } from "../../utils/chords";
import SectionDetails from "./SectionDetails";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css'; // optional
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFetchSong } from "../../hooks/useFetchSong";
import SongRatings from "./SongRatings";
import styles from './SongView.module.scss'

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

    const { error: deleteError, isSuccess: deleteSuccess, isLoading: isDeleting, fetchSong: handleDelete } = useFetchSong(
        user, 
        `/api/song/protected/${id}`,
        {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user?.token}`
            },
        }, 
        false);

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
            <div className={styles.infoContainer}>
                <div className={styles.metaContainer}>
                    <div className={styles.infoHeader}>
                        <span className={styles.songName}>{song.name}</span>
                        <span className={styles.artist}>by: <strong>{song.artist}</strong></span>
                    </div>
                    <span>Created by: {songUser.username}</span>
                    <span>Rating: { songEntry.averageScore }</span>
                    <span>key: {keyToString(song.key)}</span>
                    <div className={styles.capoContainer}>
                        <span>capo: {song.capo}</span>
                        {
                            transpose !== 0 &&  <Tippy content="To play in original Key">
                                <span>capo: { song.capo - transpose < 0 ? song.capo - transpose + 12 : song.capo - transpose }</span>
                            </Tippy>
                        }
                    </div>
                </div>
                <div>
                    <button type="button" disabled={!isOwner} onClick={() => navigate(`/song/edit/${id}`)}>Edit</button>
                    <button type="button" disabled={!isOwner} onClick={onDelete}>Delete</button>
                    { isDeleting && <span>Deleting</span> }
                    { deleteError && <span>{ deleteError }</span> }
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
            <div className={styles.floatingContainer}>
                <div className={styles.controlContainer}>
                    <span 
                        className={`${styles.numericView} ${isNumericView ? styles.selected : styles.notSelected}`}
                        onClick={() => setIsNumericView(!isNumericView)}>Numeric View</span>
                    <div className={styles.transposeContainer}>
                        <span>Transpose: </span>
                        <span className={styles.transposeButton} 
                            onClick={() => setTranspose(transpose - 1 < 0 ? 11 : transpose - 1)}
                            >-</span>
                        <span>{transpose}</span>
                        <span className={styles.transposeButton} 
                            onClick={() => setTranspose(transpose + 1 > 11 ? 0 : transpose + 1)}
                            >+</span>
                    </div>
                </div>
            </div>
            <SongRatings songEntry={songEntry}/>
        </div>

    )
}