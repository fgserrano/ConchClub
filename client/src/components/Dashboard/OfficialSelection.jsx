import React from 'react';
import { Trophy } from 'lucide-react';

export default function OfficialSelection({ selection }) {
    if (!selection || !selection.title) return null;

    return (
        <section className="relative overflow-hidden rounded-sm hover:scale-[1.005] transition-transform duration-500">
            <div className="absolute left-0 inset-y-0 w-1.5 bg-accent-forest z-10" />
            <div className="bg-surface-container p-8 flex flex-col md:flex-row gap-8 items-center">
                <img
                    src={`https://image.tmdb.org/t/p/w500${selection.posterPath}`}
                    alt={selection.title}
                    className="w-48 md:w-56 rounded-sm shadow-[0_16px_40px_rgba(33,27,0,0.12)] shrink-0"
                />

                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-accent-forest/10 text-accent-forest px-3 py-1 rounded-full mb-4">
                        <Trophy className="w-3.5 h-3.5" />
                        <span className="font-display font-bold tracking-[0.08em] text-xs uppercase">Staff Pick — Official Selection</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-4">{selection.title}</h2>

                    {selection.overview && (
                        <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3 mb-6">
                            {selection.overview}
                        </p>
                    )}

                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-on-surface-variant">
                        <span>Submitted by <span className="text-primary font-medium">{selection.user.username}</span></span>
                        <span>·</span>
                        <span>{selection.releaseDate?.split('-')[0]}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
