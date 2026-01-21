import React, { useState } from 'react';
import api from '../../lib/api';

import ConfirmDialog from '../UI/ConfirmDialog';

export default function NewSeasonForm({ onStatusChange }) {
    const [loading, setLoading] = useState(false);
    const [seasonName, setSeasonName] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    const handleCreateClick = (e) => {
        e.preventDefault();
        if (!seasonName.trim()) return;
        setShowConfirm(true);
    };

    const confirmCreateSeason = async () => {
        setShowConfirm(false);
        try {
            setLoading(true);
            await api.post('/admin/season', { name: seasonName });
            if (onStatusChange) onStatusChange("Season Created!");
            setSeasonName('');
        } catch (e) {
            if (onStatusChange) onStatusChange("Failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Start New Season</h2>
            <form onSubmit={handleCreateClick} className="flex gap-2">
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

            <ConfirmDialog
                isOpen={showConfirm}
                title="Create New Season?"
                message={`Are you sure you want to start a new season named "${seasonName}"? This will reset all current submissions.`}
                confirmText="Yes, Create It"
                cancelText="Cancel"
                onConfirm={confirmCreateSeason}
                onCancel={() => setShowConfirm(false)}
            />
        </section>
    );
}
