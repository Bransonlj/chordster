import { useState, useEffect } from 'react';
import { Song, SongEntrySummary } from '../../types/songs';
import { Link } from 'react-router-dom';

export default function SongList() {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [songs, setSongs] = useState<SongEntrySummary[]>([]);
    useEffect(() => {
        fetch("/api/song/", { method: "GET" })
        .then(res => res.json())
        .then(res => {setSongs(res); setIsLoading(false);})
        .catch(err => {setError(err.message); setIsLoading(false);});
    }, [])

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
    console.log(songs);
    return (
        <div>
            { songs &&
                songs.map((songEntry: SongEntrySummary, index: number) => (
                    <div key={index}>
                        <label>{songEntry.song.name}</label>
                        <label>{songEntry.song.artist}</label>
                        <label>{songEntry.user.username}</label>
                        <Link to={`/song/view/${songEntry._id}`}>view</Link>
                    </div>
                ))
            }
        </div>
    )
}