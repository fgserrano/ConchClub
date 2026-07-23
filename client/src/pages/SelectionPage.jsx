import React, { useEffect, useState } from 'react';
import { Search, Plus, Film, Tv, Lock, Edit, CheckCircle } from 'lucide-react';
import api from '../lib/api';

export default function SelectionPage() {
    const [season, setSeason] = useState(null);
    const [myTicket, setMyTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mediaType, setMediaType] = useState('movie'); // 'movie' | 'tv'
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const seasonRes = await api.get('/season/active');
            setSeason(seasonRes.data);
            if (seasonRes.data) {
                const myTicketRes = await api.get('/season/submissions/me').catch(() => ({ data: null }));
                setMyTicket(myTicketRes.data);
            }
        } catch (e) {
            console.log('No active season or error', e);
        } finally {
            setLoading(false);
        }
    };

    // Reset results when switching media type
    const handleTypeChange = (type) => {
        setMediaType(type);
        setResults([]);
        setSelectedItem(null);
    };

    useEffect(() => {
        const delay = parseInt(import.meta.env.VITE_SEARCH_DEBOUNCE_MS || '500', 10);
        const timer = setTimeout(() => {
            if (query.trim()) {
                runSearch(query);
            } else {
                setResults([]);
            }
        }, delay);
        return () => clearTimeout(timer);
    }, [query, mediaType]);

    const runSearch = async (searchQuery) => {
        setSearching(true);
        try {
            const res = await api.get(`/submission/search?query=${encodeURIComponent(searchQuery)}&type=${mediaType}`);
            setResults(res.data.results || []);
        } catch (e) {
            console.error(e);
        } finally {
            setSearching(false);
        }
    };

    // Normalize movie vs TV fields to a common shape
    const normalize = (item) => ({
        id: item.id,
        title: item.title ?? item.name,
        poster_path: item.poster_path,
        overview: item.overview,
        release_date: item.release_date ?? item.first_air_date,
    });

    const handleSubmit = async () => {
        if (!selectedItem) return;
        const norm = normalize(selectedItem);
        try {
            const payload = {
                tmdbId: norm.id.toString(),
                title: norm.title,
                posterPath: norm.poster_path,
                overview: norm.overview,
                releaseDate: norm.release_date,
                mediaType,
            };

            if (isEditing) {
                await api.put('/submission/update', payload);
            } else {
                await api.post('/submission/submit', payload);
            }

            setSelectedItem(null);
            setIsEditing(false);
            setSubmitted(true);
            setQuery('');
            setResults([]);
            await fetchData();
        } catch (e) {
            alert(e.response?.data || 'Submission failed');
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-20 text-outline flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-forest border-t-transparent animate-spin mb-4" />
                Loading...
            </div>
        );
    }

    const isLocked = season?.locked;
    const hasSubmission = !!myTicket;
    const canSubmit = season && !isLocked && (!hasSubmission || isEditing);
    const norm = selectedItem ? normalize(selectedItem) : null;

    // Pre-populate detail panel with existing submission when no new item is selected
    const myTicketNorm = myTicket ? {
        id: myTicket.tmdbId,
        poster_path: myTicket.posterPath,
        title: myTicket.title,
        release_date: myTicket.releaseDate,
        overview: myTicket.overview,
        genre: myTicket.genre,
        mediaType: myTicket.mediaType,
        runtime: myTicket.runtimeToNearestTenMin,
    } : null;
    const displayItem = norm ?? (hasSubmission ? myTicketNorm : null);
    const isViewingExisting = !norm && hasSubmission && !isEditing;
    const displayIsTV = displayItem?.mediaType === 'tv';
    const displayRuntime = displayItem?.runtime;
    const displayYear = displayItem?.release_date?.split('-')[0];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Hero Header */}
            <section className="pb-8 border-b border-outline-light">
                <span className="small-caps text-xs font-semibold text-oxblood mb-3 inline-block">
                    {season?.name || 'Current Season'}
                </span>
                <h1 className="font-serif text-5xl md:text-7xl font-semibold text-brown tracking-tight leading-none mb-3">
                    Make Selection
                </h1>
                <div className="h-0.5 w-16 bg-oxblood mt-4" />
            </section>

            {/* Locked state */}
            {isLocked && (
                <div className="flex items-center gap-3 p-4 bg-oxblood/5 border border-oxblood/20 rounded text-oxblood text-sm font-medium">
                    <Lock className="w-4 h-4 shrink-0" />
                    Submissions are locked for this season.
                </div>
            )}

            {/* No active season */}
            {!season && (
                <div className="flex flex-col items-center justify-center py-16 text-outline bg-canvas-container rounded border border-outline-light">
                    <Film className="w-10 h-10 mb-4 opacity-40" />
                    <p className="text-base font-medium">No season is currently active</p>
                </div>
            )}

            {/* Main two-column layout */}
            {season && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">

                    {/* Left: Search + Results */}
                    <div className="md:col-span-4 space-y-6">

                        {/* Search panel */}
                        <section className="bg-canvas-container border border-outline-light p-6 hard-shadow">
                            {/* Movie / TV toggle */}
                            <div className="flex gap-1 mb-5 bg-canvas-high p-1 rounded">
                                <button
                                    onClick={() => handleTypeChange('movie')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold tracking-wider uppercase rounded transition-all ${
                                        mediaType === 'movie'
                                            ? 'bg-canvas text-brown shadow-sm'
                                            : 'text-outline hover:text-brown'
                                    }`}
                                >
                                    <Film className="w-3.5 h-3.5" />
                                    Film
                                </button>
                                <button
                                    onClick={() => handleTypeChange('tv')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold tracking-wider uppercase rounded transition-all ${
                                        mediaType === 'tv'
                                            ? 'bg-canvas text-brown shadow-sm'
                                            : 'text-outline hover:text-brown'
                                    }`}
                                >
                                    <Tv className="w-3.5 h-3.5" />
                                    TV
                                </button>
                            </div>

                            <h3 className="small-caps text-xs text-oxblood mb-4 font-semibold tracking-widest">
                                {mediaType === 'tv' ? 'Series Search' : 'Film Search'}
                            </h3>

                            {isViewingExisting && !isLocked ? (
                                <button
                                    onClick={() => { setIsEditing(true); setSelectedItem(null); setSubmitted(false); setQuery(''); setResults([]); }}
                                    className="w-full flex items-center justify-between border-b-2 border-outline-light py-3 text-brown-light hover:text-forest hover:border-forest transition-all group"
                                >
                                    <span className="font-body text-sm">Change selection...</span>
                                    <Edit className="w-4 h-4" />
                                </button>
                            ) : (
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder={mediaType === 'tv' ? 'Search for a TV series...' : 'Search for a movie...'}
                                        className="w-full bg-transparent border-b-2 border-outline-light focus:border-forest focus:ring-0 px-0 py-3 font-body text-sm text-brown placeholder:text-outline transition-all outline-none"
                                    />
                                    {searching ? (
                                        <div className="absolute right-0 top-3 w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Search className="absolute right-0 top-3 w-4 h-4 text-outline group-focus-within:text-forest transition-colors" />
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Results list */}
                        {results.length > 0 && (
                            <section className="bg-canvas border border-outline-light">
                                <div className="flex justify-between items-center px-5 py-3 border-b border-outline-light">
                                    <h3 className="font-serif text-lg font-medium text-brown leading-none">
                                        Results
                                    </h3>
                                    <button
                                        onClick={() => { setQuery(''); setResults([]); }}
                                        className="text-xs text-oxblood hover:underline font-semibold"
                                    >
                                        Clear ({results.length})
                                    </button>
                                </div>
                                <ul className="divide-y divide-outline-light max-h-[480px] overflow-y-auto">
                                    {results.map((item) => {
                                        const n = normalize(item);
                                        const isSelected = selectedItem?.id === item.id;
                                        return (
                                            <li
                                                key={item.id}
                                                onClick={() => setSelectedItem(item)}
                                                className={`flex items-start gap-3 p-4 cursor-pointer transition-all group border-l-2 ${
                                                    isSelected
                                                        ? 'bg-canvas-high border-oxblood'
                                                        : 'hover:bg-canvas-container border-transparent'
                                                }`}
                                            >
                                                {n.poster_path ? (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w92${n.poster_path}`}
                                                        alt={n.title}
                                                        className="w-10 h-14 object-cover shrink-0 border border-outline-light"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-14 bg-canvas-highest border border-outline-light shrink-0 flex items-center justify-center text-outline text-xs">?</div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-brown truncate">
                                                        {n.title}
                                                    </p>
                                                    <p className="small-caps text-[10px] text-outline mt-0.5">
                                                        {n.release_date?.split('-')[0]}
                                                    </p>
                                                    <p className="font-body text-xs text-brown-light mt-1 line-clamp-2 italic">
                                                        {n.overview}
                                                    </p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        )}

                    </div>

                    {/* Right: Selected Item Detail */}
                    <div className="md:col-span-8">
                        {displayItem && (
                                <div className="space-y-3">
                                    {/* Card */}
                                    <div className="bg-canvas-container border border-outline-light p-4 flex flex-col hard-shadow md:max-w-xs">
                                        {/* Header row */}
                                        <div className="mb-4">
                                            <span className="small-caps text-xs text-oxblood border-l-4 border-oxblood pl-3 font-bold tracking-wider">
                                                {isViewingExisting ? 'My Selection' : isEditing ? 'Change Selection' : mediaType === 'tv' ? 'Selected Series' : 'Selected Film'}
                                            </span>
                                        </div>

                                        {/* Poster */}
                                        <div className="aspect-[3/4] bg-muted overflow-hidden border border-outline-light mb-4">
                                            {displayItem.poster_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w500${displayItem.poster_path}`}
                                                    alt={displayItem.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="font-serif text-6xl text-canvas-container select-none">?</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Metadata */}
                                        <h3 className="font-serif text-xl font-bold text-brown leading-snug">
                                            {displayItem.title}
                                        </h3>

                                        <div className="mt-3 py-2 border-t border-b border-outline-light/60 font-sans text-[11px] space-y-1">
                                            <div className="flex justify-between items-center text-outline">
                                                <span>Year</span>
                                                {displayYear
                                                    ? <span className="text-brown font-semibold">{displayYear}</span>
                                                    : <div className="h-2 bg-canvas-highest rounded-sm w-8 animate-pulse" />}
                                            </div>
                                            <div className="flex justify-between items-center text-outline">
                                                <span>Genre</span>
                                                {displayItem.genre
                                                    ? <span className="text-brown font-semibold text-right">{displayItem.genre}</span>
                                                    : <div className="h-2 bg-canvas-highest rounded-sm w-16 animate-pulse" />}
                                            </div>
                                            <div className="flex justify-between items-center text-outline">
                                                <span>{displayIsTV ? 'Episodes' : 'Runtime'}</span>
                                                {displayRuntime
                                                    ? <span className="text-brown font-semibold">{displayRuntime}{!displayIsTV && 'm'}</span>
                                                    : <div className="h-2 bg-canvas-highest rounded-sm w-10 animate-pulse" />}
                                            </div>
                                        </div>

                                        {displayItem.overview && (
                                            <p className="font-body text-xs text-brown-light mt-3 line-clamp-3 leading-relaxed">
                                                {displayItem.overview}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    {canSubmit && norm && (
                                        <div className="flex flex-wrap gap-3 items-center">
                                            <button
                                                onClick={handleSubmit}
                                                className="bg-forest hover:bg-forest-deep text-forest-on px-6 py-3 font-sans text-xs uppercase tracking-wider font-bold transition-all active:scale-95 hard-shadow flex items-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" />
                                                {isEditing ? 'Update Selection' : 'Submit Selection'}
                                            </button>
                                        </div>
                                    )}

                                    {submitted && !isEditing && (
                                        <div className="flex items-center gap-2 text-forest text-sm font-medium">
                                            <CheckCircle className="w-4 h-4" />
                                            Selection submitted!
                                        </div>
                                    )}
                                </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
