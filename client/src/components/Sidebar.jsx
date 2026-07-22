import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clapperboard, Plus, Shield } from 'lucide-react';
import tmdbLogo from '../assets/tmdb-logo.svg';

export default function Sidebar({ role }) {
    const location = useLocation();

    const navItems = [
        { to: '/', icon: Clapperboard, label: 'Browse Submissions' },
        { to: '/submit', icon: Plus, label: 'Make Selection' },
        ...(role === 'ADMIN' ? [{ to: '/admin', icon: Shield, label: 'Admin' }] : []),
    ];

    return (
        <aside className="hidden lg:flex flex-col w-80 shrink-0 fixed left-0 top-0 bottom-0 z-40 border-r border-outline-light bg-canvas-container">

            {/* Brand */}
            <div className="px-8 pt-10 pb-8 border-b border-outline-light flex items-center justify-between">
                <h1 className="font-serif text-3xl font-medium text-brown tracking-tighter leading-[0.9] uppercase">
                    Conch<br />Catalogue
                </h1>
                <span className="material-symbols-outlined text-3xl text-oxblood">movie_edit</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4">
                {navItems.map(({ to, icon: Icon, label }) => {
                    const active = location.pathname === to;
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center gap-4 px-8 py-4 text-sm font-semibold tracking-wider transition-all duration-300 ease-out group ${
                                active
                                    ? 'bg-forest text-forest-on rounded-r-full font-bold shadow-sm'
                                    : 'text-outline hover:text-brown hover:bg-canvas-high/60 hover:pl-10'
                            }`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* TMDB attribution */}
            <div className="border-t border-outline-light px-4 py-3 flex items-center gap-2">
                <img src={tmdbLogo} alt="TMDB" className="h-4 opacity-40 shrink-0" />
                <p className="text-[9px] text-outline leading-tight">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
            </div>

        </aside>
    );
}
