import { Trophy } from 'lucide-react';

export default function OfficialSelection({ selection }) {
    if (!selection || !selection.title) return null;

    return (
        <section className="relative">
            <div className="border-2 border-[#ffc965] bg-[#201139] shadow-[0_0_40px_rgba(255,201,101,0.2)] p-8 flex flex-col md:flex-row gap-8 items-center">
                <img
                    src={`https://image.tmdb.org/t/p/w500${selection.posterPath}`}
                    alt={selection.title}
                    className="w-48 md:w-56 shrink-0 shadow-[0_0_30px_rgba(255,201,101,0.3)]"
                />

                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start text-[#ffc965] mb-4">
                        <Trophy className="w-5 h-5" />
                        <span className="font-black tracking-[0.3em] text-xs uppercase neon-glow-tertiary">Official Selection</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-[#ff80e4] neon-glow-primary mb-4 italic tracking-tight">
                        {selection.title}
                    </h2>

                    {selection.overview && (
                        <p className="text-[#b5a4cd] text-sm leading-relaxed line-clamp-3 mb-6">
                            {selection.overview}
                        </p>
                    )}

                    <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-[#7e6f95] font-bold uppercase tracking-wider">
                        <span>
                            Submitted by{' '}
                            <span className="text-[#ffc965] neon-glow-tertiary">{selection.user.username}</span>
                        </span>
                        <span>•</span>
                        <span>{selection.releaseDate?.split('-')[0]}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
