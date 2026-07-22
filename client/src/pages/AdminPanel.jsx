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
            <div className="flex items-center gap-3 text-forest mb-8">
                <Shield className="w-6 h-6" />
                <h1 className="font-serif text-3xl font-semibold text-brown">Admin Control</h1>
            </div>

            {response && (
                <div className="p-4 bg-canvas-container border-l-4 border-forest text-brown rounded">
                    {response}
                </div>
            )}

            <SeasonActions onStatusChange={setResponse} season={season} />
            <CurrentSeason season={season} />
        </div>
    );
}
