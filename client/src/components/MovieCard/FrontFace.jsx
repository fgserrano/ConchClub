export default function FrontFace({ ticket, isMine }) {
    return (
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [webkit-backface-visibility:hidden] [transform:translateZ(1px)]">
            <div className={`absolute inset-0 w-full h-full bg-black overflow-hidden border-2 flex flex-col items-center justify-center ${isMine ? 'border-[#ff80e4] shadow-[0_0_15px_rgba(255,128,228,0.4)]' : 'border-[#4f4165]'}`}>
                {ticket.posterPath ? (
                    <div className="absolute inset-0">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${ticket.posterPath}`}
                            alt={ticket.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-[#201139]" />
                        <div className="relative z-10">
                            <span className="text-8xl font-black text-[#4f4165] group-hover:text-[#ff80e4]/50 transition-colors select-none">
                                ?
                            </span>
                        </div>
                    </>
                )}
            </div>

            {isMine && (
                <div className="absolute -top-6 left-0 text-xs font-black text-[#ff80e4] neon-glow-primary tracking-wider uppercase">
                    YOUR SUBMISSION
                </div>
            )}
        </div>
    );
}
