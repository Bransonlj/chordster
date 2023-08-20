import { useState } from 'react'
import { useAuth } from '../context/AuthContext';

export function useLogin() {
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const { login: loginAuth} = useAuth();

    /**
     * Sends a login request to the server with the given username and password.
     * @param username 
     * @param password 
     * @returns whether the login was successful
     */
    async function login(username: string, password: string): Promise<boolean> {
        setIsloading(true);
        setError("");

        try {
            const response = await fetch('/api/user/login', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ username, password }),
            });
    
            const jsonResponse = await response.json(); // get user
    
            console.log("attempting to log in: ", jsonResponse);
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(jsonResponse))
                loginAuth(jsonResponse);
                setIsloading(false);
                return true;
            } else {
                throw Error(jsonResponse.error)
            }
        } catch (err: any) {
            setError(err.message)
            setIsloading(false);
            return false;
        }
        
    }
    return { login, isLoading, error};
}