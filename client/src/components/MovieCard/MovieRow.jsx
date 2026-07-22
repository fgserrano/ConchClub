import React from 'react';

export default function MovieRow({ ticket }) {
    return (
        <div className="bg-white border border-outline-light p-4 rounded flex gap-5 items-center">
            <div className="w-14 h-20 flex-shrink-0 bg-canvas-container rounded overflow-hidden shadow-[0_2px_8px_rgba(61,43,31,0.10)]">
                {ticket.posterPath ? (
                    <img src={`https://image.tmdb.org/t/p/w200${ticket.posterPath}`} alt={ticket.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline font-serif font-bold text-xl">?</div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                        <h4 className="font-serif text-lg font-semibold text-brown truncate">{ticket.title}</h4>
                        <div className="flex items-center gap-2 text-outline mt-0.5">
                            <span className="small-caps text-xs">{ticket.releaseDate?.split('-')[0]}</span>
                            <span className="text-xs">·</span>
                            <span className="small-caps text-xs">{ticket.runtimeToNearestTenMin || '?'}m</span>
                        </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-forest/10 text-forest border border-forest/20 text-xs font-semibold uppercase tracking-wider shrink-0">
                        {ticket.user?.username}
                    </span>
                </div>
                <p className="font-body text-brown-light text-sm line-clamp-2 mt-1">{ticket.overview}</p>
            </div>
        </div>
    );
}
