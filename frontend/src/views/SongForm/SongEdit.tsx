import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFetchSong } from "../../hooks/useFetchSong";
import SongForm from "./SongForm";

export default function SongEdit() {
    const { id } = useParams();
    const { user } = useAuth();
    const {songEntry, error} = useFetchSong(user, `/api/song/protected/${id}`,  {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${user?.token}`
        }
    }, !!user)

    if (!user) {
        return (
            <div>
                Error: must be logged in to edit songs
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

    if (!songEntry) {
        return (
            <div>
                Loading
            </div>
        )
    }

    return (
        <div>
            <Link to={`/song/view/${id}`}>Cancel</Link>
            <SongForm song={songEntry.song} songId={id}/>
        </div>
    )
}