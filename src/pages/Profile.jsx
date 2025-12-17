// // src/pages/Profile.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import { db } from "../lib/firebase";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   orderBy,
// } from "firebase/firestore";

// export default function Profile() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user) return;
//     const fetchOrders = async () => {
//       const q = query(
//         collection(db, "orders"),
//         where("userId", "==", user.uid),
//         orderBy("createdAt", "desc")
//       );
//       const snap = await getDocs(q);
//       setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//       setLoading(false);
//     };
//     fetchOrders();
//   }, [user]);

//   if (!user) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
//         <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
//           My profile
//         </h1>
//         <p className="text-sm text-slate-700 dark:text-slate-300">
//           You need to be logged in to see your purchases.
//         </p>
//         <button
//           onClick={() =>
//             navigate("/auth/login", { state: { from: "/profile" } })
//           }
//           className="px-4 py-2 rounded-full bg-emerald-600 text-sm font-medium text-white"
//         >
//           Log in
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
//       <header className="space-y-1">
//         <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
//           My profile
//         </h1>
//         <p className="text-xs text-slate-600 dark:text-slate-400">
//           View your test purchases and their status.
//         </p>
//       </header>

//       <section className="bg-white border border-slate-200 rounded-xl p-4 text-xs shadow-sm dark:bg-slate-900 dark:border-slate-800">
//         <div className="grid md:grid-cols-2 gap-3">
//           <div>
//             <p className="text-slate-500 dark:text-slate-400">Email</p>
//             <p className="text-slate-900 dark:text-slate-100">
//               {user.email}
//             </p>
//           </div>
//         </div>
//       </section>

//       <section>
//         <h2 className="text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100">
//           My orders
//         </h2>
//         {loading ? (
//           <p className="text-xs text-slate-600 dark:text-slate-400">
//             Loading orders...
//           </p>
//         ) : orders.length === 0 ? (
//           <p className="text-xs text-slate-600 dark:text-slate-400">
//             You have not placed any test orders yet.
//           </p>
//         ) : (
//           <div className="space-y-2 text-xs">
//             {orders.map((order) => (
//               <div
//                 key={order.id}
//                 className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm dark:bg-slate-900 dark:border-slate-800"
//               >
//                 <div className="flex items-center justify-between gap-2">
//                   <div>
//                     <p className="font-semibold text-slate-900 dark:text-slate-100">
//                       Order #{order.id.slice(0, 8)}
//                     </p>
//                     <p className="text-slate-500 dark:text-slate-400">
//                       {order.tickets?.length || 0} ticket
//                       {order.tickets?.length === 1 ? "" : "s"} • $
//                       {(order.total || 0).toFixed(2)} • Method:{" "}
//                       {order.paymentMethod || "N/A"}
//                     </p>
//                   </div>
//                   <span
//                     className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
//                       order.status === "paid"
//                         ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
//                         : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
//                     }`}
//                   >
//                     {order.status || "pending"}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }













// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  ChevronDown,
  Ticket as TicketIcon,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [ticketMap, setTicketMap] = useState({});
  const [eventMap, setEventMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrdersAndDetails = async () => {
      setLoading(true);
      try {
        // Fetch all orders for this user
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const orderList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(orderList);

        // Collect unique ticket IDs & event IDs from orders
        const ticketIds = new Set();
        const eventIds = new Set();

        orderList.forEach((o) => {
          (o.tickets || []).forEach((tid) => ticketIds.add(tid));
          if (o.eventId) eventIds.add(o.eventId);
        });

        // Fetch ticket docs
        const ticketEntries = {};
        await Promise.all(
          Array.from(ticketIds).map(async (tid) => {
            try {
              const tRef = doc(db, "tickets", tid);
              const tSnap = await getDoc(tRef);
              if (tSnap.exists()) {
                ticketEntries[tid] = { id: tSnap.id, ...tSnap.data() };
              }
            } catch (err) {
              console.error("Error fetching ticket", tid, err);
            }
          })
        );

        // Fetch event docs
        const eventEntries = {};
        await Promise.all(
          Array.from(eventIds).map(async (eid) => {
            try {
              const eRef = doc(db, "events", eid);
              const eSnap = await getDoc(eRef);
              if (eSnap.exists()) {
                eventEntries[eid] = { id: eSnap.id, ...eSnap.data() };
              }
            } catch (err) {
              console.error("Error fetching event", eid, err);
            }
          })
        );

        setTicketMap(ticketEntries);
        setEventMap(eventEntries);
      } catch (err) {
        console.error("Error loading orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndDetails();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          My profile
        </h1>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          You need to be logged in to see your purchases.
        </p>
        <button
          onClick={() =>
            navigate("/auth/login", { state: { from: "/profile" } })
          }
          className="px-4 py-2 rounded-full bg-emerald-600 text-sm font-medium text-white"
        >
          Log in
        </button>
      </div>
    );
  }

  const getStatusStyles = (status) => {
    if (status === "paid") {
      return {
        pill:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        label: "Paid",
      };
    }
    if (status === "rejected") {
      return {
        pill:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        label: "Rejected",
      };
    }
    return {
      pill:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
      icon: <Clock className="w-3.5 h-3.5" />,
      label: "Pending review",
    };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          My profile
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          View your test purchases, their status, and detailed ticket info.
        </p>
      </header>

      {/* USER INFO */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 text-xs shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Email</p>
            <p className="text-slate-900 dark:text-slate-100">
              {user.email}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">
              Total orders (test)
            </p>
            <p className="text-slate-900 dark:text-slate-100">
              {orders.length}
            </p>
          </div>
        </div>
      </section>

      {/* ORDERS ACCORDION */}
      <section>
        <h2 className="text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100">
          My orders
        </h2>

        {loading ? (
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Loading orders...
          </p>
        ) : orders.length === 0 ? (
          <p className="text-xs text-slate-600 dark:text-slate-400">
            You have not placed any test orders yet.
          </p>
        ) : (
          <div className="space-y-3 text-xs">
            {orders.map((order) => {
              const statusInfo = getStatusStyles(order.status);
              const createdAt =
                order.createdAt && order.createdAt.toDate
                  ? order.createdAt.toDate()
                  : null;

              const event = order.eventId
                ? eventMap[order.eventId] || null
                : null;

              const totalTickets = (order.tickets || []).length;
              const isOpen = openOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm dark:bg-slate-900 dark:border-slate-800"
                >
                  {/* ORDER HEADER (TOGGLE) */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenOrderId((prev) =>
                        prev === order.id ? null : order.id
                      )
                    }
                    className="w-full flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="flex items-start gap-3 text-left">
                      {/* Icon bubble (desktop) */}
                      <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <TicketIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400">
                          {event
                            ? `${event.artistName || ""}${
                                event.artistName && event.eventName ? " — " : ""
                              }${event.eventName || ""}`
                            : "Event details not available"}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {totalTickets} ticket
                          {totalTickets === 1 ? "" : "s"} • $
                          {(order.total || 0).toFixed(2)} •{" "}
                          {createdAt
                            ? createdAt.toLocaleString()
                            : "Date not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusInfo.pill}`}
                      >
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  {/* ORDER BODY (ACCORDION CONTENT) */}
                  {isOpen && (
                    <div className="border-t border-slate-200 px-4 py-3 space-y-4 dark:border-slate-800">
                      {/* Ticket details */}
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Tickets
                        </p>
                        {(order.tickets || []).length === 0 ? (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            No ticket details stored for this order.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {order.tickets.map((tid) => {
                              const t = ticketMap[tid];

                              if (!t) {
                                return (
                                  <div
                                    key={tid}
                                    className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500 dark:bg-slate-900/60 dark:text-slate-300"
                                  >
                                    <span>Ticket ID: {tid}</span>
                                    <span>Details unavailable</span>
                                  </div>
                                );
                              }

                              const seatLabel =
                                t.section || t.row || t.seatNumber
                                  ? [t.section, t.row, t.seatNumber]
                                      .filter(Boolean)
                                      .join(" • ")
                                  : t.seatDescription || "General admission";

                              const qty = Number(t.ticketCount || 1);
                              const price = Number(t.price || 0);
                              const lineTotal = qty * price;

                              return (
                                <div
                                  key={tid}
                                  className="flex justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
                                >
                                  <div className="space-y-0.5">
                                    <p className="font-semibold">
                                      {t.locationName || "Ticket"}
                                    </p>
                                    <p className="text-slate-500 dark:text-slate-400">
                                      {seatLabel}
                                    </p>
                                    {Array.isArray(t.locationDates) &&
                                      t.locationDates.length > 0 && (
                                        <p className="text-slate-400 dark:text-slate-500">
                                          {t.locationDates.join(" · ")}
                                        </p>
                                      )}
                                  </div>
                                  <div className="text-right space-y-0.5">
                                    <p className="text-slate-500 dark:text-slate-400">
                                      {qty} × ${price.toFixed(2)}
                                    </p>
                                    <p className="font-semibold">
                                      ${lineTotal.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Payment + admin message */}
                      <div className="grid gap-3 md:grid-cols-2">
                        {/* Payment info */}
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Payment
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-200">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              <CreditCard className="w-3.5 h-3.5" />
                            </span>
                            <div className="space-y-0.5">
                              <p className="font-semibold">
                                {order.paymentMethod || "Method not specified"}
                              </p>
                              <p className="text-slate-500 dark:text-slate-400">
                                Total: ${(order.total || 0).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {order.giftCardCode && (
                            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                              Gift card code (test):{" "}
                              <span className="font-mono">
                                {order.giftCardCode}
                              </span>
                            </p>
                          )}

                          {order.giftCardImageName && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              Uploaded gift card image:{" "}
                              <span className="font-medium">
                                {order.giftCardImageName}
                              </span>
                            </p>
                          )}
                        </div>

                        {/* Admin message */}
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Admin message
                          </p>
                          {order.adminNote || order.adminMessage ? (
                            <div className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                              {order.adminNote || order.adminMessage}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              No message from admin yet. If your order is
                              <span className="font-semibold"> pending</span>,
                              it’s still under review.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
