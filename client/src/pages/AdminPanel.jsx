import React, { useEffect, useState } from 'react';
import { Shield, TriangleAlert } from 'lucide-react';
import SeasonActions from '../components/Season/SeasonActions';
import CurrentSeason from '../components/Season/CurrentSeason';
import api from '../lib/api';

export default function AdminPanel() {
    const [season, setSeason] = useState(null);

    const fetchSeason = async () => {
        try {
            const res = await api.get('/season/active');
            setSeason(res.data);
        } catch (e) {
            setSeason(null);
        }
    };

    useEffect(() => {
        fetchSeason();
    }, []);

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="flex items-center gap-3 text-forest mb-8">
                <Shield className="w-6 h-6" />
                <h1 className="font-serif text-3xl font-semibold text-canvas-foreground">Admin Control</h1>
            </div>

            {!season && (
                <div className="flex items-center gap-3 p-4 bg-oxblood/5 border border-oxblood/20 rounded-lg text-oxblood text-sm font-medium">
                    <TriangleAlert className="w-4 h-4 shrink-0" />
                    No season is currently active. Start a new one below.
                </div>
            )}

            <SeasonActions onStatusChange={fetchSeason} season={season} />
            <CurrentSeason season={season} />
        </div>
    );
}
