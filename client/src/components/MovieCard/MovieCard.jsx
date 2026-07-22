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
            className={cn("group relative [perspective:1000px] cursor-pointer h-80")}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={cn(
                "w-full h-full relative transition-all duration-700 [transform-style:preserve-3d] [webkit-transform-style:preserve-3d] hard-shadow group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] rounded",
                isFlipped ? "[transform:rotateY(180deg)]" : ""
            )}>
                <FrontFace ticket={ticket} isMine={isMine} />
                <BackFace ticket={ticket} roundedRuntime={roundedRuntime} year={year} />
            </div>
        </div>
    );
}
