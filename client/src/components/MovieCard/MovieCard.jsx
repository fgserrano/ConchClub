import React from 'react';

export default function MovieCard({ ticket, isMine }) {
    const isTV = ticket.mediaType === 'tv';
    const runtime = ticket.runtimeToNearestTenMin || ticket.runtime;
    const year = ticket.releaseDate?.split('-')[0];
    const isRevealed = ticket.selected || isMine;


    return (
        <div className="bg-canvas-container border border-border p-4 flex flex-col group hover:border-oxblood transition-all hard-shadow cursor-default rounded-xl">

            {/* Poster */}
            <div className="aspect-[3/4] bg-placeholder overflow-hidden border border-border mb-3 relative rounded-lg">
                {ticket.posterPath ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w500${ticket.posterPath}`}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-6xl text-canvas-container select-none">?</span>
                    </div>
                )}

                {isMine && (
                    <div className="absolute top-2 left-2 bg-forest-container text-white small-caps text-[13px] font-semibold px-2.5 py-0.5 rounded-full">
                        Yours
                    </div>
                )}

                {ticket.selected && (
                    <div className="absolute top-2 right-2 bg-oxblood-container text-white small-caps text-[13px] font-semibold px-2.5 py-0.5 rounded-full">
                        Selected
                    </div>
                )}
            </div>

            {/* Metadata — revealed only when chosen, otherwise redacted */}
            {isRevealed ? (
                <div className="bg-canvas-highest rounded-md px-3 py-2">
                    <h3 className="font-serif text-base font-bold text-canvas-foreground leading-snug group-hover:text-oxblood transition-colors">
                        {ticket.title}
                    </h3>
                    <p className="font-body text-xs text-canvas-muted-foreground italic mt-0.5">
                        Submitted by {ticket.user?.username}
                    </p>

                    <div className="mt-2 pt-2 border-t border-border/60 font-sans text-[11px] space-y-0.5">
                        {year && (
                            <div className="flex justify-between text-canvas-muted-foreground">
                                <span>Year</span>
                                <span className="text-canvas-foreground font-semibold">{year}</span>
                            </div>
                        )}
                        {ticket.genre && (
                            <div className="flex justify-between text-canvas-muted-foreground">
                                <span>Genre</span>
                                <span className="text-canvas-foreground font-semibold text-right">{ticket.genre}</span>
                            </div>
                        )}
                        {!isTV && runtime ? (
                            <div className="flex justify-between text-canvas-muted-foreground">
                                <span>Runtime</span>
                                <span className="text-canvas-foreground font-semibold">{runtime}m</span>
                            </div>
                        ) : isTV && runtime ? (
                            <div className="flex justify-between text-canvas-muted-foreground">
                                <span>Episodes</span>
                                <span className="text-canvas-foreground font-semibold">{runtime}</span>
                            </div>
                        ) : null}
                    </div>

                    {ticket.overview && (
                        <p className="font-body text-xs text-canvas-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                            {ticket.overview}
                        </p>
                    )}
                </div>
            ) : (
                <div>
                    {/* Title — redacted, submitted by — revealed */}
                    <div className="h-4 bg-canvas-highest rounded-sm w-4/5 mb-1.5" />
                    <p className="font-body text-xs text-canvas-muted-foreground italic">
                        Submitted by {ticket.user?.username}
                    </p>

                    {/* Metadata table — labels real, values redacted */}
                    <div className="mt-2 pt-2 border-t border-border/60 font-sans text-[11px] space-y-0.5">
                        <div className="flex justify-between items-center text-canvas-muted-foreground">
                            <span>Year</span>
                            <div className="h-2 bg-canvas-highest rounded-sm w-8" />
                        </div>
                        <div className="flex justify-between items-center text-canvas-muted-foreground">
                            <span>Genre</span>
                            <div className="h-2 bg-canvas-highest rounded-sm w-16" />
                        </div>
                        <div className="flex justify-between items-center text-canvas-muted-foreground">
                            <span>Runtime</span>
                            <div className="h-2 bg-canvas-highest rounded-sm w-10" />
                        </div>
                    </div>

                    {/* Overview — redacted */}
                    <div className="mt-2 flex flex-col gap-1.5">
                        <div className="h-1.5 bg-canvas-muted rounded-sm w-full" />
                        <div className="h-1.5 bg-canvas-muted rounded-sm w-5/6" />
                    </div>
                </div>
            )}
        </div>
    );
}
