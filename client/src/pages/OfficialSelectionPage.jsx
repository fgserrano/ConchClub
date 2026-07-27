import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import OfficialSelection from '../components/Dashboard/OfficialSelection';
import api from '../lib/api';

export default function OfficialSelectionPage() {
    const [selection, setSelection] = useState(null);
    const [seasonName, setSeasonName] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/season/active').catch(() => ({ data: null })),
            api.get('/season/active/selection').catch(() => ({ data: [] })),
        ]).then(([seasonRes, selectionRes]) => {
            setSeasonName(seasonRes.data?.name || null);
            const allSelections = selectionRes.data || [];
            const sorted = [...allSelections].sort((a, b) => (b.selectedAt || 0) - (a.selectedAt || 0));
            setSelection(sorted[0] || null);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-20 text-canvas-muted-foreground flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-forest border-t-transparent animate-spin mb-4" />
                Loading magic...
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <section className="pb-4 border-b border-border">
                <span className="font-sans text-xs font-bold text-oxblood uppercase tracking-widest block mb-1">
                    {seasonName || 'No Active Season'}
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-canvas-foreground">
                    Official Selection
                </h1>
            </section>

            {selection ? (
                <OfficialSelection selection={selection} hideLabel />
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-canvas-muted-foreground bg-canvas-container border border-border rounded-xl">
                    <Trophy className="w-10 h-10 mb-4 opacity-40" />
                    <p className="text-base font-medium">No selection has been made yet</p>
                </div>
            )}
        </div>
    );
}
