import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Calendar, Clock, MapPin, CheckCircle, ArrowLeft } from "lucide-react";
import api from "../services/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { formatDate, formatTime } from "../utils/helpers.js";

export default function Register() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [serverError, setServerError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    api.get(`/events/${eventId}`)
      .then((res) => setEvent(res.data.data.event))
      .catch(() => navigate("/events"))
      .finally(() => setLoading(false));
  }, [eventId, navigate]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await api.post(`/events/${eventId}/register`, data);
      setSuccess(res.data.data.message || "Registration successful!");
    } catch (err) {
      setServerError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading event..." />;
  if (!event) return null;

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="card p-8">
          <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Registration Successful!</h2>
          <p className="mt-2 text-gray-600">{success}</p>
          <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            <p className="font-semibold">{event.name}</p>
            <p>{formatDate(event.date)} at {formatTime(event.time)}</p>
            <p>{event.venue}</p>
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <Link to={`/events/${event.id}`} className="btn-secondary">View Event</Link>
            <Link to="/events" className="btn-primary">Browse More Events</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to={`/events/${event.id}`} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Back to Event
      </Link>

      <div className="mb-6 card p-4">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-brand-100 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-brand-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{event.name}</h2>
            <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDate(event.date)} at {formatTime(event.time)}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.venue}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Register for {event.name}</h1>

        {serverError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{serverError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Full Name" error={errors.name}>
            <input {...register("name", { required: "Full name is required" })} className="input-field" placeholder="John Doe" />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
              })}
              type="email"
              className="input-field"
              placeholder="john@college.edu"
            />
          </Field>
          <Field label="College" error={errors.college}>
            <input {...register("college", { required: "College is required" })} className="input-field" placeholder="College of Engineering" />
          </Field>
          <Field label="Year" error={errors.year}>
            <select {...register("year", { required: "Year is required" })} className="input-field">
              <option value="">Select year</option>
              <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option><option>5th</option><option>PG</option>
            </select>
          </Field>
          <Field label="Phone Number" error={errors.phone}>
            <input
              {...register("phone", {
                required: "Phone is required",
                validate: (v) => v.replace(/\D/g, "").length >= 7 || "Phone must have at least 7 digits",
              })}
              className="input-field"
              placeholder="9876543210"
            />
          </Field>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Registering..." : "Submit Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}
