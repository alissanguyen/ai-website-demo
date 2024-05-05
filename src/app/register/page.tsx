'use client'

import * as React from 'react';
import { signup } from "@/utils/supabase/auth";
import "./RegisterPage.css"

interface Props {

}

const RegisterPage: React.FC<Props> = ({ }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = { email: email, password: password }
        await signup(formData);
        setLoading(false);
    };

    return (
        <div className="w-full text-white p-10">
            <form className="LoginForm" onSubmit={handleRegister}>
                <h3 className="text-3xl font-medium leading-9 text-center">Register here</h3>
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
                    {loading ? "Registering.." : 'Register'}
                </button>
                <div className='flex flex-row items-center mt-3 gap-2'>
                    Already have an account? <a href="/login" className='text-cyan-400 underline'>Login.</a>
                </div>
            </form>

        </div>
    )
}

export default RegisterPage