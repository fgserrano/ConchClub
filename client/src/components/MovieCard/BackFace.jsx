import React from 'react';

export default function BackFace({ ticket, roundedRuntime, year }) {
    return (
        <div className="absolute inset-0 w-full h-full bg-canvas-container border border-forest/30 rounded overflow-hidden [backface-visibility:hidden] [webkit-backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col">
            {/* Header accent */}
            <div className="bg-forest-deep px-3 py-2.5 shrink-0">
                <p className="small-caps text-forest-light/70 text-[9px]">Entry Revealed</p>
            </div>

            {/* Metadata */}
            <div className="flex-1 flex flex-col justify-center gap-4 px-4 py-4">
                {ticket.title && (
                    <div>
                        <p className="small-caps text-[9px] text-forest mb-1">Title</p>
                        <h3 className="font-serif text-base font-semibold text-brown leading-tight">{ticket.title}</h3>
                    </div>
                )}

                <div className="w-full border-t border-outline-light" />

                <div className="grid grid-cols-2 gap-3">
                    {roundedRuntime ? (
                        <div>
                            <p className="small-caps text-[9px] text-forest mb-0.5">Runtime</p>
                            <p className="font-serif text-lg font-semibold text-brown">~{roundedRuntime}<span className="text-xs font-sans font-normal text-outline ml-0.5">m</span></p>
                        </div>
                    ) : (
                        <div>
                            <p className="small-caps text-[9px] text-forest mb-0.5">Runtime</p>
                            <p className="font-body italic text-outline text-xs">Unknown</p>
                        </div>
                    )}

                    {(ticket.releaseYear || year) && (
                        <div>
                            <p className="small-caps text-[9px] text-forest mb-0.5">Released</p>
                            <p className="font-serif text-lg font-semibold text-brown">{ticket.releaseYear || year}</p>
                        </div>
                    )}
                </div>

                <div>
                    <p className="small-caps text-[9px] text-forest mb-0.5">Submitted By</p>
                    <p className="text-sm font-semibold text-brown">{ticket.user?.username || 'Unknown'}</p>
                </div>
            </div>
        </div>
    );
}
