import { Link, useLocation } from "react-router-dom";
import { Menu, X, Calendar } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  const links = [
    { to: "/", label: "Home" },
    { to: "/events", label: "Events" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-brand-700">
          <Calendar className="h-7 w-7" />
          <span className="text-lg">TechClub</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-brand-600 ${
                pathname === l.to ? "text-brand-600" : "text-gray-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/events" className="btn-primary text-sm">
            Register Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 pt-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 ${
                pathname === l.to ? "text-brand-600" : "text-gray-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/events"
            onClick={() => setOpen(false)}
            className="btn-primary mt-2 block w-full text-center text-sm"
          >
            Register Now
          </Link>
        </div>
      )}
    </nav>
  );
}
