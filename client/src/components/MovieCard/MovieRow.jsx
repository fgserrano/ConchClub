import React from 'react';

export default function MovieRow({ ticket }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex gap-6 items-center">
            <div className="w-16 h-24 flex-shrink-0 bg-slate-800 rounded-lg overflow-hidden shadow-lg">
                {ticket.posterPath ? (
                    <img src={`https://image.tmdb.org/t/p/w200${ticket.posterPath}`} alt={ticket.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700 font-bold text-xl">?</div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                        <h4 className="text-xl font-bold text-white truncate">{ticket.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span>{ticket.releaseDate?.split('-')[0]}</span>
                            <span>•</span>
                            <span>{ticket.runtimeToNearestTenMin || ticket.runtime}m</span>
                        </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
                        {ticket.user?.username}
                    </span>
                </div>
                <p className="text-slate-500 text-sm line-clamp-2">{ticket.overview}</p>
            </div>
        </div>
    );
}
