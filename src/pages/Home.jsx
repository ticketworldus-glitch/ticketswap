// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import EventCard from "../components/EventCard";
import {
  CalendarDays,
  CalendarRange,
  CalendarClock,
  Compass,
  Shield,
  CheckCircle2,
  Star,
  Search,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Date filter helper
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

// Framer Motion variants
const pageStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      const snap = await getDocs(collection(db, "events"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEvents(list);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  const trending = useMemo(() => {
    const withViews = [...events].sort(
      (a, b) => (b.baseViewCount || 0) - (a.baseViewCount || 0)
    );
    return withViews.slice(0, 6);
  }, [events]);

  const filteredTrending = useMemo(
    () =>
      trending.filter((evt) => eventMatchesDateFilter(evt, dateFilter)),
    [trending, dateFilter]
  );

  const sportsSoon = useMemo(
    () =>
      events
        .filter((e) => e.category === "sports")
        .slice(0, 6),
    [events]
  );

  const concerts = useMemo(
    () =>
      events
        .filter((e) => e.category === "concerts")
        .slice(0, 6),
    [events]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;
    navigate(`/events?search=${encodeURIComponent(term)}`);
    setMobileSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-8 space-y-12"
      variants={pageStagger}
      initial="hidden"
      animate="visible"
    >
      {/* HERO */}
{/* HERO */}
<motion.section
  className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm dark:bg-slate-950 dark:border-slate-800"
  variants={fadeUp}
>
  <div className="absolute inset-0 pointer-events-none">
    <div className="h-full w-full bg-gradient-to-br from-emerald-100 via-transparent to-sky-100 dark:from-emerald-500/20 dark:via-slate-900 dark:to-blue-500/20" />
    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-slate-950" />
  </div>

  <div className="relative px-5 py-8 md:px-10 md:py-10 space-y-6">
    <div className="flex items-start justify-between gap-4">
      <div className="max-w-xl space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-slate-900 dark:text-white">
          The safest way to{" "}
          <span className="text-emerald-600 dark:text-emerald-400">
            buy and sell tickets
          </span>
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-200">
          Fan-to-fan marketplace for concerts, sports and theatre.
          No bots, no scams – just real fans.
        </p>
      </div>

      {/* Mobile search toggle */}
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full bg-white border border-slate-200 text-slate-800 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
        onClick={() => setMobileSearchOpen((v) => !v)}
      >
        <Search className="w-4 h-4" />
      </button>
    </div>

    {/* Desktop search */}
    <div className="max-w-2xl hidden md:block">
      <motion.form
        onSubmit={handleSearchSubmit}
        className="flex items-center bg-white/90 border border-slate-200 rounded-full px-4 py-2 gap-2 shadow-sm dark:bg-slate-900/95 dark:border-slate-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Search className="w-4 h-4 text-slate-400" />
        <input
          placeholder="Search for an event, artist, venue or city"
          className="bg-transparent flex-1 text-sm text-slate-900 placeholder:text-slate-500 outline-none dark:text-slate-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="hidden sm:inline-flex items-center px-3 py-1 text-xs rounded-full bg-emerald-600 text-white font-medium"
        >
          Search
        </button>
      </motion.form>
    </div>

    {/* Mobile search dropdown */}
    {mobileSearchOpen && (
      <motion.div
        className="md:hidden"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
      >
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white/95 border border-slate-200 rounded-2xl p-3 space-y-2 shadow-sm dark:bg-slate-950/95 dark:border-slate-700"
        >
          <label className="text-[11px] text-slate-600 dark:text-slate-300">
            Search events, artists or venues
          </label>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              className="bg-transparent flex-1 text-sm text-slate-900 placeholder:text-slate-500 outline-none dark:text-slate-100"
              placeholder="e.g. Taylor Swift, UEFA, Lagos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 rounded-full bg-emerald-600 text-xs font-medium text-white"
          >
            Search events
          </button>
        </form>
      </motion.div>
    )}

    {/* Trust row */}
    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <div className="space-y-1 text-xs text-slate-700 dark:text-slate-200">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <p>The safest way to buy & sell with real fans.</p>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <p>Verified tickets only, secure payments.</p>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <p>24/7 support if anything goes wrong.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <Star className="w-4 h-4" />
            <span className="font-semibold">4.8 / 5</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            17,000+ fan reviews
          </p>
        </div>

{/* Contact Support */}
<a
  href="https://t.me/bestickets7"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-sm hover:bg-emerald-700 transition dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-900"
>
  Contact Support
</a>

      </div>
    </div>
  </div>
</motion.section>

      {/* DISCOVER DATE FILTERS */}
      <motion.section className="space-y-6" variants={fadeUp}>
        <div className="flex items-center gap-6 text-xs border-b border-slate-200 pb-2 dark:border-slate-800">
          <button className="pb-2 border-b-2 border-emerald-600 text-slate-900 font-medium dark:border-emerald-500 dark:text-slate-100">
            Discover
          </button>
          <button className="pb-2 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-100">
            For you
          </button>
          <button className="pb-2 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-100">
            Following
          </button>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Find your next event
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <button
              className={`flex items-center justify-between rounded-xl px-3 py-2 border transition-colors ${
                dateFilter === "today"
                  ? "bg-emerald-50 border-emerald-500 text-slate-900 dark:bg-emerald-600/10 dark:text-slate-100"
                  : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
              }`}
              onClick={() => setDateFilter("today")}
            >
              <span>Today</span>
              <CalendarDays className="w-4 h-4 text-slate-400" />
            </button>
            <button
              className={`flex items-center justify-between rounded-xl px-3 py-2 border transition-colors ${
                dateFilter === "tomorrow"
                  ? "bg-emerald-50 border-emerald-500 text-slate-900 dark:bg-emerald-600/10 dark:text-slate-100"
                  : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
              }`}
              onClick={() => setDateFilter("tomorrow")}
            >
              <span>Tomorrow</span>
              <CalendarRange className="w-4 h-4 text-slate-400" />
            </button>
            <button
              className={`flex items-center justify-between rounded-xl px-3 py-2 border transition-colors ${
                dateFilter === "weekend"
                  ? "bg-emerald-50 border-emerald-500 text-slate-900 dark:bg-emerald-600/10 dark:text-slate-100"
                  : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
              }`}
              onClick={() => setDateFilter("weekend")}
            >
              <span>This weekend</span>
              <CalendarClock className="w-4 h-4 text-slate-400" />
            </button>
            <button
              className={`flex items-center justify-between rounded-xl px-3 py-2 border transition-colors ${
                dateFilter === "all"
                  ? "bg-emerald-50 border-emerald-500 text-slate-900 dark:bg-emerald-600/10 dark:text-slate-100"
                  : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
              }`}
              onClick={() => setDateFilter("all")}
            >
              <span>Explore all</span>
              <Compass className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </motion.section>

{/* // TRENDING */}
<motion.section className="space-y-4" variants={fadeUp}>
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
      Trending now
    </h2>
    <button
      type="button"
      className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
      onClick={() => navigate("/events")}
    >
      Explore all events
    </button>
  </div>

  {loading ? (
    <p className="text-xs text-slate-500 dark:text-slate-400">
      Loading events…
    </p>
  ) : (
    <motion.div
      className="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
      variants={pageStagger}
    >
      {filteredTrending.length === 0 ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 col-span-full">
          No events match this date filter yet.
        </p>
      ) : (
        filteredTrending.map((evt) => (
          <EventCard key={evt.id} event={evt} />
        ))
      )}
    </motion.div>
  )}
</motion.section>

{/* // SPORTS */}
<motion.section className="space-y-4" variants={fadeUp}>
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
      Sports to catch soon
    </h2>
    <span className="text-[11px] text-slate-500 flex items-center gap-1 dark:text-slate-400">
      <Sparkles className="w-3 h-3 text-emerald-500" />
      Hand-picked sports events
    </span>
  </div>

  {sportsSoon.length === 0 ? (
    <p className="text-xs text-slate-500 dark:text-slate-400">
      Add sports events in the admin panel to see them here.
    </p>
  ) : (
    <motion.div
      className="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
      variants={pageStagger}
    >
      {sportsSoon.map((evt) => (
        <EventCard key={evt.id} event={evt} />
      ))}
    </motion.div>
  )}
</motion.section>


{/* // CONCERTS */}
<motion.section className="space-y-4" variants={fadeUp}>
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
      Concerts you&apos;ll love
    </h2>
  </div>

  {concerts.length === 0 ? (
    <p className="text-xs text-slate-500 dark:text-slate-400">
      Add concerts in the admin panel to see them here.
    </p>
  ) : (
    <motion.div
      className="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
      variants={pageStagger}
    >
      {concerts.map((evt) => (
        <EventCard key={evt.id} event={evt} />
      ))}
    </motion.div>
  )}
</motion.section>

{/* SOCIAL PROOF */}
{/* SOCIAL PROOF */}
<motion.section className="space-y-6 overflow-hidden" variants={fadeUp}>
  <div className="text-center space-y-2">
    <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
      Trusted by fans worldwide
    </p>
    <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-100">
      More than{" "}
      <span className="text-emerald-600 dark:text-emerald-400">
        17,000,000
      </span>{" "}
      happy fans from over{" "}
      <span className="text-emerald-600 dark:text-emerald-400">
        40
      </span>{" "}
      countries
    </h2>
  </div>

  {/* Auto swiper */}
  <div className="relative">
    <motion.div
      className="flex gap-4"
      animate={{ x: ["0%", "-50%"] }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: 30,
        ease: "linear",
      }}
      drag="x"
      dragConstraints={{ left: -1000, right: 0 }}
    >
      {[
        {
          name: "Lynsey",
          image: "https://i.pravatar.cc/80?img=32",
          text:
            "I was panicking they wouldn’t sell, but 24 hours later they went to a happy customer. Such a great site.",
        },
        {
          name: "Rob",
          image: "https://i.pravatar.cc/80?img=12",
          text:
            "38 seconds is all it took to sell my ticket. Hope the buyer enjoys it as much as I would have.",
        },
        {
          name: "Mina",
          image: "https://i.pravatar.cc/80?img=47",
          text:
            "Super smooth experience buying last-minute seats. Instant delivery and clear pricing.",
        },
        {
          name: "Daniel",
          image: "https://i.pravatar.cc/80?img=22",
          text:
            "Customer support helped me instantly on Telegram. Felt safe the entire time.",
        },
        {
          name: "Pedri",
          image: "https://i.pravatar.cc/80?img=65",
          text:
            "Best fan-to-fan ticket platform I’ve used. No stress, no scams.",
        },

        /* Duplicate for seamless loop */
        {
          name: "Lynsey",
          image: "https://i.pravatar.cc/80?img=32",
          text:
            "I was panicking they wouldn’t sell, but 24 hours later they went to a happy customer. Such a great site.",
        },
        {
          name: "Rob",
          image: "https://i.pravatar.cc/80?img=12",
          text:
            "38 seconds is all it took to sell my ticket. Hope the buyer enjoys it as much as I would have.",
        },
        {
          name: "Mina",
          image: "https://i.pravatar.cc/80?img=47",
          text:
            "Super smooth experience buying last-minute seats. Instant delivery and clear pricing.",
        },
      ].map((t, i) => (
        <div
          key={i}
          className="min-w-[85%] sm:min-w-[60%] md:min-w-[32%] bg-white border border-slate-200 rounded-2xl p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800"
        >
          <div className="flex items-center gap-3 mb-2">
            <img
              src={t.image}
              alt={t.name}
              className="w-10 h-10 rounded-full object-cover"
              loading="lazy"
            />
            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              {t.name}
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            “{t.text}”
          </p>
        </div>
      ))}
    </motion.div>

    {/* Mobile hint */}
    <p className="mt-2 text-center text-[11px] text-slate-400 md:hidden">
      Swipe or wait to see more →
    </p>
  </div>
</motion.section>


    </motion.div>
  );
}
