export default function MovieRow({ ticket }) {
    return (
        <div className="bg-[#201139] border-2 border-[#4f4165] p-4 flex gap-6 items-center">
            <div className="w-16 h-24 flex-shrink-0 bg-black overflow-hidden border-2 border-[#4f4165]">
                {ticket.posterPath ? (
                    <img src={`https://image.tmdb.org/t/p/w200${ticket.posterPath}`} alt={ticket.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#4f4165] font-black text-xl">?</div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                        <h4 className="text-lg font-black text-[#eee0ff] uppercase tracking-tight truncate">{ticket.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-[#b5a4cd] font-bold uppercase tracking-wider">
                            <span>{ticket.releaseDate?.split('-')[0]}</span>
                            <span>•</span>
                            <span>{ticket.runtimeToNearestTenMin || '?'}m</span>
                        </div>
                    </div>
                    <span className="px-2 py-1 border border-[#ff80e4] text-[#ff80e4] text-[10px] font-black uppercase tracking-wider shrink-0">
                        {ticket.user?.username}
                    </span>
                </div>
                <p className="text-[#7e6f95] text-sm line-clamp-2">{ticket.overview}</p>
            </div>
        </div>
    );
}
