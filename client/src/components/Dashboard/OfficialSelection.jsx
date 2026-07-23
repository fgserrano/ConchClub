import React from 'react';

export default function OfficialSelection({ selection }) {
    if (!selection || !selection.title) return null;

    return (
        <section className="bg-sage-deep border border-brown hard-shadow flex flex-col md:flex-row">
            {/* Label — mobile only, sits above the inset poster */}
            <div className="md:hidden px-8 pt-8 pb-4">
                <span className="font-sans text-xs text-white border-l-4 border-oxblood pl-3 block uppercase font-bold tracking-widest">
                    Official Selection
                </span>
            </div>

            {/* Poster */}
            {selection.posterPath && (
                <div className="shrink-0 md:w-56 lg:w-64 mx-4 mb-4 md:mx-0 md:mb-0">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${selection.posterPath}`}
                        alt={selection.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Text block */}
            <div className="flex-1 px-8 pb-8 pt-2 md:p-10 flex flex-col justify-center">
                <span className="hidden md:block font-sans text-xs text-white border-l-4 border-oxblood pl-3 mb-4 uppercase font-bold tracking-widest">
                    Official Selection
                </span>

                <h2 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-2">
                    {selection.title}
                </h2>

                <p className="font-serif text-base text-canvas-dim italic">
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
    );
}
