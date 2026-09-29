import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import { formatDate, formatTime } from "../utils/helpers.js";

export default function EventCard({ event, showRegister = true }) {
  return (
    <div className="card group overflow-hidden transition-all hover:shadow-md">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Calendar className="h-12 w-12 text-white/40" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <span className="badge bg-white/90 text-brand-700 shadow-sm">{event.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
            {event.name}
          </h3>
          <StatusBadge event={event} />
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-gray-500">{event.description}</p>

        <div className="space-y-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{event.registrationCount || 0} / {event.capacity} registered</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Link
            to={`/events/${event.id}`}
            className="btn-secondary flex-1 text-center text-sm"
          >
            Details
          </Link>
          {showRegister && event.registrationOpen && (
            <Link
              to={`/events/${event.id}/register`}
              className="btn-primary flex-1 text-center text-sm"
            >
              Register Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
