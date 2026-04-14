import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../lib/api';

export default function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await api.post('/auth/login', data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('role', res.data.role);
            navigate('/');
        } catch (err) {
            setError(err.response?.data || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center md:justify-end px-4 md:px-16">
            <img
                src="/vhs-archive.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent from-30% to-[#211b00]/80" />

            <div className="relative z-10 w-full max-w-sm bg-surface-lowest/70 backdrop-blur-[12px] rounded-sm p-8 border border-outline-variant/15 shadow-[0_24px_48px_rgba(33,27,0,0.06)]">
                <h1 className="font-display font-bold text-3xl text-primary tracking-tight mb-1">ConchClub</h1>
                <p className="text-sm text-on-surface-variant mb-8">Enter the inner circle</p>

                {error && (
                    <div className="bg-tertiary/10 text-tertiary text-sm p-3 rounded-sm mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[11px] uppercase tracking-[0.05em] font-display text-on-surface-variant mb-1">
                            Username
                        </label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full bg-transparent border-0 border-b border-outline/40 rounded-none py-2 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] uppercase tracking-[0.05em] font-display text-on-surface-variant mb-1">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full bg-transparent border-0 border-b border-outline/40 rounded-none py-2 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-primary text-on-primary font-bold py-3 rounded-sm hover:bg-primary-container transition-colors flex items-center justify-center disabled:opacity-50 mt-2"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Enter'}
                    </button>
                </form>

                <p className="text-center text-on-surface-variant text-sm mt-6">
                    New user? <Link to="/register" className="text-primary hover:opacity-70 transition-opacity">Register Here</Link>
                </p>
                <p className="text-center text-on-surface-variant/60 text-sm mt-2">
                    Forgot your password? Ask an admin for a reset link.
                </p>
            </div>
        </div>
    );
}
