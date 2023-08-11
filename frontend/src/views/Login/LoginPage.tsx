import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin';

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { login, isLoading, error } = useLogin();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await login(email, password);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Email: </label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Password: </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button disabled={isLoading} type='submit'>Submit</button>
            </form>
            {error && <label>{ error }</label>}
        </div>
    )
}