import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Film, User, Lock, Loader2, Key } from 'lucide-react';
import api from '../lib/api';

export default function RegisterPage() {
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
            await api.post('/auth/register', data);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black animate-pulse-slow" />

            <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
                <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">Join the Club</h2>
                <p className="text-slate-500 text-center mb-8">Enter your invite details</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="group">
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                name="username"
                                type="text"
                                placeholder="Choose Username"
                                required
                                className="w-full bg-black/40 border border-slate-800 text-slate-200 rounded-xl px-10 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                name="password"
                                type="password"
                                placeholder="Create Password"
                                required
                                className="w-full bg-black/40 border border-slate-800 text-slate-200 rounded-xl px-10 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <div className="relative">
                            <Key className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                name="inviteCode"
                                type="text"
                                placeholder="Invite Code"
                                required
                                className="w-full bg-black/40 border border-slate-800 text-slate-200 rounded-xl px-10 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 mt-6"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Register'}
                    </button>
                </form>

                <p className="text-center text-slate-600 text-sm mt-6">
                    Already a member? <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Log In</Link>
                </p>
            </div>
        </div>
    );
}
