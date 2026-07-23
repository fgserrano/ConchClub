import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clapperboard, Trophy, Plus, Lock, Shield } from 'lucide-react';
import tmdbLogo from '../assets/tmdb-logo.svg';

export default function Sidebar({ role, seasonLocked }) {
    const location = useLocation();

    const navItems = [
        { to: '/selection', icon: Trophy, label: 'Official Selection' },
        { to: '/', icon: Clapperboard, label: 'Submission Pool' },
        { to: '/submit', icon: seasonLocked ? Lock : Plus, label: 'Make Selection', muted: seasonLocked },
        ...(role === 'ADMIN' ? [{ to: '/admin', icon: Shield, label: 'Admin' }] : []),
    ];

    return (
        <aside className="hidden lg:flex flex-col w-80 shrink-0 fixed left-0 top-0 bottom-0 z-40 border-r border-border bg-canvas-container">

            {/* Brand */}
            <div className="px-8 pt-10 pb-8 border-b border-border flex items-center justify-between">
                <h1 className="font-serif text-3xl font-medium text-canvas-foreground tracking-tighter leading-[0.9] uppercase">
                    Conch<br />Catalogue
                </h1>
                <span className="material-symbols-outlined text-3xl text-oxblood">movie_edit</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4">
                {navItems.map(({ to, icon: Icon, label, muted }) => {
                    const active = location.pathname === to;
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center gap-4 px-8 py-4 text-sm font-semibold tracking-wider transition-all duration-300 ease-out group ${
                                active
                                    ? 'bg-forest-container text-forest-on rounded-r-full font-bold shadow-sm'
                                    : muted
                                    ? 'text-canvas-muted-foreground/50 hover:text-canvas-muted-foreground hover:bg-canvas-muted/60 hover:pl-10'
                                    : 'text-canvas-muted-foreground hover:text-canvas-foreground hover:bg-canvas-muted/60 hover:pl-10'
                            }`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* TMDB attribution */}
            <div className="border-t border-border px-4 py-3 flex items-center gap-2">
                <img src={tmdbLogo} alt="TMDB" className="h-4 opacity-40 shrink-0" />
                <p className="text-[9px] text-canvas-muted-foreground leading-tight">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
            </div>

        </aside>
    );
}
