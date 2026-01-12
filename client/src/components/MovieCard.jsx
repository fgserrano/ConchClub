import React, { useState } from 'react';
import { Film } from 'lucide-react';
import { cn } from '../lib/utils';

export default function MovieCard({ ticket }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const runtime = ticket.runtimeToNearestTenMin;
    const roundedRuntime = runtime ? Math.floor(runtime / 10) * 10 : null;
    const year = ticket.releaseDate?.split('-')[0];

    return (
        <div
            className={cn("group relative [perspective:1000px] cursor-pointer")}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={cn(
                "aspect-[2/3] w-full relative transition-all duration-700 [transform-style:preserve-3d] shadow-lg group-hover:shadow-purple-900/20 rounded-xl group-hover:scale-105",
                isFlipped ? "[transform:rotateY(180deg)]" : ""
            )}>
                {/* Front Face */}
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

                {/* Back Face */}
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
            </div>
        </div>
    );
}
