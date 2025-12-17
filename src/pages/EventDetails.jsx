// // src/pages/EventDetails.jsx
// import { useEffect, useState, useMemo } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   doc,
//   getDoc,
//   collection,
//   getDocs,
//   limit,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../lib/firebase";
// import {
//   MapPin,
//   CalendarRange,
//   Eye,
//   PlayCircle,
//   ArrowRight,
// } from "lucide-react";
// import { motion } from "framer-motion";

// function formatViewCount(n) {
//   if (!n || isNaN(n)) return null;
//   if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M fans viewed`;
//   if (n >= 1000) return `${(n / 1000).toFixed(1)}K fans viewed`;
//   return `${n} fans viewed`;
// }

// // Format "2025-11-03" → { month: "NOV", day: "03", weekday: "MON" }
// function getDateParts(dateStr) {
//   if (!dateStr) return null;
//   const d = new Date(dateStr + "T00:00:00");
//   if (isNaN(d.getTime())) return null;

//   const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
//   const weekdays = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

//   return {
//     month: months[d.getMonth()],
//     day: String(d.getDate()).padStart(2, "0"),
//     weekday: weekdays[d.getDay()],
//   };
// }

// function SmallEventCard({ event }) {
//   const primaryLocation =
//     Array.isArray(event.locations) && event.locations.length > 0
//       ? event.locations[0]
//       : null;

//   const cityText = primaryLocation?.name || event.city || "Location TBA";
//   const dateText =
//     (event.tourStartDate && event.tourEndDate
//       ? `${event.tourStartDate} → ${event.tourEndDate}`
//       : primaryLocation?.dates?.join(", ")) || "Dates coming soon";

//   return (
//     <Link
//       to={`/event/${event.id}`}
//       className="block bg-white border border-slate-200 rounded-xl px-3 py-3 text-xs hover:border-emerald-500/70 transition-colors shadow-sm dark:bg-slate-900 dark:border-slate-800"
//     >
//       <p className="font-medium text-slate-900 line-clamp-2 dark:text-slate-100">
//         {event.artistName} — {event.eventName}
//       </p>
//       <p className="text-slate-500 mt-1 dark:text-slate-400">{dateText}</p>
//       <p className="text-slate-500 mt-1 flex items-center gap-1 dark:text-slate-400">
//         <MapPin className="w-3 h-3" />
//         <span className="truncate">{cityText}</span>
//       </p>
//     </Link>
//   );
// }

// // Motion variants
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

// export default function EventDetails() {
//   const { id } = useParams();
//   const [event, setEvent] = useState(null);
//   const [otherEvents, setOtherEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // locationId -> total tickets available
//   const [locationTicketCounts, setLocationTicketCounts] = useState({});

//   useEffect(() => {
//     const fetchEvent = async () => {
//       const ref = doc(db, "events", id);
//       const snap = await getDoc(ref);
//       if (snap.exists()) {
//         setEvent({ id: snap.id, ...snap.data() });
//       } else {
//         setEvent(null);
//       }
//       setLoading(false);
//     };

//     fetchEvent();
//   }, [id]);

//   // Fetch a few other events for "Fans also love"
//   useEffect(() => {
//     const fetchOthers = async () => {
//       const qEvents = query(collection(db, "events"), limit(6));
//       const snap = await getDocs(qEvents);
//       const list = snap.docs
//         .map((d) => ({ id: d.id, ...d.data() }))
//         .filter((e) => e.id !== id);
//       setOtherEvents(list);
//     };
//     fetchOthers();
//   }, [id]);

//   // Fetch tickets for this event and aggregate by locationId
//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const qTickets = query(
//           collection(db, "tickets"),
//           where("eventId", "==", id),
//           where("status", "==", "active")
//         );
//         const snap = await getDocs(qTickets);
//         const counts = {};

//         snap.docs.forEach((docSnap) => {
//           const data = docSnap.data();
//           const locId = data.locationId;
//           if (!locId) return;

//           // ticketCount can be "number of tickets in that listing"
//           // Fallback to 1 if not provided
//           const qty = Number(data.ticketCount) || 1;
//           counts[locId] = (counts[locId] || 0) + qty;
//         });

//         setLocationTicketCounts(counts);
//       } catch (err) {
//         console.error("Error fetching tickets for counts", err);
//       }
//     };

//     fetchTickets();
//   }, [id]);

//   const primaryLocation = useMemo(() => {
//     if (!event || !Array.isArray(event.locations)) return null;
//     return event.locations[0] || null;
//   }, [event]);

//   if (loading) {
//     return (
//       <div className="max-w-5xl mx-auto px-4 py-8">
//         <p className="text-sm text-slate-600 dark:text-slate-300">
//           Loading event...
//         </p>
//       </div>
//     );
//   }

//   if (!event) {
//     return (
//       <div className="max-w-5xl mx-auto px-4 py-8">
//         <p className="text-sm text-red-500 dark:text-red-400">
//           Event not found.
//         </p>
//       </div>
//     );
//   }

//   const viewLabel = formatViewCount(event.baseViewCount);
//   const tourRange =
//     event.tourStartDate && event.tourEndDate
//       ? `${event.tourStartDate} → ${event.tourEndDate}`
//       : null;

//   const totalLocations = Array.isArray(event.locations)
//     ? event.locations.length
//     : 0;

//   const totalTickets = Object.values(locationTicketCounts).reduce(
//     (sum, n) => sum + n,
//     0
//   );

//   return (
//     <motion.div
//       className="max-w-5xl mx-auto px-4 py-8 space-y-10"
//       variants={pageStagger}
//       initial="hidden"
//       animate="visible"
//     >
//       {/* HERO / BANNER */}
//       <motion.section className="space-y-4" variants={fadeUp}>
//         <div className="relative h-52 md:h-64 bg-gradient-to-br from-emerald-100 via-sky-50 to-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm dark:from-emerald-500/20 dark:via-slate-900 dark:to-blue-500/20 dark:border-slate-800">
//           <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_#22c55e44,_transparent_55%),radial-gradient(circle_at_bottom,_#0ea5e944,_transparent_55%)]" />
//           <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-slate-950" />

//           <div className="relative h-full flex flex-col justify-end px-5 md:px-8 pb-5 md:pb-6 gap-3">
//             <div className="space-y-1">
//               <p className="text-xs uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
//                 FanPass event
//               </p>
//               <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
//                 {event.artistName}
//               </h1>
//               <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
//                 {event.eventName}
//               </p>
//             </div>

//             <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-700 dark:text-slate-200">
//               {tourRange && (
//                 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-sm dark:bg-black/40 dark:border-slate-700">
//                   <CalendarRange className="w-3.5 h-3.5" />
//                   {tourRange}
//                 </span>
//               )}
//               {primaryLocation?.name && (
//                 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-sm dark:bg-black/40 dark:border-slate-700">
//                   <MapPin className="w-3.5 h-3.5" />
//                   {primaryLocation.name}
//                 </span>
//               )}
//               {viewLabel && (
//                 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-sm dark:bg-black/40 dark:border-slate-700">
//                   <Eye className="w-3.5 h-3.5" />
//                   {viewLabel} in the past hour
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//           <div className="text-xs text-slate-600 space-y-1 dark:text-slate-400">
//             <p>
//               {primaryLocation?.dates && primaryLocation.dates.length > 0
//                 ? `Next date: ${primaryLocation.dates[0]}`
//                 : "Dates to be announced."}
//             </p>
//             <p>
//               {Array.isArray(event.locations)
//                 ? `${event.locations.length} location${
//                     event.locations.length !== 1 ? "s" : ""
//                   } on this tour`
//                 : "Single location event"}
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {event.youtubeUrl && (
//               <a
//                 href={event.youtubeUrl}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs text-slate-800 hover:border-emerald-500/70 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
//               >
//                 <PlayCircle className="w-4 h-4" />
//                 Watch artist
//               </a>
//             )}
//             <Link
//               to={`/event/${event.id}/tickets`}
//               className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-emerald-600 text-xs md:text-sm font-medium text-white shadow-sm"
//             >
//               See tickets
//               <ArrowRight className="w-4 h-4 ml-1" />
//             </Link>
//           </div>
//         </div>
//       </motion.section>

//       {/* MAIN BODY: LOCATIONS LIST (left) + SPOTLIGHT CARD (right) */}
//       <motion.section variants={fadeUp}>
//         <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
//           {/* LEFT: locations list */}
//           <div className="space-y-3">
//             {/* Info bar like viagogo */}
//             <div className="bg-blue-50 border border-blue-100 text-xs rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 dark:bg-slate-900/70 dark:border-slate-700">
//               <div className="flex flex-wrap items-center gap-2">
//                 <span className="font-medium text-slate-800 dark:text-slate-100">
//                   Shakira-style tour schedule
//                 </span>
//                 {totalLocations > 0 && (
//                   <span className="text-slate-600 dark:text-slate-300">
//                     {totalLocations} location{totalLocations !== 1 ? "s" : ""} ·{" "}
//                     {totalTickets} ticket{totalTickets !== 1 ? "s" : ""} available
//                   </span>
//                 )}
//               </div>
//               <span className="text-[10px] text-slate-500 dark:text-slate-400">
//                 Click a date to see tickets at that venue.
//               </span>
//             </div>

//             {/* Tabs row (Location / All dates / Parking) */}
//             <div className="flex flex-wrap gap-2 text-xs">
//               <button className="px-3 py-1.5 rounded-full bg-slate-900 text-white border border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100">
//                 Location
//               </button>
//               <button className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200">
//                 All dates
//               </button>
//               <button className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200">
//                 Parking
//               </button>
//             </div>

//             {/* Locations stack – viagogo-style rows */}
//             {Array.isArray(event.locations) && event.locations.length > 0 ? (
//               <div className="space-y-2">
//                 {event.locations.map((loc) => {
//                   const firstDate = Array.isArray(loc.dates)
//                     ? loc.dates[0]
//                     : null;
//                   const dateParts = getDateParts(firstDate);
//                   const city = loc.name || "Location";
//                   const locId = loc.id;
//                   const ticketCount = locId
//                     ? locationTicketCounts[locId] || 0
//                     : 0;
//                   const hasTickets = ticketCount > 0;

//                   const ticketsLabel = hasTickets
//                     ? `${ticketCount} ticket${
//                         ticketCount !== 1 ? "s" : ""
//                       } available`
//                     : "No tickets yet";

//                   const CardInner = (
//                     <div className="flex items-stretch gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs shadow-sm hover:border-emerald-500/70 transition-colors dark:bg-slate-900 dark:border-slate-800 dark:hover:border-emerald-500/60">
//                       {/* Date badge */}
//                       <div className="flex flex-col items-center justify-center w-14 rounded-xl bg-slate-50 border border-slate-200 text-center text-[11px] text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
//                         {dateParts ? (
//                           <>
//                             <span className="font-semibold">
//                               {dateParts.month}
//                             </span>
//                             <span className="text-lg leading-none font-bold">
//                               {dateParts.day}
//                             </span>
//                             <span className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
//                               {dateParts.weekday}
//                             </span>
//                           </>
//                         ) : (
//                           <span className="text-[10px] px-1">Date TBA</span>
//                         )}
//                       </div>

//                       {/* Venue + meta */}
//                       <div className="flex-1 flex flex-col justify-center gap-1">
//                         <p className="font-medium text-slate-900 line-clamp-2 dark:text-slate-100">
//                           {city}
//                         </p>
//                         {Array.isArray(loc.dates) && loc.dates.length > 0 && (
//                           <p className="text-slate-500 dark:text-slate-400">
//                             {loc.dates.join(" · ")}
//                           </p>
//                         )}
//                         {loc.type && (
//                           <p className="text-[11px] text-slate-500 dark:text-slate-400">
//                             {loc.type === "parking" ? "Parking pass" : "Event"}
//                           </p>
//                         )}
//                       </div>

//                       {/* Right side: tickets info + button */}
//                       <div className="flex flex-col items-end justify-center gap-2 min-w-[110px]">
//                         <p
//                           className={`text-[11px] ${
//                             hasTickets
//                               ? "text-emerald-600 dark:text-emerald-400"
//                               : "text-slate-400 dark:text-slate-500"
//                           }`}
//                         >
//                           {ticketsLabel}
//                         </p>
//                         {hasTickets ? (
//                           <span className="inline-flex items-center justify-center rounded-full border border-emerald-600 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm dark:bg-emerald-600 dark:text-white dark:border-emerald-500">
//                             See tickets
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[11px] text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
//                             No tickets
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   );

//                   // Only clickable if there are tickets for this location
//                   return hasTickets ? (
//                     <Link
//                       key={locId || loc.name}
//                       to={`/event/${event.id}/tickets`}
//                       state={{ locationId: locId }}
//                       className="block"
//                     >
//                       {CardInner}
//                     </Link>
//                   ) : (
//                     <div
//                       key={locId || loc.name}
//                       className="opacity-80 cursor-default"
//                     >
//                       {CardInner}
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 No locations have been added for this tour yet.
//               </p>
//             )}
//           </div>

//           {/* RIGHT: spotlight card like viagogo side panel */}
//           <div className="space-y-3">
//             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
//               {/* Fake image / gradient header */}
//               <div className="h-40 bg-gradient-to-tr from-emerald-500 via-amber-400 to-pink-500" />
//               <div className="p-4 space-y-2 text-xs">
//                 <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
//                   Artist spotlight
//                 </p>
//                 <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
//                   {event.artistName}
//                 </h2>
//                 <p className="text-slate-600 leading-snug dark:text-slate-300">
//                   {event.description ||
//                     `${event.artistName} live in concert. Find your perfect seats for this show and other dates on the tour.`}
//                 </p>

//                 {viewLabel && (
//                   <p className="text-[11px] text-slate-500 dark:text-slate-400">
//                     {viewLabel} on FanPass in the last 24 hours.
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.section>

//       {/* ABOUT SECTION */}
//       <motion.section className="space-y-3" variants={fadeUp}>
//         <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
//           About this event
//         </h2>
//         <p className="text-sm text-slate-700 whitespace-pre-line dark:text-slate-300">
//           {event.description || "No description added yet."}
//         </p>
//       </motion.section>

//       {/* FANS ALSO LOVE */}
//       <motion.section className="space-y-3" variants={fadeUp}>
//         <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
//           Fans also love
//         </h2>
//         {otherEvents.length === 0 ? (
//           <p className="text-xs text-slate-500 dark:text-slate-400">
//             No related events yet.
//           </p>
//         ) : (
//           <div className="grid sm:grid-cols-2 gap-3">
//             {otherEvents.map((evt) => (
//               <SmallEventCard key={evt.id} event={evt} />
//             ))}
//           </div>
//         )}
//       </motion.section>
//     </motion.div>
//   );
// }





























// src/pages/EventDetails.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  MapPin,
  CalendarRange,
  Eye,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

function formatViewCount(n) {
  if (!n || isNaN(n)) return null;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M fans viewed`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K fans viewed`;
  return `${n} fans viewed`;
}

// Format "2025-11-03" → { month: "NOV", day: "03", weekday: "MON" }
function getDateParts(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return null;

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return {
    month: months[d.getMonth()],
    day: String(d.getDate()).padStart(2, "0"),
    weekday: weekdays[d.getDay()],
  };
}

function SmallEventCard({ event }) {
  const primaryLocation =
    Array.isArray(event.locations) && event.locations.length > 0
      ? event.locations[0]
      : null;

  const cityText = primaryLocation?.name || event.city || "Location TBA";
  const dateText =
    (event.tourStartDate && event.tourEndDate
      ? `${event.tourStartDate} → ${event.tourEndDate}`
      : primaryLocation?.dates?.join(", ")) || "Dates coming soon";

  return (
    <Link
      to={`/event/${event.id}`}
      className="block bg-white border border-slate-200 rounded-xl px-3 py-3 text-xs hover:border-emerald-500/70 transition-colors shadow-sm dark:bg-slate-900 dark:border-slate-800"
    >
      <p className="font-medium text-slate-900 line-clamp-2 dark:text-slate-100">
        {event.artistName} — {event.eventName}
      </p>
      <p className="text-slate-500 mt-1 dark:text-slate-400">{dateText}</p>
      <p className="text-slate-500 mt-1 flex items-center gap-1 dark:text-slate-400">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{cityText}</span>
      </p>
    </Link>
  );
}

// Motion variants
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

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [otherEvents, setOtherEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // locationId -> total tickets available
  const [locationTicketCounts, setLocationTicketCounts] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      const ref = doc(db, "events", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setEvent({ id: snap.id, ...snap.data() });
      } else {
        setEvent(null);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  // Fetch a few other events for "Fans also love"
  useEffect(() => {
    const fetchOthers = async () => {
      const qEvents = query(collection(db, "events"), limit(6));
      const snap = await getDocs(qEvents);
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((e) => e.id !== id);
      setOtherEvents(list);
    };
    fetchOthers();
  }, [id]);

  // Fetch tickets for this event and aggregate by locationId
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const qTickets = query(
          collection(db, "tickets"),
          where("eventId", "==", id),
          where("status", "==", "active")
        );
        const snap = await getDocs(qTickets);
        const counts = {};

        snap.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const locId = data.locationId;
          if (!locId) return;

          // ticketCount can be "number of tickets in that listing"
          // Fallback to 1 if not provided
          const qty = Number(data.ticketCount) || 1;
          counts[locId] = (counts[locId] || 0) + qty;
        });

        setLocationTicketCounts(counts);
      } catch (err) {
        console.error("Error fetching tickets for counts", err);
      }
    };

    fetchTickets();
  }, [id]);

  const primaryLocation = useMemo(() => {
    if (!event || !Array.isArray(event.locations)) return null;
    return event.locations[0] || null;
  }, [event]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Loading event...
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-sm text-red-500 dark:text-red-400">
          Event not found.
        </p>
      </div>
    );
  }

  const viewLabel = formatViewCount(event.baseViewCount);
  const tourRange =
    event.tourStartDate && event.tourEndDate
      ? `${event.tourStartDate} → ${event.tourEndDate}`
      : null;

  const totalLocations = Array.isArray(event.locations)
    ? event.locations.length
    : 0;

  const totalTickets = Object.values(locationTicketCounts).reduce(
    (sum, n) => sum + n,
    0
  );

  const hasEventImage = !!event.eventImageUrl;

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-8 space-y-10"
      variants={pageStagger}
      initial="hidden"
      animate="visible"
    >
      {/* HERO / BANNER */}
      <motion.section className="space-y-4" variants={fadeUp}>
        <div className="relative h-52 md:h-64 rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-gradient-to-br from-emerald-100 via-sky-50 to-slate-50 dark:from-emerald-500/20 dark:via-slate-900 dark:to-blue-500/20 dark:border-slate-800">
          {/* Event image (if present) */}
          {hasEventImage && (
            <img
              src={event.eventImageUrl}
              alt={event.eventName || "Event banner"}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          )}

          {/* Gradient overlays for both image and fallback */}
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_#22c55e44,_transparent_55%),radial-gradient(circle_at_bottom,_#0ea5e944,_transparent_55%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-slate-950" />

          <div className="relative h-full flex flex-col justify-end px-5 md:px-8 pb-5 md:pb-6 gap-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                FanPass event
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                {event.artistName}
              </h1>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                {event.eventName}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-700 dark:text-slate-200">
              {tourRange && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-sm dark:bg-black/40 dark:border-slate-700">
                  <CalendarRange className="w-3.5 h-3.5" />
                  {tourRange}
                </span>
              )}
              {primaryLocation?.name && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-sm dark:bg-black/40 dark:border-slate-700">
                  <MapPin className="w-3.5 h-3.5" />
                  {primaryLocation.name}
                </span>
              )}
              {viewLabel && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-sm dark:bg-black/40 dark:border-slate-700">
                  <Eye className="w-3.5 h-3.5" />
                  {viewLabel} in the past hour
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-xs text-slate-600 space-y-1 dark:text-slate-400">
            <p>
              {primaryLocation?.dates && primaryLocation.dates.length > 0
                ? `Next date: ${primaryLocation.dates[0]}`
                : "Dates to be announced."}
            </p>
            <p>
              {Array.isArray(event.locations)
                ? `${event.locations.length} location${
                    event.locations.length !== 1 ? "s" : ""
                  } on this tour`
                : "Single location event"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {event.youtubeUrl && (
              <a
                href={event.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs text-slate-800 hover:border-emerald-500/70 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              >
                <PlayCircle className="w-4 h-4" />
                Watch artist
              </a>
            )}
            <Link
              to={`/event/${event.id}/tickets`}
              className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-emerald-600 text-xs md:text-sm font-medium text-white shadow-sm"
            >
              See tickets
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* MAIN BODY: LOCATIONS LIST (left) + SPOTLIGHT CARD (right) */}
      <motion.section variants={fadeUp}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* LEFT: locations list */}
          <div className="space-y-3">
            {/* Info bar like viagogo */}
            <div className="bg-blue-50 border border-blue-100 text-xs rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 dark:bg-slate-900/70 dark:border-slate-700">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-800 dark:text-slate-100">
                  Shakira-style tour schedule
                </span>
                {totalLocations > 0 && (
                  <span className="text-slate-600 dark:text-slate-300">
                    {totalLocations} location{totalLocations !== 1 ? "s" : ""} ·{" "}
                    {totalTickets} ticket{totalTickets !== 1 ? "s" : ""} available
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Click a date to see tickets at that venue.
              </span>
            </div>

            {/* Tabs row (Location / All dates / Parking) */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button className="px-3 py-1.5 rounded-full bg-slate-900 text-white border border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100">
                Location
              </button>
              <button className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200">
                All dates
              </button>
              <button className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200">
                Parking
              </button>
            </div>

            {/* Locations stack – viagogo-style rows */}
            {Array.isArray(event.locations) && event.locations.length > 0 ? (
              <div className="space-y-2">
                {event.locations.map((loc) => {
                  const firstDate = Array.isArray(loc.dates)
                    ? loc.dates[0]
                    : null;
                  const dateParts = getDateParts(firstDate);
                  const city = loc.name || "Location";
                  const locId = loc.id;
                  const ticketCount = locId
                    ? locationTicketCounts[locId] || 0
                    : 0;
                  const hasTickets = ticketCount > 0;

                  const ticketsLabel = hasTickets
                    ? `${ticketCount} ticket${
                        ticketCount !== 1 ? "s" : ""
                      } available`
                    : "No tickets yet";

                  const CardInner = (
                    <div className="flex items-stretch gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs shadow-sm hover:border-emerald-500/70 transition-colors dark:bg-slate-900 dark:border-slate-800 dark:hover:border-emerald-500/60">
                      {/* Date badge */}
                      <div className="flex flex-col items-center justify-center w-14 rounded-xl bg-slate-50 border border-slate-200 text-center text-[11px] text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                        {dateParts ? (
                          <>
                            <span className="font-semibold">
                              {dateParts.month}
                            </span>
                            <span className="text-lg leading-none font-bold">
                              {dateParts.day}
                            </span>
                            <span className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                              {dateParts.weekday}
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] px-1">Date TBA</span>
                        )}
                      </div>

                      {/* Venue + meta */}
                      <div className="flex-1 flex flex-col justify-center gap-1">
                        <p className="font-medium text-slate-900 line-clamp-2 dark:text-slate-100">
                          {city}
                        </p>
                        {Array.isArray(loc.dates) && loc.dates.length > 0 && (
                          <p className="text-slate-500 dark:text-slate-400">
                            {loc.dates.join(" · ")}
                          </p>
                        )}
                        {loc.type && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {loc.type === "parking" ? "Parking pass" : "Event"}
                          </p>
                        )}
                      </div>

                      {/* Right side: tickets info + button */}
                      <div className="flex flex-col items-end justify-center gap-2 min-w-[110px]">
                        <p
                          className={`text-[11px] ${
                            hasTickets
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {ticketsLabel}
                        </p>
                        {hasTickets ? (
                          <span className="inline-flex items-center justify-center rounded-full border border-emerald-600 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm dark:bg-emerald-600 dark:text-white dark:border-emerald-500">
                            See tickets
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[11px] text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                            No tickets
                          </span>
                        )}
                      </div>
                    </div>
                  );

                  // Only clickable if there are tickets for this location
                  return hasTickets ? (
                    <Link
                      key={locId || loc.name}
                      to={`/event/${event.id}/tickets`}
                      state={{ locationId: locId }}
                      className="block"
                    >
                      {CardInner}
                    </Link>
                  ) : (
                    <div
                      key={locId || loc.name}
                      className="opacity-80 cursor-default"
                    >
                      {CardInner}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No locations have been added for this tour yet.
              </p>
            )}
          </div>

          {/* RIGHT: spotlight card like viagogo side panel */}
          <div className="space-y-3">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
              {/* Event image (if present) or gradient fallback */}
              <div className="h-40 relative bg-gradient-to-tr from-emerald-500 via-amber-400 to-pink-500">
                {hasEventImage && (
                  <img
                    src={event.eventImageUrl}
                    alt={event.eventName || "Artist spotlight"}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>

              <div className="p-4 space-y-2 text-xs">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Artist spotlight
                </p>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {event.artistName}
                </h2>
                <p className="text-slate-600 leading-snug dark:text-slate-300">
                  {event.description ||
                    `${event.artistName} live in concert. Find your perfect seats for this show and other dates on the tour.`}
                </p>

                {viewLabel && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {viewLabel} on FanPass in the last 24 hours.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ABOUT SECTION */}
      <motion.section className="space-y-3" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          About this event
        </h2>
        <p className="text-sm text-slate-700 whitespace-pre-line dark:text-slate-300">
          {event.description || "No description added yet."}
        </p>
      </motion.section>

      {/* FANS ALSO LOVE */}
      <motion.section className="space-y-3" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Fans also love
        </h2>
        {otherEvents.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No related events yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {otherEvents.map((evt) => (
              <SmallEventCard key={evt.id} event={evt} />
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
