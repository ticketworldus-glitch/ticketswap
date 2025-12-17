// // // src/pages/auth/Login.jsx
// // import { useState } from "react";
// // import { useNavigate, Link, useLocation } from "react-router-dom";
// // import { signInWithEmailAndPassword } from "firebase/auth";
// // import { auth } from "../../lib/firebase";

// // export default function Login() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [form, setForm] = useState({ email: "", password: "" });
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const from = location.state?.from || "/";

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setForm((f) => ({ ...f, [name]: value }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setLoading(true);

// //     try {
// //       await signInWithEmailAndPassword(auth, form.email, form.password);
// //       navigate(from, { replace: true });
// //     } catch (err) {
// //       console.error(err);
// //       setError("Invalid email or password.");
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
// //       <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
// //         <div className="space-y-1 text-center">
// //           <h1 className="text-xl font-semibold">Fan login</h1>
// //           <p className="text-xs text-slate-400">
// //             Sign in to browse and manage your orders.
// //           </p>
// //         </div>

// //         {error && (
// //           <div className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded px-3 py-2">
// //             {error}
// //           </div>
// //         )}

// //         <form className="space-y-4" onSubmit={handleSubmit}>
// //           <div className="space-y-1 text-xs">
// //             <label className="block text-slate-300">Email</label>
// //             <input
// //               type="email"
// //               name="email"
// //               placeholder="you@example.com"
// //               value={form.email}
// //               onChange={handleChange}
// //               required
// //               className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs"
// //             />
// //           </div>

// //           <div className="space-y-1 text-xs">
// //             <label className="block text-slate-300">Password</label>
// //             <input
// //               type="password"
// //               name="password"
// //               placeholder="Your password"
// //               value={form.password}
// //               onChange={handleChange}
// //               required
// //               className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs"
// //             />
// //           </div>

// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="w-full mt-2 px-4 py-2 rounded-full bg-emerald-600 text-xs font-medium disabled:opacity-50"
// //           >
// //             {loading ? "Logging in..." : "Log in"}
// //           </button>
// //         </form>

// //         <p className="text-xs text-slate-400 text-center">
// //           No account yet?{" "}
// //           <Link
// //             to="/auth/register"
// //             className="text-emerald-400 hover:underline"
// //           >
// //             Sign up
// //           </Link>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

































// // src/pages/auth/Login.jsx
// import { useState } from "react";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../lib/firebase";
// import { motion } from "framer-motion";

// const fadeUp = {
//   hidden: { opacity: 0, y: 18 },
//   visible: { opacity: 1, y: 0 },
// };

// export default function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const from = location.state?.from || "/";

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       await signInWithEmailAndPassword(auth, form.email, form.password);
//       navigate(from, { replace: true });
//     } catch (err) {
//       console.error(err);
//       setError("Invalid email or password.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
//       <motion.div
//         className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm dark:bg-slate-900 dark:border-slate-800"
//         variants={fadeUp}
//         initial="hidden"
//         animate="visible"
//       >
//         <div className="space-y-1 text-center">
//           <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
//             Fan login
//           </h1>
//           <p className="text-xs text-slate-600 dark:text-slate-400">
//             Sign in to browse and manage your orders.
//           </p>
//         </div>

//         {error && (
//           <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 dark:bg-red-950/40 dark:border-red-800 dark:text-red-400">
//             {error}
//           </div>
//         )}

//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <div className="space-y-1 text-xs">
//             <label className="block text-slate-700 dark:text-slate-300">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               placeholder="you@example.com"
//               value={form.email}
//               onChange={handleChange}
//               required
//               className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs outline-none focus:border-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
//             />
//           </div>

//           <div className="space-y-1 text-xs">
//             <label className="block text-slate-700 dark:text-slate-300">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Your password"
//               value={form.password}
//               onChange={handleChange}
//               required
//               className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs outline-none focus:border-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full mt-2 px-4 py-2 rounded-full bg-emerald-600 text-xs font-medium text-white disabled:opacity-50"
//           >
//             {loading ? "Logging in..." : "Log in"}
//           </button>
//         </form>

//         <p className="text-xs text-slate-600 text-center dark:text-slate-400">
//           No account yet?{" "}
//           <Link
//             to="/auth/register"
//             className="text-emerald-600 hover:underline dark:text-emerald-400"
//           >
//             Sign up
//           </Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// }








































// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Ensure a user doc exists / is updated
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName || null,
          email: user.email || null,
          role: "buyer",
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const isBusy = loading || googleLoading;

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
            Fan login
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Sign in to browse and manage your orders.
          </p>
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 dark:bg-red-950/40 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Google sign-in */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isBusy}
            className="w-full flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            {/* Simple G icon circle */}
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-900 dark:bg-slate-800 dark:text-slate-100">
              G
            </span>
            {googleLoading ? "Signing in with Google..." : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-[10px] uppercase tracking-wide text-slate-400">
              or
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>

        {/* Email/password login */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1 text-xs">
            <label className="block text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              disabled={isBusy}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs outline-none focus:border-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 disabled:opacity-60"
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
              disabled={isBusy}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs outline-none focus:border-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="w-full mt-2 px-4 py-2 rounded-full bg-emerald-600 text-xs font-medium text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-xs text-slate-600 text-center dark:text-slate-400">
          No account yet?{" "}
          <Link
            to="/auth/register"
            className="text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
