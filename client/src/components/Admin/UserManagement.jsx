import { useEffect, useState } from 'react';
import { Users, KeyRound, Copy, Check } from 'lucide-react';
import api from '../../lib/api';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [resetLinks, setResetLinks] = useState({});
    const [copiedUsername, setCopiedUsername] = useState(null);

    useEffect(() => {
        api.get('/admin/users').then(res => setUsers(res.data)).catch(() => {});
    }, []);

    const generateResetLink = async (username) => {
        try {
            const res = await api.post(`/admin/users/${username}/reset-token`);
            setResetLinks(prev => ({ ...prev, [username]: res.data.resetUrl }));
        } catch (e) {}
    };

    const copyLink = (username) => {
        navigator.clipboard.writeText(resetLinks[username]);
        setCopiedUsername(username);
        setTimeout(() => setCopiedUsername(null), 2000);
    };

    return (
        <section className="bg-[#201139] border-2 border-[#4f4165] p-6">
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-[#ff80e4]" />
                <h2 className="text-xs font-black text-[#ff80e4] uppercase tracking-[0.3em]">Members</h2>
            </div>
            <div className="space-y-2">
                {users.map(user => (
                    <UserRow
                        key={user.username}
                        user={user}
                        resetUrl={resetLinks[user.username]}
                        isCopied={copiedUsername === user.username}
                        onGenerateLink={() => generateResetLink(user.username)}
                        onCopyLink={() => copyLink(user.username)}
                    />
                ))}
            </div>
        </section>
    );
}

function UserRow({ user, resetUrl, isCopied, onGenerateLink, onCopyLink }) {
    return (
        <div className="bg-black border-2 border-[#4f4165] p-4 space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-[#eee0ff] font-bold uppercase tracking-wide text-sm">{user.username}</span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border ${user.role === 'ADMIN' ? 'border-[#ff80e4] text-[#ff80e4]' : 'border-[#7e6f95] text-[#7e6f95]'}`}>
                        {user.role}
                    </span>
                </div>
                <button
                    onClick={onGenerateLink}
                    className="flex items-center gap-1.5 text-[10px] border border-[#7e6f95] hover:border-[#00f1fd] text-[#b5a4cd] hover:text-[#00f1fd] px-3 py-1.5 font-black uppercase tracking-widest transition-colors"
                >
                    <KeyRound className="w-3 h-3" />
                    Reset Password
                </button>
            </div>
            {resetUrl && (
                <ResetLinkRow resetUrl={resetUrl} isCopied={isCopied} onCopy={onCopyLink} />
            )}
        </div>
    );
}

function ResetLinkRow({ resetUrl, isCopied, onCopy }) {
    return (
        <div className="flex items-center gap-2 mt-2">
            <input
                readOnly
                value={resetUrl}
                className="flex-1 bg-black border border-[#4f4165] text-[#b5a4cd] text-xs px-3 py-2 truncate focus:outline-none"
            />
            <button
                onClick={onCopy}
                className="flex items-center gap-1 text-[10px] border-2 border-[#00f1fd] text-[#00f1fd] hover:bg-[#00f1fd]/10 px-3 py-2 font-black uppercase tracking-widest transition-colors shrink-0"
            >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
}
