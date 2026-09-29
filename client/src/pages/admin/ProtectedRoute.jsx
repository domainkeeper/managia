import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner text="Checking authentication..." />
    </div>
  );

  if (!admin) return <Navigate to="/admin/login" replace />;

  return children;
}
