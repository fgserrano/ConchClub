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
        <section className="bg-canvas-container border border-border p-6 rounded-xl">
            <h2 className="font-serif text-lg font-semibold text-canvas-foreground mb-4">Start New Season</h2>
            <form onSubmit={handleCreateClick} className="flex gap-2">
                <input
                    type="text"
                    value={seasonName}
                    onChange={e => setSeasonName(e.target.value)}
                    placeholder="Season Name (e.g. 'Horror Month')"
                    className="flex-1 bg-canvas-container border-0 border-b-2 border-border px-3 py-2 text-canvas-foreground placeholder:text-canvas-muted-foreground focus:outline-none focus:border-forest transition-colors"
                    required
                />
                <button disabled={loading} className="bg-oxblood-container hover:bg-oxblood-deep text-white px-6 py-2 rounded-lg font-semibold uppercase tracking-wider text-xs transition-colors disabled:opacity-50 hard-shadow">
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
