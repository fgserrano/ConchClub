import React, { useEffect, useState } from 'react';
import { Search, Plus, Calendar, Film, Lock } from 'lucide-react';
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
        if (!searchQuery.trim()) { setResults([]); return; }
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
            if (query) searchMovies(query);
            else setResults([]);
        }, delay);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = (e) => { e.preventDefault(); };

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
            <div className="text-center mt-20 text-on-surface-variant flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
                Loading...
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <section className="bg-surface-low rounded-sm p-8 md:p-12 text-center">
                {season && (
                    <span className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-display font-bold tracking-[0.05em] uppercase mb-4",
                        season.locked
                            ? "bg-tertiary/10 text-tertiary"
                            : "bg-accent-forest/10 text-accent-forest"
                    )}>
                        {season.locked ? <Lock className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {season.locked ? "Submissions Locked" : "Open for Submissions"}
                    </span>
                )}
                <h1 className="text-4xl md:text-6xl font-display font-black text-on-surface mb-2 tracking-tight">
                    {season?.name || "Conch Club"}
                </h1>
                <p className="text-on-surface-variant text-sm uppercase tracking-[0.05em] font-display">
                    {tickets.length} {tickets.length === 1 ? 'submission' : 'submissions'}
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
                onEdit={() => { setIsEditing(true); setQuery(''); setResults([]); }}
            />

            {!season && (
                <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant bg-surface-low rounded-sm">
                    <Film className="w-12 h-12 mb-4 opacity-40" />
                    <p className="text-lg font-display font-medium">No season is currently active</p>
                </div>
            )}

            <section>
                <h3 className="text-xl font-display font-bold text-on-surface mb-10 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    The Pool
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {tickets.map((ticket, i) => (
                        <div key={ticket.id} className={i % 2 === 1 ? "mt-3" : ""}>
                            <MovieCard
                                ticket={ticket}
                                isMine={myTicket?.id === ticket.id}
                            />
                        </div>
                    ))}
                </div>
                {tickets.length === 0 && (
                    <div className="text-center py-12 bg-surface-low rounded-sm text-on-surface-variant">
                        No submissions yet. Be the first!
                    </div>
                )}
            </section>
        </div>
    );
}
