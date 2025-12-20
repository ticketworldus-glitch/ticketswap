// src/pages/TicketSelection.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { MapPin, Tag, Info } from "lucide-react";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";

function formatMoney(n) {
  const num = Number(n) || 0;
  return num.toFixed(2);
}

// Rating label like 8.5 → "Great"
function getRatingLabel(score) {
  if (!score && score !== 0) return "";
  const s = Number(score);
  if (s >= 9.0) return "Amazing";
  if (s >= 8.0) return "Great";
  if (s >= 7.0) return "Good";
  return "Fair";
}

// Urgency label like "Only 2 left"
function getUrgencyLabel(ticketCount) {
  const n = Number(ticketCount) || 0;
  if (n === 0) return "";
  if (n <= 2) return `Only ${n} left`;
  if (n <= 5) return `Only ${n} left`;
  return "";
}

const MotionButton = motion.button;

export default function TicketSelection() {
  const { id } = useParams(); // event id
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(1); // 1 = show preferences modal, 2 = ticket list
  const [seatCount, setSeatCount] = useState(1);
  const [sitTogether, setSitTogether] = useState(true);
  const [locationFilter, setLocationFilter] = useState("");

  const [selectedTicketIds, setSelectedTicketIds] = useState([]);
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  // Fetch event + tickets
  useEffect(() => {
    const fetchData = async () => {
      const eventRef = doc(db, "events", id);
      const eventSnap = await getDoc(eventRef);
      if (eventSnap.exists()) {
        setEvent({ id: eventSnap.id, ...eventSnap.data() });
      } else {
        setEvent(null);
      }

      const qTickets = query(
        collection(db, "tickets"),
        where("eventId", "==", id),
        where("status", "==", "active")
      );
      const snap = await getDocs(qTickets);
      setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));

      setLoading(false);
    };

    fetchData();
  }, [id]);

  // If navigated from EventDetails with a specific location
  useEffect(() => {
    const locIdFromState = location.state?.locationId;
    if (locIdFromState) {
      setLocationFilter(locIdFromState);
      setStep(2);
    }
  }, [location.state]);

  // Always have one ticket auto-selected & expanded (the first visible one)
  useEffect(() => {
    if (loading) return;
    if (!tickets.length) return;

    const visible = tickets.filter(
      (t) => !locationFilter || t.locationId === locationFilter
    );
    if (!visible.length) return;

    const first = visible[0];

    if (!expandedTicketId || !visible.some((t) => t.id === expandedTicketId)) {
      setExpandedTicketId(first.id);
    }
    if (
      selectedTicketIds.length === 0 ||
      !visible.some((t) => selectedTicketIds.includes(t.id))
    ) {
      setSelectedTicketIds([first.id]);
    }
  }, [loading, tickets, locationFilter, expandedTicketId, selectedTicketIds]);

  const totalSelected = selectedTicketIds.length;

  const toggleSelect = (ticketId) => {
    setSelectedTicketIds((prev) => {
      // Single-select behaviour when preference is 1 ticket
      if (seatCount === 1) {
        if (prev[0] === ticketId) {
          // clicking again unselects
          return [];
        }
        return [ticketId];
      }

      // Multi-select behaviour when preference is 2+
      if (prev.includes(ticketId)) {
        return prev.filter((x) => x !== ticketId);
      }
      if (prev.length >= seatCount) {
        // don't exceed chosen count
        return prev;
      }
      return [...prev, ticketId];
    });
  };

  const handleCardClick = (ticketId) => {
    // Keep selection logic as-is
    toggleSelect(ticketId);
    // Always open the newly clicked one and close the previous
    setExpandedTicketId(ticketId);
  };

  const visibleTickets = useMemo(
    () =>
      tickets.filter(
        (t) => !locationFilter || t.locationId === locationFilter
      ),
    [tickets, locationFilter]
  );

  const selectedTickets = useMemo(
    () => tickets.filter((t) => selectedTicketIds.includes(t.id)),
    [tickets, selectedTicketIds]
  );

  // Total price = (sum of selected ticket prices) × number of tickets chosen
  const totalPrice = useMemo(() => {
    const baseTotal = selectedTickets.reduce(
      (sum, t) => sum + (Number(t.price) || 0),
      0
    );
    const count = Number(seatCount) || 1;
    return baseTotal * count;
  }, [selectedTickets, seatCount]);

  const handleProceedToCheckout = () => {
    if (selectedTickets.length === 0) return;

    // Must be logged in before going to payment
    if (!user) {
      navigate("/auth/login", {
        state: { from: `/event/${id}/tickets` },
      });
      return;
    }

    navigate("/checkout", {
      state: {
        event,
        tickets: selectedTickets,
        preferences: {
          seatCount,
          sitTogether,
          locationFilter,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Loading tickets...
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

  // Derived values (no hooks from here down)
  const primaryLocation =
    Array.isArray(event.locations) && event.locations.length > 0
      ? event.locations[0]
      : null;

  const headerLocation =
    primaryLocation?.name || "Multiple locations";

  const headerDates =
    (event.tourStartDate && event.tourEndDate
      ? `${event.tourStartDate} → ${event.tourEndDate}`
      : primaryLocation?.dates?.join(" · ")) || "Dates TBA";

  const locationOptions = Array.isArray(event.locations)
    ? event.locations.map((loc) => ({
        id: loc.id,
        label: loc.name,
      }))
    : [];
  const currentLocationLabel =
    locationFilter &&
    locationOptions.find((l) => l.id === locationFilter)?.label;

    
  return (
    <div className="relative max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {event.artistName} — {event.eventName}
        </h1>
        <p className="text-xs text-slate-500 flex flex-wrap gap-2 items-center dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {headerLocation}
          </span>
          <span>· {headerDates}</span>
        </p>
      </header>


{/* PREFERENCES MODAL (modern, centered, responsive) */}
{step === 1 && (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
    <div className="w-full max-w-sm sm:max-w-md rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
      
      {/* Header */}
      <div className="px-6 pt-6 text-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          How many tickets?
        </h2>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        {/* Ticket count dropdown */}
        <div>
          <select
            value={seatCount}
            onChange={(e) => {
              const v = Number(e.target.value) || 1;
              setSeatCount(v);
              setSelectedTicketIds([]);
              setExpandedTicketId(null);
            }}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} ticket{i + 1 > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Sit together toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-emerald-600">🪑</div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                We want to be seated together
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                We’ll find the best available tickets based on your criteria
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSitTogether(!sitTogether)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              sitTogether ? "bg-emerald-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                sitTogether ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Location filter */}
        {locationOptions.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-slate-300">
              Filter by location (optional)
            </label>
            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setSelectedTicketIds([]);
                setExpandedTicketId(null);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
            >
              <option value="">All locations</option>
              {locationOptions.map((loc) => (
                <option key={loc.id || loc.label} value={loc.id}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <button
          onClick={() => setStep(2)}
          className="w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
)}


      {/* STEP 2 – TICKETS LIST (viagogo style) */}
      {step === 2 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Available tickets
            </h2>
            <button
              onClick={() => {
                setStep(1);
                setExpandedTicketId(null);
              }}
              className="text-xs text-emerald-600 underline dark:text-emerald-400"
            >
              Change preferences
            </button>
          </div>

          {visibleTickets.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No tickets have been listed yet for this selection.
            </p>
          ) : (
            <>
              {/* Ticket cards */}
              <div className="space-y-3">
                {visibleTickets.map((t) => {
                  const isSelected = selectedTicketIds.includes(t.id);
                  const isExpanded = expandedTicketId === t.id;
                  const isActive = isSelected || isExpanded;

                  const hasSeatInfo = t.section || t.row || t.seatNumber;
                  const seatLabel = hasSeatInfo
                    ? [t.section, t.row, t.seatNumber]
                        .filter(Boolean)
                        .join(" • ")
                    : t.seatDescription || "General admission";

                  const ratingScore = t.ranking;
                  const ratingLabel = getRatingLabel(ratingScore);
                  const urgencyLabel =
                    t.urgencyLabel || getUrgencyLabel(t.ticketCount);
                  const featureLabel =
                    t.featureLabel ||
                    (t.cheapest ? "Cheapest" : "") ||
                    (t.bestView ? "Best view" : "");

                  return (
                    <div
                      key={t.id}
                      className={`rounded-2xl shadow-sm border transition-colors ${
                        isActive
                          ? "bg-emerald-50/60 border-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/70"
                          : "bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800"
                      }`}
                    >
                      <MotionButton
                        type="button"
                        onClick={() => handleCardClick(t.id)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        className={`w-full text-left px-4 py-3 rounded-2xl flex flex-col gap-2 transition-colors ${
                          isActive
                            ? "ring-2 ring-emerald-500/80 bg-emerald-50/60 dark:bg-emerald-500/10"
                            : "ring-0 bg-transparent"
                        }`}
                      >
                        {/* Top row: feature + urgency + rating pill */}
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <div className="flex items-center gap-2">
                            {featureLabel && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium border border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-900">
                                {featureLabel}
                              </span>
                            )}
                            {t.bestTag && !featureLabel && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-900">
                                {t.bestTag}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {urgencyLabel && (
                              <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white font-semibold border border-pink-600">
                                {urgencyLabel}
                              </span>
                            )}
                            {ratingScore && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-900 dark:text-emerald-200">
                                <span>{Number(ratingScore).toFixed(1)}</span>
                                <span>{ratingLabel}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Main row: left description, right price */}
                        <div className="flex items-start justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {t.locationName || seatLabel || "Listing"}
                            </p>
                            {Array.isArray(t.locationDates) &&
                              t.locationDates.length > 0 && (
                                <p className="text-slate-500 dark:text-slate-400">
                                  {t.locationDates.join(" · ")}
                                </p>
                              )}

                            <p className="text-slate-500 dark:text-slate-400">
                              {t.ticketCount
                                ? `${t.ticketCount} ticket${
                                    t.ticketCount > 1 ? "s" : ""
                                  } • ${seatLabel}`
                                : seatLabel}
                            </p>
                          </div>

                          {/* Price block */}
                          <div className="text-right space-y-1">
                            {t.originalPrice && (
                              <p className="text-[11px] text-slate-400 line-through">
                                ${formatMoney(t.originalPrice)}
                              </p>
                            )}
                            <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                              ${formatMoney(t.price)}
                            </p>
                          </div>
                        </div>
                      </MotionButton>

                      {/* Accordion details */}
                      {isExpanded && (
                        <div className="border-t border-slate-200 px-4 py-3 text-xs space-y-3 dark:border-slate-800">
                          <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                            <Info className="w-3 h-3 mt-[2px]" />
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-800 dark:text-slate-100">
                                Listing details
                              </p>
                              <p>
                                Section / row / seat:{" "}
                                {hasSeatInfo
                                  ? [t.section, t.row, t.seatNumber]
                                      .filter(Boolean)
                                      .join(" • ")
                                  : "Not specified"}
                              </p>
                              {t.highlightText && (
                                <p className="text-amber-600 dark:text-amber-300">
                                  {t.highlightText}
                                </p>
                              )}
                              {t.notes && (
                                <p className="text-slate-600 dark:text-slate-300">
                                  {t.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* BIG TICKET IMAGE (always big & readable) */}
                          {t.ticketImageUrl && (
                            <div className="space-y-2">
                              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                                Ticket image (scroll/zoom to read details)
                              </p>
                              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800">
                                <div className="max-h-80 md:max-h-[28rem] overflow-auto flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                                  <img
                                    src={t.ticketImageUrl}
                                    alt="Ticket"
                                    className="w-full h-auto object-contain md:w-[90%]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Perks row */}
                          {Array.isArray(t.perks) && t.perks.length > 0 && (
                            <div className="flex flex-wrap gap-2 text-[11px]">
                              {t.perks.map((perk) => (
                                <span
                                  key={perk}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                                >
                                  <Tag className="w-3 h-3" />
                                  {perk}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Preference summary + footer */}
              <div className="flex flex-col gap-3 mt-4 text-xs">
                <div className="space-y-1 text-slate-600 dark:text-slate-300">
                  <p>
                    Preference:{" "}
                    <span className="font-semibold">
                      {seatCount} ticket{seatCount !== 1 ? "s" : ""}
                    </span>{" "}
                    · Sit together:{" "}
                    <span className="font-semibold">
                      {sitTogether ? "Yes" : "No"}
                    </span>
                    {currentLocationLabel && (
                      <>
                        {" "}
                        · Location:{" "}
                        <span className="font-semibold">
                          {currentLocationLabel}
                        </span>
                      </>
                    )}
                  </p>
                  <p>
                    Selected: {totalSelected}/{seatCount} listing
                    {seatCount !== 1 ? "s" : ""}{" "}
                    {sitTogether && selectedTickets.length > 0
                      ? "· we’ll try to keep seats together when possible"
                      : ""}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Total: ${totalPrice.toFixed(2)}{" "}
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      ({seatCount} ticket{seatCount !== 1 ? "s" : ""})
                    </span>
                  </p>

                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full border border-slate-300 text-[11px] text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                      onClick={() => {
                        setStep(1);
                        setExpandedTicketId(null);
                      }}
                    >
                      Change preference
                    </button>
                    <button
                      disabled={selectedTicketIds.length === 0}
                      onClick={handleProceedToCheckout}
                      className="px-5 py-2 rounded-full bg-emerald-600 text-xs font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Proceed to checkout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
