import React from 'react';
import { Plus, Search, X } from 'lucide-react';

export default function SubmissionForm({ season, myTicket, isEditing, handleSearch, query, setQuery, searching, setIsEditing, results, handleSubmitMovie }) {
    if (!season || season.locked || (myTicket && !isEditing)) return null;

    return (
        <div className="bg-surface-low rounded-sm p-6">
            <h3 className="text-xl font-display font-bold text-on-surface mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Submit a Movie
            </h3>

            <form onSubmit={handleSearch} className="relative group mb-8">
                <Search className="absolute left-0 top-3.5 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a movie..."
                    className="w-full bg-transparent border-0 border-b border-outline/40 rounded-none py-3 pl-8 pr-10 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors text-lg"
                    autoFocus
                />
                {searching ? (
                    <div className="absolute right-0 top-3.5 w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : isEditing ? (
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="absolute right-0 top-3.5 text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                ) : null}
            </form>

            <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-1">
                {results.map((movie) => (
                    <div
                        key={movie.id}
                        onClick={() => handleSubmitMovie(movie)}
                        className="bg-surface-container hover:bg-surface-high p-4 rounded-sm flex gap-4 cursor-pointer transition-colors group"
                    >
                        {movie.poster_path && (
                            <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} className="w-16 h-24 object-cover rounded-sm bg-surface-high shrink-0" alt="" />
                        )}
                        <div className="flex-1 text-left min-w-0">
                            <h3 className="font-display font-bold text-on-surface">{movie.title}</h3>
                            <p className="text-on-surface-variant text-sm mt-1 line-clamp-2">{movie.overview}</p>
                            <p className="text-on-surface-variant/60 text-xs mt-2">{movie.release_date?.split('-')[0]}</p>
                        </div>
                        <div className="self-center shrink-0">
                            <Plus className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
