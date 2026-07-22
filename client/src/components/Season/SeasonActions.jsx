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
        <section className="bg-canvas border border-outline-light p-6 rounded">
            <h2 className="font-serif text-xl font-semibold text-brown mb-4">Season Actions</h2>
            <div className="flex gap-4">
                <div className="flex-[3] bg-canvas-container border border-outline-light p-4 rounded flex flex-col justify-center">
                    <span className="text-outline text-xs font-semibold uppercase tracking-widest mb-1">Current Season</span>
                    <span className="font-serif text-2xl font-semibold text-brown tracking-tight">{season ? season.name : 'No Active Season'}</span>
                </div>
                {isLocked === null ? (
                    <div className="flex-1 bg-canvas-container p-4 rounded flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-outline border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : isLocked ? (
                    <button onClick={unlockSeason} className="flex-1 bg-forest hover:bg-forest-deep text-white p-4 rounded flex flex-col items-center gap-2 transition-colors">
                        <Unlock className="w-6 h-6" />
                        <span className="font-semibold uppercase tracking-wider text-xs">Unlock</span>
                    </button>
                ) : (
                    <button onClick={lockSeason} className="flex-1 bg-canvas-container hover:bg-canvas-high text-brown p-4 rounded flex flex-col items-center justify-center gap-2 transition-colors border border-outline-light">
                        <Lock className="w-6 h-6" />
                        <span className="font-semibold uppercase tracking-wider text-xs">Lock</span>
                    </button>
                )}
            </div>
            <div className="mt-4">
                <NewSeasonForm onStatusChange={onStatusChange} />
            </div>
        </section>
    );
}
