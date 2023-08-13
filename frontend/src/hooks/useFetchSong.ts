import { SongEntry } from "../types/songs";
import { User } from "../types/user";
import { useState, useEffect } from 'react'

export function useFetchSong(user: User | null, input: RequestInfo | URL, init: RequestInit | undefined, enabled=true) {
    const [songEntry, setSongEntry] = useState<SongEntry>()
    const [error, setError] = useState<string>("")

    async function fetchSong() {
        try {
            const res = await fetch(input, init);
            const data = await res.json()
            if (!res.ok) {
                setError(data.error);
                setSongEntry(undefined);
                return;
            } 
            setError("")
            setSongEntry(data)

        } catch (err: any) {
            setError(err.message)
            setSongEntry(undefined);
        }
    }

    useEffect(() => {
        if (enabled) {
            fetchSong();
        }
    }, [user])


    return { songEntry, error }
}