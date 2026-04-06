import { useState } from 'react';
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
        <section className="bg-[#271641] border-2 border-[#4f4165] p-4 mt-2">
            <h2 className="text-[10px] font-black text-[#7e6f95] uppercase tracking-[0.3em] mb-3">Start New Season</h2>
            <form onSubmit={handleCreateClick} className="flex gap-2">
                <input
                    type="text"
                    value={seasonName}
                    onChange={e => setSeasonName(e.target.value)}
                    placeholder="Season name (e.g. Horror Month)"
                    className="flex-1 bg-black border-2 border-[#7e6f95] focus:border-[#00f1fd] px-4 py-2 text-[#eee0ff] focus:outline-none focus:ring-0 transition-all placeholder:text-[#7e6f95]/40 text-sm font-bold"
                    required
                />
                <button
                    disabled={loading}
                    className="border-2 border-[#ff80e4] text-[#ff80e4] px-6 py-2 font-black text-xs uppercase tracking-widest hover:bg-[#ff80e4]/10 transition-colors disabled:opacity-50"
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
