import React, { useEffect, useState } from 'react';
import { Calendar, Film, Lock, Plus } from 'lucide-react';
import MovieCard from '../components/MovieCard/MovieCard';
import OfficialSelection from '../components/Dashboard/OfficialSelection';
import MySubmission from '../components/Dashboard/MySubmission';
import api from '../lib/api';
import { cn } from '../lib/utils';

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
        return <div className="text-center mt-20 text-outline flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-2 border-forest border-t-transparent animate-spin mb-4" />
            Loading magic...
        </div>;
    }



    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <section className="pb-8 border-b border-outline-light">
                {season && (
                    <span className={cn("small-caps text-xs font-semibold mb-3 inline-flex items-center gap-1.5",
                        season.locked ? "text-oxblood" : "text-forest")}>
                        {season.locked ? <Lock className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {season.locked ? "Submissions Locked" : "Open for Submissions"}
                    </span>
                )}
                <h1 className="font-serif text-5xl md:text-7xl font-semibold text-brown mb-3 tracking-tight leading-none">
                    {season?.name || "Conch Club"}
                </h1>
                <p className="font-body text-brown-light text-sm mt-4">
                    {tickets.length} {tickets.length === 1 ? 'submission' : 'submissions'} in the pool this season.
                </p>
            </section>

            <OfficialSelection selection={selection} />

            <MySubmission
                myTicket={myTicket}
                season={season}
                isEditing={false}
                onEdit={null}
            />

            {!season && (
                <div className="flex flex-col items-center justify-center py-12 text-outline bg-canvas-container rounded border border-outline-light">
                    <Film className="w-10 h-10 mb-4 opacity-40" />
                    <p className="text-base font-medium">No season is currently active</p>
                </div>
            )}

            <section>
                <h3 className="small-caps text-sm font-semibold text-outline mb-8 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-forest" />
                    Browse Submissions
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
                    <div className="text-center py-12 border-2 border-dashed border-outline-light rounded text-outline">
                        No submissions yet. Be the first!
                    </div>
                )}
            </section>
        </div>
    );
}
