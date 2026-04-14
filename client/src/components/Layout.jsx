import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { LogOut, Film, Shield } from 'lucide-react';
import tmdbLogo from '../assets/tmdb-logo.svg';

export default function Layout() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-tertiary-container/30 flex flex-col">
            <nav className="bg-surface-lowest/70 backdrop-blur-[12px] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Film className="w-6 h-6 text-primary" />
                        <span className="font-display font-bold text-xl tracking-wide text-primary">ConchClub</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        {role === 'ADMIN' && (
                            <Link to="/admin" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm font-medium">Admin</span>
                            </Link>
                        )}
                        <span className="text-sm text-on-surface-variant">Welcome, <span className="text-on-surface font-medium">{username}</span></span>
                        <button onClick={handleLogout} className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant hover:text-on-surface">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
                <Outlet />
            </main>

            <footer className="bg-surface-low py-6">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4">
                    <img src={tmdbLogo} alt="TMDB Logo" className="h-8 opacity-60" />
                    <p className="text-xs text-on-surface-variant max-w-md text-center md:text-left">
                        This product uses the TMDB API but is not endorsed or certified by TMDB.
                    </p>
                </div>
            </footer>
        </div>
    );
}
