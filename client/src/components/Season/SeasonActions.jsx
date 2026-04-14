import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';
import api from '../../lib/api';
import NewSeasonForm from './NewSeasonForm';

export default function SeasonActions({ onStatusChange, season }) {
    const [isLocked, setIsLocked] = useState(season ? season.locked : null);

    useEffect(() => {
        if (season) setIsLocked(season.locked);
        else setIsLocked(null);
    }, [season?.id, season?.locked]);

    const lockSeason = async () => {
        if (!season?.id) { onStatusChange("Error: No active season to lock."); return; }
        try {
            await api.post(`/admin/season/${season.id}/lock`);
            setIsLocked(true);
            onStatusChange("Season Locked!");
        } catch (e) {
            onStatusChange();
        }
    };

    const unlockSeason = async () => {
        if (!season?.id) return;
        try {
            await api.post(`/admin/season/${season.id}/unlock`);
            setIsLocked(false);
            onStatusChange("Season Unlocked!");
        } catch (e) {
            onStatusChange("Error: " + (e.response?.data || e.message));
        }
    };

    return (
        <section className="bg-surface-low rounded-sm p-6">
            <h2 className="text-xl font-display font-bold text-on-surface mb-4">Season Actions</h2>
            <div className="flex gap-3">
                <div className="flex-[3] bg-surface-container rounded-sm p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-[0.05em] mb-1">Current Season</span>
                    <span className="text-2xl font-display font-bold text-on-surface tracking-tight">{season ? season.name : 'No Active Season'}</span>
                </div>

                {isLocked === null ? (
                    <div className="flex-1 bg-surface-container rounded-sm p-4 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-outline/40 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : isLocked ? (
                    <button
                        onClick={unlockSeason}
                        className="flex-1 bg-accent-forest/10 hover:bg-accent-forest/20 text-accent-forest rounded-sm p-4 flex flex-col items-center gap-2 transition-colors"
                    >
                        <Unlock className="w-7 h-7" />
                        <span className="font-display font-bold text-sm uppercase tracking-[0.05em]">Unlock</span>
                    </button>
                ) : (
                    <button
                        onClick={lockSeason}
                        className="flex-1 bg-surface-container hover:bg-surface-high text-on-surface rounded-sm p-4 flex flex-col items-center justify-center gap-2 transition-colors"
                    >
                        <Lock className="w-7 h-7" />
                        <span className="font-display font-bold text-sm uppercase tracking-[0.05em]">Lock</span>
                    </button>
                )}
            </div>

            <div className="mt-4">
                <NewSeasonForm onStatusChange={onStatusChange} />
            </div>
        </section>
    );
}
