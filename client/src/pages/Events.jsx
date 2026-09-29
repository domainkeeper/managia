import { useState, useEffect } from "react";
import api from "../services/api.js";
import EventCard from "../components/EventCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const SORT_OPTIONS = [
  { value: "upcoming", label: "Upcoming First" },
  { value: "newest", label: "Latest Added" },
  { value: "date-asc", label: "Date Ascending" },
];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/events/categories").then((res) => setCategories(res.data.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { sort };
    if (search) params.search = search;
    if (category !== "all") params.category = category;
    api
      .get("/events", { params })
      .then((res) => setEvents(res.data.data.events))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Events</h1>
        <p className="mt-2 text-gray-600">Discover and register for upcoming events</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="flex gap-3">
          <CategoryFilter categories={categories} value={category} onChange={setCategory} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field w-full sm:w-auto"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner text="Loading events..." />
      ) : events.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="No events found"
            description="Try adjusting your search or filters to find what you're looking for."
            action={
              <button
                onClick={() => { setSearch(""); setCategory("all"); }}
                className="btn-secondary text-sm"
              >
                Clear Filters
              </button>
            }
          />
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-gray-500">{events.length} event{events.length !== 1 ? "s" : ""} found</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
