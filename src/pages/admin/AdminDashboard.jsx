// src/pages/admin/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const eventsSnap = await getDocs(collection(db, "events"));
      const ticketsSnap = await getDocs(collection(db, "tickets"));

      setUsers(usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setEvents(eventsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setTickets(ticketsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchAll();
  }, []);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const sellers = users.filter((u) => u.role === "seller").length;
    const admins = users.filter((u) => u.role === "admin").length;

    const totalEvents = events.length;

    const totalTickets = tickets.length;
    const pendingTickets = tickets.filter((t) => t.status === "pending").length;
    const activeTickets = tickets.filter((t) => t.status === "active").length;
    const soldTickets = tickets.filter((t) => t.status === "sold").length;

    return {
      totalUsers,
      sellers,
      admins,
      totalEvents,
      totalTickets,
      pendingTickets,
      activeTickets,
      soldTickets,
    };
  }, [users, events, tickets]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Overview of users, events and tickets.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            to="/admin/events"
            className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-800 shadow-sm hover:border-emerald-500/70 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
          >
            Manage Events
          </Link>
          <Link
            to="/admin/tickets"
            className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-800 shadow-sm hover:border-emerald-500/70 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
          >
            Manage Tickets
          </Link>
          {/* direct shortcuts to creation pages */}
          <Link
            to="/admin/events"
            className="px-4 py-2 rounded-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
          >
            Add Event
          </Link>
          <Link
            to="/seller/add-ticket"
            className="px-4 py-2 rounded-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
          >
            Add Ticket
          </Link>
        </div>
      </header>

      {/* STATS CARDS */}
      <section className="grid md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Users</p>
          <p className="text-2xl font-semibold mt-1 text-slate-900 dark:text-slate-50">
            {stats.totalUsers}
          </p>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Sellers: {stats.sellers} • Admins: {stats.admins}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Events</p>
          <p className="text-2xl font-semibold mt-1 text-slate-900 dark:text-slate-50">
            {stats.totalEvents}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Tickets</p>
          <p className="text-2xl font-semibold mt-1 text-slate-900 dark:text-slate-50">
            {stats.totalTickets}
          </p>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Pending: {stats.pendingTickets} • Active: {stats.activeTickets} •
            Sold: {stats.soldTickets}
          </p>
        </div>
      </section>
    </div>
  );
}














































// // src/pages/admin/AdminDashboard.jsx
// import { useEffect, useMemo, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../lib/firebase";
// import { Link } from "react-router-dom";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [tickets, setTickets] = useState([]);

//   useEffect(() => {
//     const fetchAll = async () => {
//       const usersSnap = await getDocs(collection(db, "users"));
//       const eventsSnap = await getDocs(collection(db, "events"));
//       const ticketsSnap = await getDocs(collection(db, "tickets"));

//       setUsers(usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
//       setEvents(eventsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
//       setTickets(ticketsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     };
//     fetchAll();
//   }, []);

//   const stats = useMemo(() => {
//     const totalUsers = users.length;
//     const sellers = users.filter((u) => u.role === "seller").length;
//     const admins = users.filter((u) => u.role === "admin").length;

//     const totalEvents = events.length;

//     const totalTickets = tickets.length;
//     const pendingTickets = tickets.filter((t) => t.status === "pending").length;
//     const activeTickets = tickets.filter((t) => t.status === "active").length;
//     const soldTickets = tickets.filter((t) => t.status === "sold").length;

//     return {
//       totalUsers,
//       sellers,
//       admins,
//       totalEvents,
//       totalTickets,
//       pendingTickets,
//       activeTickets,
//       soldTickets,
//     };
//   }, [users, events, tickets]);

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
//       <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
//           <p className="text-xs text-slate-400">
//             Overview of users, events and tickets.
//           </p>
//         </div>
//         <div className="flex gap-2 text-xs">
//           <Link
//             to="/admin/events"
//             className="px-4 py-2 rounded-full bg-slate-800"
//           >
//             Manage Events
//           </Link>
//           <Link
//             to="/admin/tickets"
//             className="px-4 py-2 rounded-full bg-slate-800"
//           >
//             Manage Tickets
//           </Link>
//         </div>
//       </header>

//       <section className="grid md:grid-cols-3 gap-4 text-xs">
//         <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
//           <p className="text-slate-400">Users</p>
//           <p className="text-2xl font-semibold mt-1">
//             {stats.totalUsers}
//           </p>
//           <p className="mt-2 text-slate-400">
//             Sellers: {stats.sellers} • Admins: {stats.admins}
//           </p>
//         </div>

//         <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
//           <p className="text-slate-400">Events</p>
//           <p className="text-2xl font-semibold mt-1">
//             {stats.totalEvents}
//           </p>
//         </div>

//         <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
//           <p className="text-slate-400">Tickets</p>
//           <p className="text-2xl font-semibold mt-1">
//             {stats.totalTickets}
//           </p>
//           <p className="mt-2 text-slate-400">
//             Pending: {stats.pendingTickets} • Active: {stats.activeTickets} •
//             Sold: {stats.soldTickets}
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// }
