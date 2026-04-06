import { Plus, Search, X } from 'lucide-react';

export default function SubmissionForm({ season, myTicket, isEditing, handleSearch, query, setQuery, searching, setIsEditing, results, handleSubmitMovie }) {
    if (!season || season.locked || (myTicket && !isEditing)) return null;

    return (
        <div className="bg-[#201139] border-2 border-[#4f4165] p-6">
            <h3 className="font-black text-[#ffc965] neon-glow-tertiary uppercase tracking-[0.3em] text-sm mb-6 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Submit a Film
            </h3>
            <form onSubmit={handleSearch} className="relative group mb-8">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a film..."
                    className="w-full bg-black border-2 border-[#7e6f95] focus:border-[#00f1fd] px-6 py-4 pl-14 text-[#00f1fd] placeholder:text-[#7e6f95]/40 focus:outline-none focus:ring-0 transition-all text-lg font-bold tracking-wide"
                    autoFocus
                />
                <Search className="absolute left-5 top-5 w-5 h-5 text-[#7e6f95] group-focus-within:text-[#00f1fd]" />
                {searching ? (
                    <div className="absolute right-5 top-5 w-5 h-5 border-2 border-[#ff80e4] border-t-transparent animate-spin" />
                ) : isEditing ? (
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="absolute right-5 top-5 text-[#7e6f95] hover:text-[#ff80e4] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                ) : null}
            </form>

            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                {results.map((movie) => (
                    <div
                        key={movie.id}
                        onClick={() => handleSubmitMovie(movie)}
                        className="bg-[#271641] border-2 border-[#4f4165] hover:border-[#ff80e4] p-4 flex gap-4 cursor-pointer transition-all group"
                    >
                        {movie.poster_path && (
                            <img
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                className="w-16 h-24 object-cover bg-black flex-shrink-0"
                                alt=""
                            />
                        )}
                        <div className="flex-1 text-left">
                            <h3 className="font-black text-[#eee0ff] group-hover:text-[#ff80e4] transition-colors uppercase tracking-wide">{movie.title}</h3>
                            <p className="text-[#b5a4cd] text-sm mt-1 line-clamp-2">{movie.overview}</p>
                            <p className="text-[#7e6f95] text-xs mt-2 font-bold">{movie.release_date?.split('-')[0]}</p>
                        </div>
                        <div className="self-center">
                            <Plus className="w-6 h-6 text-[#4f4165] group-hover:text-[#ff80e4] transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
