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
        <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border border-outline-light p-10 rounded hard-shadow">
                <div className="flex justify-center mb-8">
                    <div className="w-14 h-14 bg-canvas-container border border-outline-light rounded flex items-center justify-center">
                        <Film className="w-7 h-7 text-forest" />
                    </div>
                </div>

                <h2 className="font-serif text-3xl font-semibold text-center text-forest mb-2">ConchClub</h2>
                <p className="text-brown-light text-center text-sm mb-8">Enter the inner circle</p>

                {error && (
                    <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="group">
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-outline group-focus-within:text-forest transition-colors" />
                            <input
                                name="username"
                                type="text"
                                placeholder="Username"
                                required
                                className="w-full bg-canvas-container border-0 border-b-2 border-outline-light text-brown rounded-none px-9 py-2.5 focus:outline-none focus:border-forest transition-colors placeholder:text-outline"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-outline group-focus-within:text-forest transition-colors" />
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full bg-canvas-container border-0 border-b-2 border-outline-light text-brown rounded-none px-9 py-2.5 focus:outline-none focus:border-forest transition-colors placeholder:text-outline"
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-oxblood text-white font-semibold uppercase tracking-widest text-sm py-3 rounded hover:bg-oxblood-deep transition-colors flex items-center justify-center disabled:opacity-50 mt-2 hard-shadow"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Enter'}
                    </button>
                </form>

                <p className="text-center text-outline text-sm mt-6">
                    New user? <Link to="/register" className="text-forest hover:text-forest-deep transition-colors font-medium">Register Here</Link>
                </p>
            </div>
        </div>
    );
}
