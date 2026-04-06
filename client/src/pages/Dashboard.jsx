import { useEffect, useState } from 'react';
import { Film, Lock, Plus, Calendar } from 'lucide-react';
import MovieCard from '../components/MovieCard/MovieCard';
import OfficialSelection from '../components/Dashboard/OfficialSelection';
import SubmissionForm from '../components/Dashboard/SubmissionForm';
import MySubmission from '../components/Dashboard/MySubmission';
import api from '../lib/api';
import { cn } from '../lib/utils';

export default function Dashboard() {
    const [season, setSeason] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [myTicket, setMyTicket] = useState(null);
    const [selection, setSelection] = useState(null);
    const [loading, setLoading] = useState(true);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const username = localStorage.getItem('username');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const seasonRes = await api.get('/season/active');
            setSeason(seasonRes.data);
            if (seasonRes.data) {
                const [ticketRes, myTicketRes, selectionRes] = await Promise.all([
                    api.get('/season/submissions'),
                    api.get('/season/submissions/me').catch(() => ({ data: null })),
                    api.get('/season/active/selection').catch(() => ({ data: [] }))
                ]);

                let allTickets = ticketRes.data;
                const myFullTicket = myTicketRes.data;
                const allSelections = selectionRes.data;

                if (myFullTicket) {
                    setMyTicket(myFullTicket);
                    allTickets = allTickets.map(t => t.id === myFullTicket.id ? myFullTicket : t);
                } else {
                    setMyTicket(null);
                }

                if (allSelections.length > 0) {
                    const selectionMap = new Map(allSelections.map(s => [s.id, s]));
                    allTickets = allTickets.map(t => selectionMap.has(t.id) ? selectionMap.get(t.id) : t);
                }

                setTickets(allTickets);

                const sortedSelections = [...allSelections].sort((a, b) => (b.selectedAt || 0) - (a.selectedAt || 0));
                setSelection(sortedSelections[0] || null);
            } else {
                setMyTicket(null);
            }
        } catch (e) {
            console.log("No active season or error", e);
        } finally {
            setLoading(false);
        }
    };

    const [isEditing, setIsEditing] = useState(false);

    const searchMovies = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }
        setSearching(true);
        try {
            const res = await api.get(`/submission/search?query=${searchQuery}`);
            setResults(res.data.results || []);
        } catch (e) {
            console.error(e);
        } finally {
            setSearching(false);
        }
    };

    useEffect(() => {
        const delay = parseInt(import.meta.env.VITE_SEARCH_DEBOUNCE_MS || '500', 10);
        const timer = setTimeout(() => {
            if (query) {
                searchMovies(query);
            } else {
                setResults([]);
            }
        }, delay);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const handleSubmitMovie = async (movie) => {
        try {
            const payload = {
                tmdbId: movie.id.toString(),
                title: movie.title,
                posterPath: movie.poster_path,
                overview: movie.overview,
                releaseDate: movie.release_date
            };

            if (isEditing) {
                await api.put('/submission/update', payload);
                setIsEditing(false);
            } else {
                await api.post('/submission/submit', payload);
            }

            setQuery('');
            setResults([]);
            fetchData();
        } catch (e) {
            alert(e.response?.data || "Submission failed");
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-20 text-[#b5a4cd] flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-[#ff80e4] border-t-transparent animate-spin" />
                <span className="text-xs uppercase tracking-[0.3em] font-bold">Loading...</span>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <section className="relative overflow-hidden bg-[#201139] border-2 border-[#4f4165] p-8 md:p-12 text-center">
                {season && (
                    <span className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 text-xs font-black tracking-wider mb-4 border-2 uppercase",
                        season.locked
                            ? "border-[#ff6e84] text-[#ff6e84]"
                            : "border-[#00f1fd] text-[#00f1fd]"
                    )}>
                        {season.locked ? <Lock className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {season.locked ? "SUBMISSIONS LOCKED" : "OPEN FOR SUBMISSIONS"}
                    </span>
                )}
                <h1 className="text-4xl md:text-6xl font-black text-[#ff80e4] neon-glow-primary mb-2 tracking-tight italic">
                    {season?.name || "Conch Club"}
                </h1>
                <p className="text-[#b5a4cd] uppercase tracking-[0.3em] text-xs font-bold">
                    Total Submissions: {tickets.length}
                </p>
            </section>

            <SubmissionForm
                season={season}
                myTicket={myTicket}
                isEditing={isEditing}
                handleSearch={handleSearch}
                query={query}
                setQuery={setQuery}
                searching={searching}
                setIsEditing={setIsEditing}
                results={results}
                handleSubmitMovie={handleSubmitMovie}
            />

            <OfficialSelection selection={selection} />

            <MySubmission
                myTicket={myTicket}
                season={season}
                isEditing={isEditing}
                onEdit={() => {
                    setIsEditing(true);
                    setQuery('');
                    setResults([]);
                }}
            />

            {!season && (
                <div className="flex flex-col items-center justify-center py-12 text-[#7e6f95] bg-[#201139] border-2 border-[#4f4165]">
                    <Film className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-sm font-bold uppercase tracking-[0.3em]">No season is currently active</p>
                </div>
            )}

            <section>
                <h3 className="text-sm font-black text-[#ffc965] neon-glow-tertiary mb-10 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    The Pool
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {tickets.map((ticket) => (
                        <MovieCard
                            key={ticket.id}
                            ticket={ticket}
                            isMine={myTicket?.id === ticket.id}
                        />
                    ))}
                </div>
                {tickets.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-[#4f4165] text-[#7e6f95] text-sm font-bold uppercase tracking-[0.2em]">
                        No submissions yet. Be the first!
                    </div>
                )}
            </section>
        </div>
    );
}
