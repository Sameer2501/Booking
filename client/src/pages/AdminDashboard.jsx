import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEventForm, setShowEventForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    image: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get("/events"),
        api.get("/bookings/my"), // Admin gets all bookings
      ]);
      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", formData);
      setShowEventForm(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        image: "",
      });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating event");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        fetchData();
      } catch (error) {
        alert("Error deleting event");
      }
    }
  };

  const handleConfirmBooking = async (id, paymentStatus) => {
    try {
      await api.put(`/bookings/${id}`, { paymentStatus });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error confirming booking");
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Cancel this user's booking request?")) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Error cancelling booking");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl font-semibold text-gray-400">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Admin Profile Header */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-brand-500/5 blur-[80px] pointer-events-none"></div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Manage your events and manually confirm client bookings.
          </p>
        </div>
        <button
          onClick={() => setShowEventForm(!showEventForm)}
          className="w-full md:w-auto bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold py-3.5 px-6 rounded-xl transition duration-300 shadow-lg shadow-brand-500/15 hover:shadow-brand-500/30 hover:-translate-y-0.5 cursor-pointer text-sm"
        >
          {showEventForm ? "Cancel Creation" : "+ Create New Event"}
        </button>
      </div>

      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-xl">
          <div>
            <p className="text-gray-500 text-[10px] font-extrabold uppercase tracking-widest mb-1">
              Total Revenue
            </p>
            <h3 className="text-3xl font-black font-display text-emerald-400">
              ₹
              {bookings.reduce(
                (sum, b) =>
                  b.paymentStatus === "paid" && b.status === "confirmed"
                    ? sum + b.amount
                    : sum,
                0,
              )}
            </h3>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center text-xl font-extrabold border border-emerald-500/20">
            ₹
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-xl">
          <div>
            <p className="text-gray-500 text-[10px] font-extrabold uppercase tracking-widest mb-1">
              Paid Clients
            </p>
            <h3 className="text-3xl font-black font-display text-sky-400">
              {
                new Set(
                  bookings
                    .filter(
                      (b) =>
                        b.paymentStatus === "paid" && b.status === "confirmed",
                    )
                    .map((b) => b.userId?._id),
                ).size
              }
            </h3>
          </div>
          <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-xl flex items-center justify-center text-xl font-extrabold border border-sky-500/20">
            👤
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-xl">
          <div>
            <p className="text-gray-500 text-[10px] font-extrabold uppercase tracking-widest mb-1">
              Pending Requests
            </p>
            <h3 className="text-3xl font-black font-display text-amber-400">
              {bookings.filter((b) => b.status === "pending").length}
            </h3>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center text-xl font-extrabold border border-amber-500/20">
            ⏳
          </div>
        </div>
      </div>

      {showEventForm && (
        <div className="glass-card p-8 rounded-3xl border border-white/10 mb-8 shadow-2xl animation-slideDown">
          <h2 className="text-2xl font-black font-display mb-6 text-white">
            Create New Event
          </h2>
          <form
            onSubmit={handleCreateEvent}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Event Title</label>
              <input
                required
                type="text"
                placeholder="e.g. NextGen Web Summit"
                className="border border-white/10 bg-white/5 px-4 py-3 rounded-xl focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition text-white placeholder-gray-600 font-medium"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Category</label>
              <input
                required
                type="text"
                placeholder="e.g. Tech, Music, Arts"
                className="border border-white/10 bg-white/5 px-4 py-3 rounded-xl focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition text-white placeholder-gray-600 font-medium"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Date</label>
              <input
                required
                type="date"
                className="border border-white/10 bg-white/5 px-4 py-3 rounded-xl focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition text-white placeholder-gray-600 font-medium"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Location</label>
              <input
                required
                type="text"
                placeholder="e.g. Science City, Kolkata"
                className="border border-white/10 bg-white/5 px-4 py-3 rounded-xl focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition text-white placeholder-gray-600 font-medium"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Total Seats Available</label>
              <input
                required
                type="number"
                placeholder="e.g. 150"
                className="border border-white/10 bg-white/5 px-4 py-3 rounded-xl focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition text-white placeholder-gray-600 font-medium"
                value={formData.totalSeats}
                onChange={(e) =>
                  setFormData({ ...formData, totalSeats: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Ticket Price (₹)</label>
              <input
                required
                type="number"
                placeholder="0 for free entry"
                className="border border-white/10 bg-white/5 px-4 py-3 rounded-xl focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition text-white placeholder-gray-600 font-medium"
                value={formData.ticketPrice}
                onChange={(e) =>
                  setFormData({ ...formData, ticketPrice: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Image URL</label>
              <input
                type="text"
                placeholder="Provide direct web URL for banner image (Optional)"
                className="w-full border border-white/10 bg-white/5 px-4 py-3 rounded-xl focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition text-white placeholder-gray-600 font-medium"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Event Description</label>
              <textarea
                required
                placeholder="Describe details about key speakers, itinerary, or other highlights..."
                className="border border-white/10 bg-white/5 px-4 py-3 rounded-xl md:col-span-2 h-32 focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/15 focus:outline-none transition text-white placeholder-gray-600 font-medium"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="md:col-span-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold py-4 mt-2 rounded-xl transition duration-300 shadow-lg shadow-brand-500/15 hover:shadow-brand-500/30 hover:-translate-y-0.5 cursor-pointer text-base"
            >
              Publish Event
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events Section */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-black font-display mb-6 text-white flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-black">
              {events.length}
            </span>
            All Active Events
          </h2>
          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-xl">
            <ul className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
              {events.length === 0 ? (
                <li className="p-6 text-gray-500 text-center font-medium">
                  No events created yet.
                </li>
              ) : (
                events.map((event) => (
                  <li
                    key={event._id}
                    className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.02] transition border-b border-white/5 last:border-0"
                  >
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-white mb-1 leading-tight font-display text-base">
                        {event.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5 font-semibold text-gray-300 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>{" "}
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-gray-300 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${event.availableSeats > 0 ? "bg-emerald-500" : "bg-red-500"}`}
                          ></div>{" "}
                          {event.availableSeats} / {event.totalSeats} seats remaining
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="w-full sm:w-auto text-red-400 hover:text-white hover:bg-red-600 border border-red-500/20 hover:border-red-600 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md duration-300 shrink-0 cursor-pointer"
                    >
                      Delete Event
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-black font-display mb-6 text-white flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black">
              {bookings.length}
            </span>
            Booking Requests
          </h2>
          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-xl">
            <ul className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
              {bookings.length === 0 ? (
                <li className="p-6 text-gray-500 text-center font-medium">
                  No bookings yet.
                </li>
              ) : (
                bookings.map((booking) => (
                  <li
                    key={booking._id}
                    className={`p-6 hover:bg-white/[0.01] transition border-l-4 ${booking.status === "pending" ? "border-l-amber-500/80" : booking.status === "confirmed" ? "border-l-emerald-500/80" : "border-l-red-500/80"}`}
                  >
                    <div className="flex justify-between items-start mb-3 gap-4">
                      <h4 className="font-bold text-white text-base leading-tight font-display">
                        {booking.eventId?.title || "Deleted Event"}
                      </h4>
                      <div className="flex flex-col gap-1.5 items-end shrink-0 ml-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border ${booking.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : booking.status === "cancelled" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}
                        >
                          {booking.status}
                        </span>
                        {booking.status !== "cancelled" && (
                          <span
                            className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border ${booking.paymentStatus === "paid" ? "bg-sky-500/10 text-sky-400 border-sky-500/20" : "bg-gray-500/10 text-gray-400 border-white/5"}`}
                          >
                            {booking.paymentStatus.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bg-white/[0.01] rounded-xl p-4 mb-3 border border-white/5 text-sm space-y-2.5">
                      <p className="text-gray-300 flex items-center gap-2">
                        <span className="font-extrabold w-20 text-gray-500 uppercase text-[10px] tracking-widest">
                          User
                        </span>
                        <span className="font-semibold text-gray-200">
                          {booking.userId?.name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          ({booking.userId?.email})
                        </span>
                      </p>
                      <p className="text-gray-300 flex items-center gap-2">
                        <span className="font-extrabold w-20 text-gray-500 uppercase text-[10px] tracking-widest">
                          Amount
                        </span>
                        <span
                          className={`font-semibold ${booking.amount === 0 ? "text-emerald-400" : "text-white"}`}
                        >
                          {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                        </span>
                      </p>
                      <p className="text-gray-300 flex items-center gap-2">
                        <span className="font-extrabold w-20 text-gray-500 uppercase text-[10px] tracking-widest">
                          Requested
                        </span>
                        <span className="text-gray-300 font-medium">
                          {new Date(booking.bookedAt).toLocaleString()}
                        </span>
                      </p>
                      {booking.eventId && (
                        <p className="text-gray-300 flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                          <span className="font-extrabold w-20 text-gray-500 uppercase text-[10px] tracking-widest">
                            Seats
                          </span>
                          <span
                            className={`font-bold ${booking.eventId.availableSeats > 0 ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {booking.eventId.availableSeats}
                          </span>{" "}
                          <span className="text-gray-500 font-normal">remaining of {booking.eventId.totalSeats}</span>
                        </p>
                      )}
                    </div>

                    {/* Action buttons for admin */}
                    {booking.status === "pending" && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          onClick={() =>
                            handleConfirmBooking(booking._id, "paid")
                          }
                          className="flex-grow min-w-[120px] bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition duration-300 cursor-pointer"
                        >
                          ✓ Approve as Paid
                        </button>
                        <button
                          onClick={() =>
                            handleConfirmBooking(booking._id, "not_paid")
                          }
                          className="flex-grow min-w-[120px] bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition duration-300 cursor-pointer"
                        >
                          ✓ Approve Undecided
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="w-[80px] bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/20 text-xs font-bold py-2.5 px-3 rounded-lg transition duration-300 cursor-pointer"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
