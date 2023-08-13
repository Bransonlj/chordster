import { useState } from "react";
import { User } from "../types/user";

export function useDeleteSong(user: User | null) {
    const [error, setError] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    async function handleDelete(id: string | undefined) {
        if (!user) {
            return setError("Not Authorised")
        }
        if (!id) {
            return setError("invalid id")
        }
        try {
            const response = await fetch(`/api/song/protected/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                },
            })
            const data = await response.json()

            if (!response.ok) {
                return setError(data.error);
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message);
        }
    }

    return {error, isSuccess, handleDelete};
}