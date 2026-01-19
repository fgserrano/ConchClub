import React from 'react';
import { Plus, Search, X } from 'lucide-react';

export default function SubmissionForm({ season, myTicket, isEditing, handleSearch, query, setQuery, searching, setIsEditing, results, handleSubmitMovie }) {
    if (!season || season.locked || (myTicket && !isEditing)) return null;

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-500" />
                Submit a Movie
            </h3>
            <form onSubmit={handleSearch} className="relative group mb-8">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a movie..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 pl-14 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-lg shadow-xl"
                    autoFocus
                />
                <Search className="absolute left-5 top-5 w-5 h-5 text-slate-500 group-focus-within:text-purple-400" />
                {searching ? (
                    <div className="absolute right-5 top-5 w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                ) : isEditing ? (
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="absolute right-5 top-5 text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                ) : null}
            </form>

            <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2">
                {results.map((movie) => (
                    <div key={movie.id}
                        onClick={() => handleSubmitMovie(movie)}
                        className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 p-4 rounded-xl flex gap-4 cursor-pointer transition-all group">
                        {movie.poster_path && (
                            <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} className="w-16 h-24 object-cover rounded-lg bg-slate-700" alt="" />
                        )}
                        <div className="flex-1 text-left">
                            <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">{movie.title}</h3>
                            <p className="text-slate-400 text-sm mt-1 line-clamp-2">{movie.overview}</p>
                            <p className="text-slate-600 text-xs mt-2">{movie.release_date?.split('-')[0]}</p>
                        </div>
                        <div className="self-center">
                            <Plus className="w-6 h-6 text-slate-500 group-hover:text-purple-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
