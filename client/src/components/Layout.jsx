import { Outlet, useNavigate, Link } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';
import tmdbLogo from '../assets/tmdb-logo.svg';

const MARQUEE_TEXT = 'NOW SCREENING AT CONCH CLUB FILM SOCIETY • PULP FICTION • THE MATRIX • GOODFELLAS • FARGO • HEAT • FIGHT CLUB • AMERICAN BEAUTY • THE SILENCE OF THE LAMBS • FORREST GUMP • SCHINDLER\'S LIST • ';

export default function Layout() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#140727] text-[#eee0ff] font-sans flex flex-col selection:bg-[#00f1fd] selection:text-[#140727]">
            <div className="scanlines" />
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff80e4]/10 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00f1fd]/10 blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="fixed top-0 w-full bg-[#2e1c4b] border-b-2 border-[#ff80e4] z-50 h-8 flex items-center overflow-hidden">
                <div className="marquee-content px-4">
                    <span className="text-[#ffc965] font-bold tracking-[0.2em] text-xs uppercase">
                        {MARQUEE_TEXT}{MARQUEE_TEXT}
                    </span>
                </div>
            </div>

            <nav className="border-b-2 border-[#4f4165] bg-[#2e1c4b]/70 backdrop-blur-[20px] sticky top-8 z-40">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="font-black text-2xl italic tracking-tighter text-[#ff80e4] neon-glow-primary hover:opacity-80 transition-opacity">
                        CONCH CLUB
                    </Link>

                    <div className="flex items-center gap-6">
                        {role === 'ADMIN' && (
                            <Link to="/admin" className="flex items-center gap-2 text-[#ffc965] hover:text-white transition-colors">
                                <Shield className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest">Admin</span>
                            </Link>
                        )}
                        <span className="text-xs text-[#b5a4cd] uppercase tracking-wider">
                            Welcome, <span className="text-[#eee0ff] font-bold">{username}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="p-2 border-2 border-[#7e6f95] hover:border-[#ff80e4] transition-colors text-[#b5a4cd] hover:text-[#ff80e4]"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full relative z-10">
                <Outlet />
            </main>

            <footer className="border-t-2 border-[#4f4165] bg-[#201139]/50 py-6 relative z-10">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4">
                    <img src={tmdbLogo} alt="TMDB Logo" className="h-6 opacity-60 invert" />
                    <p className="text-[10px] text-[#7e6f95] max-w-md text-center md:text-left uppercase tracking-[0.2em] font-bold">
                        This product uses the TMDB API but is not endorsed or certified by TMDB.
                    </p>
                </div>
            </footer>
        </div>
    );
}
