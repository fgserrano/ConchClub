import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../lib/api';

const MARQUEE_TEXT = 'NEW ARRIVALS: PULP FICTION • THE MATRIX • FIGHT CLUB • GOODFELLAS • FORREST GUMP • THE SILENCE OF THE LAMBS • SCHINDLER\'S LIST • FARGO • HEAT • AMERICAN BEAUTY • LATE FEES APPLY AFTER MIDNIGHT • ';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (data.password !== data.confirmPassword) {
            setError('Passcodes do not match');
            setLoading(false);
            return;
        }

        const { confirmPassword, ...registrationData } = data;

        try {
            await api.post('/auth/register', registrationData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#140727] flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-[#00f1fd] selection:text-[#140727]">
            <div className="scanlines" />
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] z-[90]" />
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff80e4]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00f1fd]/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="fixed top-0 w-full bg-[#2e1c4b] border-b-2 border-[#ff80e4] z-50 h-8 flex items-center overflow-hidden">
                <div className="marquee-content px-4">
                    <span className="text-[#ffc965] font-bold tracking-[0.2em] text-xs uppercase">
                        {MARQUEE_TEXT}{MARQUEE_TEXT}
                    </span>
                </div>
            </div>

            <main className="w-full max-w-lg z-10 flex flex-col gap-8 mt-8 crt-flicker">
                <header className="text-center">
                    <h1 className="font-black text-5xl md:text-7xl italic tracking-tighter text-[#ff80e4] neon-glow-primary mb-2 drop-shadow-[4px_4px_0px_#00f1fd]">
                        JOIN THE CLUB
                    </h1>
                    <p className="uppercase tracking-[0.5em] text-[#00f1fd] font-bold text-sm neon-glow-secondary">
                        Present your invite credentials
                    </p>
                </header>

                <div className="bg-[#201139] border-4 border-[#4f4165] shadow-[20px_20px_0px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 flex gap-1">
                        <div className="w-3 h-3 bg-[#ff6e84] rounded-full shadow-[0_0_8px_#ff6e84]" />
                        <div className="w-3 h-3 bg-[#7e6f95] rounded-full" />
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 flex flex-col gap-8">
                        {error && (
                            <div className="border-l-4 border-[#ff6e84] bg-[#ff6e84]/10 text-[#ff6e84] text-sm p-3">
                                {error}
                            </div>
                        )}

                        <RetroInput name="username" label="HANDLE" placeholder="your-handle" type="text" accentColor="#00f1fd" borderFocusClass="focus:border-[#00f1fd]" textColorClass="text-[#00f1fd]" />
                        <RetroInput name="password" label="PASSKEY" placeholder="••••••••" type="password" accentColor="#ff80e4" borderFocusClass="focus:border-[#ff80e4]" textColorClass="text-[#ff80e4]" />
                        <RetroInput name="confirmPassword" label="CONFIRM PASSKEY" placeholder="••••••••" type="password" accentColor="#ff80e4" borderFocusClass="focus:border-[#ff80e4]" textColorClass="text-[#ff80e4]" />
                        <RetroInput name="inviteCode" label="ACCESS CODE" placeholder="XXXX-XXXX" type="text" accentColor="#ffc965" borderFocusClass="focus:border-[#ffc965]" textColorClass="text-[#ffc965]" />

                        <button
                            disabled={loading}
                            className="group relative w-full bg-transparent border-4 border-[#ff80e4] p-5 mt-2 transition-all active:scale-95 hover:bg-[#ff80e4]/10 disabled:opacity-50"
                            type="submit"
                        >
                            <div className="absolute inset-0 border-2 border-[#ff80e4] scale-[1.05] opacity-50 group-hover:scale-[1.08] transition-transform" />
                            <span className="relative font-black text-2xl uppercase tracking-tighter text-[#ff80e4] neon-glow-primary group-hover:text-white transition-colors">
                                {loading ? <Loader2 className="animate-spin w-6 h-6 mx-auto" /> : 'REGISTER'}
                            </span>
                            <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#00f1fd]" />
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#00f1fd]" />
                        </button>

                        <div className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#7e6f95]">
                            Already a member?{' '}
                            <Link to="/login" className="text-[#00f1fd] hover:neon-glow-secondary transition-colors">
                                Log In
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

function RetroInput({ name, label, placeholder, type, accentColor, borderFocusClass, textColorClass }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[#ffc965] uppercase font-black text-xs tracking-widest">
                {label}
            </label>
            <div className="relative group">
                <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    required
                    className={`w-full bg-black border-2 border-[#7e6f95] ${borderFocusClass} p-4 font-bold text-xl tracking-widest ${textColorClass} focus:ring-0 focus:outline-none placeholder:text-[#7e6f95]/40 transition-all`}
                />
                <div
                    className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"
                    style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
                />
            </div>
        </div>
    );
}
