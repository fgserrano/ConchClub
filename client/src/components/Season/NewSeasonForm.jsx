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
        <section className="bg-surface-container rounded-sm p-4">
            <h2 className="text-base font-display font-bold text-on-surface mb-4">Start New Season</h2>
            <form onSubmit={handleCreateClick} className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-[11px] uppercase tracking-[0.05em] font-display text-on-surface-variant mb-1">
                        Season Name
                    </label>
                    <input
                        type="text"
                        value={seasonName}
                        onChange={e => setSeasonName(e.target.value)}
                        placeholder="e.g. Horror Month"
                        className="w-full bg-transparent border-0 border-b border-outline/40 rounded-none py-2 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors"
                        required
                    />
                </div>
                <button
                    disabled={loading}
                    className="bg-primary text-on-primary px-5 py-2 rounded-sm font-display font-bold hover:bg-primary-container transition-colors disabled:opacity-50 shrink-0"
                >
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
