import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/5 shadow-xl">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
                    <Link to="/" className="text-white text-2xl font-black font-display flex items-center gap-2 hover:opacity-90 transition duration-300">
                        <FaTicketAlt className="text-brand-500 drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                        <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">Eventora</span>
                    </Link>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                        <Link to="/" className="text-sm text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg hover:bg-white/5 transition duration-300 cursor-pointer">
                            Events
                        </Link>
                        {user ? (
                            <>
                                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-sm text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg hover:bg-white/5 transition duration-300">
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className="text-sm bg-[#12131a] hover:bg-brand-600/10 text-gray-300 hover:text-brand-400 border border-white/5 hover:border-brand-500/20 px-4 py-2 rounded-lg transition duration-300 font-semibold cursor-pointer">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg hover:bg-white/5 transition duration-300">
                                    Login
                                </Link>
                                <Link to="/register" className="text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-brand-500/15 hover:shadow-brand-500/30 hover:-translate-y-0.5 transition duration-300">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;