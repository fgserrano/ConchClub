import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
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
        <div className="min-h-screen bg-[#211b00] flex justify-center overflow-hidden">
            <div className="relative h-screen w-full md:w-auto">
                <img
                    src="/vhs-archive.jpg"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-[center_25%] md:relative md:inset-auto md:h-full md:w-auto md:block"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-transparent from-30% to-[#211b00]/80" />

<div className="absolute inset-0 flex flex-col px-8 md:px-16">
                    <div className="pt-10 md:text-right">
                        <h1
                            className="font-display font-black text-4xl text-primary-container uppercase tracking-[0.12em] leading-none"
                            style={{ textShadow: '0 0 16px rgba(0,0,0,0.55), 0 2px 4px rgba(0,0,0,0.85)' }}
                        >
                            Conch Club
                        </h1>
                    </div>

                    <div className="flex-1 flex items-center justify-center md:justify-end">
                        <div className="w-full max-w-xs" style={{ filter: 'drop-shadow(0 0 16px rgba(0,0,0,0.55)) drop-shadow(0 2px 4px rgba(0,0,0,0.85))' }}>
                            {error && (
                                <p className="text-tertiary-container text-sm mb-6">{error}</p>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label className="block w-fit text-[10px] uppercase tracking-[0.1em] font-display bg-primary-container/75 text-on-primary-container px-2 py-0.5 rounded-t-sm ml-1.5">
                                        Username
                                    </label>
                                    <div className="flex">
                                        <div className="w-1.5 bg-accent-navy rounded-l-sm flex-shrink-0" />
                                        <input
                                            name="username"
                                            type="text"
                                            required
                                            className="w-full bg-primary/20 border border-primary-container/75 rounded-br-sm px-2 py-2 text-surface-lowest placeholder:text-surface-lowest/30 focus:outline-none focus:border-primary-container focus:bg-primary/30 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block w-fit text-[10px] uppercase tracking-[0.1em] font-display bg-primary-container/75 text-on-primary-container px-2 py-0.5 rounded-t-sm ml-1.5">
                                        Password
                                    </label>
                                    <div className="flex">
                                        <div className="w-1.5 bg-accent-forest rounded-l-sm flex-shrink-0" />
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            className="w-full bg-primary/20 border border-primary-container/75 rounded-br-sm px-2 py-2 text-surface-lowest placeholder:text-surface-lowest/30 focus:outline-none focus:border-primary-container focus:bg-primary/30 transition-colors"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full bg-accent-terracotta text-surface-lowest font-display font-bold py-3 rounded-sm uppercase tracking-[0.1em] hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading
                                        ? <Loader2 className="animate-spin w-5 h-5" />
                                        : <><span>Enter Archive</span><ArrowRight className="w-4 h-4" /></>
                                    }
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="flex gap-8 pb-10 md:justify-end">
                        <div>
                            <p className="text-surface/50 text-xs uppercase tracking-[0.08em] font-display">
                                Forgot Password?
                            </p>
                            <p className="text-surface/50 text-xs uppercase tracking-[0.08em] font-display">
                                Ask an  admin for a reset link
                            </p>
                        </div>
                        <Link to="/register" className="text-surface/80 text-xs uppercase tracking-[0.08em] font-display hover:text-surface/80 transition-colors">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
