import React, { useState } from 'react';
import { Lock, Play } from 'lucide-react';
import api from '../lib/api';

export default function SeasonActions({ onStatusChange, seasonId }) {
    const revealWinner = async () => {
        try {
            const res = await api.post('/admin/reveal');
            if (onStatusChange) onStatusChange(`WINNER: ${res.data.title}`);
        } catch (e) {
            if (onStatusChange) onStatusChange("Error: " + e.response?.data);
        }
    };

    const lockSeason = async () => {
        if (!seasonId) {
            if (onStatusChange) onStatusChange("Error: No active season to lock.");
            return;
        }
        try {
            const res = await api.post(`/admin/season/${seasonId}/lock`);
            if (onStatusChange) onStatusChange(`Season Locked: ${res.data.name}`);
        } catch (e) {
            if (onStatusChange) onStatusChange("Error: " + (e.response?.data || e.message));
        }
    };

    return (
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Season Actions</h2>
            <div className="flex gap-4">
                <button onClick={revealWinner} className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:opacity-90 text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
                    <Play className="w-8 h-8" />
                    <span className="font-bold">REVEAL WINNER</span>
                </button>

                <button onClick={lockSeason} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
                    <Lock className="w-8 h-8" />
                    <span className="font-bold">LOCK SUBMISSIONS</span>
                </button>
            </div>
        </section>
    );
}
