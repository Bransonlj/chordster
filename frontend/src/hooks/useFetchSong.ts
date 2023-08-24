import { SongEntry } from "../types/songs";
import { User } from "../types/user";
import { useState, useEffect } from 'react'

export function useFetchSong(user: User | null, input: RequestInfo | URL, defaultParams: RequestInit | undefined, autoFetch=true) {
    const [songEntry, setSongEntry] = useState<SongEntry>()
    const [error, setError] = useState<string>("")
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function fetchSong(customParam?: RequestInit | undefined) {
        setIsLoading(true)
        setSongEntry(undefined);
        setIsSuccess(false);
        setError("");
        try {
            const res = await fetch(input, customParam ?? defaultParams);
            const data = await res.json()
            if (!res.ok) {
                console.log(data)
                throw Error(data.error)
            } 
            console.log("successfully fetched")
            setIsLoading(false)
            setError("")
            setSongEntry(data)
            setIsSuccess(true)

        } catch (err: any) {
            console.log(err.message)
            setIsLoading(false)
            setError(err.message)
            setSongEntry(undefined);
            setIsSuccess(false)
        }
    }

    useEffect(() => {
        if (autoFetch) {
            fetchSong();
        }
    }, [user])


    return { songEntry, error, isSuccess, isLoading, fetchSong }
}