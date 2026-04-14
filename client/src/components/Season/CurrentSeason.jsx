import React, { useEffect, useState } from 'react';
import { Calendar, Dices } from 'lucide-react';
import api from '../../lib/api';
import MovieRow from '../MovieCard/MovieRow';

export default function CurrentSeason({ season }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [softSelectedId, setSoftSelectedId] = useState(null);
    const [isRolling, setIsRolling] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, [season?.id]);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/admin/submissions');
            setTickets(res.data);
        } catch (e) {
            console.error("Failed to fetch tickets", e);
        } finally {
            setLoading(false);
        }
    };

    const handleRandomize = () => {
        if (activeTickets.length === 0 || !season?.locked) return;
        setIsRolling(true);
        let steps = 0;
        const maxSteps = 20;
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * activeTickets.length);
            setSoftSelectedId(activeTickets[randomIndex].id);
            steps++;
            if (steps >= maxSteps) {
                clearInterval(interval);
                setIsRolling(false);
            }
        }, 100);
    };

    const handleReveal = async () => {
        if (!softSelectedId) return;
        try {
            await api.post('/admin/reveal', { submissionId: softSelectedId });
            setSoftSelectedId(null);
            fetchTickets();
        } catch (e) {
            console.error("Failed to reveal winner", e);
        }
    };

    const activeTickets = tickets.filter(t => !t.selected);
    const pastTickets = tickets.filter(t => t.selected).sort((a, b) => (b.selectedAt || 0) - (a.selectedAt || 0));

    if (loading) {
        return <div className="text-center py-8 text-on-surface-variant">Loading submissions...</div>;
    }

    return (
        <section className="bg-surface-low rounded-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-on-surface flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Submissions ({activeTickets.length})
                </h2>
                <div className="flex gap-2 items-center">
                    {!season?.locked && (
                        <span className="text-xs font-display font-bold text-tertiary uppercase tracking-[0.05em]">
                            Lock to select
                        </span>
                    )}
                    <button
                        onClick={handleRandomize}
                        disabled={isRolling || activeTickets.length === 0 || !season?.locked}
                        className="p-2 bg-surface-container hover:bg-surface-high text-primary rounded-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Random Selection"
                    >
                        <Dices className={`w-6 h-6 ${isRolling ? 'animate-spin' : ''}`} />
                    </button>
                    {softSelectedId && !isRolling && (
                        <button
                            onClick={handleReveal}
                            className="px-4 py-2 bg-primary text-on-primary font-display font-bold rounded-sm hover:bg-primary-container transition-colors animate-pulse"
                        >
                            Reveal Winner
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {activeTickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        onClick={() => !isRolling && season?.locked && setSoftSelectedId(ticket.id)}
                        className={`transition-all duration-300 rounded-sm ${season?.locked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} ${softSelectedId === ticket.id
                            ? 'outline outline-2 outline-primary/40 scale-[1.01]'
                            : 'hover:brightness-95'
                        }`}
                    >
                        <MovieRow ticket={ticket} />
                    </div>
                ))}
            </div>

            {tickets.length === 0 && (
                <div className="text-center py-12 bg-surface-container rounded-sm text-on-surface-variant">
                    No submissions yet.
                </div>
            )}

            {pastTickets.length > 0 && (
                <div className="mt-10 pt-8 space-y-3">
                    <h3 className="text-[11px] font-display font-bold text-on-surface-variant uppercase tracking-[0.05em] mb-4">
                        Past Selections
                    </h3>
                    <div className="flex flex-col gap-3 opacity-60">
                        {pastTickets.map((ticket) => (
                            <MovieRow key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
