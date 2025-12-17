// // src/pages/Checkout.jsx
// import { useLocation, useNavigate } from "react-router-dom";
// import { useMemo } from "react";
// import useAuth from "../hooks/useAuth";
// import { motion } from "framer-motion";
// import { Gift, Bitcoin, CreditCard } from "lucide-react";

// const pageStagger = {
//   hidden: {},
//   visible: {
//     transition: { staggerChildren: 0.18 },
//   },
// };

// const fadeUp = {
//   hidden: { opacity: 0, y: 18 },
//   visible: { opacity: 1, y: 0 },
// };

// export default function Checkout() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const event = location.state?.event || null;
//   const tickets = location.state?.tickets || [];
//   const preferences = location.state?.preferences || null;

//   // Total = sum of (number of tickets in listing * price)
//   const totalPrice = useMemo(
//     () =>
//       tickets.reduce((sum, t) => {
//         const qty = Number(t.ticketCount || 1);
//         const price = Number(t.price || 0);
//         return sum + qty * price;
//       }, 0),
//     [tickets]
//   );

//   if (!event || tickets.length === 0) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <p className="text-sm text-slate-700 dark:text-slate-300">
//           No tickets found for checkout. Please start again from the
//           event page.
//         </p>
//       </div>
//     );
//   }

//   // User must be logged in before seeing payment options
//   if (!user) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
//         <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
//           Checkout
//         </h1>
//         <p className="text-sm text-slate-700 dark:text-slate-300">
//           You need to be signed in before completing your purchase.
//         </p>
//         <button
//           onClick={() =>
//             navigate("/auth/login", { state: { from: "/checkout" } })
//           }
//           className="px-4 py-2 rounded-full bg-emerald-600 text-sm font-medium text-white"
//         >
//           Log in to continue
//         </button>
//       </div>
//     );
//   }

//   const seatCountPref = preferences?.seatCount || tickets.length;
//   const sitTogetherPref =
//     preferences?.sitTogether === true ||
//     preferences?.sitTogether === false
//       ? preferences.sitTogether
//       : null;

//   return (
//     <motion.div
//       className="max-w-4xl mx-auto px-4 py-8 space-y-6"
//       variants={pageStagger}
//       initial="hidden"
//       animate="visible"
//     >
//       {/* TEST MODE BANNER */}
//       <motion.div
//         variants={fadeUp}
//         className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-100"
//       >
//         <p className="font-semibold tracking-wide">
//           TEST MODE — No real payments are processed. All purchases are
//           created as <span className="underline">pending</span> until an
//           admin marks them as paid.
//         </p>
//       </motion.div>

//       <motion.header variants={fadeUp}>
//         <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
//           Checkout
//         </h1>
//         <p className="text-xs text-slate-600 mt-1 dark:text-slate-400">
//           Review your order, then choose how you want to pay.
//         </p>
//       </motion.header>

//       {/* Preference summary (read-only) */}
//       <motion.section
//         variants={fadeUp}
//         className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-1 shadow-sm dark:bg-slate-900 dark:border-slate-800"
//       >
//         <p className="text-slate-600 dark:text-slate-300">
//           Tickets selected:{" "}
//           <span className="font-semibold">
//             {tickets.reduce(
//               (sum, t) => sum + Number(t.ticketCount || 1),
//               0
//             )}{" "}
//             ticket
//             {tickets.reduce(
//               (sum, t) => sum + Number(t.ticketCount || 1),
//               0
//             ) !== 1
//               ? "s"
//               : ""}
//           </span>
//         </p>
//         <p className="text-slate-600 dark:text-slate-300">
//           Preference:{" "}
//           <span className="font-semibold">
//             {seatCountPref} ticket{seatCountPref !== 1 ? "s" : ""}
//           </span>
//           {sitTogetherPref !== null && (
//             <>
//               {" "}
//               · Sit together:{" "}
//               <span className="font-semibold">
//                 {sitTogetherPref ? "Yes" : "No"}
//               </span>
//             </>
//           )}
//         </p>
//         <button
//           type="button"
//           onClick={() =>
//             navigate(`/event/${event.id}/tickets`, {
//               state: { fromCheckout: true },
//             })
//           }
//           className="mt-2 inline-flex items-center text-[11px] text-emerald-600 underline dark:text-emerald-400"
//         >
//           Change seats / preferences
//         </button>
//       </motion.section>

//       {/* Order summary */}
//       <motion.section
//         className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm dark:bg-slate-900 dark:border-slate-800"
//         variants={fadeUp}
//       >
//         <div>
//           <h2 className="text-sm font-semibold mb-1 text-slate-900 dark:text-slate-100">
//             Event
//           </h2>
//           <p className="text-sm text-slate-900 dark:text-slate-100">
//             {event.artistName} — {event.eventName}
//           </p>
//           <p className="text-xs text-slate-600 dark:text-slate-400">
//             {event.date} • {event.time} • {event.venue} • {event.city}
//           </p>
//         </div>

//         <div>
//           <h2 className="text-sm font-semibold mb-1 text-slate-900 dark:text-slate-100">
//             Tickets
//           </h2>
//           <div className="space-y-1">
//             {tickets.map((t) => {
//               const qty = Number(t.ticketCount || 1);
//               const price = Number(t.price || 0);
//               const lineTotal = qty * price;

//               return (
//                 <div
//                   key={t.id}
//                   className="flex justify-between text-xs text-slate-700 dark:text-slate-300"
//                 >
//                   <span className="flex flex-col">
//                     <span>
//                       {t.section || "Section"}-{t.row || "Row"}-
//                       {t.seatNumber || "Seat"}{" "}
//                       {t.seatType ? `(${t.seatType})` : ""}
//                     </span>
//                     <span className="text-[11px] text-slate-500 dark:text-slate-400">
//                       {qty} × ${price.toFixed(2)}
//                     </span>
//                   </span>
//                   <span className="font-semibold">
//                     ${lineTotal.toFixed(2)}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between text-sm">
//           <span className="text-slate-900 dark:text-slate-100">
//             Total
//           </span>
//           <span className="font-semibold text-slate-900 dark:text-slate-100">
//             ${totalPrice.toFixed(2)}
//           </span>
//         </div>
//       </motion.section>

//       {/* Buyer info */}
//       <motion.section
//         className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm dark:bg-slate-900 dark:border-slate-800"
//         variants={fadeUp}
//       >
//         <h2 className="text-sm font-semibold mb-2 text-slate-900 dark:text-slate-100">
//           Buyer information
//         </h2>
//         <div className="grid md:grid-cols-2 gap-3 text-xs">
//           <div className="space-y-1">
//             <p className="text-slate-500 dark:text-slate-400">Email</p>
//             <p className="text-slate-900 dark:text-slate-100">
//               {user?.email || "Not signed in"}
//             </p>
//           </div>
//         </div>
//       </motion.section>

//       {/* Payment method chooser — pro UI with icons */}
//       <motion.section
//         className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm dark:bg-slate-900 dark:border-slate-800"
//         variants={fadeUp}
//       >
//         <div className="flex items-center justify-between gap-2">
//           <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
//             Choose how you want to pay
//           </h2>
//           <p className="text-[11px] text-slate-500 dark:text-slate-400">
//             All methods are simulated in test mode.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-3 text-xs">
//           {/* Gift card */}
//           <button
//             type="button"
//             onClick={() =>
//               navigate("/payment/gift-card", {
//                 state: { event, tickets },
//               })
//             }
//             className="group h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-3 py-3 text-left shadow-sm hover:border-emerald-500/80 hover:shadow-md dark:from-slate-950 dark:to-slate-900 dark:border-slate-700 dark:hover:border-emerald-500/80 transition-all"
//           >
//             <div className="flex items-center gap-2 mb-2">
//               <div className="rounded-full p-2 bg-emerald-100 text-emerald-700 group-hover:bg-emerald-500 group-hover:text-white dark:bg-emerald-900/40 dark:text-emerald-200">
//                 <Gift className="w-4 h-4" />
//               </div>
//               <p className="font-semibold text-slate-900 dark:text-slate-100">
//                 Pay with gift card
//               </p>
//             </div>
//             <p className="text-slate-600 dark:text-slate-400 leading-snug">
//               Enter a test gift card and optionally upload a screenshot.
//               Admin will review and mark as paid.
//             </p>
//           </button>

//           {/* Crypto */}
//           <button
//             type="button"
//             onClick={() =>
//               navigate("/payment/crypto", {
//                 state: { event, tickets },
//               })
//             }
//             className="group h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-3 py-3 text-left shadow-sm hover:border-emerald-500/80 hover:shadow-md dark:from-slate-950 dark:to-slate-900 dark:border-slate-700 dark:hover:border-emerald-500/80 transition-all"
//           >
//             <div className="flex items-center gap-2 mb-2">
//               <div className="rounded-full p-2 bg-sky-100 text-sky-700 group-hover:bg-emerald-500 group-hover:text-white dark:bg-sky-900/40 dark:text-sky-200">
//                 <Bitcoin className="w-4 h-4" />
//               </div>
//               <p className="font-semibold text-slate-900 dark:text-slate-100">
//                 Pay with crypto
//               </p>
//             </div>
//             <p className="text-slate-600 dark:text-slate-400 leading-snug">
//               Send test crypto to a demo wallet address and submit a fake
//               transaction reference. Admin confirms manually.
//             </p>
//           </button>

//           {/* Card */}
//           <button
//             type="button"
//             onClick={() =>
//               navigate("/payment/card", {
//                 state: { event, tickets },
//               })
//             }
//             className="group h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-3 py-3 text-left shadow-sm hover:border-emerald-500/80 hover:shadow-md dark:from-slate-950 dark:to-slate-900 dark:border-slate-700 dark:hover:border-emerald-500/80 transition-all"
//           >
//             <div className="flex items-center gap-2 mb-2">
//               <div className="rounded-full p-2 bg-indigo-100 text-indigo-700 group-hover:bg-emerald-500 group-hover:text-white dark:bg-indigo-900/40 dark:text-indigo-200">
//                 <CreditCard className="w-4 h-4" />
//               </div>
//               <p className="font-semibold text-slate-900 dark:text-slate-100">
//                 Continue with credit card
//               </p>
//             </div>
//             <p className="text-slate-600 dark:text-slate-400 leading-snug">
//               Simulate a card payment using fake details. Order stays
//               pending until an admin flags it as paid.
//             </p>
//           </button>
//         </div>
//       </motion.section>
//     </motion.div>
//   );
// }


























// src/pages/Checkout.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";
import { Gift, Bitcoin, CreditCard } from "lucide-react";

const pageStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const event = location.state?.event || null;
  const tickets = location.state?.tickets || [];
  const preferences = location.state?.preferences || null;
  console.log(event)
  // Total = sum of (number of tickets in listing * price)
  const totalPrice = useMemo(
    () =>
      tickets.reduce((sum, t) => {
        const qty = Number(t.ticketCount || 1);
        const price = Number(t.price || 0);
        return sum + qty * price;
      }, 0),
    [tickets]
  );

  const totalTicketsSelected = useMemo(
    () =>
      tickets.reduce((sum, t) => sum + Number(t.ticketCount || 1), 0),
    [tickets]
  );

  if (!event || tickets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          No tickets found for checkout. Please start again from the event
          page.
        </p>
      </div>
    );
  }

  // User must be logged in before seeing payment options
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Checkout
        </h1>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          You need to be signed in before completing your purchase.
        </p>
        <button
          onClick={() =>
            navigate("/auth/login", { state: { from: "/checkout" } })
          }
          className="px-4 py-2 rounded-full bg-emerald-600 text-sm font-medium text-white"
        >
          Log in to continue
        </button>
      </div>
    );
  }

  const seatCountPref = preferences?.seatCount || tickets.length;
  const sitTogetherPref =
    preferences?.sitTogether === true ||
    preferences?.sitTogether === false
      ? preferences.sitTogether
      : null;

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-8 space-y-6"
      variants={pageStagger}
      initial="hidden"
      animate="visible"
    >
      {/* TEST MODE BANNER */}
      <motion.div
        variants={fadeUp}
        className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-100"
      >
        <p className="font-semibold tracking-wide">
          TEST MODE — No real payments are processed. All purchases are created
          as <span className="underline">pending</span> until an admin marks
          them as paid.
        </p>
      </motion.div>

      {/* HEADER */}
      <motion.header
        variants={fadeUp}
        className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Checkout
          </h1>
          <p className="text-xs text-slate-600 mt-1 dark:text-slate-400">
            Review your order and choose how you want to pay.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/event/${event.id}`)}
          className="mt-2 inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Back to event page
        </button>
      </motion.header>

      {/* MAIN GRID: LEFT = ORDER, RIGHT = SUMMARY + PAYMENT */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
        {/* LEFT COLUMN: ORDER DETAILS */}
        <motion.div
          variants={fadeUp}
          className="space-y-4"
        >
          {/* Event + basic info */}
          <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <h2 className="text-sm font-semibold mb-1 text-slate-900 dark:text-slate-100">
              Event
            </h2>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {event.artistName} — {event.eventName}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {event.date} • {event.time} • {event.venue} • {event.city}
            </p>
          </section>

          {/* Tickets list */}
          <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Tickets
              </h2>
              <button
                type="button"
                onClick={() =>
                  navigate(`/event/${event.id}/tickets`, {
                    state: { fromCheckout: true },
                  })
                }
                className="inline-flex items-center text-[11px] text-emerald-600 underline dark:text-emerald-400"
              >
                Change seats / preferences
              </button>
            </div>

            <div className="space-y-2">
              {tickets.map((t) => {
                const qty = Number(t.ticketCount || 1);
                const price = Number(t.price || 0);
                const lineTotal = qty * price;

                const seatLabel = [
                  t.section || "Section",
                  t.row || "Row",
                  t.seatNumber || "Seat",
                ]
                  .filter(Boolean)
                  .join(" • ");

                return (
                  <div
                    key={t.id}
                    className="flex justify-between items-start rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium">
                        {seatLabel}{" "}
                        {t.seatType ? `(${t.seatType})` : ""}
                      </span>
                      {t.locationName && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {t.locationName}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {qty} × ${price.toFixed(2)}
                      </span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      ${lineTotal.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Preferences & buyer info combined */}
          <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            {/* Preference summary (read-only) */}
            <div className="space-y-1 text-xs">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Seat preferences
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Tickets selected:{" "}
                <span className="font-semibold">
                  {totalTicketsSelected} ticket
                  {totalTicketsSelected !== 1 ? "s" : ""}
                </span>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Preference:{" "}
                <span className="font-semibold">
                  {seatCountPref} ticket{seatCountPref !== 1 ? "s" : ""}
                </span>
                {sitTogetherPref !== null && (
                  <>
                    {" "}
                    · Sit together:{" "}
                    <span className="font-semibold">
                      {sitTogetherPref ? "Yes" : "No"}
                    </span>
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={() =>
                  navigate(`/event/${event.id}/tickets`, {
                    state: { fromCheckout: true },
                  })
                }
                className="mt-2 inline-flex items-center text-[11px] text-emerald-600 underline dark:text-emerald-400"
              >
                Adjust preferences
              </button>
            </div>

            {/* Buyer info */}
            <div className="border-t border-slate-200 pt-3 text-xs space-y-1 dark:border-slate-800">
              <h2 className="text-sm font-semibold mb-1 text-slate-900 dark:text-slate-100">
                Buyer information
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-slate-500 dark:text-slate-400">Email</p>
                  <p className="text-slate-900 dark:text-slate-100">
                    {user?.email || "Not signed in"}
                  </p>
                </div>
                {/* Slot for future fields (name, phone, etc.) */}
              </div>
            </div>
          </section>
        </motion.div>

        {/* RIGHT COLUMN: SUMMARY + PAYMENT METHODS */}
        <motion.aside
          variants={fadeUp}
          className="space-y-4 lg:sticky lg:top-6 lg:self-start"
        >
          {/* Order summary / total */}
          <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Order summary
            </h2>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>Tickets ({totalTicketsSelected})</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Fees & taxes</span>
              <span>Included in test mode</span>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-center text-sm">
              <span className="text-slate-900 dark:text-slate-100 font-semibold">
                Total due
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              In live mode, this amount would be charged to your chosen payment
              method. In test mode, admins manually mark orders as paid.
            </p>
          </section>

          {/* Payment method chooser — pro UI with icons */}
          <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Choose how you want to pay
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                All methods are simulated in test mode.
              </p>
            </div>

            <div className="grid md:grid-cols-1 gap-3 text-xs">
              {/* Gift card */}
              <button
                type="button"
                onClick={() =>
                  navigate("/payment/gift-card", {
                    state: { event, tickets },
                  })
                }
                className="group h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-3 py-3 text-left shadow-sm hover:border-emerald-500/80 hover:shadow-md dark:from-slate-950 dark:to-slate-900 dark:border-slate-700 dark:hover:border-emerald-500/80 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-full p-2 bg-emerald-100 text-emerald-700 group-hover:bg-emerald-500 group-hover:text-white dark:bg-emerald-900/40 dark:text-emerald-200">
                    <Gift className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Pay with gift card
                  </p>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-snug">
                  Enter a test gift card and optionally upload a screenshot.
                  Admin will review and mark the order as paid.
                </p>
              </button>

              {/* Crypto */}
              <button
                type="button"
                onClick={() =>
                  navigate("/payment/crypto", {
                    state: { event, tickets },
                  })
                }
                className="group h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-3 py-3 text-left shadow-sm hover:border-emerald-500/80 hover:shadow-md dark:from-slate-950 dark:to-slate-900 dark:border-slate-700 dark:hover:border-emerald-500/80 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-full p-2 bg-sky-100 text-sky-700 group-hover:bg-emerald-500 group-hover:text-white dark:bg-sky-900/40 dark:text-sky-200">
                    <Bitcoin className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Pay with crypto
                  </p>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-snug">
                  Send test crypto to a demo wallet address and submit a fake
                  transaction reference. Admin confirms manually.
                </p>
              </button>

              {/* Card */}
              <button
                type="button"
                onClick={() =>
                  navigate("/payment/card", {
                    state: { event, tickets },
                  })
                }
                className="group h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-3 py-3 text-left shadow-sm hover:border-emerald-500/80 hover:shadow-md dark:from-slate-950 dark:to-slate-900 dark:border-slate-700 dark:hover:border-emerald-500/80 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-full p-2 bg-indigo-100 text-indigo-700 group-hover:bg-emerald-500 group-hover:text-white dark:bg-indigo-900/40 dark:text-indigo-200">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Continue with credit card
                  </p>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-snug">
                  Simulate a card payment using fake details. The order stays
                  pending until an admin flags it as paid.
                </p>
              </button>
            </div>
          </section>
        </motion.aside>
      </div>
    </motion.div>
  );
}
