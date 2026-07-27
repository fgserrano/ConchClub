import React from 'react';

export default function MovieRow({ ticket }) {
    const isTV = ticket.mediaType === 'tv';
    const runtime = ticket.runtimeToNearestTenMin || ticket.runtime;

    return (
        <div className="relative pt-5">
            {/* Username chip — floats above the top-left corner of the card */}
            <span className="absolute top-0 left-0 px-2.5 py-0.5 bg-forest-container text-forest-on text-[10px] font-semibold uppercase tracking-wide">
                {ticket.user?.username}
            </span>

            {/* Card body */}
            <div className="bg-canvas-container border border-border rounded-xl flex overflow-hidden">
                <div className="w-20 flex-shrink-0 bg-canvas-container overflow-hidden">
                    {ticket.posterPath ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w200${ticket.posterPath}`}
                            alt={ticket.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-canvas-muted-foreground font-serif font-bold text-xl">?</div>
                    )}
                </div>

                <div className="flex-1 min-w-0 p-4">
                    <h4 className="font-serif text-lg font-semibold text-canvas-foreground truncate">{ticket.title}</h4>
                    <div className="flex items-center gap-2 text-canvas-muted-foreground mt-0.5 mb-1">
                        <span className="small-caps text-xs">{ticket.releaseDate?.split('-')[0]}</span>
                        {!isTV && runtime ? (
                            <>
                                <span className="text-xs">·</span>
                                <span className="small-caps text-xs">{runtime}m</span>
                            </>
                        ) : null}
                    </div>
                    <p className="font-body text-canvas-muted-foreground text-sm line-clamp-2">{ticket.overview}</p>
                </div>
            </div>
        </div>
    );
}
