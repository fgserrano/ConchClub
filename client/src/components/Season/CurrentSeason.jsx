import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import api from '../lib/api';
import MovieRow from './MovieCard/MovieRow';


export default function CurrentSeason() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="text-center py-8 text-slate-500">Loading submissions...</div>;
    }

    return (
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Current Season Submissions ({tickets.length})
            </h2>

            <div className="flex flex-col gap-4">
                {tickets.map((ticket) => (
                    <MovieRow key={ticket.id} ticket={ticket} />
                ))}
            </div>

            {tickets.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl text-slate-600">
                    No submissions yet.
                </div>
            )}
        </section>
    );
}
