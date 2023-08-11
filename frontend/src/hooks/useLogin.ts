import { useState } from 'react'
import { useAuth } from '../context/AuthContext';

export function useLogin() {
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const { login: loginAuth} = useAuth();

    async function login(email: string, password: string) {
        setIsloading(true);
        setError("");

        const response = await fetch('/api/user/login', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password }),
        });

        const jsonResponse = await response.json();

        console.log("attempting to log in: ", jsonResponse);
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(jsonResponse))
            loginAuth(jsonResponse);
            setIsloading(false);
        } else {
            setError(jsonResponse.error)
            setIsloading(false);
        }
    }
    return { login, isLoading, error};
}