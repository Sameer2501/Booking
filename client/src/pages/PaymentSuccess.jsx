import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 relative">
            <div className="absolute top-[20%] w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none"></div>

            <div className="glass-card p-10 rounded-3xl border border-white/5 max-w-md w-full text-center shadow-2xl relative z-10">
                <FaCheckCircle className="text-emerald-400 text-7xl mx-auto mb-6 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
                <h1 className="text-3xl font-black font-display text-white mb-4">Booking Confirmed!</h1>
                <p className="text-gray-400 mb-8 text-base leading-relaxed">Your ticket has been booked successfully. A confirmation email has been sent to your registered email address.</p>
                <div className="space-y-4">
                    <Link to="/dashboard" className="block w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3.5 px-6 rounded-xl transition duration-300 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:-translate-y-0.5 text-center cursor-pointer">
                        View My Tickets
                    </Link>
                    <Link to="/" className="block w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 px-6 rounded-xl border border-white/5 hover:border-white/10 transition duration-300 text-center cursor-pointer">
                        Discover More Events
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;