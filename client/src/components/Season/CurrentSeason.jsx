import { useEffect, useState } from 'react';
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
        return (
            <div className="text-center py-8 text-[#7e6f95] text-xs font-black uppercase tracking-[0.3em]">
                Loading submissions...
            </div>
        );
    }

    return (
        <section className="bg-[#201139] border-2 border-[#4f4165] p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-black text-[#ff80e4] neon-glow-primary uppercase tracking-[0.3em] flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Current Season ({activeTickets.length})
                </h2>
                <div className="flex gap-2 items-center">
                    {!season?.locked && (
                        <span className="text-[10px] text-[#ffc965] font-black uppercase tracking-widest px-2">
                            LOCK TO SELECT
                        </span>
                    )}
                    <button
                        onClick={handleRandomize}
                        disabled={isRolling || activeTickets.length === 0 || !season?.locked}
                        className="p-2 bg-[#271641] border-2 border-[#7e6f95] hover:border-[#00f1fd] text-[#00f1fd] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Random Selection"
                    >
                        <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
                    </button>
                    {softSelectedId && !isRolling && (
                        <button
                            onClick={handleReveal}
                            className="relative px-4 py-2 border-4 border-[#ff80e4] text-[#ff80e4] font-black text-xs uppercase tracking-widest hover:bg-[#ff80e4]/10 transition-all animate-pulse"
                        >
                            REVEAL WINNER
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {activeTickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        onClick={() => !isRolling && season?.locked && setSoftSelectedId(ticket.id)}
                        className={`transition-all duration-300 ${season?.locked ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'} ${softSelectedId === ticket.id
                            ? 'ring-4 ring-[#ff80e4] scale-[1.02]'
                            : 'hover:brightness-110'
                            }`}
                    >
                        <MovieRow ticket={ticket} />
                    </div>
                ))}
            </div>

            {tickets.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-[#4f4165] text-[#7e6f95] text-xs font-black uppercase tracking-[0.2em]">
                    No submissions yet.
                </div>
            )}

            {pastTickets.length > 0 && (
                <div className="mt-12 pt-8 border-t-2 border-[#4f4165]">
                    <h3 className="text-[10px] font-black text-[#7e6f95] uppercase tracking-[0.3em] mb-6">
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
