import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, Plus } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import ThemeToggle from './ThemeToggle';
import tmdbLogo from '../assets/tmdb-logo.svg';
import api from '../lib/api';

const PAGE_LABELS = {
    '/': 'Submission Pool',
    '/selection': 'Official Selection',
    '/submit': 'Make Selection',
    '/admin': 'Admin Panel',
};

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const [seasonName, setSeasonName] = useState(null);
    const [seasonLocked, setSeasonLocked] = useState(false);

    useEffect(() => {
        api.get('/season/active')
            .then(res => {
                setSeasonName(res.data?.name || null);
                setSeasonLocked(res.data?.locked ?? false);
            })
            .catch(() => {});
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const pageLabel = PAGE_LABELS[location.pathname] ?? '';

    return (
        <div className="min-h-screen bg-canvas text-canvas-foreground font-sans selection:bg-forest/20">
            <Sidebar role={role} seasonLocked={seasonLocked} />

            {/* Top header — fixed, offset past sidebar on desktop */}
            <header className="fixed top-0 left-0 lg:left-80 right-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-border/20">
                <div className="flex justify-between items-center px-4 md:px-10 py-4 md:py-5">

                    {/* Brand / Season name */}
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-canvas-foreground group-hover:text-oxblood transition-colors">movie_edit</span>
                        <div>
                            <span className="font-serif text-2xl md:text-3xl font-semibold tracking-tighter text-canvas-foreground">
                                {seasonName || 'Conch Club'}
                            </span>
                            {pageLabel && (
                                <span className="hidden sm:inline-block ml-3 font-sans text-xs tracking-widest text-oxblood uppercase font-bold border-l border-border/30 pl-3">
                                    {pageLabel}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 sm:gap-6">
                        {/* Submit button */}
                        <Link
                            to="/submit"
                            className="bg-forest-container hover:bg-forest-deep text-white p-2 flex items-center justify-center transition-all hard-shadow active:translate-x-0.5 active:translate-y-0.5"
                            title="Make Selection"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                        </Link>

                        {/* Username + logout */}
                        <div className="flex items-center gap-3 pl-4 border-l border-border">
                            <span className="hidden sm:block font-sans text-sm font-medium text-canvas-foreground">{username}</span>
                            <ThemeToggle />
                            <button
                                onClick={handleLogout}
                                title="Sign out"
                                className="p-1.5 text-canvas-muted-foreground hover:text-oxblood transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content — offset by sidebar on desktop, header height on all breakpoints */}
            <main className="lg:pl-80 px-6 pt-24 pb-24 lg:pb-10">
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* TMDB footer — mobile only */}
            <footer className="lg:hidden px-6 pb-24">
                <div className="max-w-5xl mx-auto border-t border-border pt-6 flex items-center gap-3">
                    <img src={tmdbLogo} alt="TMDB Logo" className="h-5 opacity-60 shrink-0" />
                    <p className="text-xs text-canvas-muted-foreground">
                        This product uses the TMDB API but is not endorsed or certified by TMDB.
                    </p>
                </div>
            </footer>

            <MobileNav role={role} />
        </div>
    );
}
