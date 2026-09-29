import { useState, useEffect } from "react";
import api from "../../services/api.js";
import SearchBar from "../../components/SearchBar.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import Modal from "../../components/Modal.jsx";
import { formatDate, formatTime } from "../../utils/helpers.js";

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    api.get("/events?sort=newest").then((res) => setEvents(res.data.data.events));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 15, sort };
    if (search) params.search = search;
    if (eventFilter !== "all") params.eventId = eventFilter;
    if (yearFilter !== "all") params.year = yearFilter;
    api
      .get("/registrations", { params })
      .then((res) => {
        setRegistrations(res.data.data.registrations);
        setPagination(res.data.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [search, eventFilter, yearFilter, sort, page]);

  const colleges = [...new Set(registrations.map((r) => r.college))].filter(Boolean);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Registrations</h1>
        <p className="text-sm text-gray-500">{pagination.total} total registrations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, or college..." /></div>
        <div className="flex gap-3 flex-wrap">
          <select value={eventFilter} onChange={(e) => { setEventFilter(e.target.value); setPage(1); }} className="input-field">
            <option value="all">All Events</option>
            {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setPage(1); }} className="input-field">
            <option value="all">All Years</option>
            {["1st","2nd","3rd","4th","5th","PG"].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">By Name</option>
          </select>
        </div>
      </div>

      {loading ? <LoadingSpinner text="Loading registrations..." /> : registrations.length === 0 ? (
        <div className="mt-12"><EmptyState title="No registrations found" description="Try adjusting your filters." /></div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="mt-6 hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">College</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {registrations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setDetail(r)}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{r.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{r.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{r.college}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{r.year}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{r.event?.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mt-6 space-y-3 md:hidden">
            {registrations.map((r) => (
              <div key={r.id} className="card p-4 cursor-pointer" onClick={() => setDetail(r)}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{r.name}</p>
                    <p className="text-sm text-gray-500">{r.email}</p>
                  </div>
                  <span className="badge bg-gray-100 text-gray-600">{r.year}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{r.college} &middot; {r.event?.name}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${p === page ? "bg-brand-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Registration Details">
        {detail && (
          <div className="space-y-3">
            <Field label="Name" value={detail.name} />
            <Field label="Email" value={detail.email} />
            <Field label="College" value={detail.college} />
            <Field label="Year" value={detail.year} />
            <Field label="Phone" value={detail.phone} />
            <Field label="Event" value={detail.event?.name} />
            <Field label="Event Date" value={detail.event ? `${formatDate(detail.event.date)} at ${formatTime(detail.event.time)}` : ""} />
            <Field label="Registered On" value={formatDate(detail.createdAt)} />
          </div>
        )}
      </Modal>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex items-baseline justify-between border-b border-gray-100 py-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
