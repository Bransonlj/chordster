import { useState } from 'react'

export function useSignup() {
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    async function signup(username: string, email: string, password: string): Promise<boolean> {
        setIsloading(true);
        setError("");

        try {
            const response = await fetch('/api/user/signup', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ username, email, password }),
            });

            const jsonResponse = await response.json();

            console.log("attempting to signup: ", jsonResponse);
            if (response.ok) {
                setIsloading(false);
                return true;
            } else {
                throw Error(jsonResponse.error);
            }
        } catch (err: any) {
            setError(err.message);
            setIsloading(false);
            return false;
        }
    }
    return { signup, isLoading, error};
}