import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate()
    const { login, isLoading, error } = useLogin();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const isSuccess = await login(username, password);
        if (isSuccess) {
            navigate("/");
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Username: </label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} />
                <label>Password: </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button disabled={isLoading} type='submit'>Submit</button>
            </form>
            {error && <label>{ error }</label>}
        </div>
    )
}