// src/hooks/useAuth.js
import { useAuthContext } from "../contexts/AuthContext";

export default function useAuth() {
  return useAuthContext();
}
