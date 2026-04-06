import { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';
import api from '../../lib/api';
import NewSeasonForm from './NewSeasonForm';

export default function SeasonActions({ onStatusChange, season }) {
    const [isLocked, setIsLocked] = useState(season ? season.locked : null);

    useEffect(() => {
        if (season) {
            setIsLocked(season.locked);
        } else {
            setIsLocked(null);
        }
    }, [season?.id, season?.locked]);

    const lockSeason = async () => {
        if (!season?.id) {
            onStatusChange("Error: No active season to lock.");
            return;
        }
        try {
            await api.post(`/admin/season/${season.id}/lock`);
            setIsLocked(true);
            onStatusChange("Season Locked!");
        } catch (e) {
            onStatusChange();
        }
    };

    const unlockSeason = async () => {
        if (!season?.id) return;
        try {
            await api.post(`/admin/season/${season.id}/unlock`);
            setIsLocked(false);
            onStatusChange("Season Unlocked!");
        } catch (e) {
            onStatusChange("Error: " + (e.response?.data || e.message));
        }
    };

    return (
        <section className="bg-[#201139] border-2 border-[#4f4165] p-6">
            <h2 className="text-xs font-black text-[#ffc965] uppercase tracking-[0.3em] mb-4">Season Actions</h2>
            <div className="flex gap-4">
                <div className="flex-[3] bg-black border-2 border-[#4f4165] shadow-inner p-4 flex flex-col justify-center">
                    <span className="text-[#7e6f95] text-[10px] font-black uppercase tracking-wider mb-1">Current Season</span>
                    <span className="text-xl font-black text-[#eee0ff] tracking-tight uppercase">
                        {season ? season.name : 'No Active Season'}
                    </span>
                </div>
                {isLocked === null ? (
                    <div className="flex-1 bg-[#271641] border-2 border-[#4f4165] p-4 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#7e6f95] border-t-transparent animate-spin" />
                    </div>
                ) : isLocked ? (
                    <button
                        onClick={unlockSeason}
                        className="flex-1 bg-[#271641] border-2 border-[#00f1fd] text-[#00f1fd] shadow-[0_0_10px_rgba(0,241,253,0.2)] p-4 flex flex-col items-center gap-2 transition-all hover:bg-[#00f1fd]/10"
                    >
                        <Unlock className="w-8 h-8" />
                        <span className="font-black text-xs uppercase tracking-widest">UNLOCK</span>
                    </button>
                ) : (
                    <button
                        onClick={lockSeason}
                        className="flex-1 bg-[#271641] border-2 border-[#7e6f95] text-[#b5a4cd] p-4 flex flex-col items-center justify-center gap-2 transition-all hover:border-[#ff6e84] hover:text-[#ff6e84]"
                    >
                        <Lock className="w-8 h-8" />
                        <span className="font-black text-xs uppercase tracking-widest">LOCK</span>
                    </button>
                )}
            </div>
            <div className="mt-4">
                <NewSeasonForm onStatusChange={onStatusChange} />
            </div>
        </section>
    );
}
