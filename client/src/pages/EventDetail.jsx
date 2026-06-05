import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (!showOTP) {
                await api.post('/bookings/send-otp');
                setShowOTP(true);
                setSuccessMsg('OTP sent to your email. Please verify to confirm booking.');
            } else {
                await api.post('/bookings', { eventId: event._id, otp });
                setSuccessMsg('Booking requested! Awaiting admin confirmation.');
                setShowOTP(false);
                // Update local seats count dynamically after booking
                setEvent({ ...event, availableSeats: event.availableSeats - 1 });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xl font-semibold text-gray-400">Loading event details...</div>
            </div>
        );
    }
    
    if (error && !event) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="text-2xl font-bold text-red-500 mb-4">{error || 'Event not found'}</div>
                <button onClick={() => navigate('/')} className="bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-xl hover:bg-white/10 transition">
                    Return to Events
                </button>
            </div>
        );
    }

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="max-w-5xl mx-auto glass rounded-3xl border border-white/5 shadow-2xl overflow-hidden mt-8">
            <div className="relative h-96 bg-gray-950 overflow-hidden">
                {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#12131a] text-brand-400/30 text-7xl font-black uppercase tracking-widest font-display">
                        {event.category}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-darkbg via-darkbg/40 to-transparent"></div>
            </div>

            <div className="p-6 md:p-12 relative z-10 -mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2">
                        <div className="inline-block bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-4 font-display">
                            {event.category}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight font-display">{event.title}</h1>
                        
                        <div className="h-px bg-white/5 my-6"></div>
                        
                        <h3 className="text-lg font-bold text-white mb-3 font-display">About the Event</h3>
                        <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6 whitespace-pre-line">{event.description}</p>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 rounded-2xl border border-white/10 w-full shadow-lg shadow-black/40">
                            <h3 className="text-lg font-extrabold font-display text-white mb-6 border-b border-white/5 pb-3">Booking Status</h3>

                            <div className="space-y-5 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                                        <FaMoneyBillWave />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Ticket Price</p>
                                        <p className="font-extrabold text-white text-base">
                                            {event.ticketPrice === 0 ? <span className="text-emerald-400">Free</span> : `₹${event.ticketPrice}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                                        <FaChair />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Availability</p>
                                        <p className="font-extrabold text-white text-base">
                                            <span className={event.availableSeats < 10 ? 'text-amber-400' : 'text-emerald-400'}>{event.availableSeats}</span>
                                            <span className="text-gray-500 font-normal"> / {event.totalSeats} remaining</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                                        <FaCalendarAlt />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Date</p>
                                        <p className="font-extrabold text-white text-base">
                                            {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Location</p>
                                        <p className="font-extrabold text-white text-base line-clamp-2">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            {showOTP && (
                                <div className="mb-5 animation-slideDown">
                                    <label className="block text-xs font-extrabold text-brand-400 uppercase tracking-widest mb-2">Enter verification code (OTP)</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="6-digit code"
                                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition font-extrabold tracking-widest text-center text-lg text-white placeholder-gray-600 shadow-inner"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleBooking}
                                disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                                className={`w-full py-4 px-6 rounded-xl font-extrabold text-base transition-all duration-300 shadow-lg cursor-pointer ${
                                    isSoldOut || (successMsg && !showOTP)
                                        ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5 shadow-none'
                                        : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-brand-500/15 hover:shadow-brand-500/30 hover:-translate-y-0.5'
                                }`}
                            >
                                {bookingLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Processing...
                                    </span>
                                ) : (showOTP ? 'Verify OTP & Confirm' : (successMsg && !showOTP ? 'Request Sent ✓' : (isSoldOut ? 'Sold Out' : 'Confirm Registration')))}
                            </button>

                            {error && (
                                <p className="text-red-400 mt-4 text-center text-sm font-semibold bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                                    {error}
                                </p>
                            )}
                            {successMsg && (
                                <p className="text-emerald-400 mt-4 text-center text-sm font-semibold bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                                    {successMsg}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;