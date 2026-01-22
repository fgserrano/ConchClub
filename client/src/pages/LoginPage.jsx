import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Film, User, Lock, Loader2 } from 'lucide-react';
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
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black animate-pulse-slow" />

            <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center rotate-3 border border-purple-500/30">
                        <Film className="w-8 h-8 text-purple-400" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">ConchClub</h2>
                <p className="text-slate-500 text-center mb-8">Enter the inner circle</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="group">
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                name="username"
                                type="text"
                                placeholder="Username"
                                required
                                className="w-full bg-black/40 border border-slate-800 text-slate-200 rounded-xl px-10 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full bg-black/40 border border-slate-800 text-slate-200 rounded-xl px-10 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 mt-6"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Enter'}
                    </button>
                </form>

                <p className="text-center text-slate-600 text-sm mt-6">
                    New user? <Link to="/register" className="text-purple-400 hover:text-purple-300 transition-colors">Register Here</Link>
                </p>
            </div>
        </div>
    );
}
