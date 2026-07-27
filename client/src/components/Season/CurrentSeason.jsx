import React, { useEffect, useState } from 'react';
import { Dices } from 'lucide-react';
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
            setTickets(res.data || []);
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

    const revealWinner = (submissionId) => {
        return api.post('/admin/reveal', { submissionId });
    };

    const handleReveal = async () => {
        if (!softSelectedId) return;
        try {
            await revealWinner(softSelectedId);
            setSoftSelectedId(null);
            fetchTickets();
        } catch (e) {
            console.error("Failed to reveal winner", e);
        }
    };

    const activeTickets = tickets.filter(t => !t.selected);
    const pastTickets = tickets.filter(t => t.selected).sort((a, b) => (b.selectedAt || 0) - (a.selectedAt || 0));

    if (loading) {
        return <div className="text-center py-8 text-canvas-muted-foreground">Loading submissions...</div>;
    }

    return (
        <section className="bg-canvas border border-border p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-semibold text-canvas-foreground">
                    Submissions
                </h2>
                <div className="flex gap-2 items-center">
                    {!season?.locked && (
                        <span className="text-xs text-oxblood font-semibold uppercase tracking-wider px-2">
                            Lock season to select
                        </span>
                    )}
                    <button
                        onClick={handleRandomize}
                        disabled={isRolling || activeTickets.length === 0 || !season?.locked}
                        className="p-2 bg-canvas-container hover:bg-canvas-muted text-forest rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Random Selection"
                    >
                        <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
                    </button>
                    {softSelectedId && !isRolling && (
                        <button
                            onClick={handleReveal}
                            className="px-4 py-2 bg-oxblood-container hover:bg-oxblood-deep text-white font-semibold uppercase tracking-wider text-xs rounded-lg transition-colors animate-pulse hard-shadow"
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
                        className={`transition-all duration-300 rounded-lg ${season?.locked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} ${softSelectedId === ticket.id
                            ? 'ring-2 ring-forest ring-offset-2 ring-offset-canvas scale-[1.01] bg-canvas-container'
                            : 'hover:bg-canvas-container'
                            }`}
                    >
                        <MovieRow ticket={ticket} />
                    </div>
                ))}
            </div>

            {tickets.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl text-canvas-muted-foreground">
                    No submissions yet.
                </div>
            )}

            {pastTickets.length > 0 && (
                <div className="mt-10 pt-8 border-t border-border">
                    <h3 className="text-xs font-semibold text-canvas-muted-foreground uppercase tracking-widest mb-6">
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
