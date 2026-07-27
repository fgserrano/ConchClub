import React from 'react';
import { Plus, Search, X } from 'lucide-react';

export default function SubmissionForm({ season, myTicket, isEditing, handleSearch, query, setQuery, searching, setIsEditing, results, handleSubmitMovie }) {
    if (!season || season.locked || (myTicket && !isEditing)) return null;

    return (
        <div className="bg-canvas-container border border-border rounded-xl p-6">
            <h3 className="font-serif text-xl font-semibold text-forest mb-6 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Submit a Movie
            </h3>
            <form onSubmit={handleSearch} className="relative group mb-8">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a movie..."
                    className="w-full bg-canvas-container border-0 border-b-2 border-border px-6 py-3 pl-12 text-canvas-foreground placeholder:text-canvas-muted-foreground focus:outline-none focus:border-forest transition-colors text-base"
                    autoFocus
                />
                <Search className="absolute left-0 top-3 w-4 h-4 text-canvas-muted-foreground group-focus-within:text-forest transition-colors" />
                {searching ? (
                    <div className="absolute right-0 top-3 w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                ) : isEditing ? (
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="absolute right-0 top-3 text-canvas-muted-foreground hover:text-canvas-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                ) : null}
            </form>

            <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                {results.map((movie) => (
                    <div key={movie.id}
                        onClick={() => handleSubmitMovie(movie)}
                        className="bg-canvas-container hover:bg-canvas-container border border-border hover:border-forest/40 p-4 rounded-lg flex gap-4 cursor-pointer transition-all group">
                        {movie.poster_path && (
                            <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} className="w-14 h-20 object-cover rounded-lg bg-canvas-container shrink-0" alt="" />
                        )}
                        <div className="flex-1 text-left">
                            <h3 className="font-semibold text-canvas-foreground group-hover:text-forest transition-colors">{movie.title}</h3>
                            <p className="font-body text-canvas-muted-foreground text-sm mt-1 line-clamp-2">{movie.overview}</p>
                            <p className="small-caps text-canvas-muted-foreground text-xs mt-2">{movie.release_date?.split('-')[0]}</p>
                        </div>
                        <div className="self-center shrink-0">
                            <Plus className="w-5 h-5 text-canvas-muted-foreground group-hover:text-forest transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
