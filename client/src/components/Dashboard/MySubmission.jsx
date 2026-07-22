import React from 'react';
import { Edit } from 'lucide-react';

export default function MySubmission({ myTicket, season, isEditing, onEdit }) {
    if (!myTicket || !season || season.locked || isEditing) return null;

    return (
        <div className="relative flex flex-col items-center justify-center p-8 border border-forest/20 bg-forest/5 rounded gap-6 h-full text-center hard-shadow">
            <div className="w-full flex justify-between items-start absolute top-4 right-4">
                <button
                    title="edit"
                    onClick={onEdit}
                    className="p-2 text-brown-light hover:text-forest hover:bg-canvas-container rounded transition-colors ml-auto"
                >
                    <Edit className="w-4 h-4" />
                </button>
            </div>

            <p className="small-caps text-forest text-xs font-semibold mb-2">My Submission</p>

            {myTicket.posterPath && (
                <img src={`https://image.tmdb.org/t/p/w200${myTicket.posterPath}`} alt={myTicket.title} className="w-36 rounded shadow-[0_4px_16px_rgba(61,43,31,0.15)]" />
            )}

            <div>
                <h3 className="font-serif text-2xl font-semibold text-brown mb-1">{myTicket.title}</h3>
                <p className="text-brown-light text-sm">Runtime: {myTicket.runtimeToNearestTenMin || myTicket.runtime}m</p>
            </div>
        </div>
    );
}
