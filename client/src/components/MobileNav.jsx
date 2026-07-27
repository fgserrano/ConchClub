import React from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Clapperboard, Trophy, Plus, Lock, Shield, Archive } from 'lucide-react';

export default function MobileNav({ role, seasonLocked }) {
    const location = useLocation();

    const navItems = [
        { to: '/', icon: Trophy, label: 'Selection' },
        { to: '/pool', icon: Clapperboard, label: 'Pool' },
        { to: '/submit', icon: seasonLocked ? Lock : Plus, label: 'Submit', muted: seasonLocked },
        { to: '/archives', icon: Archive, label: 'Archive' },
        ...(role === 'ADMIN' ? [{ to: '/admin', icon: Shield, label: 'Admin' }] : []),
    ];

    const nav = (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[200] bg-canvas/95 backdrop-blur-sm border-t border-border flex">
            {navItems.map(({ to, icon: Icon, label, muted }) => {
                const active = location.pathname === to;
                return (
                    <Link
                        key={to}
                        to={to}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
                            active
                                ? 'text-forest border-t-2 border-forest -mt-px'
                                : muted
                                ? 'text-canvas-muted-foreground/40 border-t-2 border-transparent -mt-px'
                                : 'text-canvas-muted-foreground border-t-2 border-transparent -mt-px'
                        }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="small-caps text-[10px] font-semibold">{label}</span>
                    </Link>
                );
            })}
        </nav>
    );

    return createPortal(nav, document.body);
}
