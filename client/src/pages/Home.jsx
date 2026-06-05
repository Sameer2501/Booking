import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400); // 400ms debounce
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-[#0d0e14] text-white rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/5 py-6">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                
                {/* Floating Glow Effects */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-brand-600/15 blur-[120px] pointer-events-none animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none animate-pulse-slow"></div>

                <div className="relative p-8 md:p-20 text-center flex flex-col items-center z-10">
                    <span className="bg-brand-500/10 text-brand-400 border border-brand-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase mb-6">
                        Welcome to Eventora
                    </span>
                    <h1 className="text-4xl md:text-7xl font-black font-display mb-6 leading-tight tracking-tight text-white">
                        Find Your Next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-500 to-indigo-400 drop-shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                            Unforgettable
                        </span> Experience
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg mb-10 max-w-2xl mx-auto font-normal leading-relaxed">
                        Discover the best tech conferences, late-night music festivals, and hands-on workshops happening directly in your area. Secure your spot today.
                    </p>

                    <div className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl group">
                        <FaSearch className="absolute left-6 text-gray-400 text-xl group-focus-within:text-brand-400 transition-colors duration-300" />
                        <input
                            type="text"
                            placeholder="Search events by title..."
                            className="w-full pl-16 pr-6 py-4.5 rounded-full text-lg text-white bg-[#12131a]/90 backdrop-blur-sm border border-white/10 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition-all placeholder-gray-500 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Why Choose Us / Features row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1.5 transition duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-brand-500/20">
                        <FaRegClock />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Fast Booking</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Secure your tickets instantly with our fast streamlined booking infrastructure built for speed.</p>
                </div>
                <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1.5 transition duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-brand-500/20">
                        <FaTicketAlt />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Seamless Access</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Download tickets instantly or manage them right from your personal dashboard with easily.</p>
                </div>
                <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1.5 transition duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-brand-500/20">
                        <FaShieldAlt />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Secure Platform</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">All transactions and registrations are bounded by cutting-edge security and 2FA OTP tech.</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8 px-2 border-b border-white/5 pb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">Upcoming Events</h2>
                <div className="text-gray-400 text-sm bg-white/5 border border-white/10 px-4 py-1.5 rounded-full font-medium">{events.length} results found</div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-lg font-medium text-gray-400">Loading events...</div>
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-xl text-gray-400 glass rounded-3xl border border-white/5">No events found matching your search.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <div key={event._id} className="glass-card hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1 transition duration-300 flex flex-col rounded-3xl overflow-hidden group">
                            <div className="h-52 bg-gray-900 overflow-hidden relative">
                                {event.imageUrl ? (
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#1a1b26] text-brand-400 font-extrabold text-2xl uppercase tracking-wider">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-darkbg/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-md border border-white/10">
                                    {event.ticketPrice === 0 ? <span className="text-emerald-400 tracking-wide font-display">FREE</span> : <span className="text-white">₹{event.ticketPrice}</span>}
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="text-xs font-extrabold text-brand-400 uppercase tracking-widest mb-2 font-display">{event.category}</div>
                                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-brand-400 transition-colors duration-300 line-clamp-1">{event.title}</h2>
                                <div className="flex flex-col gap-2.5 mb-5 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-brand-500/80" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-brand-500/80" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="w-full bg-white/10 rounded-full h-2 mb-2 overflow-hidden">
                                        <div className="bg-gradient-to-r from-brand-500 to-indigo-500 h-2 rounded-full" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-4 font-medium">{event.availableSeats} of {event.totalSeats} seats remaining</p>
                                    <Link to={`/events/${event._id}`} className="block w-full text-center bg-[#1a1b26] hover:bg-brand-600 text-white font-bold py-3 rounded-xl transition duration-300 border border-white/5 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/20">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Section */}
            <footer className="mt-auto pt-20 pb-8 border-t border-white/5 text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <FaTicketAlt className="text-brand-500 text-2xl drop-shadow-[0_0_8px_rgba(124,58,237,0.4)]" />
                    <span className="text-xl font-bold font-display text-white">Eventora</span>
                </div>
                <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                    The simplest, most dynamic way to manage, discover, and host world-class events in your local city. Let's make memories together.
                </p>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    &copy; {new Date().getFullYear()} Eventora Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;