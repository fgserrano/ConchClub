import React, { useEffect, useState } from 'react';
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
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Members</h2>
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
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-white font-medium">{user.username}</span>
                    <span className={`ml-2 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${user.role === 'ADMIN' ? 'bg-purple-900/50 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>
                        {user.role}
                    </span>
                </div>
                <button
                    onClick={onGenerateLink}
                    className="flex items-center gap-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                >
                    <KeyRound className="w-4 h-4" />
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
                className="flex-1 bg-black/40 border border-slate-700 text-slate-400 text-xs rounded-lg px-3 py-2 truncate"
            />
            <button
                onClick={onCopy}
                className="flex items-center gap-1 text-xs bg-purple-700 hover:bg-purple-600 text-white px-3 py-2 rounded-lg transition-colors shrink-0"
            >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
}
