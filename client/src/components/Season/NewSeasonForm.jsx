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
        <section className="bg-canvas-container border border-outline-light p-6 rounded">
            <h2 className="font-serif text-lg font-semibold text-brown mb-4">Start New Season</h2>
            <form onSubmit={handleCreateClick} className="flex gap-2">
                <input
                    type="text"
                    value={seasonName}
                    onChange={e => setSeasonName(e.target.value)}
                    placeholder="Season Name (e.g. 'Horror Month')"
                    className="flex-1 bg-white border-0 border-b-2 border-outline-light px-3 py-2 text-brown placeholder:text-outline focus:outline-none focus:border-forest transition-colors"
                    required
                />
                <button disabled={loading} className="bg-oxblood hover:bg-oxblood-deep text-white px-6 py-2 rounded font-semibold uppercase tracking-wider text-xs transition-colors disabled:opacity-50 hard-shadow">
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
