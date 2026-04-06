import { Edit } from 'lucide-react';

export default function MySubmission({ myTicket, season, isEditing, onEdit }) {
    if (!myTicket || !season || season.locked || isEditing) return null;

    return (
        <div className="relative flex flex-col items-center justify-center p-8 border-2 border-[#00f1fd] bg-[#201139] shadow-[0_0_20px_rgba(0,241,253,0.15)] gap-6 text-center">
            <button
                title="edit"
                onClick={onEdit}
                className="absolute top-4 right-4 p-2 border-2 border-[#7e6f95] hover:border-[#ff80e4] text-[#b5a4cd] hover:text-[#ff80e4] transition-colors"
            >
                <Edit className="w-4 h-4" />
            </button>

            <p className="text-[#00f1fd] text-xs font-black tracking-[0.3em] uppercase neon-glow-secondary">
                Your Submission
            </p>

            {myTicket.posterPath && (
                <img
                    src={`https://image.tmdb.org/t/p/w200${myTicket.posterPath}`}
                    alt={myTicket.title}
                    className="w-40 shadow-[0_0_20px_rgba(0,241,253,0.2)]"
                />
            )}

            <div>
                <h3 className="text-2xl font-black text-[#eee0ff] mb-2 uppercase tracking-tight">{myTicket.title}</h3>
                <p className="text-[#b5a4cd] text-xs uppercase tracking-[0.2em] font-bold">
                    Runtime: {myTicket.runtimeToNearestTenMin || myTicket.runtime}m
                </p>
            </div>
        </div>
    );
}
