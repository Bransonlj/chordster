import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { signup, error, isLoading } = useSignup();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const success: boolean = await signup(username, email, password);
        
        if (success) {
            // redirect to success page
            console.log("successfully created account", username, email, password);
            navigate("/login");
        };
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Email: </label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Username: </label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} />
                <label>Password: </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button disabled={ isLoading } type='submit'>SignUp</button>
                {error &&
                    <label>{ error }</label>
                }
            </form>
        </div>
    )
}