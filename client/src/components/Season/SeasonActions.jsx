import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';
import api from '../../lib/api';
import NewSeasonForm from './NewSeasonForm';

export default function SeasonActions({ onStatusChange, season }) {
    const [isLocked, setIsLocked] = useState(season ? season.locked : null);

    useEffect(() => {
        if (season) {
            setIsLocked(season.locked);
        } else {
            setIsLocked(null);
        }
    }, [season?.id, season?.locked]);

    const lockSeason = async () => {
        if (!season?.id) {
            onStatusChange("Error: No active season to lock.");
            return;
        }
        try {
            await api.post(`/admin/season/${season.id}/lock`);
            setIsLocked(true);
            onStatusChange("Season Locked!");
        } catch (e) {

            onStatusChange();
        }
    };

    const unlockSeason = async () => {
        if (!season?.id) {
            return;
        }
        try {
            await api.post(`/admin/season/${season.id}/unlock`);
            setIsLocked(false);
            onStatusChange("Season Unlocked!");
        } catch (e) {

            onStatusChange("Error: " + (e.response?.data || e.message));
        }
    };

    return (
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Season Actions</h2>
            <div className="flex gap-4">
                <div className="flex-[3] bg-slate-950 border border-slate-800 shadow-inner p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Current Season</span>
                    <span className="text-2xl font-bold text-white tracking-tight">{season ? season.name : 'No Active Season'}</span>
                </div>
                {isLocked === null ? (
                    <div className="flex-1 bg-slate-800/50 p-4 rounded-xl flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : isLocked ? (
                    <button onClick={unlockSeason} className="flex-1 bg-green-800 hover:bg-green-700 text-green-100 p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
                        <Unlock className="w-8 h-8" />
                        <span className="font-bold">UNLOCK</span>
                    </button>
                ) : (
                    <button onClick={lockSeason} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all">
                        <Lock className="w-8 h-8" />
                        <span className="font-bold">LOCK</span>
                    </button>
                )}

            </div>
            <div className="mt-4">
                <NewSeasonForm onStatusChange={onStatusChange} />
            </div>
        </section>
    );
}
