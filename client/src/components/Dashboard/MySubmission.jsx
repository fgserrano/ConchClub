import React from 'react';
import { Edit } from 'lucide-react';

export default function MySubmission({ myTicket, season, isEditing, onEdit }) {
    if (!myTicket || !season || season.locked || isEditing) return null;

    return (
        <div className="relative flex flex-col items-center justify-center p-8 border border-green-500/20 bg-green-500/5 rounded-3xl gap-6 h-full text-center">
            <div className="w-full flex justify-between items-start absolute top-6 right-6">
                <button
                    title="edit"
                    onClick={onEdit}
                    className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors border border-transparent hover:border-slate-700 ml-auto"
                >
                    <Edit className="w-5 h-5" />
                </button>
            </div>

            <p className="text-green-400 text-sm font-bold tracking-widest uppercase mb-2">My Submission</p>

            {myTicket.posterPath && (
                <img src={`https://image.tmdb.org/t/p/w200${myTicket.posterPath}`} alt={myTicket.title} className="w-40 rounded-xl shadow-lg" />
            )}

            <div>
                <h3 className="text-2xl font-black text-white mb-2">{myTicket.title}</h3>
                <p className="text-slate-400">Runtime: {myTicket.runtimeToNearestTenMin || myTicket.runtime}m</p>
            </div>
        </div>
    );
}
