import React from 'react';
import { Edit } from 'lucide-react';

export default function MySubmission({ myTicket, season, isEditing, onEdit }) {
    if (!myTicket || !season || season.locked || isEditing) return null;

    return (
        <div className="relative overflow-hidden rounded-sm bg-surface-container p-8 flex flex-col items-center gap-6 text-center">
            <div className="absolute left-0 inset-y-0 w-1.5 bg-accent-terracotta" />

            <button
                title="Edit submission"
                onClick={onEdit}
                className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-high rounded-full transition-colors"
            >
                <Edit className="w-4 h-4" />
            </button>

            <p className="text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-[0.12em]">My Submission</p>

            {myTicket.posterPath && (
                <img
                    src={`https://image.tmdb.org/t/p/w200${myTicket.posterPath}`}
                    alt={myTicket.title}
                    className="w-40 rounded-sm shadow-[0_8px_24px_rgba(33,27,0,0.10)]"
                />
            )}

            <div>
                <h3 className="text-2xl font-display font-bold text-on-surface mb-1">{myTicket.title}</h3>
                <p className="text-on-surface-variant text-sm uppercase tracking-[0.05em] font-display">{myTicket.runtimeToNearestTenMin || myTicket.runtime}m</p>
            </div>
        </div>
    );
}
