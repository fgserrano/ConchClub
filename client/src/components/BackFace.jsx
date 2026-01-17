import React from 'react';

export default function BackFace({ ticket, roundedRuntime, year }) {
    return (
        <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-xl overflow-hidden border border-purple-500/30 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />

            <div className="relative z-10 flex flex-col items-center gap-6 text-center p-4">
                {ticket.title && (
                    <h3 className="text-lg font-bold text-white leading-tight">{ticket.title}</h3>
                )}
                {roundedRuntime ? (
                    <div className="space-y-1">
                        <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Runtime</p>
                        <div className="text-3xl font-black text-white tracking-tight">
                            ~{roundedRuntime}
                            <span className="text-sm font-medium text-slate-500 ml-1">min</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-slate-600 italic text-sm">Runtime unknown</div>
                )}

                <div className="space-y-1">
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Submitted By</p>
                    <p className="text-lg font-bold text-white tracking-tight">{ticket.user?.username || "Unknown"}</p>
                </div>

                {(ticket.releaseYear || year) && (
                    <div className="space-y-1">
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Released</p>
                        <p className="text-3xl font-black text-white tracking-tight">{ticket.releaseYear || year}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
