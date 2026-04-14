import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
        return <ResetPasswordLayout><SuccessMessage /></ResetPasswordLayout>;
    }

    return (
        <ResetPasswordLayout>
            {error && (
                <div className="bg-tertiary/10 text-tertiary text-sm p-3 rounded-sm mb-4 text-center">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <PasswordInput name="newPassword" label="New Password" />
                <PasswordInput name="confirmPassword" label="Confirm New Password" />
                <button
                    disabled={loading}
                    className="w-full bg-primary text-on-primary font-bold py-3 rounded-sm hover:bg-primary-container transition-colors flex items-center justify-center disabled:opacity-50 mt-2"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Reset Password'}
                </button>
            </form>
            <p className="text-center text-on-surface-variant text-sm mt-6">
                <Link to="/login" className="text-primary hover:opacity-70 transition-opacity">Back to Login</Link>
            </p>
        </ResetPasswordLayout>
    );
}

function ResetPasswordLayout({ children }) {
    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
            <img
                src="/vhs-archive.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#211b00]/60" />
            <div className="relative z-10 w-full max-w-sm bg-surface-lowest/70 backdrop-blur-[12px] rounded-sm p-8 border border-outline-variant/15 shadow-[0_24px_48px_rgba(33,27,0,0.06)]">
                <h1 className="font-display font-bold text-3xl text-primary tracking-tight mb-1">Reset Password</h1>
                <p className="text-sm text-on-surface-variant mb-8">Set your new password</p>
                {children}
            </div>
        </div>
    );
}

function PasswordInput({ name, label }) {
    return (
        <div>
            <label className="block text-[11px] uppercase tracking-[0.05em] font-display text-on-surface-variant mb-1">
                {label}
            </label>
            <input
                name={name}
                type="password"
                required
                className="w-full bg-transparent border-0 border-b border-outline/40 rounded-none py-2 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors"
            />
        </div>
    );
}

function InvalidTokenMessage() {
    return (
        <div className="text-center">
            <p className="text-tertiary mb-4">No reset token found. This link may be invalid.</p>
            <Link to="/login" className="text-primary hover:opacity-70 transition-opacity text-sm">Back to Login</Link>
        </div>
    );
}

function SuccessMessage() {
    return (
        <div className="text-center">
            <p className="text-primary font-medium mb-2">Password reset successfully!</p>
            <p className="text-on-surface-variant text-sm">Redirecting to login...</p>
        </div>
    );
}
