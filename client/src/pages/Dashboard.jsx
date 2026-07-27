import React, { useEffect, useState } from 'react';
import { Calendar, Film } from 'lucide-react';
import MovieCard from '../components/MovieCard/MovieCard';
import OfficialSelection from '../components/Dashboard/OfficialSelection';
import api from '../lib/api';

export default function Dashboard() {

    const [season, setSeason] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [myTicket, setMyTicket] = useState(null);
    const [selection, setSelection] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const winner = tickets.find(t => t.selected);

    if (loading) {
        return <div className="text-center mt-20 text-canvas-muted-foreground flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-2 border-forest border-t-transparent animate-spin mb-4" />
            Loading magic...
        </div>;
    }



    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <section className="pb-6 border-b border-border">
                <span className="font-sans text-xs font-bold text-oxblood uppercase tracking-widest block mb-1">
                    {season ? (season.locked ? 'Submissions Closed' : 'Current Season Submissions') : 'No Active Season'}
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-canvas-foreground">
                    Submission Collection
                </h1>
                <p className="font-body text-sm text-canvas-muted-foreground mt-1">
                    {tickets.length} {tickets.length === 1 ? 'submission' : 'submissions'} in the pool this season.
                </p>
            </section>

            <OfficialSelection selection={selection} />

{!season && (
                <div className="flex flex-col items-center justify-center py-12 text-canvas-muted-foreground bg-canvas-container rounded-xl border border-border">
                    <Film className="w-10 h-10 mb-4 opacity-40" />
                    <p className="text-base font-medium">No season is currently active</p>
                </div>
            )}

            <section>
                <h3 className="small-caps text-sm font-semibold text-canvas-muted-foreground mb-8 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-forest" />
                    Submission Pool
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((ticket) => (
                        <MovieCard
                            key={ticket.id}
                            ticket={ticket}
                            isMine={myTicket?.id === ticket.id}
                        />
                    ))}
                </div>
                {tickets.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-xl text-canvas-muted-foreground">
                        No submissions yet. Be the first!
                    </div>
                )}
            </section>
        </div>
    );
}
