import React from 'react';
import { Trophy } from 'lucide-react';

export default function OfficialSelection({ selection }) {
    if (!selection || !selection.title) return null;

    return (
        <section className="relative transform hover:scale-[1.01] transition-transform duration-500 h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 blur-2xl -z-10" />
            <div className="bg-black/40 border border-yellow-500/30 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center h-full">
                <img
                    src={`https://image.tmdb.org/t/p/w500${selection.posterPath}`}
                    alt={selection.title}
                    className="w-48 md:w-56 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.3)] shrink-0"
                />

                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start text-yellow-500 mb-4">
                        <Trophy className="w-5 h-5" />
                        <span className="font-bold tracking-widest text-xs">OFFICIAL SELECTION</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{selection.title}</h2>

                    {selection.overview && (
                        <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-6">
                            {selection.overview}
                        </p>
                    )}

                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-500">
                        <span>Submitted by <span className="text-yellow-400 font-medium">{selection.user.username}</span></span>
                        <span>•</span>
                        <span>{selection.releaseDate?.split('-')[0]}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
