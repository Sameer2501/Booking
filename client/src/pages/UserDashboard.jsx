import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xl font-semibold text-gray-400">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8 border border-white/5 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-brand-500/5 blur-[80px] pointer-events-none"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-brand-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-black font-display uppercase tracking-widest shrink-0 shadow-lg shadow-brand-500/20">
                    {user?.name.charAt(0)}
                </div>
                <div className="flex flex-col items-center sm:items-start justify-center">
                    <h1 className="text-2xl sm:text-3xl font-black font-display text-white mb-2">Welcome, {user?.name}!</h1>
                    <p className="text-gray-400 text-sm flex items-center justify-center sm:justify-start gap-2 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/5 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> User Dashboard
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-3">
                    <FaTicketAlt className="text-brand-500" /> My Booking Requests
                </h2>
            </div>

            {bookings.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center border border-white/5">
                    <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-500/10">
                        <FaTicketAlt className="text-brand-400 text-3xl" />
                    </div>
                    <p className="text-xl text-gray-400 mb-6 mt-4 font-semibold">You haven't booked any events yet.</p>
                    <Link to="/" className="inline-block bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold py-3.5 px-8 rounded-xl transition duration-300 shadow-lg shadow-brand-500/15 hover:shadow-brand-500/30 hover:-translate-y-0.5 cursor-pointer">
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="glass-card rounded-2xl overflow-hidden hover:border-brand-500/25 hover:shadow-lg transition-all duration-300 border border-white/5 flex flex-col justify-between">
                            <div className="p-6 flex-grow">
                                {booking.eventId ? (
                                    <>
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <h3 className="text-lg font-bold text-white font-display leading-tight line-clamp-2">{booking.eventId.title}</h3>
                                            <div className="flex flex-col gap-1.5 items-end shrink-0">
                                                <span className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border ${
                                                    booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                                {booking.status !== 'cancelled' && (
                                                    <span className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border ${
                                                        booking.paymentStatus === 'paid' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 
                                                        'bg-gray-500/10 text-gray-400 border-white/5'
                                                    }`}>
                                                        {booking.paymentStatus.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-400 space-y-2 mt-6">
                                            <p className="flex justify-between items-center border-b border-white/5 pb-2">
                                                <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Date</span> 
                                                <span className="font-semibold text-gray-200">{new Date(booking.eventId.date).toLocaleDateString()}</span>
                                            </p>
                                            <p className="flex justify-between items-center border-b border-white/5 pb-2">
                                                <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Amount</span> 
                                                <span className={`font-semibold ${booking.amount === 0 ? 'text-emerald-400' : 'text-white'}`}>
                                                    {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}
                                                </span>
                                            </p>
                                            <p className="flex justify-between items-center">
                                                <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Requested</span> 
                                                <span className="font-semibold text-gray-300">{new Date(booking.bookedAt).toLocaleDateString()}</span>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-red-400 italic text-center py-6 text-sm">Event details unavailable (might have been deleted)</p>
                                )}
                            </div>
                            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center shrink-0">
                                {booking.eventId && booking.status !== 'cancelled' ? (
                                    <>
                                        <Link to={`/events/${booking.eventId._id}`} className="text-brand-400 font-bold text-sm hover:text-brand-300 hover:underline transition">View Event</Link>
                                        <button
                                            onClick={() => cancelBooking(booking._id)}
                                            className="text-red-400 font-bold text-sm hover:text-red-300 transition flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <FaTimesCircle /> Cancel Request
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full text-center text-sm text-gray-500 italic font-semibold">Booking Cancelled</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;