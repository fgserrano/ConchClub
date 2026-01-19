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
                "aspect-[2/3] w-full relative transition-all duration-700 [transform-style:preserve-3d] shadow-lg group-hover:shadow-purple-900/20 rounded-xl group-hover:scale-105",
                isFlipped ? "[transform:rotateY(180deg)]" : ""
            )}>
                <FrontFace ticket={ticket} isMine={isMine} />
                <BackFace ticket={ticket} roundedRuntime={roundedRuntime} year={year} />
            </div>
        </div>
    );
}
