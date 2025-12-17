// src/hooks/useRoleGuard.js
import useAuth from "./useAuth";

export default function useRoleGuard(requiredRoles = []) {
  const { profile } = useAuth();
  if (!profile) return false;
  if (requiredRoles.length === 0) return true;
  return requiredRoles.includes(profile.role);
}
