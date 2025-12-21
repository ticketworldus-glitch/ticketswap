// src/components/SellerTicketForm.jsx
import { useEffect, useState } from "react";

export default function SellerTicketForm({
  events,
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState({
    eventId: "",
    locationId: "",
    section: "",
    row: "",
    seatNumber: "",
    seatDescription: "",
    ticketCount: 1,
    highlightText: "",
    priceNow: "",
    priceBefore: "",
    ticketImageUrl: "",
    extraDescription: "",
    ranking: "",
    bestTag: "",
  });

  const [uploadingTicketImage, setUploadingTicketImage] = useState(false);

  const selectedEvent = events.find((e) => e.id === form.eventId);
  const locations = Array.isArray(selectedEvent?.locations)
    ? selectedEvent.locations
    : [];

  // Reset location when event changes
  useEffect(() => {
    if (!selectedEvent) {
      setForm((f) => ({ ...f, locationId: "" }));
    } else if (
      selectedEvent &&
      !selectedEvent.locations?.some((l) => l.id === form.locationId)
    ) {
      setForm((f) => ({ ...f, locationId: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        name === "ticketCount" || name === "ranking"
          ? value.replace(/[^\d]/g, "")
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      ticketCount: Number(form.ticketCount) || 1,
      ranking: form.ranking ? Number(form.ranking) : null,
    };

    onSubmit(payload);
  };
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET =
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "TicketGen"; // from your preset

  // Cloudinary ticket image upload
  const handleTicketImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTicketImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET); // unsigned preset
      // TODO: replace YOUR_CLOUD_NAME with your actual Cloudinary cloud name
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.secure_url) {
        setForm((f) => ({
          ...f,
          ticketImageUrl: data.secure_url,
        }));
      } else {
        alert("Could not upload image. Check Cloudinary settings.");
      }
    } catch (err) {
      console.error("Ticket image upload error:", err);
      alert("Upload failed. Try again.");
    } finally {
      setUploadingTicketImage(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Select event & location */}
      <div className="space-y-2 text-xs">
        <label className="text-slate-700 dark:text-slate-300">
          Select event
        </label>
        <select
          name="eventId"
          value={form.eventId}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
        >
          <option value="">Choose an event</option>
          {events.map((evt) => (
            <option key={evt.id} value={evt.id}>
              {evt.artistName} — {evt.eventName}
            </option>
          ))}
        </select>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          Pick the tour/event this ticket belongs to.
        </p>
      </div>

      <div className="space-y-2 text-xs">
        <label className="text-slate-700 dark:text-slate-300">
          Select location for this ticket
        </label>
        <select
          name="locationId"
          value={form.locationId}
          onChange={handleChange}
          disabled={!selectedEvent}
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
        >
          <option value="">
            {selectedEvent ? "Choose a location" : "Select event first"}
          </option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}{" "}
              {loc.type
                ? `(${loc.type === "parking" ? "Parking" : "Event"})`
                : ""}
            </option>
          ))}
        </select>
        {selectedEvent && locations.length > 0 && (
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Dates for this location:{" "}
            {locations
              .find((l) => l.id === form.locationId)
              ?.dates?.join(", ") || locations[0].dates?.join(", ")}
          </p>
        )}
      </div>

      {/* Seating vs standing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="space-y-1">
          <label className="text-slate-700 dark:text-slate-300">
            Section (optional)
          </label>
          <input
            name="section"
            value={form.section}
            onChange={handleChange}
            placeholder="A, B, Floor, etc."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-700 dark:text-slate-300">
            Row (optional)
          </label>
          <input
            name="row"
            value={form.row}
            onChange={handleChange}
            placeholder="3, 12, GA, etc."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-700 dark:text-slate-300">
            Seat number (optional)
          </label>
          <input
            name="seatNumber"
            value={form.seatNumber}
            onChange={handleChange}
            placeholder="45, 102, etc."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <label className="text-slate-700 dark:text-slate-300">
          If no specific seat: describe the area (standing / general view)
        </label>
        <input
          name="seatDescription"
          value={form.seatDescription}
          onChange={handleChange}
          placeholder="Standing - General Admission, Clear view, Front of stage, etc."
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
        />
      </div>

      {/* Ticket count + highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <label className="text-slate-700 dark:text-slate-300">
            Number of tickets
          </label>
          <input
            type="number"
            name="ticketCount"
            min={1}
            value={form.ticketCount}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-700 dark:text-slate-300">
            Catchy highlight text
          </label>
          <input
            name="highlightText"
            value={form.highlightText}
            onChange={handleChange}
            placeholder="Act fast – in high demand and viewed by 27 people in the past hour."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <label className="text-slate-700 dark:text-slate-300">
            Current price
          </label>
          <input
            type="number"
            step="0.01"
            name="priceNow"
            value={form.priceNow}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-700 dark:text-slate-300">
            Original price (optional)
          </label>
          <input
            type="number"
            step="0.01"
            name="priceBefore"
            value={form.priceBefore}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Ticket image + extra description (Cloudinary upload + preview) */}
      <div className="space-y-2 text-xs">
        <label className="text-slate-700 dark:text-slate-300">
          Ticket image
        </label>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <label className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-[11px] font-medium text-white shadow-sm hover:bg-slate-800 cursor-pointer dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
            <span>
              {uploadingTicketImage ? "Uploading..." : "Upload ticket image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleTicketImageUpload}
              disabled={uploadingTicketImage}
            />
          </label>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            JPG or PNG. Uploaded via Cloudinary. We’ll store the URL with your
            ticket.
          </span>
        </div>

        {/* URL (read/write, in case you want to paste a custom URL) */}
        <input
          name="ticketImageUrl"
          value={form.ticketImageUrl}
          onChange={handleChange}
          placeholder="https://... (optional manual URL override)"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
        />

        {/* Preview */}
        {form.ticketImageUrl && (
          <div className="mt-2">
            <p className="mb-1 text-[10px] text-slate-500 dark:text-slate-400">
              Preview:
            </p>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2 max-w-xs dark:bg-slate-950 dark:border-slate-800">
              <img
                src={form.ticketImageUrl}
                alt="Ticket preview"
                className="h-32 w-full rounded object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1 text-xs">
        <label className="text-slate-700 dark:text-slate-300">
          Extra description (clear view, event organizer, etc.)
        </label>
        <textarea
          name="extraDescription"
          value={form.extraDescription}
          onChange={handleChange}
          rows={3}
          placeholder="Clear view, no obstructions. Official Ticketmaster purchase. Event organizer: Live Nation..."
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
        />
      </div>

      {/* Ranking + tag */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <label className="text-slate-700 dark:text-slate-300">
            Ranking (1–10, optional)
          </label>
          <input
            type="number"
            name="ranking"
            min={1}
            max={10}
            value={form.ranking}
            onChange={handleChange}
            placeholder="8"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-700 dark:text-slate-300">
            Best tag (optional)
          </label>
          <input
            name="bestTag"
            value={form.bestTag}
            onChange={handleChange}
            placeholder="Best view, Cheapest VIP, Great value, etc."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting ticket..." : "Submit ticket"}
      </button>
    </form>
  );
}
