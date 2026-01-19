import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import NewSeasonForm from '../components/Season/NewSeasonForm';
import SeasonActions from '../components/Season/SeasonActions';
import CurrentSeason from '../components/Season/CurrentSeason';
import api from '../lib/api';

export default function AdminPanel() {
    const [response, setResponse] = useState('');
    const [season, setSeason] = useState(null);

    const fetchSeason = async () => {
        try {
            const res = await api.get('/season/active');
            setSeason(res.data);
        } catch (e) {
        }
    };

    useEffect(() => {
        fetchSeason();
    }, [response]);

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="flex items-center gap-3 text-purple-400 mb-8">
                <Shield className="w-8 h-8" />
                <h1 className="text-3xl font-bold text-white">Admin Control</h1>
            </div>

            {response && (
                <div className="p-4 bg-slate-800 border-l-4 border-purple-500 text-white rounded">
                    {response}
                </div>
            )}

            <NewSeasonForm onStatusChange={setResponse} />
            <CurrentSeason season={season} />
            <SeasonActions seasonId={season?.id} isLocked={season?.locked} onStatusChange={setResponse} />
        </div>
    );
}
