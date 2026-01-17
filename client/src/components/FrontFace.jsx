import React from 'react';

export default function FrontFace({ ticket }) {
    return (
        <div className="absolute inset-0 w-full h-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700 [backface-visibility:hidden] flex flex-col items-center justify-center">
            {ticket.posterPath ? (
                <div className="absolute inset-0">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${ticket.posterPath}`}
                        alt={ticket.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
            ) : (
                <>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                    <div className="relative z-10">
                        <span className="text-8xl font-black text-slate-700 group-hover:text-purple-500/50 transition-colors select-none">
                            ?
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
