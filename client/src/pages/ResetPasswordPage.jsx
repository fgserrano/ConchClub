import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
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
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-4 text-center">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
                <PasswordInput name="newPassword" placeholder="New Password" />
                <PasswordInput name="confirmPassword" placeholder="Confirm New Password" />
                <button
                    disabled={loading}
                    className="w-full bg-oxblood-container text-white font-semibold uppercase tracking-widest text-sm py-3 rounded-lg hover:bg-oxblood-deep transition-colors flex items-center justify-center disabled:opacity-50 mt-2 hard-shadow"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Reset Password'}
                </button>
            </form>
            <p className="text-center text-canvas-muted-foreground text-sm mt-6">
                <Link to="/login" className="text-forest hover:underline transition-colors font-medium">Back to Login</Link>
            </p>
        </ResetPasswordLayout>
    );
}

function ResetPasswordLayout({ children }) {
    return (
        <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-canvas-container border border-border p-10 rounded-2xl hard-shadow">
                <h2 className="font-serif text-3xl font-semibold text-center text-forest mb-2">Reset Password</h2>
                <p className="text-canvas-muted-foreground text-center text-sm mb-8">Set your new password</p>
                {children}
            </div>
        </div>
    );
}

function PasswordInput({ name, placeholder }) {
    return (
        <div className="group">
            <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-canvas-muted-foreground group-focus-within:text-forest transition-colors" />
                <input
                    name={name}
                    type="password"
                    placeholder={placeholder}
                    required
                    className="w-full bg-canvas-container border-0 border-b-2 border-border text-canvas-foreground rounded-none px-9 py-2.5 focus:outline-none focus:border-forest transition-colors placeholder:text-canvas-muted-foreground"
                />
            </div>
        </div>
    );
}

function InvalidTokenMessage() {
    return (
        <div className="text-center">
            <p className="text-destructive text-sm mb-4">No reset token found. This link may be invalid.</p>
            <Link to="/login" className="text-forest hover:underline transition-colors font-medium text-sm">Back to Login</Link>
        </div>
    );
}

function SuccessMessage() {
    return (
        <div className="text-center">
            <p className="text-forest font-medium mb-2">Password reset successfully</p>
            <p className="text-canvas-muted-foreground text-sm">Redirecting to login...</p>
        </div>
    );
}
