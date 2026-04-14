import React from 'react';

export default function MovieRow({ ticket }) {
    return (
        <div className="bg-surface-low p-4 rounded-sm flex gap-6 items-center">
            <div className="w-16 h-24 flex-shrink-0 bg-surface-container rounded-sm overflow-hidden shadow-[0_4px_12px_rgba(33,27,0,0.08)]">
                {ticket.posterPath ? (
                    <img src={`https://image.tmdb.org/t/p/w200${ticket.posterPath}`} alt={ticket.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40 font-bold text-xl">?</div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                        <h4 className="text-xl font-display font-bold text-on-surface truncate">{ticket.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <span>{ticket.releaseDate?.split('-')[0]}</span>
                            <span>·</span>
                            <span>{ticket.runtimeToNearestTenMin || '?'}m</span>
                        </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-tertiary-container/60 text-on-tertiary-container text-xs font-display font-bold uppercase tracking-[0.05em] shrink-0">
                        {ticket.user?.username}
                    </span>
                </div>
                <p className="text-on-surface-variant text-sm line-clamp-2">{ticket.overview}</p>
            </div>
        </div>
    );
}
