import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import Register from "./pages/Register.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageEvents from "./pages/admin/ManageEvents.jsx";
import Registrations from "./pages/admin/Registrations.jsx";
import ProtectedRoute from "./pages/admin/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
        <Route path="/events/:id" element={<PublicLayout><EventDetails /></PublicLayout>} />
        <Route path="/events/:eventId/register" element={<PublicLayout><Register /></PublicLayout>} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="registrations" element={<Registrations />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
