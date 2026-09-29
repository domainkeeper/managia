import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Users, Trophy, Calendar, Star, ChevronRight } from "lucide-react";
import api from "../services/api.js";
import EventCard from "../components/EventCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { formatDate, formatTime } from "../utils/helpers.js";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/events?sort=upcoming"),
      api.get("/events/featured"),
    ])
      .then(([eventsRes, featRes]) => {
        setEvents(eventsRes.data.data.events.filter((e) => e.status !== "completed").slice(0, 6));
        setFeatured(featRes.data.data.event);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Welcome to TechClub
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Where Innovation Meets{" "}
              <span className="text-brand-200">Community</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-brand-100">
              Join our vibrant tech community. We organize hackathons, workshops, seminars, and cultural events
              that inspire learning and connect passionate students.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition-all hover:bg-brand-50 hover:shadow-xl"
              >
                Explore Events <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Register for an Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Who We Are</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            TechClub is the premier technology and innovation club at our college. We bring together students
            who are passionate about technology, creativity, and making a difference.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, title: "500+ Members", desc: "A thriving community of tech enthusiasts" },
            { icon: Calendar, title: "20+ Events/Year", desc: "Workshops, hackathons, seminars, and more" },
            { icon: Trophy, title: "10+ Competitions", desc: "National and inter-college tech competitions" },
            { icon: Star, title: "Industry Mentors", desc: "Guidance from industry professionals" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 text-center transition-all hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Event */}
      {featured && (
        <section className="bg-gray-900 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <Star className="h-5 w-5 text-yellow-400" />
              <h2 className="text-2xl font-bold">Featured Event</h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700">
                {featured.imageUrl ? (
                  <img src={featured.imageUrl} alt={featured.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-72 items-center justify-center">
                    <Calendar className="h-20 w-20 text-white/30" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <span className="badge mb-3 w-fit bg-brand-500/20 text-brand-200">{featured.category}</span>
                <h3 className="text-3xl font-bold">{featured.name}</h3>
                <div className="mt-4 space-y-2 text-gray-300">
                  <p>{formatDate(featured.date)} at {formatTime(featured.time)}</p>
                  <p>{featured.venue}</p>
                </div>
                <p className="mt-4 text-gray-400">{featured.description}</p>
                <div className="mt-8">
                  {featured.registrationOpen ? (
                    <Link to={`/events/${featured.id}/register`} className="btn-primary bg-white text-brand-700 hover:bg-brand-50">
                      Register Now <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center rounded-lg bg-white/10 px-5 py-2.5 text-sm font-semibold">
                      Registration Closed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <Link to="/events" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading events..." />
        ) : events.length === 0 ? (
          <div className="mt-12 text-center text-gray-500">No upcoming events at the moment. Check back soon!</div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
