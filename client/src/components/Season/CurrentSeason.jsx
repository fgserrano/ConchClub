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
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/admin/tickets');
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

    const revealWinner = (ticketId) => {
        return api.post('/admin/reveal', { ticketId });
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
        return <div className="text-center py-8 text-slate-500">Loading submissions...</div>;
    }

    return (
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    Current Season Submissions ({activeTickets.length})
                </h2>
                <div className="flex gap-2">
                    {!season?.locked && (
                        <span className="text-xs text-amber-500 self-center font-bold px-2">
                            LOCK SEASON TO SELECT
                        </span>
                    )}
                    <button
                        onClick={handleRandomize}
                        disabled={isRolling || activeTickets.length === 0 || !season?.locked}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Random Selection"
                    >
                        <Dices className={`w-6 h-6 ${isRolling ? 'animate-spin' : ''}`} />
                    </button>
                    {softSelectedId && !isRolling && (
                        <button
                            onClick={handleReveal}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:opacity-90 transition-all shadow-lg animate-pulse"
                        >
                            REVEAL WINNER
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {activeTickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        onClick={() => !isRolling && season?.locked && setSoftSelectedId(ticket.id)}
                        className={`transition-all duration-300 rounded-xl ${season?.locked ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'} ${softSelectedId === ticket.id
                            ? 'ring-4 ring-purple-500 ring-offset-4 ring-offset-slate-900 scale-[1.02] bg-slate-800/50'
                            : 'hover:bg-slate-800/30'
                            }`}
                    >
                        <MovieRow ticket={ticket} />
                    </div>
                ))}
            </div>

            {tickets.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl text-slate-600">
                    No submissions yet.
                </div>
            )}

            {pastTickets.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-800">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">
                        Past Selections
                    </h3>
                    <div className="flex flex-col gap-4 opacity-75">
                        {pastTickets.map((ticket) => (
                            <MovieRow key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
