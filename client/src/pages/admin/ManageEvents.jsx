import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, Star } from "lucide-react";
import api from "../../services/api.js";
import Modal from "../../components/Modal.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { useToast } from "../../components/Toast.jsx";
import { formatDate, formatTime } from "../../utils/helpers.js";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const loadEvents = () => {
    api.get("/events?sort=newest").then((res) => setEvents(res.data.data.events)).finally(() => setLoading(false));
  };

  useEffect(() => { loadEvents(); }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/events/${deleteId}`);
      setEvents(events.filter((e) => e.id !== deleteId));
      setDeleteId(null);
      toast.success("Event deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const toggleFeatured = async (event) => {
    try {
      await api.put(`/events/${event.id}`, { isFeatured: !event.isFeatured });
      loadEvents();
      toast.success(event.isFeatured ? "Removed from featured" : "Marked as featured");
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
          <p className="text-sm text-gray-500">Create, edit, and delete events</p>
        </div>
        <button onClick={() => { setEditEvent(null); setShowForm(true); }} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Event
        </button>
      </div>

      {loading ? <LoadingSpinner text="Loading events..." /> : events.length === 0 ? (
        <EmptyState title="No events yet" description="Create your first event to get started." action={<button onClick={() => setShowForm(true)} className="btn-primary text-sm">Create Event</button>} />
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">{event.name}</h3>
                  <StatusBadge event={event} />
                  <span className="badge bg-gray-100 text-gray-600">{event.category}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {formatDate(event.date)} at {formatTime(event.time)} &middot; {event.venue}
                </p>
                <p className="mt-1 text-sm text-gray-400">{event.registrationCount || 0} registrations</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleFeatured(event)} title="Toggle featured" className={`rounded-lg p-2 transition-colors ${event.isFeatured ? "text-yellow-500 hover:bg-yellow-50" : "text-gray-400 hover:bg-gray-100"}`}>
                  {event.isFeatured ? <Star className="h-4 w-4 fill-current" /> : <Star className="h-4 w-4" />}
                </button>
                <Link to={`/events/${event.id}`} title="View" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <Eye className="h-4 w-4" />
                </Link>
                <button onClick={() => { setEditEvent(event); setShowForm(true); }} title="Edit" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-brand-600">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => setDeleteId(event.id)} title="Delete" className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Form Modal */}
      <EventFormModal open={showForm} onClose={() => { setShowForm(false); setEditEvent(null); }} editEvent={editEvent} onSaved={() => { setShowForm(false); setEditEvent(null); loadEvents(); toast.success(editEvent ? "Event updated" : "Event created"); }} />

      {/* Delete Confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Event">
        <p className="text-sm text-gray-600">Are you sure you want to delete this event? All registrations will also be removed. This action cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger text-sm">{deleting ? "Deleting..." : "Delete"}</button>
        </div>
      </Modal>
    </div>
  );
}

function EventFormModal({ open, onClose, editEvent, onSaved }) {
  const isEdit = !!editEvent;
  const [form, setForm] = useState({
    name: "", category: "Technical", description: "", date: "", time: "10:00",
    venue: "", imageUrl: "", registrationDeadline: "", capacity: 100, isFeatured: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editEvent) {
      setForm({
        name: editEvent.name,
        category: editEvent.category,
        description: editEvent.description,
        date: editEvent.date?.split("T")[0] || "",
        time: editEvent.time || "10:00",
        venue: editEvent.venue,
        imageUrl: editEvent.imageUrl || "",
        registrationDeadline: editEvent.registrationDeadline?.split("T")[0] || "",
        capacity: editEvent.capacity,
        isFeatured: editEvent.isFeatured,
      });
    } else {
      setForm({ name: "", category: "Technical", description: "", date: "", time: "10:00", venue: "", imageUrl: "", registrationDeadline: "", capacity: 100, isFeatured: false });
    }
  }, [editEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEdit) {
        await api.put(`/events/${editEvent.id}`, form);
      } else {
        await api.post("/events", form);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const field = (label, name, type = "text", required = true) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {type === "textarea" ? (
        <textarea name={name} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} required={required} className="input-field" rows={3} />
      ) : type === "select" ? (
        <select name={name} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} className="input-field">
          <option>Technical</option><option>Cultural</option><option>Sports</option><option>Workshop</option><option>Seminar</option><option>Competition</option><option>Other</option>
        </select>
      ) : (
        <input type={type} name={name} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} required={required} className="input-field" />
      )}
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Event" : "Add New Event"} maxWidth="max-w-2xl">
      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {field("Event Name", "name")}
          {field("Category", "category", "select")}
        </div>
        {field("Description", "description", "textarea")}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("Date", "date", "date")}
          {field("Time", "time", "time")}
        </div>
        {field("Venue", "venue")}
        {field("Image URL (optional)", "imageUrl", "text", false)}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("Registration Deadline", "registrationDeadline", "date")}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Capacity</label>
            <input type="number" name="capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 0 })} min={1} className="input-field" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          Featured Event
        </label>
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary text-sm">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Saving..." : isEdit ? "Update Event" : "Create Event"}</button>
        </div>
      </form>
    </Modal>
  );
}
