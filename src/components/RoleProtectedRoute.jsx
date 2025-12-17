// src/components/RoleProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function hasRequiredRole(profile, roles) {
  if (!profile || !roles || roles.length === 0) return false;

  return roles.some((role) => {
    switch (role) {
      case "admin":
        return profile.role === "admin" || profile.isAdmin === true;
      case "seller":
        return profile.role === "seller" || profile.isSeller === true;
      case "buyer":
        return profile.role === "buyer" && !profile.isAdmin && !profile.isSeller;
      default:
        return profile.role === role;
    }
  });
}

export default function RoleProtectedRoute({ children, roles, redirectTo }) {
  const { user, profile, loading } = useAuth();
  const redirectPath = redirectTo || "/auth/login";

  if (loading) return null;

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  const allowed = hasRequiredRole(profile, roles);
  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}
