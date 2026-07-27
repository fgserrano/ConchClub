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
            <div className="text-center mt-20 text-canvas-muted-foreground flex flex-col items-center">
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
        <div className="space-y-6 animate-in fade-in duration-700">
            <section className="pb-6 border-b border-border">
                <span className="font-sans text-xs font-bold text-oxblood uppercase tracking-widest block mb-1">
                    {season?.name || 'No Active Season'}
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-canvas-foreground">
                    Make Selection
                </h1>
            </section>

            {/* Locked state */}
            {isLocked && (
                <div className="flex items-center gap-3 p-4 bg-oxblood/5 border border-oxblood/20 rounded-lg text-oxblood text-sm font-medium">
                    <Lock className="w-4 h-4 shrink-0" />
                    Submissions are locked for this season.
                </div>
            )}

            {/* No active season */}
            {!season && (
                <div className="flex flex-col items-center justify-center py-16 text-canvas-muted-foreground bg-canvas-container rounded-xl border border-border">
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
                        <section className="bg-canvas-container border border-border p-6 hard-shadow rounded-xl">
                            {/* Movie / TV toggle */}
                            <div className="flex gap-1 mb-5 bg-canvas-muted p-1 rounded-lg">
                                <button
                                    onClick={() => handleTypeChange('movie')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-md transition-all ${
                                        mediaType === 'movie'
                                            ? 'bg-canvas text-canvas-foreground shadow-sm'
                                            : 'text-canvas-muted-foreground hover:text-canvas-foreground'
                                    }`}
                                >
                                    <Film className="w-3.5 h-3.5" />
                                    Film
                                </button>
                                <button
                                    onClick={() => handleTypeChange('tv')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-md transition-all ${
                                        mediaType === 'tv'
                                            ? 'bg-canvas text-canvas-foreground shadow-sm'
                                            : 'text-canvas-muted-foreground hover:text-canvas-foreground'
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
                                    className="w-full flex items-center justify-between border-b-2 border-border py-3 text-canvas-muted-foreground hover:text-forest hover:border-forest transition-all group"
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
                                        className="w-full bg-transparent border-b-2 border-border focus:border-forest focus:ring-0 px-0 py-3 font-body text-sm text-canvas-foreground placeholder:text-canvas-muted-foreground transition-all outline-none"
                                    />
                                    {searching ? (
                                        <div className="absolute right-0 top-3 w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Search className="absolute right-0 top-3 w-4 h-4 text-canvas-muted-foreground group-focus-within:text-forest transition-colors" />
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Results list */}
                        {results.length > 0 && (
                            <section className="bg-canvas border border-border rounded-xl overflow-hidden">
                                <div className="flex justify-between items-center px-5 py-3 border-b border-border">
                                    <h3 className="font-serif text-lg font-medium text-canvas-foreground leading-none">
                                        Results
                                    </h3>
                                    <button
                                        onClick={() => { setQuery(''); setResults([]); }}
                                        className="text-xs text-oxblood hover:underline font-semibold"
                                    >
                                        Clear ({results.length})
                                    </button>
                                </div>
                                <ul className="divide-y divide-border max-h-[480px] overflow-y-auto">
                                    {results.map((item) => {
                                        const n = normalize(item);
                                        const isSelected = selectedItem?.id === item.id;
                                        return (
                                            <li
                                                key={item.id}
                                                onClick={() => setSelectedItem(item)}
                                                className={`flex items-start gap-3 p-4 cursor-pointer transition-all group border-l-2 ${
                                                    isSelected
                                                        ? 'bg-canvas-muted border-oxblood'
                                                        : 'hover:bg-canvas-container border-transparent'
                                                }`}
                                            >
                                                {n.poster_path ? (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w92${n.poster_path}`}
                                                        alt={n.title}
                                                        className="w-10 h-14 object-cover shrink-0 border border-border rounded"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-14 bg-canvas-highest border border-border shrink-0 flex items-center justify-center text-canvas-muted-foreground text-xs rounded">?</div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-canvas-foreground truncate">
                                                        {n.title}
                                                    </p>
                                                    <p className="small-caps text-[10px] text-canvas-muted-foreground mt-0.5">
                                                        {n.release_date?.split('-')[0]}
                                                    </p>
                                                    <p className="font-body text-xs text-canvas-muted-foreground mt-1 line-clamp-2 italic">
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
                                    <div className="bg-canvas-container border border-border p-4 flex flex-col hard-shadow md:max-w-xs rounded-xl">
                                        {/* Header row */}
                                        <div className="mb-4">
                                            <span className="small-caps text-xs text-oxblood border-l-4 border-oxblood pl-3 font-bold tracking-wider">
                                                {isViewingExisting ? 'My Selection' : isEditing ? 'Change Selection' : mediaType === 'tv' ? 'Selected Series' : 'Selected Film'}
                                            </span>
                                        </div>

                                        {/* Poster */}
                                        <div className="aspect-[3/4] bg-placeholder overflow-hidden border border-border mb-4 rounded-lg">
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
                                        <h3 className="font-serif text-xl font-bold text-canvas-foreground leading-snug">
                                            {displayItem.title}
                                        </h3>

                                        <div className="mt-3 py-2 border-t border-b border-border/60 font-sans text-[11px] space-y-1">
                                            <div className="flex justify-between items-center text-canvas-muted-foreground">
                                                <span>Year</span>
                                                {displayYear
                                                    ? <span className="text-canvas-foreground font-semibold">{displayYear}</span>
                                                    : <div className="h-2 bg-canvas-highest rounded-sm w-8 animate-pulse" />}
                                            </div>
                                            <div className="flex justify-between items-center text-canvas-muted-foreground">
                                                <span>Genre</span>
                                                {displayItem.genre
                                                    ? <span className="text-canvas-foreground font-semibold text-right">{displayItem.genre}</span>
                                                    : <div className="h-2 bg-canvas-highest rounded-sm w-16 animate-pulse" />}
                                            </div>
                                            <div className="flex justify-between items-center text-canvas-muted-foreground">
                                                <span>{displayIsTV ? 'Episodes' : 'Runtime'}</span>
                                                {displayRuntime
                                                    ? <span className="text-canvas-foreground font-semibold">{displayRuntime}{!displayIsTV && 'm'}</span>
                                                    : <div className="h-2 bg-canvas-highest rounded-sm w-10 animate-pulse" />}
                                            </div>
                                        </div>

                                        {displayItem.overview && (
                                            <p className="font-body text-xs text-canvas-muted-foreground mt-3 line-clamp-3 leading-relaxed">
                                                {displayItem.overview}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    {canSubmit && norm && (
                                        <div className="flex flex-wrap gap-3 items-center">
                                            <button
                                                onClick={handleSubmit}
                                                className="bg-forest-container hover:bg-forest-deep text-forest-on px-6 py-3 font-sans text-xs uppercase tracking-wider font-bold transition-all active:scale-95 hard-shadow flex items-center gap-2 rounded-lg"
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
