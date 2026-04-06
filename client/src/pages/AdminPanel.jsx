import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import SeasonActions from '../components/Season/SeasonActions';
import CurrentSeason from '../components/Season/CurrentSeason';
import UserManagement from '../components/Admin/UserManagement';
import api from '../lib/api';

export default function AdminPanel() {
    const [response, setResponse] = useState('');
    const [season, setSeason] = useState(null);

    const fetchSeason = async () => {
        try {
            const res = await api.get('/season/active');
            setSeason(res.data);
        } catch (e) {
        }
    };

    useEffect(() => {
        fetchSeason();
    }, [response]);

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="flex items-center gap-3 mb-8">
                <Shield className="w-8 h-8 text-[#00f1fd]" />
                <h1 className="text-3xl font-black italic tracking-tighter text-[#ff80e4] neon-glow-primary">ADMIN CONTROL</h1>
            </div>

            {response && (
                <div className="border-l-4 border-[#00f1fd] bg-[#201139] text-[#eee0ff] p-4 font-bold uppercase tracking-wider text-sm">
                    {response}
                </div>
            )}

            <SeasonActions onStatusChange={setResponse} season={season} />
            <CurrentSeason season={season} />
            <UserManagement />
        </div>
    );
}
