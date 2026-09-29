import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, Star, ArrowRight } from "lucide-react";
import api from "../../services/api.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { formatDate } from "../../utils/helpers.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then((res) => setStats(res.data.data.stats))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your events and registrations</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="mt-3 h-8 w-12 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Events", value: stats.totalEvents, icon: Calendar, color: "bg-brand-100 text-brand-600" },
              { label: "Upcoming Events", value: stats.upcomingEvents, icon: LayoutDashboard, color: "bg-emerald-100 text-emerald-600" },
              { label: "Total Registrations", value: stats.totalRegistrations, icon: Users, color: "bg-amber-100 text-amber-600" },
              { label: "Featured Events", value: stats.featuredEvents, icon: Star, color: "bg-purple-100 text-purple-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Events */}
          <div className="mt-8 card">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold text-gray-900">Recent Events</h2>
              <Link to="/admin/events" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {stats.recentEvents.map((e) => (
                <div key={e.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{e.name}</p>
                    <p className="text-sm text-gray-500">{formatDate(e.date)} at {e.time} &middot; {e.category}</p>
                  </div>
                  <span className="badge bg-brand-100 text-brand-700">{e.registrationCount} registrations</span>
                </div>
              ))}
              {stats.recentEvents.length === 0 && (
                <p className="px-6 py-8 text-center text-sm text-gray-500">No events yet</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Failed to load dashboard data</p>
      )}
    </div>
  );
}
