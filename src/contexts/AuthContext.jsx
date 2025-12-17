// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        // Firebase auth user
  const [profile, setProfile] = useState(null);  // Firestore user doc (with role)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(fbUser);

      try {
        const userRef = doc(db, "users", fbUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setProfile({ id: snap.id, ...snap.data() });
        } else {
          // fallback: treat as buyer if no profile doc yet
          setProfile({ id: fbUser.uid, role: "buyer", email: fbUser.email });
        }
      } catch (e) {
        console.error("Error fetching user profile", e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === "admin",
    isSeller: profile?.role === "seller",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
