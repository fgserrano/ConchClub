import React, { useState } from 'react';
import { Lock, Play, Unlock } from 'lucide-react';
import api from '../../lib/api';

export default function SeasonActions({ onStatusChange, seasonId, isLocked }) {

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

    const unlockSeason = async () => {
        if (!seasonId) {
            if (onStatusChange) onStatusChange("Error: No active season to unlock.");
            return;
        }
        try {
            const res = await api.post(`/admin/season/${seasonId}/unlock`);
            if (onStatusChange) onStatusChange(`Season Unlocked: ${res.data.name}`);
        } catch (e) {
            if (onStatusChange) onStatusChange("Error: " + (e.response?.data || e.message));
        }
    };

    return (
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Season Actions</h2>
            <div className="flex gap-4">
                {isLocked ? (
                    <button onClick={unlockSeason} className="flex-1 bg-green-800 hover:bg-green-700 text-green-100 p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
                        <Unlock className="w-8 h-8" />
                        <span className="font-bold">UNLOCK SUBMISSIONS</span>
                    </button>
                ) : (
                    <button onClick={lockSeason} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
                        <Lock className="w-8 h-8" />
                        <span className="font-bold">LOCK SUBMISSIONS</span>
                    </button>
                )}
            </div>
        </section>
    );
}
