import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Film } from 'lucide-react';
import tmdbLogo from '../assets/tmdb-logo.svg';

export default function Layout() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-purple-500/30 flex flex-col">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black pointer-events-none -z-10" />

            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-400">
                        <Film className="w-6 h-6" />
                        <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">ConchClub</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-sm text-slate-400">Welcome, <span className="text-slate-200 font-medium">{username}</span></span>
                        <button onClick={handleLogout} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
                <Outlet />
            </main>

            <footer className="border-t border-slate-800 bg-slate-900/30 py-6">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4">
                    <img src={tmdbLogo} alt="TMDB Logo" className="h-8 opacity-80" />
                    <p className="text-xs text-slate-500 max-w-md text-center md:text-left">
                        This product uses the TMDB API but is not endorsed or certified by TMDB.
                    </p>
                </div>
            </footer>
        </div>
    );
}
