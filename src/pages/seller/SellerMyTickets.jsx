// // src/pages/seller/SellerMyTickets.jsx
// import { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "../../lib/firebase";
// import useAuth from "../../hooks/useAuth";

// export default function SellerMyTickets() {
//   const { user } = useAuth();
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchTickets = async () => {
//     if (!user) return;
//     const qTickets = query(
//       collection(db, "tickets"),
//       where("sellerId", "==", user.uid)
//     );
//     const snap = await getDocs(qTickets);
//     setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchTickets();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this ticket?")) return;
//     await deleteDoc(doc(db, "tickets", id));
//     setTickets((prev) => prev.filter((t) => t.id !== id));
//   };

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
//       <h1 className="text-2xl font-semibold mb-2">My Tickets</h1>
//       {loading ? (
//         <p className="text-sm text-slate-300">Loading your tickets...</p>
//       ) : tickets.length === 0 ? (
//         <p className="text-sm text-slate-400">You have no tickets yet.</p>
//       ) : (
//         <div className="space-y-2">
//           {tickets.map((t) => (
//             <div
//               key={t.id}
//               className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 flex items-center justify-between text-xs"
//             >
//               <div>
//                 <p className="font-medium">
//                   {t.section}-{t.row}-{t.seatNumber} ({t.seatType})
//                 </p>
//                 <p className="text-slate-400 mt-1">
//                   Price: ${Number(t.price || 0).toFixed(2)}
//                 </p>
//                 <p className="text-slate-400">
//                   Status:{" "}
//                   <span className="uppercase text-emerald-400">
//                     {t.status}
//                   </span>
//                 </p>
//               </div>
//               <button
//                 onClick={() => handleDelete(t.id)}
//                 className="px-3 py-1 rounded bg-red-600 text-xs"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

















// src/pages/seller/SellerMyTickets.jsx
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import useAuth from "../../hooks/useAuth";

export default function SellerMyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    if (!user) return;
    const qTickets = query(
      collection(db, "tickets"),
      where("sellerId", "==", user.uid)
    );
    const snap = await getDocs(qTickets);
    setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    await deleteDoc(doc(db, "tickets", id));
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          My tickets
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage the tickets you&apos;ve listed for sale.
        </p>
      </header>

      {/* Content states */}
      {loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Loading your tickets...
        </p>
      ) : tickets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
          You haven&apos;t listed any tickets yet. Once you create a listing,
          it will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => {
            const price = Number(t.price || 0);
            const status = (t.status || "").toLowerCase();

            const statusClasses =
              status === "sold"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700"
                : status === "pending"
                ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700"
                : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";

            return (
              <div
                key={t.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs shadow-sm md:flex-row md:items-center md:justify-between dark:bg-slate-900 dark:border-slate-800"
              >
                {/* Left side: ticket info */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Section · Row · Seat
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {t.section || "Section"}-{t.row || "Row"}-
                    {t.seatNumber || "Seat"}{" "}
                    {t.seatType ? (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        ({t.seatType})
                      </span>
                    ) : null}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>
                      Price:{" "}
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        ${price.toFixed(2)}
                      </span>
                    </span>
                    {t.ticketCount && (
                      <span>
                        Quantity:{" "}
                        <span className="font-semibold">
                          {t.ticketCount}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side: status + actions */}
                <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold capitalize ${statusClasses}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {status || "unknown"}
                  </span>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-3 py-1 text-[11px] font-medium text-white shadow-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
