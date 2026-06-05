import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentFailed = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 relative">
            <div className="absolute top-[20%] w-[300px] h-[300px] rounded-full bg-red-500/5 blur-[100px] pointer-events-none"></div>

            <div className="glass-card p-10 rounded-3xl border border-white/5 max-w-md w-full text-center shadow-2xl relative z-10">
                <FaTimesCircle className="text-red-400 text-7xl mx-auto mb-6 drop-shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse" />
                <h1 className="text-3xl font-black font-display text-white mb-4">Booking Failed</h1>
                <p className="text-gray-400 mb-8 text-base leading-relaxed">We couldn't process your payment. Please ensure your payment details are correct and try again.</p>
                <div className="space-y-4">
                    <Link to="/" className="block w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold py-3.5 px-6 rounded-xl transition duration-300 shadow-lg shadow-red-500/10 hover:shadow-red-500/25 hover:-translate-y-0.5 text-center cursor-pointer">
                        Return to Events
                    </Link>
                    <Link to="/dashboard" className="block w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 px-6 rounded-xl border border-white/5 hover:border-white/10 transition duration-300 text-center cursor-pointer">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;