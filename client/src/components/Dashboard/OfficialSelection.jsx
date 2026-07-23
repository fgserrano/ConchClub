import React from 'react';
import { Trophy } from 'lucide-react';

export default function OfficialSelection({ selection, hideLabel }) {
    if (!selection || !selection.title) return null;

    return (
        <div className="bg-canvas-container border border-border hard-shadow p-4">
            {!hideLabel && (
                <span className="font-sans text-sm text-canvas-foreground border-l-4 border-oxblood pl-3 mb-4 flex items-center gap-2 uppercase font-bold tracking-widest">
                    <Trophy className="w-4 h-4 text-oxblood" />
                    Official Selection
                </span>
            )}

            <section className="bg-accent border border-ink flex flex-col md:flex-row">
                {/* Poster */}
                {selection.posterPath && (
                    <div className="shrink-0 md:w-56 lg:w-64 mx-4 mt-4 md:mx-0 md:mt-0">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${selection.posterPath}`}
                            alt={selection.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Text block */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <h2 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-2">
                        {selection.title}
                    </h2>

                    <p className="font-serif text-base text-accent-subtle italic">
                        Submitted by <span className="font-semibold not-italic">{selection.user?.username}</span>
                        {selection.runtimeToNearestTenMin > 0 && selection.mediaType !== 'tv' && (
                            <span className="mx-2">·</span>
                        )}
                        {selection.runtimeToNearestTenMin > 0 && selection.mediaType !== 'tv' && (
                            <span className="not-italic font-semibold">{selection.runtimeToNearestTenMin}m</span>
                        )}
                    </p>
                </div>
            </section>
        </div>
    );
}
