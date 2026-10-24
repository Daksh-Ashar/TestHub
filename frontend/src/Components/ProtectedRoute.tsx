import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import type { User } from "../Types/auth.type";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: User["role"];
}

const ProtectedRoute = ({
  children,
  allowedRole,
}: ProtectedRouteProps) => {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    return <Navigate to="/auth" replace />;
  }

  // Role Check
  if (allowedRole && auth.user.role !== allowedRole) {
    // Redirect to dashboard based on role type
    if (auth.user.role === "creator") {
      return <Navigate to="/creator" replace />;
    } else {
      return <Navigate to="/participant" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;