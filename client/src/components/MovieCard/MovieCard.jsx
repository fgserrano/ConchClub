import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import FrontFace from './FrontFace';
import BackFace from './BackFace';

export default function MovieCard({ ticket, isMine }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const runtime = ticket.runtimeToNearestTenMin;
    const roundedRuntime = runtime ? Math.floor(runtime / 10) * 10 : null;
    const year = ticket.releaseDate?.split('-')[0];

    return (
        <div
            className={cn("group relative [perspective:1000px] cursor-pointer")}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={cn(
                "aspect-[2/3] w-full relative transition-all duration-700 [transform-style:preserve-3d] [webkit-transform-style:preserve-3d] shadow-[0_8px_24px_rgba(33,27,0,0.08)] group-hover:shadow-[0_12px_32px_rgba(33,27,0,0.12)] rounded-sm group-hover:scale-[1.02]",
                isFlipped ? "[transform:rotateY(180deg)]" : ""
            )}>
                <FrontFace ticket={ticket} isMine={isMine} />
                <BackFace ticket={ticket} roundedRuntime={roundedRuntime} year={year} />
            </div>
        </div>
    );
}
