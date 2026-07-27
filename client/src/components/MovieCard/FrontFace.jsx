import React from 'react';

export default function FrontFace({ ticket, isMine }) {
    return (
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [webkit-backface-visibility:hidden] [transform:translateZ(1px)] flex flex-col">
            {/* Poster */}
            <div className={`flex-1 relative bg-canvas-container overflow-hidden border-b border-border ${isMine ? 'border border-forest' : 'border border-border'}`}>
                {ticket.posterPath ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w500${ticket.posterPath}`}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-6xl text-canvas-muted-foreground select-none">?</span>
                    </div>
                )}
                {isMine && (
                    <div className="absolute top-2 left-2 bg-forest-container text-white small-caps text-[9px] font-semibold px-2 py-0.5 rounded-sm">
                        Yours
                    </div>
                )}
            </div>

            {/* Redacted metadata strip */}
            <div className="bg-canvas-container border border-t-0 border-border px-3 py-3 rounded-b">
                <div className="bg-canvas-highest rounded-sm px-2 py-2">
                    <div className="h-2.5 bg-canvas-muted rounded-sm w-4/5 mb-2" />
                    <div className="h-2 bg-canvas-muted rounded-sm w-3/5 mb-3" />
                    <div className="flex gap-2">
                        <div className="h-1.5 bg-canvas-muted rounded-sm w-1/4" />
                        <div className="h-1.5 bg-canvas-muted rounded-sm w-1/4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
