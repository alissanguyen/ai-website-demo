'use client'

import * as React from 'react';
import { login } from "@/utils/supabase/auth"

interface Props {

}

const LoginPage: React.FC<Props> = ({ }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        const formData = {email: email, password: password}
        await login(formData);
        setLoading(false);
    };

    return (
        <div className="w-full text-white p-10 mt-14">
            <form className="LoginForm" onSubmit={handleLogin}>
                <h3 className="text-3xl font-medium leading-9 text-center">Login Here</h3>
                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    placeholder="Email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    className="LogIn_Button w-full text-black cursor-pointer bg-white py-3 mt-8 font-semibold text-lg rounded-lg"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in.." : 'Log In'}
                </button>
                <div className='flex flex-row items-center mt-3 gap-2'>
                    New here? <a href="/register" className='text-cyan-400 underline'>Register.</a>
                </div>
            </form>
        </div>
    )
}

export default LoginPage