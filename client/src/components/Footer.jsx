import { Link } from "react-router-dom";
import { Calendar, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-white">
              <Calendar className="h-6 w-6 text-brand-400" />
              <span className="text-lg">TechClub</span>
            </div>
            <p className="mt-3 text-sm text-gray-400">
              Empowering students through technology, innovation, and community since 2018.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/events", label: "Events" },
                { to: "/admin/login", label: "Admin" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" /> techclub@college.edu
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" /> Building A, College Campus
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Follow Us</h3>
            <div className="mt-3 flex gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} TechClub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
