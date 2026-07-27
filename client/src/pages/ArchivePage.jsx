import React, { useEffect, useState } from 'react';
import { Archive, Calendar, ChevronDown, Trophy } from 'lucide-react';
import MovieCard from '../components/MovieCard/MovieCard';
import api from '../lib/api';

function formatDate(epochMs) {
    if (!epochMs) return '—';
    const d = new Date(epochMs);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ArchivePage() {
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openSeasonIds, setOpenSeasonIds] = useState(() => new Set());

    useEffect(() => {
        api.get('/season/archived')
            .then(res => {
                const data = res.data || [];
                setSeasons(data);
                if (data.length > 0) setOpenSeasonIds(new Set([data[0].id]));
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    function toggleSeason(id) {
        setOpenSeasonIds(current => {
            const next = new Set(current);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    if (loading) {
        return (
            <div className="text-center mt-20 text-canvas-muted-foreground flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-forest border-t-transparent animate-spin mb-4" />
                Loading archive...
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <section className="pb-6 border-b border-border">
                <span className="font-sans text-xs font-bold text-oxblood uppercase tracking-widest block mb-1">
                    Past Seasons
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-canvas-foreground">
                    Season Archive
                </h1>
                <p className="font-body text-sm text-canvas-muted-foreground mt-1">
                    {seasons.length} {seasons.length === 1 ? 'season' : 'seasons'} archived.
                </p>
            </section>

            {seasons.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-canvas-muted-foreground bg-canvas-container border border-border rounded-xl">
                    <Archive className="w-10 h-10 mb-4 opacity-40" />
                    <p className="text-base font-medium">No seasons have been archived yet</p>
                    <p className="text-sm mt-1 opacity-60">Close a season from the Admin panel to archive it here.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {seasons.map(season => {
                        const isOpen = openSeasonIds.has(season.id);
                        return (
                            <section
                                key={season.id}
                                className="bg-canvas-muted border border-border rounded-xl hard-shadow overflow-hidden"
                            >
                                {/* Season header — toggles the season open/closed */}
                                <button
                                    type="button"
                                    onClick={() => toggleSeason(season.id)}
                                    aria-expanded={isOpen}
                                    className="w-full text-left p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-canvas transition-colors"
                                >
                                    <div>
                                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-canvas-foreground tracking-tight">
                                            {season.name}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2">
                                            <span className="flex items-center gap-1.5 font-sans text-xs text-canvas-muted-foreground">
                                                <Calendar className="w-3.5 h-3.5 text-forest" />
                                                <span className="font-semibold text-canvas-foreground">Started:</span>
                                                {formatDate(season.startedAt)}
                                            </span>
                                            <span className="flex items-center gap-1.5 font-sans text-xs text-canvas-muted-foreground">
                                                <Archive className="w-3.5 h-3.5 text-oxblood" />
                                                <span className="font-semibold text-canvas-foreground">Closed:</span>
                                                {formatDate(season.closedAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <Trophy className="w-4 h-4 text-oxblood" />
                                            <span className="font-sans text-sm font-semibold text-canvas-muted-foreground">
                                                {season.selections.length} {season.selections.length === 1 ? 'selection' : 'selections'}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            className={`w-5 h-5 text-canvas-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                </button>

                                {/* Selections — collapse to keep many seasons scannable */}
                                {isOpen && (
                                    <div className="px-6 pb-6 border-t border-border pt-6">
                                        {season.selections.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {season.selections.map(ticket => (
                                                    <MovieCard
                                                        key={ticket.id}
                                                        ticket={ticket}
                                                        isMine={false}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-10 border-2 border-dashed border-border rounded-xl text-canvas-muted-foreground text-sm">
                                                No official selections were made this season.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
