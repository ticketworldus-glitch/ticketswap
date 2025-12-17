// src/pages/admin/AdminOrders.jsx
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Gift,
  Bitcoin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  BadgeDollarSign,
} from "lucide-react";

function formatDateTime(value) {
  if (!value) return "N/A";
  try {
    // Firestore Timestamp
    if (typeof value.toDate === "function") {
      return value.toDate().toLocaleString();
    }
    // JS Date
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    // Fallback string
    return String(value);
  } catch {
    return "N/A";
  }
}

function PaymentMethodBadge({ method }) {
  const base =
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold";

  if (method === "gift-card") {
    return (
      <span className={`${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200`}>
        <Gift className="w-3 h-3" />
        Gift card
      </span>
    );
  }

  if (method === "crypto") {
    return (
      <span className={`${base} bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200`}>
        <Bitcoin className="w-3 h-3" />
        Crypto
      </span>
    );
  }

  if (method === "card") {
    return (
      <span className={`${base} bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200`}>
        <CreditCard className="w-3 h-3" />
        Card
      </span>
    );
  }

  return (
    <span className={`${base} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200`}>
      <BadgeDollarSign className="w-3 h-3" />
      {method || "Unknown"}
    </span>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const snap = await getDocs(collection(db, "orders"));
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const markAsPaid = async (order) => {
    if (!order) return;
    if (!window.confirm("Mark this order as paid and mark tickets sold?"))
      return;

    setUpdatingId(order.id);
    try {
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, {
        status: "paid",
        paidAt: serverTimestamp(),
      });

      const ticketIds = order.tickets || [];
      for (const ticketId of ticketIds) {
        const tRef = doc(db, "tickets", ticketId);
        await updateDoc(tRef, {
          status: "sold",
          updatedAt: serverTimestamp(),
        });
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: "paid" } : o
        )
      );
    } catch (err) {
      console.error("Mark paid error", err);
      alert("Failed to mark as paid. Check console for details.");
    } finally {
      setUpdatingId(null);
    }
  };

  const renderPaymentDetails = (order) => {
    const method = order.paymentMethod;

    // Gift card fields
    if (method === "gift-card") {
      return (
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Gift card details
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Code:{" "}
            <span className="font-mono">
              {order.giftCardCode || "N/A"}
            </span>
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Note: {order.giftCardNote || "N/A"}
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Uploaded image: {order.giftCardImageName || "None"}
          </p>
        </div>
      );
    }

    // Crypto fields
    if (method === "crypto") {
      return (
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Crypto payment details
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Network: {order.cryptoNetwork || "N/A"}
          </p>
          <p className="text-slate-600 dark:text-slate-300 break-all">
            Wallet address: {order.cryptoAddress || "N/A"}
          </p>
          <p className="text-slate-600 dark:text-slate-300 break-all">
            Tx / reference: {order.cryptoTxHash || order.cryptoReference || "N/A"}
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Note: {order.cryptoNote || "N/A"}
          </p>
        </div>
      );
    }

    // Card fields
    if (method === "card") {
      return (
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Card payment details
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Card brand: {order.cardBrand || "N/A"}
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Last 4:{" "}
            {order.cardLast4 ? `**** **** **** ${order.cardLast4}` : "N/A"}
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Expiry:{" "}
            {order.cardExpMonth && order.cardExpYear
              ? `${order.cardExpMonth}/${order.cardExpYear}`
              : "N/A"}
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Card holder: {order.cardHolderName || "N/A"}
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Note: {order.cardNote || "N/A"}
          </p>
        </div>
      );
    }

    // Fallback for unknown method
    return (
      <div className="space-y-1 text-xs">
        <p className="font-semibold text-slate-900 dark:text-slate-100">
          Payment details
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          Method: {method || "N/A"}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Admin – Orders (Test payments)
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Review pending test payments, inspect payment details, and mark
          them as paid to release tickets.
        </p>
      </header>

      {loading ? (
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Loading orders...
        </p>
      ) : orders.length === 0 ? (
        <p className="text-xs text-slate-600 dark:text-slate-400">
          No orders found.
        </p>
      ) : (
        <div className="space-y-2 text-xs">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm dark:bg-slate-900 dark:border-slate-800"
              >
                {/* TOP ROW */}
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      Order #{order.id.slice(0, 8)} • User:{" "}
                      <span className="font-mono">
                        {order.userId || "Unknown"}
                      </span>
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {order.tickets?.length || 0} ticket
                      {order.tickets?.length === 1 ? "" : "s"} • $
                      {Number(order.total || 0).toFixed(2)} •{" "}
                      Method:{" "}
                      <PaymentMethodBadge
                        method={order.paymentMethod}
                      />
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      Status:{" "}
                      <span className="font-semibold">
                        {order.status || "pending"}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        order.status === "paid"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
                      }`}
                    >
                      {order.status || "pending"}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId((prev) =>
                          prev === order.id ? null : order.id
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    >
                      {isExpanded ? (
                        <>
                          Hide details
                          <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          View details
                          <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>

                    {order.status !== "paid" && (
                      <button
                        type="button"
                        onClick={() => markAsPaid(order)}
                        disabled={updatingId === order.id}
                        className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] disabled:opacity-50"
                      >
                        {updatingId === order.id
                          ? "Updating..."
                          : "Mark as paid"}
                      </button>
                    )}
                  </div>
                </div>

                {/* EXPANDED DETAILS */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 grid md:grid-cols-3 gap-3">
                    {/* Payment details */}
                    <div>{renderPaymentDetails(order)}</div>

                    {/* Tickets & event */}
                    <div className="space-y-1 text-xs">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        Tickets & event
                      </p>
                      <p className="text-slate-600 dark:text-slate-300">
                        Event ID:{" "}
                        <span className="font-mono">
                          {order.eventId || "N/A"}
                        </span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-300">
                        Ticket IDs:
                      </p>
                      {Array.isArray(order.tickets) &&
                      order.tickets.length > 0 ? (
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300">
                          {order.tickets.map((tid) => (
                            <li key={tid} className="font-mono text-[11px]">
                              {tid}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400">
                          None
                        </p>
                      )}
                    </div>

                    {/* Timestamps */}
                    <div className="space-y-1 text-xs">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        Timestamps
                      </p>
                      <p className="text-slate-600 dark:text-slate-300">
                        Created: {formatDateTime(order.createdAt)}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300">
                        Paid at: {formatDateTime(order.paidAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
