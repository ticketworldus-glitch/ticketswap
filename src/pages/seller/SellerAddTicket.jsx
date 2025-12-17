// // src/pages/seller/SellerAddTicket.jsx
// import { useEffect, useState } from "react";
// import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
// import { db } from "../../lib/firebase";
// import useAuth from "../../hooks/useAuth";
// import SellerTicketForm from "../../components/SellerTicketForm";

// export default function SellerAddTicket() {
//   const { user } = useAuth();
//   const [events, setEvents] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [loadingEvents, setLoadingEvents] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       const snap = await getDocs(collection(db, "events"));
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setEvents(list);
//       setLoadingEvents(false);
//     };
//     fetchEvents();
//   }, []);

//   const handleSubmit = async (data) => {
//     if (!user) {
//       alert("You must be signed in as a seller.");
//       return;
//     }

//     const event = events.find((e) => e.id === data.eventId);
//     const location =
//       event?.locations?.find((loc) => loc.id === data.locationId) || null;

//     setSubmitting(true);

//     try {
//       await addDoc(collection(db, "tickets"), {
//         eventId: data.eventId,
//         sellerId: user.uid,

//         // Location info
//         locationId: data.locationId,
//         locationName: location?.name || null,
//         locationType: location?.type || null,
//         locationDates: location?.dates || [],

//         // Seating / area
//         section: data.section || null,
//         row: data.row || null,
//         seatNumber: data.seatNumber || null,
//         seatDescription: data.seatDescription || null,

//         ticketCount: Number(data.ticketCount) || 1,

//         // Highlight & pricing
//         highlightText: data.highlightText || null,
//         price: Number(data.priceNow) || 0,
//         originalPrice: data.priceBefore
//           ? Number(data.priceBefore)
//           : null,

//         // Image & extra meta
//         ticketImageUrl: data.ticketImageUrl || null,
//         extraDescription: data.extraDescription || null,
//         ranking: data.ranking ? Number(data.ranking) : null,
//         bestTag: data.bestTag || null,

//         status: "pending",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });

//       setSubmitting(false);
//       alert("Ticket submitted for approval.");
//     } catch (err) {
//       console.error(err);
//       setSubmitting(false);
//       alert("Could not submit ticket. Try again.");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
//       <h1 className="text-2xl font-semibold mb-2">Add ticket</h1>
//       <p className="text-xs text-slate-400 mb-4">
//         Link your ticket to a specific tour location, add pricing and details.
//       </p>

//       {loadingEvents ? (
//         <p className="text-xs text-slate-300">Loading events...</p>
//       ) : events.length === 0 ? (
//         <p className="text-xs text-slate-400">
//           No events available yet. Ask an admin to create events first.
//         </p>
//       ) : (
//         <SellerTicketForm
//           events={events}
//           onSubmit={handleSubmit}
//           submitting={submitting}
//         />
//       )}
//     </div>
//   );
// }














// src/pages/seller/SellerAddTicket.jsx
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import useAuth from "../../hooks/useAuth";
import SellerTicketForm from "../../components/SellerTicketForm";

export default function SellerAddTicket() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEvents(list);
      setLoadingEvents(false);
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (data) => {
    if (!user) {
      alert("You must be signed in as a seller.");
      return;
    }

    const event = events.find((e) => e.id === data.eventId);
    const location =
      event?.locations?.find((loc) => loc.id === data.locationId) || null;

    setSubmitting(true);

    try {
      await addDoc(collection(db, "tickets"), {
        eventId: data.eventId,
        sellerId: user.uid,

        // Location info
        locationId: data.locationId,
        locationName: location?.name || null,
        locationType: location?.type || null,
        locationDates: location?.dates || [],

        // Seating / area
        section: data.section || null,
        row: data.row || null,
        seatNumber: data.seatNumber || null,
        seatDescription: data.seatDescription || null,

        ticketCount: Number(data.ticketCount) || 1,

        // Highlight & pricing
        highlightText: data.highlightText || null,
        price: Number(data.priceNow) || 0,
        originalPrice: data.priceBefore ? Number(data.priceBefore) : null,

        // Image & extra meta
        ticketImageUrl: data.ticketImageUrl || null,
        extraDescription: data.extraDescription || null,
        ranking: data.ranking ? Number(data.ranking) : null,
        bestTag: data.bestTag || null,

        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSubmitting(false);
      alert("Ticket submitted for approval.");
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      alert("Could not submit ticket. Try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Add ticket
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Link your ticket to a specific tour location, set pricing, and
          add details for buyers.
        </p>

        <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-800 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100">
          Tickets you submit will appear in the marketplace once they are
          reviewed and approved.
        </div>
      </header>

      {/* Content */}
      {loadingEvents ? (
        <p className="text-xs text-slate-500 dark:text-slate-300">
          Loading events...
        </p>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
          No events are available yet. Ask an admin to create events before
          listing tickets.
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <SellerTicketForm
            events={events}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      )}
    </div>
  );
}
