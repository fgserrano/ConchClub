import React from 'react';
import { Trophy } from 'lucide-react';

export default function OfficialSelection({ selection }) {
    if (!selection || !selection.title) return null;

    return (
        <section className="relative transform hover:scale-[1.01] transition-transform duration-500 h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 blur-2xl -z-10" />
            <div className="bg-black/40 border border-yellow-500/30 rounded-3xl p-8 flex flex-col gap-6 items-center text-center h-full justify-center">
                <div className="flex items-center gap-2 justify-center text-yellow-500">
                    <Trophy className="w-6 h-6" />
                    <span className="font-bold tracking-widest text-sm">OFFICIAL SELECTION</span>
                </div>

                <img
                    src={`https://image.tmdb.org/t/p/w500${selection.posterPath}`}
                    alt={selection.title}
                    className="w-48 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.3)]"
                />

                <div>
                    <h2 className="text-3xl font-bold text-white mb-4">{selection.title}</h2>
                    <div className="mt-6 flex items-center justify-center gap-4 text-sm text-slate-500">
                        <span>Submitted by <span className="text-yellow-400 font-medium">{selection.user.username}</span></span>
                        <span>•</span>
                        <span>{selection.releaseDate?.split('-')[0]}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
