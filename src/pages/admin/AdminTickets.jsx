// src/pages/admin/AdminTickets.jsx
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const snap = await getDocs(collection(db, "tickets"));
      setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchTickets();
  }, []);

  const updateStatus = async (ticketId, status) => {
    const ref = doc(db, "tickets", ticketId);
    await updateDoc(ref, { status });
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
        Admin – Tickets
      </h1>

      <div className="space-y-2">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex justify-between items-center shadow-sm dark:bg-slate-900 dark:border-slate-800"
          >
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Event: {t.eventId} — {t.section} / {t.row} / {t.seatNumber}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seller: {t.sellerId} • {t.seatType} • ${t.price}
              </p>
              <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                Status:{" "}
                <span className="uppercase font-semibold text-emerald-600 dark:text-emerald-400">
                  {t.status}
                </span>
              </p>
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => updateStatus(t.id, "active")}
                className="px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(t.id, "rejected")}
                className="px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



































































// // src/pages/admin/AdminTickets.jsx
// import { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "../../lib/firebase";

// export default function AdminTickets() {
//   const [tickets, setTickets] = useState([]);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       const snap = await getDocs(collection(db, "tickets"));
//       setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     };
//     fetchTickets();
//   }, []);

//   const updateStatus = async (ticketId, status) => {
//     const ref = doc(db, "tickets", ticketId);
//     await updateDoc(ref, { status });
//     setTickets((prev) =>
//       prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
//     );
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
//       <h1 className="text-2xl font-semibold">Admin – Tickets</h1>
//       <div className="space-y-2">
//         {tickets.map((t) => (
//           <div
//             key={t.id}
//             className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 flex justify-between items-center"
//           >
//             <div>
//               <p className="text-sm font-medium">
//                 Event: {t.eventId} — {t.section} / {t.row} / {t.seatNumber}
//               </p>
//               <p className="text-xs text-slate-400">
//                 Seller: {t.sellerId} • {t.seatType} • ${t.price}
//               </p>
//               <p className="text-xs mt-1">
//                 Status:{" "}
//                 <span className="uppercase text-emerald-400">{t.status}</span>
//               </p>
//             </div>
//             <div className="flex gap-2 text-xs">
//               <button
//                 onClick={() => updateStatus(t.id, "active")}
//                 className="px-3 py-1 rounded bg-emerald-600"
//               >
//                 Approve
//               </button>
//               <button
//                 onClick={() => updateStatus(t.id, "rejected")}
//                 className="px-3 py-1 rounded bg-red-600"
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
