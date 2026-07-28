import React, { useEffect, useState } from 'react';
import { Users, KeyRound, Copy, Check, ChevronDown } from 'lucide-react';
import api from '../../lib/api';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [resetLinks, setResetLinks] = useState({});
    const [copiedUsername, setCopiedUsername] = useState(null);
    const [isOpen, setIsOpen] = useState(true);

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
        <section className="bg-canvas border border-border rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="w-full text-left p-6 flex items-center justify-between gap-4 hover:bg-canvas-container transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-forest" />
                    <h2 className="font-serif text-xl font-semibold text-canvas-foreground">Members</h2>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <span className="font-sans text-sm font-semibold text-canvas-muted-foreground">
                        {users.length} {users.length === 1 ? 'member' : 'members'}
                    </span>
                    <ChevronDown
                        className={`w-5 h-5 text-canvas-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {isOpen && (
                <div className="px-6 pb-6 border-t border-border pt-6">
                    {users.length === 0 ? (
                        <p className="text-sm text-canvas-muted-foreground text-center py-4">No members found.</p>
                    ) : (
                        <div className="space-y-3">
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
                    )}
                </div>
            )}
        </section>
    );
}

function UserRow({ user, resetUrl, isCopied, onGenerateLink, onCopyLink }) {
    return (
        <div className="bg-canvas-container border border-border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="text-canvas-foreground font-medium truncate">{user.username}</span>
                    <RoleBadge role={user.role} />
                </div>
                <button
                    onClick={onGenerateLink}
                    className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-canvas-container hover:bg-canvas-muted text-forest border border-border px-3 py-2 rounded-lg transition-colors shrink-0"
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

function RoleBadge({ role }) {
    const isAdministrator = role === 'ADMIN';
    return (
        <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                isAdministrator
                    ? 'bg-oxblood/10 text-oxblood'
                    : 'bg-canvas-muted text-canvas-muted-foreground'
            }`}
        >
            {role}
        </span>
    );
}

function ResetLinkRow({ resetUrl, isCopied, onCopy }) {
    return (
        <div className="flex items-center gap-2 pt-2">
            <input
                readOnly
                value={resetUrl}
                className="flex-1 min-w-0 bg-canvas-muted border border-border text-canvas-muted-foreground text-xs rounded-lg px-3 py-2 truncate focus:outline-none"
            />
            <button
                onClick={onCopy}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-oxblood-container hover:bg-oxblood-deep text-white px-3 py-2 rounded-lg transition-colors shrink-0 hard-shadow"
            >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? 'Copied' : 'Copy'}
            </button>
        </div>
    );
}
