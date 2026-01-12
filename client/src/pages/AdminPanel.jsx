import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import NewSeasonForm from '../components/NewSeasonForm';
import SeasonActions from '../components/SeasonActions';
import CurrentSeason from '../components/CurrentSeason';

export default function AdminPanel() {
    const [response, setResponse] = useState('');

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
            <CurrentSeason />
            <SeasonActions onStatusChange={setResponse} />
        </div>
    );
}
