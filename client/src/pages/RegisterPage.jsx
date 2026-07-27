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

        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const { confirmPassword, ...registrationData } = data;

        try {
            await api.post('/auth/register', registrationData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-canvas-container border border-border p-10 rounded-2xl hard-shadow">
                <h2 className="font-serif text-3xl font-semibold text-center text-forest mb-2">Join the Club</h2>
                <p className="text-canvas-muted-foreground text-center text-sm mb-8">Enter your invite details</p>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="group">
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-canvas-muted-foreground group-focus-within:text-forest transition-colors" />
                            <input
                                name="username"
                                type="text"
                                placeholder="Choose Username"
                                required
                                className="w-full bg-canvas-container border-0 border-b-2 border-border text-canvas-foreground rounded-none px-9 py-2.5 focus:outline-none focus:border-forest transition-colors placeholder:text-canvas-muted-foreground"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-canvas-muted-foreground group-focus-within:text-forest transition-colors" />
                            <input
                                name="password"
                                type="password"
                                placeholder="Create Password"
                                required
                                className="w-full bg-canvas-container border-0 border-b-2 border-border text-canvas-foreground rounded-none px-9 py-2.5 focus:outline-none focus:border-forest transition-colors placeholder:text-canvas-muted-foreground"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-canvas-muted-foreground group-focus-within:text-forest transition-colors" />
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                required
                                className="w-full bg-canvas-container border-0 border-b-2 border-border text-canvas-foreground rounded-none px-9 py-2.5 focus:outline-none focus:border-forest transition-colors placeholder:text-canvas-muted-foreground"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <div className="relative">
                            <Key className="absolute left-3 top-3 w-4 h-4 text-canvas-muted-foreground group-focus-within:text-forest transition-colors" />
                            <input
                                name="inviteCode"
                                type="text"
                                placeholder="Invite Code"
                                required
                                className="w-full bg-canvas-container border-0 border-b-2 border-border text-canvas-foreground rounded-none px-9 py-2.5 focus:outline-none focus:border-forest transition-colors placeholder:text-canvas-muted-foreground"
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-oxblood-container text-white font-semibold uppercase tracking-widest text-sm py-3 rounded-lg hover:bg-oxblood-deep transition-colors flex items-center justify-center disabled:opacity-50 mt-2 hard-shadow"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Register'}
                    </button>
                </form>

                <p className="text-center text-canvas-muted-foreground text-sm mt-6">
                    Already a member? <Link to="/login" className="text-forest hover:underline transition-colors font-medium">Log In</Link>
                </p>
            </div>
        </div>
    );
}
