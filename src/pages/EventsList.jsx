// // src/pages/EventsList.jsx
// import { useEffect, useMemo, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../lib/firebase";
// import { useLocation } from "react-router-dom";
// import { Search, Filter, MapPin, CalendarRange } from "lucide-react";
// import EventCard from "../components/EventCard";
// import { EVENT_CATEGORIES, getCategoryLabel } from "../constants/eventCategories";

// // Helpers (same logic as Home)
// function eventMatchesDateFilter(event, filterKey, now = new Date()) {
//   if (filterKey === "all") return true;

//   const dates = [];
//   if (Array.isArray(event.locations)) {
//     event.locations.forEach((loc) => {
//       if (Array.isArray(loc.dates)) {
//         loc.dates.forEach((d) => dates.push(d));
//       }
//     });
//   }
//   if (dates.length === 0) return false;

//   const todayStr = now.toISOString().slice(0, 10);
//   const tomorrow = new Date(now);
//   tomorrow.setDate(now.getDate() + 1);
//   const tomorrowStr = tomorrow.toISOString().slice(0, 10);

//   if (filterKey === "today") return dates.includes(todayStr);
//   if (filterKey === "tomorrow") return dates.includes(tomorrowStr);

//   if (filterKey === "weekend") {
//     const day = now.getDay();
//     const saturday = new Date(now);
//     const sunday = new Date(now);
//     const daysToSat = (6 - day + 7) % 7;
//     saturday.setDate(now.getDate() + daysToSat);
//     sunday.setDate(saturday.getDate() + 1);
//     const satStr = saturday.toISOString().slice(0, 10);
//     const sunStr = sunday.toISOString().slice(0, 10);
//     return dates.includes(satStr) || dates.includes(sunStr);
//   }

//   return true;
// }

// export default function EventsList() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [cityFilter, setCityFilter] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [dateFilter, setDateFilter] = useState("all");

//   const location = useLocation();

//   useEffect(() => {
//     const fetchEvents = async () => {
//       const snap = await getDocs(collection(db, "events"));
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setEvents(list);
//       setLoading(false);
//     };
//     fetchEvents();
//   }, []);

//   // Initialize from URL ?search=...
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const q = params.get("search") || "";
//     if (q) setSearch(q);
//   }, [location.search]);

//   const cities = useMemo(() => {
//     const names = [];
//     events.forEach((evt) => {
//       if (Array.isArray(evt.locations)) {
//         evt.locations.forEach((loc) => {
//           if (loc?.name) {
//             const city = loc.name.split(",")[0].trim();
//             if (city) names.push(city);
//           }
//         });
//       }
//     });
//     return Array.from(new Set(names));
//   }, [events]);

//   const filtered = useMemo(() => {
//     return events.filter((evt) => {
//       const matchesSearch =
//         search.trim().length === 0 ||
//         `${evt.artistName ?? ""} ${evt.eventName ?? ""}`
//           .toLowerCase()
//           .includes(search.toLowerCase());

//       const matchesCity =
//         !cityFilter ||
//         (Array.isArray(evt.locations) &&
//           evt.locations.some((loc) => {
//             if (!loc?.name) return false;
//             const city = loc.name.split(",")[0].trim().toLowerCase();
//             return city === cityFilter.toLowerCase();
//           }));

//       const matchesCategory =
//         !categoryFilter ||
//         (evt.category || "other") === categoryFilter;

//       const matchesDate = eventMatchesDateFilter(evt, dateFilter);

//       return matchesSearch && matchesCity && matchesCategory && matchesDate;
//     });
//   }, [events, search, cityFilter, categoryFilter, dateFilter]);

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-semibold">All events</h1>
//           <p className="text-xs text-slate-400">
//             Browse concerts, sports, festivals and more.
//           </p>
//           <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
//             <span>
//               {events.length} event{events.length !== 1 ? "s" : ""} live
//             </span>
//             {cities.length > 0 && (
//               <span>· {cities.length} cities</span>
//             )}
//           </div>
//         </div>

//         {/* Search + filters */}
//         <div className="flex flex-col md:flex-row gap-3 md:items-center w-full md:w-auto">
//           <div className="flex items-center bg-slate-900 border border-slate-700 rounded-full px-3 py-2 gap-2 w-full md:w-64">
//             <Search className="w-4 h-4 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search by artist or event..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="bg-transparent flex-1 text-xs text-slate-100 placeholder:text-slate-500 outline-none"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             {/* City */}
//             <div className="relative">
//               <select
//                 value={cityFilter}
//                 onChange={(e) => setCityFilter(e.target.value)}
//                 className="appearance-none bg-slate-900 border border-slate-700 rounded-full pl-8 pr-6 py-2 text-xs text-slate-100 w-full md:w-40"
//               >
//                 <option value="">All cities</option>
//                 {cities.map((city) => (
//                   <option key={city} value={city}>
//                     {city}
//                   </option>
//                 ))}
//               </select>
//               <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//             </div>

//             {/* Category */}
//             <select
//               value={categoryFilter}
//               onChange={(e) => setCategoryFilter(e.target.value)}
//               className="bg-slate-900 border border-slate-700 rounded-full px-3 py-2 text-xs text-slate-100"
//             >
//               <option value="">Category</option>
//               {EVENT_CATEGORIES.map((cat) => (
//                 <option key={cat.value} value={cat.value}>
//                   {cat.label}
//                 </option>
//               ))}
//             </select>

//             <button className="hidden md:inline-flex items-center gap-1 px-3 py-2 rounded-full bg-slate-900 border border-slate-700 text-[11px] text-slate-200">
//               <Filter className="w-3 h-3" />
//               Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Date filter row */}
//       <div className="flex flex-wrap gap-3 text-[11px]">
//         <button
//           className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
//             dateFilter === "all"
//               ? "bg-emerald-600/10 border-emerald-500 text-slate-100"
//               : "bg-slate-900 border-slate-700 text-slate-300"
//           }`}
//           onClick={() => setDateFilter("all")}
//         >
//           <CalendarRange className="w-3.5 h-3.5" />
//           <span>Explore all</span>
//         </button>
//         <button
//           className={`px-3 py-1.5 rounded-full border ${
//             dateFilter === "today"
//               ? "bg-emerald-600/10 border-emerald-500 text-slate-100"
//               : "bg-slate-900 border-slate-700 text-slate-300"
//           }`}
//           onClick={() => setDateFilter("today")}
//         >
//           Today
//         </button>
//         <button
//           className={`px-3 py-1.5 rounded-full border ${
//             dateFilter === "tomorrow"
//               ? "bg-emerald-600/10 border-emerald-500 text-slate-100"
//               : "bg-slate-900 border-slate-700 text-slate-300"
//           }`}
//           onClick={() => setDateFilter("tomorrow")}
//         >
//           Tomorrow
//         </button>
//         <button
//           className={`px-3 py-1.5 rounded-full border ${
//             dateFilter === "weekend"
//               ? "bg-emerald-600/10 border-emerald-500 text-slate-100"
//               : "bg-slate-900 border-slate-700 text-slate-300"
//           }`}
//           onClick={() => setDateFilter("weekend")}
//         >
//           This weekend
//         </button>
//       </div>

//       {/* Grid */}
//       {loading ? (
//         <p className="text-sm text-slate-300">Loading events...</p>
//       ) : (
//         <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {filtered.length === 0 ? (
//             <p className="text-sm text-slate-400 col-span-full">
//               No events match your filters yet.
//             </p>
//           ) : (
//             filtered.map((evt) => <EventCard key={evt.id} event={evt} />)
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



















// src/pages/EventsList.jsx
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useLocation } from "react-router-dom";
import { Search, Filter, MapPin, CalendarRange } from "lucide-react";
import EventCard from "../components/EventCard";
import {
  EVENT_CATEGORIES,
  getCategoryLabel,
} from "../constants/eventCategories";

// Helpers (same logic as Home)
function eventMatchesDateFilter(event, filterKey, now = new Date()) {
  if (filterKey === "all") return true;

  const dates = [];
  if (Array.isArray(event.locations)) {
    event.locations.forEach((loc) => {
      if (Array.isArray(loc.dates)) {
        loc.dates.forEach((d) => dates.push(d));
      }
    });
  }
  if (dates.length === 0) return false;

  const todayStr = now.toISOString().slice(0, 10);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  if (filterKey === "today") return dates.includes(todayStr);
  if (filterKey === "tomorrow") return dates.includes(tomorrowStr);

  if (filterKey === "weekend") {
    const day = now.getDay();
    const saturday = new Date(now);
    const sunday = new Date(now);
    const daysToSat = (6 - day + 7) % 7;
    saturday.setDate(now.getDate() + daysToSat);
    sunday.setDate(saturday.getDate() + 1);
    const satStr = saturday.toISOString().slice(0, 10);
    const sunStr = sunday.toISOString().slice(0, 10);
    return dates.includes(satStr) || dates.includes(sunStr);
  }

  return true;
}

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  console.log(events)
  const location = useLocation();

  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEvents(list);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // Initialize from URL ?search=...
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    if (q) setSearch(q);
  }, [location.search]);

  const cities = useMemo(() => {
    const names = [];
    events.forEach((evt) => {
      if (Array.isArray(evt.locations)) {
        evt.locations.forEach((loc) => {
          if (loc?.name) {
            const city = loc.name.split(",")[0].trim();
            if (city) names.push(city);
          }
        });
      }
    });
    return Array.from(new Set(names));
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        search.trim().length === 0 ||
        `${evt.artistName ?? ""} ${evt.eventName ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCity =
        !cityFilter ||
        (Array.isArray(evt.locations) &&
          evt.locations.some((loc) => {
            if (!loc?.name) return false;
            const city = loc.name.split(",")[0].trim().toLowerCase();
            return city === cityFilter.toLowerCase();
          }));

      const matchesCategory =
        !categoryFilter || (evt.category || "other") === categoryFilter;

      const matchesDate = eventMatchesDateFilter(evt, dateFilter);

      return matchesSearch && matchesCity && matchesCategory && matchesDate;
    });
  }, [events, search, cityFilter, categoryFilter, dateFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            All events
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browse concerts, sports, festivals and more.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span>
              {events.length} event{events.length !== 1 ? "s" : ""} live
            </span>
            {cities.length > 0 && <span>· {cities.length} cities</span>}
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center w-full md:w-auto">
          {/* Search */}
          <div className="flex items-center bg-white border border-slate-200 rounded-full px-3 py-2 gap-2 w-full md:w-64 shadow-sm dark:bg-slate-900 dark:border-slate-700">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by artist or event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent flex-1 text-xs text-slate-900 placeholder:text-slate-400 outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* City */}
            <div className="relative">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-full pl-8 pr-6 py-2 text-xs text-slate-900 w-full md:w-40 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              >
                <option value="">All cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-full px-3 py-2 text-xs text-slate-900 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
            >
              <option value="">Category</option>
              {EVENT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Extra filters button (visual only for now) */}
            <button className="hidden md:inline-flex items-center gap-1 px-3 py-2 rounded-full bg-white border border-slate-200 text-[11px] text-slate-700 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200">
              <Filter className="w-3 h-3" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Date filter row */}
      <div className="flex flex-wrap gap-3 text-[11px]">
        <button
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
            dateFilter === "all"
              ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500 dark:text-emerald-100"
              : "bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
          }`}
          onClick={() => setDateFilter("all")}
        >
          <CalendarRange className="w-3.5 h-3.5" />
          <span>Explore all</span>
        </button>
        <button
          className={`px-3 py-1.5 rounded-full border transition-colors ${
            dateFilter === "today"
              ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500 dark:text-emerald-100"
              : "bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
          }`}
          onClick={() => setDateFilter("today")}
        >
          Today
        </button>
        <button
          className={`px-3 py-1.5 rounded-full border transition-colors ${
            dateFilter === "tomorrow"
              ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500 dark:text-emerald-100"
              : "bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
          }`}
          onClick={() => setDateFilter("tomorrow")}
        >
          Tomorrow
        </button>
        <button
          className={`px-3 py-1.5 rounded-full border transition-colors ${
            dateFilter === "weekend"
              ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500 dark:text-emerald-100"
              : "bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
          }`}
          onClick={() => setDateFilter("weekend")}
        >
          This weekend
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Loading events...
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 col-span-full">
              No events match your filters yet.
            </p>
          ) : (
            filtered.map((evt) => <EventCard key={evt.id} event={evt} />)
          )}
        </div>
      )}
    </div>
  );
}
