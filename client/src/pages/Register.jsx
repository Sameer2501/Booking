import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                await register(name, email, password);
                setShowOTP(true);
                setError('');
            } else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200%] rounded-full bg-brand-600/5 blur-[120px] pointer-events-none"></div>

            <div className="max-w-md mx-auto mt-16 glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black font-display text-white mb-2">Create an Account</h2>
                    <p className="text-gray-400 text-sm">Join Eventora today</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3.5 rounded-xl mb-6 text-center text-sm font-semibold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!showOTP ? (
                        <>
                            <div>
                                <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition-all text-white placeholder-gray-600 shadow-inner font-medium"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition-all text-white placeholder-gray-600 shadow-inner font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition-all text-white placeholder-gray-600 shadow-inner font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="animation-slideDown">
                            <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3.5 mb-4 rounded-xl font-semibold">
                                An OTP has been sent to your email. Please verify your account.
                            </p>
                            <label className="block text-xs font-extrabold text-brand-400 uppercase tracking-widest mb-2">Verification Code (OTP)</label>
                            <input
                                type="text"
                                required
                                placeholder="6-digit code"
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition-all text-white placeholder-gray-600 shadow-inner font-bold tracking-widest text-center text-lg"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 hover:-translate-y-0.5 mt-4 cursor-pointer"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Processing...
                            </span>
                        ) : (showOTP ? 'Verify & Complete' : 'Sign Up')}
                    </button>
                </form>

                {!showOTP && (
                    <p className="text-center mt-6 text-gray-400 text-sm">
                        Already have an account? <Link to="/login" className="text-brand-400 font-extrabold hover:text-brand-300 transition hover:underline">Sign in</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;