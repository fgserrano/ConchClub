import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, Plus } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import ThemeToggle from './ThemeToggle';
import tmdbLogo from '../assets/tmdb-logo.svg';
import api from '../lib/api';

const PAGE_LABELS = {
    '/': 'Official Selection',
    '/pool': 'Submission Pool',
    '/submit': 'Make Selection',
    '/admin': 'Admin Panel',
    '/archives': 'Season Archive',
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8 shrink-0">
                            <rect width="100" height="100" rx="22" className="fill-none dark:fill-[#07190a]"/>
                            <circle cx="27" cy="31" r="16" className="fill-none dark:fill-[#07190a] stroke-[#07190a] dark:stroke-[#f6f3ea]" strokeWidth="4.5"/>
                            <circle cx="27" cy="31" r="4" className="fill-oxblood"/>
                            <circle cx="27" cy="20" r="2.2" className="fill-[#07190a] dark:fill-[#f6f3ea]"/>
                            <circle cx="36" cy="35" r="2.2" className="fill-[#07190a] dark:fill-[#f6f3ea]"/>
                            <circle cx="18" cy="35" r="2.2" className="fill-[#07190a] dark:fill-[#f6f3ea]"/>
                            <circle cx="58" cy="31" r="16" className="fill-none dark:fill-[#07190a] stroke-[#07190a] dark:stroke-[#f6f3ea]" strokeWidth="4.5"/>
                            <circle cx="58" cy="31" r="4" className="fill-oxblood"/>
                            <circle cx="58" cy="20" r="2.2" className="fill-[#07190a] dark:fill-[#f6f3ea]"/>
                            <circle cx="67" cy="35" r="2.2" className="fill-[#07190a] dark:fill-[#f6f3ea]"/>
                            <circle cx="49" cy="35" r="2.2" className="fill-[#07190a] dark:fill-[#f6f3ea]"/>
                            <rect x="20" y="42" width="12" height="5" rx="1.5" className="fill-[#07190a] dark:fill-[#f6f3ea]"/>
                            <rect x="16" y="47" width="52" height="32" rx="5" className="fill-[#07190a] dark:fill-[#f6f3ea]"/>
                            <rect x="16" y="60" width="52" height="6" className="fill-oxblood"/>
                            <path d="M 68 53 L 86 46 L 86 74 L 68 67 Z" className="fill-[#07190a] dark:fill-[#f6f3ea]"/>
                            <rect x="85" y="44" width="4" height="32" rx="2" className="fill-oxblood"/>
                        </svg>
                        <div>
                            <span className="font-serif text-2xl md:text-3xl font-semibold tracking-tighter text-canvas-foreground">
                                <span className="lg:hidden">Conch Catalogue</span>
                                <span className="hidden lg:inline">{seasonName || 'Conch Club'}</span>
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
                            className="bg-forest-container hover:bg-forest-deep text-white p-2 flex items-center justify-center transition-all hard-shadow active:translate-x-0.5 active:translate-y-0.5 rounded-lg"
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
            <main className="lg:pl-80 px-8 md:px-12 pt-24 pb-24 lg:pb-10">
                <div className="max-w-4xl mx-auto">
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

            <MobileNav role={role} seasonLocked={seasonLocked} />
        </div>
    );
}
