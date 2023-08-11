import { useState } from 'react'

export default function SignupPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log(email, password);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Email: </label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Password: </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>SignUp</button>
            </form>
        </div>
    )
}