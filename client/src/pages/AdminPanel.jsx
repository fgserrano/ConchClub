import React, { useState } from 'react';
import { Shield, Lock, Unlock, Play } from 'lucide-react';
import api from '../lib/api';

export default function AdminPanel() {
    const [loading, setLoading] = useState(false);
    const [seasonName, setSeasonName] = useState('');
    const [response, setResponse] = useState('');

    const createSeason = async (e) => {
        try {
            setLoading(true);
            await api.post('/admin/season', { name: seasonName });
            setResponse("Season Created!");
            setSeasonName('');
        } catch (e) {
            setResponse("Failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const lockSeason = async () => {
        // Hardcoded ID for now since we just want to lock the active one usually
        // Ideally we fetch the active ID first. 
        // For this MVP let's assume the user knows what they are doing or we improve the API to /season/lock-active
        alert("This feature needs the active season ID. Go to dashboard to see it.");
    };

    const revealWinner = async () => {
        if (!confirm("REVEAL THE WINNER??")) return;
        try {
            const res = await api.post('/admin/reveal');
            setResponse(`WINNER: ${res.data.title}`);
        } catch (e) {
            setResponse("Error: " + e.response?.data);
        }
    }

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

            {/* CREATE SEASON */}
            <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Start New Season</h2>
                <form onSubmit={createSeason} className="flex gap-2">
                    <input
                        type="text"
                        value={seasonName}
                        onChange={e => setSeasonName(e.target.value)}
                        placeholder="Season Name (e.g. 'Horror Month')"
                        className="flex-1 bg-black/40 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        required
                    />
                    <button disabled={loading} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                        Create
                    </button>
                </form>
            </section>

            {/* ACTIONS */}
            <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Season Actions</h2>
                <div className="flex gap-4">
                    <button onClick={revealWinner} className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:opacity-90 text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
                        <Play className="w-8 h-8" />
                        <span className="font-bold">REVEAL WINNER</span>
                    </button>

                    <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
                        <Lock className="w-8 h-8" />
                        <span className="font-bold">LOCK SUBMISSIONS</span>
                    </button>
                </div>
            </section>
        </div>
    );
}
