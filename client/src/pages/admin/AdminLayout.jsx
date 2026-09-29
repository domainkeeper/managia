import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const NAV = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/events", icon: Calendar, label: "Events" },
  { to: "/admin/registrations", icon: Users, label: "Registrations" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <Link to="/admin/dashboard" className="font-bold text-brand-700">TechClub Admin</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden rounded p-1 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {NAV.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === to ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
              {admin?.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{admin?.name}</p>
              <p className="truncate text-xs text-gray-500">{admin?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:pl-64">
        <div className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Link to="/admin/dashboard" className="hover:text-gray-700">Admin</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-gray-900">
              {NAV.find((n) => pathname.startsWith(n.to))?.label || "Dashboard"}
            </span>
          </div>
          <div className="ml-auto">
            <Link to="/" target="_blank" className="text-sm text-gray-500 hover:text-gray-700">View Site</Link>
          </div>
        </div>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
