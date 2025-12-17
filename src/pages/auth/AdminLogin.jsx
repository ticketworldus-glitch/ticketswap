// // src/pages/auth/AdminLogin.jsx
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { auth, db } from "../../lib/firebase";
// import { doc, getDoc } from "firebase/firestore";

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const cred = await signInWithEmailAndPassword(
//         auth,
//         form.email,
//         form.password
//       );

//       const userRef = doc(db, "users", cred.user.uid);
//       const snap = await getDoc(userRef);
//       const data = snap.exists() ? snap.data() : null;

//       const isAdmin =
//         data &&
//         (data.role === "admin" || data.isAdmin === true);

//       if (!isAdmin) {
//         await signOut(auth);
//         setError("This account is not an admin. Access denied.");
//         setLoading(false);
//         return;
//       }

//       navigate("/admin", { replace: true });
//     } catch (err) {
//       console.error(err);
//       setError("Invalid credentials or not an admin account.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
//         <div className="space-y-1 text-center">
//           <h1 className="text-xl font-semibold">Admin login</h1>
//           <p className="text-xs text-slate-400">
//             Restricted access to event and ticket management.
//           </p>
//         </div>

//         {error && (
//           <div className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded px-3 py-2">
//             {error}
//           </div>
//         )}

//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <div className="space-y-1 text-xs">
//             <label className="block text-slate-300">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="admin@example.com"
//               value={form.email}
//               onChange={handleChange}
//               required
//               className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs"
//             />
//           </div>

//           <div className="space-y-1 text-xs">
//             <label className="block text-slate-300">Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Your password"
//               value={form.password}
//               onChange={handleChange}
//               required
//               className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full mt-2 px-4 py-2 rounded-full bg-emerald-600 text-xs font-medium disabled:opacity-50"
//           >
//             {loading ? "Checking role..." : "Log in as admin"}
//           </button>
//         </form>

//         <p className="text-xs text-slate-400 text-center">
//           Fans and buyers should{" "}
//           <Link
//             to="/auth/login"
//             className="text-emerald-400 hover:underline"
//           >
//             log in here
//           </Link>
//           .
//         </p>
//       </div>
//     </div>
//   );
// }
































// src/pages/auth/AdminLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const userRef = doc(db, "users", cred.user.uid);
      const snap = await getDoc(userRef);
      const data = snap.exists() ? snap.data() : null;

      const isAdmin =
        data && (data.role === "admin" || data.isAdmin === true);

      if (!isAdmin) {
        await signOut(auth);
        setError("This account is not an admin. Access denied.");
        setLoading(false);
        return;
      }

      navigate("/admin", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or not an admin account.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <motion.div
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm dark:bg-slate-900 dark:border-slate-800"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Admin login
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Restricted access to event and ticket management.
          </p>
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 dark:bg-red-950/40 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1 text-xs">
            <label className="block text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs outline-none focus:border-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="block text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs outline-none focus:border-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-4 py-2 rounded-full bg-emerald-600 text-xs font-medium text-white disabled:opacity-50"
          >
            {loading ? "Checking role..." : "Log in as admin"}
          </button>
        </form>

        <p className="text-xs text-slate-600 text-center dark:text-slate-400">
          Fans and buyers should{" "}
          <Link
            to="/auth/login"
            className="text-emerald-600 hover:underline dark:text-emerald-400"
          >
            log in here
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
}
