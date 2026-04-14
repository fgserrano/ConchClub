import React from 'react';

export default function BackFace({ ticket, roundedRuntime, year }) {
    return (
        <div className="absolute inset-0 w-full h-full bg-surface-low rounded-sm overflow-hidden border border-outline-variant/15 [backface-visibility:hidden] [webkit-backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center">
            <div className="relative z-10 flex flex-col items-center gap-6 text-center p-4">
                {ticket.title && (
                    <h3 className="text-lg font-display font-bold text-on-surface leading-tight">{ticket.title}</h3>
                )}

                {roundedRuntime ? (
                    <div className="space-y-1">
                        <p className="text-[10px] text-on-surface-variant font-display font-bold uppercase tracking-[0.05em]">Runtime</p>
                        <div className="text-3xl font-black text-on-surface tracking-tight">
                            ~{roundedRuntime}
                            <span className="text-sm font-medium text-on-surface-variant ml-1">min</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-on-surface-variant italic text-sm">Runtime unknown</div>
                )}

                <div className="space-y-1">
                    <p className="text-[10px] text-on-surface-variant font-display font-bold uppercase tracking-[0.05em]">Submitted By</p>
                    <p className="text-lg font-bold text-on-surface tracking-tight">{ticket.user?.username || "Unknown"}</p>
                </div>

                {(ticket.releaseYear || year) && (
                    <div className="space-y-1">
                        <p className="text-[10px] text-on-surface-variant font-display font-bold uppercase tracking-[0.05em]">Released</p>
                        <p className="text-3xl font-black text-on-surface tracking-tight">{ticket.releaseYear || year}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
