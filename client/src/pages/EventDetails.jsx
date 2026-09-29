import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react";
import api from "../services/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { formatDate, formatTime } from "../utils/helpers.js";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then((res) => setEvent(res.data.data.event))
      .catch(() => setError("Event not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading event details..." />;
  if (error) return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <p className="text-lg text-gray-500">{error}</p>
      <Link to="/events" className="btn-primary mt-4 inline-flex">Back to Events</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/events" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      <div className="card overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-brand-500 to-brand-700">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center"><Calendar className="h-20 w-20 text-white/30" /></div>
          )}
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="badge bg-brand-100 text-brand-700">{event.category}</span>
            <StatusBadge event={event} />
            {event.isFeatured && <span className="badge bg-yellow-100 text-yellow-700">Featured</span>}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" />{formatDate(event.date)}</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400" />{formatTime(event.time)}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" />{event.venue}</div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-gray-400" />{event.registrationCount} / {event.capacity} registered</div>
          </div>
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About This Event</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {event.registrationOpen ? (
              <Link to={`/events/${event.id}/register`} className="btn-primary">Register Now</Link>
            ) : (
              <span className="inline-flex items-center rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-500">
                Registration Closed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
