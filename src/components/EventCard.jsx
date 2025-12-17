// // src/components/EventCard.jsx
// import { Link } from "react-router-dom";
// import { MapPin, Eye } from "lucide-react";
// import { getCategoryLabel } from "../constants/eventCategories";

// function formatViewCount(n) {
//   if (!n || isNaN(n)) return null;
//   if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
//   if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
//   return String(n);
// }

// export default function EventCard({ event }) {
//   const primaryLocation =
//     Array.isArray(event.locations) && event.locations.length > 0
//       ? event.locations[0]
//       : null;

//   const cityText =
//     primaryLocation?.name ||
//     event.city ||
//     "Location TBA";

//   const dateText =
//     (event.tourStartDate && event.tourEndDate
//       ? `${event.tourStartDate} → ${event.tourEndDate}`
//       : primaryLocation?.dates?.join(" · ")) || "Dates coming soon";

//   const viewCount = formatViewCount(event.baseViewCount);
//   const categoryLabel = getCategoryLabel(event.category);
//   const typeTag =
//     primaryLocation?.type === "parking"
//       ? "Parking"
//       : categoryLabel;

//   return (
//     <Link
//       to={`/event/${event.id}`}
//       className="group bg-slate-950 border border-slate-800 hover:border-emerald-500/70 rounded-2xl overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-1"
//     >
//       {/* Image placeholder / gradient */}
//       <div className="relative h-40 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
//         <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity bg-[radial-gradient(circle_at_top,_#22c55e33,_transparent_55%),radial-gradient(circle_at_bottom,_#0ea5e933,_transparent_55%)]" />

//         <div className="absolute top-2 left-2 flex gap-2 text-[10px]">
//           {typeTag && (
//             <span className="px-2 py-0.5 rounded-full bg-black/60 text-slate-100 border border-white/10">
//               {typeTag}
//             </span>
//           )}
//           {event.artistName && (
//             <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-100 border border-white/10">
//               {event.artistName}
//             </span>
//           )}
//         </div>

//         {viewCount && (
//           <div className="absolute bottom-2 right-2 text-[10px] flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 text-slate-100 border border-slate-700">
//             <Eye className="w-3 h-3" />
//             <span>{viewCount} viewed</span>
//           </div>
//         )}
//       </div>

//       {/* Info */}
//       <div className="p-4 flex-1 flex flex-col gap-2">
//         <div>
//           <h3 className="font-semibold text-sm text-slate-50 line-clamp-2">
//             {event.eventName || "Untitled event"}
//           </h3>
//           {event.artistName && (
//             <p className="text-[11px] text-slate-400 mt-0.5">
//               {event.artistName}
//             </p>
//           )}
//         </div>

//         <div className="space-y-1 text-[11px] text-slate-400">
//           <p>{dateText}</p>
//           <p className="flex items-center gap-1">
//             <MapPin className="w-3 h-3" />
//             <span className="truncate">{cityText}</span>
//           </p>
//         </div>

//         <div className="mt-3 flex items-center justify-between text-[11px]">
//           <span className="text-emerald-400 font-medium">
//             View tickets
//           </span>
//           <span className="text-slate-500">
//             Fan-to-fan marketplace
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// }






















// // src/components/EventCard.jsx
// import { Link } from "react-router-dom";
// import { MapPin, Eye } from "lucide-react";
// import { motion } from "framer-motion";
// import { getCategoryLabel } from "../constants/eventCategories";

// const MotionLink = motion(Link);

// function formatViewCount(n) {
//   if (!n || isNaN(n)) return null;
//   if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
//   if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
//   return String(n);
// }

// export default function EventCard({ event }) {
//   const primaryLocation =
//     Array.isArray(event.locations) && event.locations.length > 0
//       ? event.locations[0]
//       : null;

//   const cityText =
//     primaryLocation?.name || event.city || "Location TBA";

//   const dateText =
//     (event.tourStartDate && event.tourEndDate
//       ? `${event.tourStartDate} → ${event.tourEndDate}`
//       : primaryLocation?.dates?.join(" · ")) || "Dates coming soon";

//   const viewCount = formatViewCount(event.baseViewCount);
//   const categoryLabel = getCategoryLabel(event.category);
//   const typeTag =
//     primaryLocation?.type === "parking" ? "Parking" : categoryLabel;

//   return (
//     <MotionLink
//       to={`/event/${event.id}`}
//       initial={{ opacity: 0, y: 12 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.25 }}
//       whileHover={{ y: -4 }}
//       whileTap={{ scale: 0.98 }}
//       className="group bg-white border border-slate-200 hover:border-emerald-500/70 rounded-2xl overflow-hidden flex flex-col shadow-sm transition-colors dark:bg-slate-950 dark:border-slate-800"
//     >
//       {/* Image / gradient header */}
//       <div className="relative h-40 bg-gradient-to-br from-emerald-50 via-slate-50 to-sky-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
//         <div className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity bg-[radial-gradient(circle_at_top,_#22c55e33,_transparent_55%),radial-gradient(circle_at_bottom,_#0ea5e933,_transparent_55%)]" />

//         <div className="absolute top-2 left-2 flex gap-2 text-[10px]">
//           {typeTag && (
//             <span className="px-2 py-0.5 rounded-full bg-white/80 text-slate-800 border border-slate-200 shadow-sm dark:bg-black/60 dark:text-slate-100 dark:border-white/10">
//               {typeTag}
//             </span>
//           )}
//           {event.artistName && (
//             <span className="px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-100 border border-white/10 text-[10px]">
//               {event.artistName}
//             </span>
//           )}
//         </div>

//         {viewCount && (
//           <div className="absolute bottom-2 right-2 text-[10px] flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 text-slate-100 border border-slate-700">
//             <Eye className="w-3 h-3" />
//             <span>{viewCount} viewed</span>
//           </div>
//         )}
//       </div>

//       {/* Info */}
//       <div className="p-4 flex-1 flex flex-col gap-2">
//         <div>
//           <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 dark:text-slate-50">
//             {event.eventName || "Untitled event"}
//           </h3>
//           {event.artistName && (
//             <p className="text-[11px] text-slate-500 mt-0.5 dark:text-slate-400">
//               {event.artistName}
//             </p>
//           )}
//         </div>

//         <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
//           <p>{dateText}</p>
//           <p className="flex items-center gap-1">
//             <MapPin className="w-3 h-3" />
//             <span className="truncate">{cityText}</span>
//           </p>
//         </div>

//         <div className="mt-3 flex items-center justify-between text-[11px]">
//           <span className="text-emerald-600 font-medium dark:text-emerald-400">
//             View tickets
//           </span>
//           <span className="text-slate-400 dark:text-slate-500">
//             Fan-to-fan marketplace
//           </span>
//         </div>
//       </div>
//     </MotionLink>
//   );
// }






















// src/components/EventCard.jsx
import { Link } from "react-router-dom";
import { MapPin, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { getCategoryLabel } from "../constants/eventCategories";

const MotionLink = motion(Link);

function formatViewCount(n) {
  if (!n || isNaN(n)) return null;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function EventCard({ event }) {
  const primaryLocation =
    Array.isArray(event.locations) && event.locations.length > 0
      ? event.locations[0]
      : null;

  const cityText =
    primaryLocation?.name || event.city || "Location TBA";

  const dateText =
    (event.tourStartDate && event.tourEndDate
      ? `${event.tourStartDate} → ${event.tourEndDate}`
      : primaryLocation?.dates?.join(" · ")) || "Dates coming soon";

  const viewCount = formatViewCount(event.baseViewCount);
  const categoryLabel = getCategoryLabel(event.category);
  const typeTag =
    primaryLocation?.type === "parking" ? "Parking" : categoryLabel;

  const hasImage = !!event.eventImageUrl;

  return (
    <MotionLink
      to={`/event/${event.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group bg-white border border-slate-200 hover:border-emerald-500/70 rounded-2xl overflow-hidden flex flex-col shadow-sm transition-colors dark:bg-slate-950 dark:border-slate-800"
    >
      {/* Image / gradient header */}
      <div className="relative h-40 bg-gradient-to-br from-emerald-50 via-slate-50 to-sky-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
        {/* Event image if present */}
        {hasImage && (
          <img
            src={event.eventImageUrl}
            alt={event.eventName || "Event image"}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}

        {/* Gradient / overlay for both image and fallback */}
        <div className="pointer-events-none absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity bg-[radial-gradient(circle_at_top,_#22c55e33,_transparent_55%),radial-gradient(circle_at_bottom,_#0ea5e933,_transparent_55%)]" />

        {/* Top-left tags */}
        <div className="absolute top-2 left-2 flex gap-2 text-[10px]">
          {typeTag && (
            <span className="px-2 py-0.5 rounded-full bg-white/80 text-slate-800 border border-slate-200 shadow-sm dark:bg-black/60 dark:text-slate-100 dark:border-white/10">
              {typeTag}
            </span>
          )}
          {event.artistName && (
            <span className="px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-100 border border-white/10 text-[10px]">
              {event.artistName}
            </span>
          )}
        </div>

        {/* View count badge */}
        {viewCount && (
          <div className="absolute bottom-2 right-2 text-[10px] flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 text-slate-100 border border-slate-700">
            <Eye className="w-3 h-3" />
            <span>{viewCount} viewed</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div>
          <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 dark:text-slate-50">
            {event.eventName || "Untitled event"}
          </h3>
          {event.artistName && (
            <p className="text-[11px] text-slate-500 mt-0.5 dark:text-slate-400">
              {event.artistName}
            </p>
          )}
        </div>

        <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
          <p>{dateText}</p>
          <p className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{cityText}</span>
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px]">
          <span className="text-emerald-600 font-medium dark:text-emerald-400">
            View tickets
          </span>
          <span className="text-slate-400 dark:text-slate-500">
            Fan-to-fan marketplace
          </span>
        </div>
      </div>
    </MotionLink>
  );
}
