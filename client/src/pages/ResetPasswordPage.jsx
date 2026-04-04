import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Film, Lock, Loader2 } from 'lucide-react';
import api from '../lib/api';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!token) {
        return <ResetPasswordLayout><InvalidTokenMessage /></ResetPasswordLayout>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData(e.currentTarget);
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, newPassword });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data || 'Reset failed. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <ResetPasswordLayout>
                <SuccessMessage />
            </ResetPasswordLayout>
        );
    }

    return (
        <ResetPasswordLayout>
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <PasswordInput name="newPassword" placeholder="New Password" />
                <PasswordInput name="confirmPassword" placeholder="Confirm New Password" />
                <button
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 mt-6"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Reset Password'}
                </button>
            </form>
            <p className="text-center text-slate-600 text-sm mt-6">
                <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">Back to Login</Link>
            </p>
        </ResetPasswordLayout>
    );
}

function ResetPasswordLayout({ children }) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black animate-pulse-slow" />
            <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center rotate-3 border border-purple-500/30">
                        <Film className="w-8 h-8 text-purple-400" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">Reset Password</h2>
                <p className="text-slate-500 text-center mb-8">Set your new password</p>
                {children}
            </div>
        </div>
    );
}

function PasswordInput({ name, placeholder }) {
    return (
        <div className="group">
            <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                    name={name}
                    type="password"
                    placeholder={placeholder}
                    required
                    className="w-full bg-black/40 border border-slate-800 text-slate-200 rounded-xl px-10 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                />
            </div>
        </div>
    );
}

function InvalidTokenMessage() {
    return (
        <div className="text-center">
            <p className="text-red-400 mb-4">No reset token found. This link may be invalid.</p>
            <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">Back to Login</Link>
        </div>
    );
}

function SuccessMessage() {
    return (
        <div className="text-center">
            <p className="text-green-400 mb-2">Password reset successfully!</p>
            <p className="text-slate-500 text-sm">Redirecting to login...</p>
        </div>
    );
}
