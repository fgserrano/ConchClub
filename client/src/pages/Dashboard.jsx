import React, { useEffect, useState } from 'react';
import { Search, Plus, Calendar, Film, Lock, Trophy, Edit, X } from 'lucide-react';
import MovieCard from '../components/MovieCard/MovieCard';
import api from '../lib/api';
import { cn } from '../lib/utils';

export default function Dashboard() {

    const [season, setSeason] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [myTicket, setMyTicket] = useState(null);
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
                const [ticketRes, myTicketRes] = await Promise.all([
                    api.get('/season/tickets'),
                    api.get('/season/tickets/me').catch(() => ({ data: null }))
                ]);

                let allTickets = ticketRes.data;
                const myFullTicket = myTicketRes.data;

                if (myFullTicket) {
                    setMyTicket(myFullTicket);
                    allTickets = allTickets.map(t => t.id === myFullTicket.id ? myFullTicket : t);
                } else {
                    setMyTicket(null);
                }

                setTickets(allTickets);
            }
        } catch (e) {
            console.log("No active season or error", e);
        } finally {
            setLoading(false);
        }
    };

    const [isEditing, setIsEditing] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setSearching(true);
        try {
            const res = await api.get(`/submission/search?query=${query}`);
            setResults(res.data.results || []);
        } catch (e) {
            console.error(e);
        } finally {
            setSearching(false);
        }
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

    const winner = tickets.find(t => t.selected);

    if (loading) {
        return <div className="text-center mt-20 text-slate-500 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-4" />
            Loading magic...
        </div>;
    }



    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <section className="relative rounded-3xl overflow-hidden bg-slate-900/50 border border-slate-800 p-8 md:p-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10" />
                <div className="relative z-10">
                    {season && (
                        <span className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4",
                            season.locked ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20")}>
                            {season.locked ? <Lock className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            {season.locked ? "SUBMISSIONS LOCKED" : "OPEN FOR SUBMISSIONS"}
                        </span>
                    )}
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
                        {season?.name || "Conch Club"}
                    </h1>
                    <p className="text-slate-400">Total Submissions: {tickets.length}</p>
                </div>
            </section>


            {winner && winner.title && (
                <section className="relative transform hover:scale-[1.01] transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 blur-2xl -z-10" />
                    <div className="bg-black/40 border border-yellow-500/30 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${winner.posterPath}`}
                            alt={winner.title}
                            className="w-48 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.3)]"
                        />
                        <div className="text-center md:text-left">
                            <div className="flex items-center gap-2 justify-center md:justify-start text-yellow-500 mb-2">
                                <Trophy className="w-6 h-6" />
                                <span className="font-bold tracking-widest text-sm">OFFICIAL SELECTION</span>
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-4">{winner.title}</h2>
                            <p className="text-slate-300 max-w-xl leading-relaxed">{winner.overview}</p>
                            <div className="mt-6 flex items-center justify-center md:justify-start gap-4 text-sm text-slate-500">
                                <span>Submitted by <span className="text-yellow-400 font-medium">{winner.user.username}</span></span>
                                <span>•</span>
                                <span>{winner.releaseDate?.split('-')[0]}</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {!season && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 bg-slate-900/30 rounded-3xl border border-slate-800/50 mb-8">
                    <Film className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No season is currently active</p>
                </div>
            )}

            {season && !season.locked && (!myTicket || isEditing) && (
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="relative group mb-8">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for a movie..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 pl-14 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-lg shadow-xl"
                            autoFocus
                        />
                        <Search className="absolute left-5 top-5 w-5 h-5 text-slate-500 group-focus-within:text-purple-400" />
                        {searching ? (
                            <div className="absolute right-5 top-5 w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        ) : isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="absolute right-5 top-5 text-slate-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        ) : null}
                    </form>

                    <div className="grid gap-4">
                        {results.map((movie) => (
                            <div key={movie.id}
                                onClick={() => handleSubmitMovie(movie)}
                                className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 p-4 rounded-xl flex gap-4 cursor-pointer transition-all group">
                                {movie.poster_path && (
                                    <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} className="w-16 h-24 object-cover rounded-lg bg-slate-700" alt="" />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">{movie.title}</h3>
                                    <p className="text-slate-400 text-sm mt-1 line-clamp-2">{movie.overview}</p>
                                    <p className="text-slate-600 text-xs mt-2">{movie.release_date?.split('-')[0]}</p>
                                </div>
                                <div className="self-center">
                                    <Plus className="w-6 h-6 text-slate-500 group-hover:text-purple-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {myTicket && season && !season.locked && !isEditing && (
                <div className="relative flex items-center justify-center p-8 border border-green-500/20 bg-green-500/5 rounded-2xl mb-8 gap-8">
                    <div className="flex items-center gap-8">
                        {myTicket.posterPath && (
                            <img src={`https://image.tmdb.org/t/p/w200${myTicket.posterPath}`} alt={myTicket.title} className="w-24 rounded-lg shadow-lg" />
                        )}
                        <div className="text-center md:text-left">
                            <p className="text-green-400 text-sm font-bold tracking-widest uppercase mb-2">My Submission</p>
                            <h3 className="text-2xl font-black text-white mb-2">{myTicket.title}</h3>
                            <p className="text-slate-400">Runtime: {myTicket.runtimeToNearestTenMin || myTicket.runtime}m</p>
                        </div>
                    </div>
                    <button
                        title="edit"
                        onClick={() => {
                            setIsEditing(true);
                            setQuery('');
                            setResults([]);
                        }}
                        className="absolute right-8 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors border border-transparent hover:border-slate-700"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                </div>
            )}



            <section>
                <h3 className="text-xl font-bold text-slate-300 mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    The Pool
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {tickets.map((ticket) => (
                        <MovieCard
                            key={ticket.id}
                            ticket={ticket}
                        />
                    ))}
                </div>
                {tickets.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
                        No submissions yet. Be the first!
                    </div>
                )}
            </section>
        </div>
    );
}
