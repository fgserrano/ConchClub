import React from 'react';
import { Trophy } from 'lucide-react';

export default function OfficialSelection({ selection }) {
    if (!selection || !selection.title) return null;

    return (
        <section className="bg-white border border-outline-light rounded p-8 flex flex-col md:flex-row gap-8 items-center hard-shadow">
            <div className="shrink-0">
                <img
                    src={`https://image.tmdb.org/t/p/w500${selection.posterPath}`}
                    alt={selection.title}
                    className="w-40 md:w-48 rounded block"
                />
            </div>

            <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start text-forest mb-4">
                    <Trophy className="w-4 h-4" />
                    <span className="small-caps text-xs font-semibold">Official Selection</span>
                </div>

                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-brown mb-3 leading-tight">{selection.title}</h2>

                {selection.overview && (
                    <p className="font-body text-brown-light text-sm leading-relaxed line-clamp-3 mb-6">
                        {selection.overview}
                    </p>
                )}

                <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-outline">
                    <span>Submitted by <span className="text-forest font-medium">{selection.user.username}</span></span>
                    <span>·</span>
                    <span>{selection.releaseDate?.split('-')[0]}</span>
                </div>
            </div>
        </section>
    );
}
