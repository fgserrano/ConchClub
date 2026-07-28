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
        <section className="bg-surface-low rounded-sm p-6">
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-display font-bold text-on-surface">Members</h2>
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
        <div className="bg-surface-container rounded-sm p-4 space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-on-surface font-medium">{user.username}</span>
                    <span className={`text-[10px] font-display font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded-full ${user.role === 'ADMIN' ? 'bg-tertiary-container/60 text-on-tertiary-container' : 'bg-surface-high text-on-surface-variant'}`}>
                        {user.role}
                    </span>
                </div>
                <button
                    onClick={onGenerateLink}
                    className="flex items-center gap-1.5 text-sm bg-surface-high hover:bg-surface-highest text-on-surface px-3 py-1.5 rounded-sm transition-colors"
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
                className="flex-1 bg-surface-high text-on-surface-variant text-xs rounded-sm px-3 py-2 truncate focus:outline-none border-0"
            />
            <button
                onClick={onCopy}
                className="flex items-center gap-1 text-xs bg-primary text-on-primary px-3 py-2 rounded-sm hover:bg-primary-container transition-colors shrink-0"
            >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
}
