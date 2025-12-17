// // src/pages/seller/SellerDashboard.jsx
// import { useEffect, useMemo, useState } from "react";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "../../lib/firebase";
// import useAuth from "../../hooks/useAuth";
// import { Link } from "react-router-dom";

// export default function SellerDashboard() {
//   const { user } = useAuth();
//   const [tickets, setTickets] = useState([]);

//   useEffect(() => {
//     if (!user) return;

//     const fetchTickets = async () => {
//       const qTickets = query(
//         collection(db, "tickets"),
//         where("sellerId", "==", user.uid)
//       );
//       const snap = await getDocs(qTickets);
//       setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     };

//     fetchTickets();
//   }, [user]);

//   const stats = useMemo(() => {
//     const total = tickets.length;
//     const active = tickets.filter((t) => t.status === "active").length;
//     const pending = tickets.filter((t) => t.status === "pending").length;
//     const sold = tickets.filter((t) => t.status === "sold").length;
//     const earnings = tickets
//       .filter((t) => t.status === "sold")
//       .reduce((sum, t) => sum + (Number(t.price) || 0), 0);
//     return { total, active, pending, sold, earnings };
//   }, [tickets]);

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
//       <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-semibold">Seller Dashboard</h1>
//           <p className="text-xs text-slate-400">
//             Overview of your listings and sales.
//           </p>
//         </div>
//         <div className="flex gap-2 text-xs">
//           <Link
//             to="/seller/add-ticket"
//             className="px-4 py-2 rounded-full bg-emerald-600 font-medium"
//           >
//             Add Ticket
//           </Link>
//           <Link
//             to="/seller/my-tickets"
//             className="px-4 py-2 rounded-full bg-slate-800"
//           >
//             Manage Tickets
//           </Link>
//         </div>
//       </header>

//       <section className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
//         <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
//           <p className="text-slate-400">Total listings</p>
//           <p className="text-xl font-semibold mt-1">{stats.total}</p>
//         </div>
//         <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
//           <p className="text-slate-400">Active</p>
//           <p className="text-xl font-semibold mt-1">{stats.active}</p>
//         </div>
//         <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
//           <p className="text-slate-400">Pending</p>
//           <p className="text-xl font-semibold mt-1">{stats.pending}</p>
//         </div>
//         <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
//           <p className="text-slate-400">Sold earnings</p>
//           <p className="text-xl font-semibold mt-1">
//             ${stats.earnings.toFixed(2)}
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// }


























// src/pages/seller/SellerDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchTickets = async () => {
      const qTickets = query(
        collection(db, "tickets"),
        where("sellerId", "==", user.uid)
      );
      const snap = await getDocs(qTickets);
      setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    fetchTickets();
  }, [user]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const active = tickets.filter((t) => t.status === "active").length;
    const pending = tickets.filter((t) => t.status === "pending").length;
    const sold = tickets.filter((t) => t.status === "sold").length;
    const earnings = tickets
      .filter((t) => t.status === "sold")
      .reduce((sum, t) => sum + (Number(t.price) || 0), 0);
    return { total, active, pending, sold, earnings };
  }, [tickets]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Seller Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Overview of your listings and sales.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <Link
            to="/seller/add-ticket"
            className="rounded-full bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            Add Ticket
          </Link>
          <Link
            to="/seller/my-tickets"
            className="rounded-full bg-white px-4 py-2 font-medium text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Manage Tickets
          </Link>
        </div>
      </header>

      <section className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm dark:bg-slate-950 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Total listings</p>
          <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
            {stats.total}
          </p>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm dark:bg-slate-950 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Active</p>
          <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
            {stats.active}
          </p>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm dark:bg-slate-950 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Pending</p>
          <p className="mt-1 text-xl font-semibold text-amber-600 dark:text-amber-300">
            {stats.pending}
          </p>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm dark:bg-slate-950 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Sold earnings</p>
          <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
            ${stats.earnings.toFixed(2)}
          </p>
        </div>
      </section>
    </div>
  );
}
