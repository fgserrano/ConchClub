import React, { useEffect, useState } from 'react';
import { Search, Plus, Calendar, Film, Lock, Trophy, Edit, X } from 'lucide-react';
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
                    api.get('/season/tickets'),
                    api.get('/season/tickets/me').catch(() => ({ data: null })),
                    api.get('/season/active/selection').catch(() => ({ data: null }))
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
                setSelection(selectionRes.data);
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


            {/* Active Content Grid */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <OfficialSelection selection={selection} />

                {/* Right Column: User Action / Status */}
                <div className="space-y-8">
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
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500 bg-slate-900/30 rounded-3xl border border-slate-800/50">
                            <Film className="w-12 h-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">No season is currently active</p>
                        </div>
                    )}
                </div>
            </div>

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
