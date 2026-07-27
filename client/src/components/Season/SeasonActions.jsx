import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ArchiveX, Pencil, Check, X } from 'lucide-react';
import api from '../../lib/api';
import NewSeasonForm from './NewSeasonForm';
import ConfirmDialog from '../UI/ConfirmDialog';

export default function SeasonActions({ onStatusChange, season }) {
    const [isLocked, setIsLocked] = useState(season ? season.locked : null);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState('');
    const [savingName, setSavingName] = useState(false);

    useEffect(() => {
        if (season) {
            setIsLocked(season.locked);
        } else {
            setIsLocked(null);
        }
    }, [season?.id, season?.locked]);

    const startEditingName = () => {
        setNameDraft(season?.name || '');
        setIsEditingName(true);
    };

    const cancelEditingName = () => {
        setIsEditingName(false);
        setNameDraft('');
    };

    const saveName = async () => {
        const trimmed = nameDraft.trim();
        if (!season?.id || !trimmed || trimmed === season.name) {
            cancelEditingName();
            return;
        }
        setSavingName(true);
        try {
            await api.post(`/admin/season/${season.id}/rename`, { name: trimmed });
            onStatusChange("Season renamed!");
            setIsEditingName(false);
        } catch (e) {
            onStatusChange("Error: " + (e.response?.data || e.message));
        } finally {
            setSavingName(false);
        }
    };

    const handleNameKeyDown = (e) => {
        if (e.key === 'Enter') saveName();
        if (e.key === 'Escape') cancelEditingName();
    };

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

    const closeSeason = async () => {
        setShowCloseConfirm(false);
        if (!season?.id) return;
        try {
            await api.post(`/admin/season/${season.id}/close`);
            onStatusChange("Season Closed and Archived.");
        } catch (e) {
            onStatusChange("Error: " + (e.response?.data || e.message));
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
        <section className="bg-canvas border border-border p-6 rounded-xl">
            <h2 className="font-serif text-xl font-semibold text-canvas-foreground mb-4">Season Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:flex-[3] bg-canvas-container border border-border p-4 rounded-lg flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <span className="text-canvas-muted-foreground text-xs font-semibold uppercase tracking-widest mb-1">Current Season</span>
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    autoFocus
                                    value={nameDraft}
                                    onChange={(e) => setNameDraft(e.target.value)}
                                    onKeyDown={handleNameKeyDown}
                                    disabled={savingName}
                                    className="font-serif text-2xl font-semibold text-canvas-foreground tracking-tight bg-transparent border-b-2 border-forest focus:outline-none flex-1 min-w-0"
                                />
                                <button
                                    onClick={saveName}
                                    disabled={savingName}
                                    title="Save"
                                    className="p-1.5 text-forest hover:text-forest-deep transition-colors shrink-0 disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={cancelEditingName}
                                    disabled={savingName}
                                    title="Cancel"
                                    className="p-1.5 text-canvas-muted-foreground hover:text-oxblood transition-colors shrink-0 disabled:opacity-50"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <span className="font-serif text-2xl font-semibold text-canvas-foreground tracking-tight truncate">
                                {season ? season.name : 'No Active Season'}
                            </span>
                        )}
                    </div>
                    {!isEditingName && season && (
                        <button
                            onClick={startEditingName}
                            title="Edit season name"
                            className="p-1.5 text-canvas-muted-foreground hover:text-forest transition-colors shrink-0"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                {!season ? (
                    <button disabled className="sm:flex-1 bg-canvas-container text-canvas-muted-foreground p-4 rounded-lg flex flex-row sm:flex-col items-center justify-center gap-2 border border-border opacity-50 cursor-not-allowed">
                        <Lock className="w-6 h-6" />
                        <span className="font-semibold uppercase tracking-wider text-xs">Lock</span>
                    </button>
                ) : isLocked ? (
                    <button onClick={unlockSeason} className="sm:flex-1 bg-forest-container hover:bg-forest-deep text-white p-4 rounded-lg flex flex-row sm:flex-col items-center justify-center gap-2 transition-colors">
                        <Unlock className="w-6 h-6" />
                        <span className="font-semibold uppercase tracking-wider text-xs">Unlock</span>
                    </button>
                ) : (
                    <button onClick={lockSeason} className="sm:flex-1 bg-canvas-container hover:bg-canvas-muted text-canvas-foreground p-4 rounded-lg flex flex-row sm:flex-col items-center justify-center gap-2 transition-colors border border-border">
                        <Lock className="w-6 h-6" />
                        <span className="font-semibold uppercase tracking-wider text-xs">Lock</span>
                    </button>
                )}
            </div>
            <div className="mt-4">
                <NewSeasonForm onStatusChange={onStatusChange} />
            </div>

            {season && (
                <div className="mt-4 border border-oxblood/30 rounded-xl p-4 bg-oxblood/5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-oxblood mb-3">Danger Zone</p>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-canvas-foreground">Close Season</p>
                            <p className="text-xs text-canvas-muted-foreground mt-0.5">Permanently archives this season. Cannot be undone.</p>
                        </div>
                        <button
                            onClick={() => setShowCloseConfirm(true)}
                            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-oxblood-container hover:bg-oxblood-deep text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors hard-shadow"
                        >
                            <ArchiveX className="w-4 h-4" />
                            Close Season
                        </button>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={showCloseConfirm}
                title={`Close "${season?.name}"?`}
                message="This will permanently archive the season. It will be locked, removed from the active view, and visible only in the Season Archive. This cannot be undone."
                confirmText="Yes, Close Season"
                cancelText="Cancel"
                onConfirm={closeSeason}
                onCancel={() => setShowCloseConfirm(false)}
            />
        </section>
    );
}
