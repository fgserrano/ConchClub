import React from 'react';

export default function FrontFace({ ticket, isMine }) {
    return (
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [webkit-backface-visibility:hidden] [transform:translateZ(1px)]">
            {isMine && (
                <div className="absolute -top-5 left-0 text-[10px] font-display font-bold text-accent-terracotta uppercase tracking-[0.05em] z-20">
                    Your Pick
                </div>
            )}

            <div className="absolute inset-0 w-full h-full bg-surface-container rounded-sm overflow-hidden flex flex-col items-center justify-center">
                {isMine && (
                    <div className="absolute left-0 inset-y-0 w-1 bg-accent-terracotta z-10" />
                )}

                {ticket.posterPath ? (
                    <div className="absolute inset-0">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${ticket.posterPath}`}
                            alt={ticket.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[#211b00]/10" />
                    </div>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-surface-container to-surface-high" />
                        <div className="relative z-10">
                            <span className="text-8xl font-black text-on-surface-variant/30 group-hover:text-on-surface-variant/50 transition-colors select-none">
                                ?
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
