export default function BackFace({ ticket, roundedRuntime, year }) {
    return (
        <div className="absolute inset-0 w-full h-full bg-black border-2 border-[#ff80e4]/30 overflow-hidden [backface-visibility:hidden] [webkit-backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-6 text-center p-4">
                {ticket.title && (
                    <h3 className="text-lg font-black text-[#eee0ff] leading-tight uppercase tracking-tight">{ticket.title}</h3>
                )}
                {roundedRuntime ? (
                    <div className="space-y-1">
                        <p className="text-[10px] text-[#00f1fd] font-black uppercase tracking-widest neon-glow-secondary">Runtime</p>
                        <div className="text-3xl font-black text-[#eee0ff] tracking-tight">
                            ~{roundedRuntime}
                            <span className="text-sm font-bold text-[#7e6f95] ml-1">min</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-[#7e6f95] italic text-sm">Runtime unknown</div>
                )}

                <div className="space-y-1">
                    <p className="text-[10px] text-[#ff80e4] font-black uppercase tracking-widest neon-glow-primary">Submitted By</p>
                    <p className="text-lg font-black text-[#eee0ff] tracking-tight">{ticket.user?.username || "Unknown"}</p>
                </div>

                {(ticket.releaseYear || year) && (
                    <div className="space-y-1">
                        <p className="text-[10px] text-[#ffc965] font-black uppercase tracking-widest neon-glow-tertiary">Released</p>
                        <p className="text-3xl font-black text-[#eee0ff] tracking-tight">{ticket.releaseYear || year}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
