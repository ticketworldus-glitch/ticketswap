// src/pages/payments/GiftCardPayment.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import useAuth from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { Gift, ArrowLeft, FileImage, Store } from "lucide-react";

const pageStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const GIFT_CARD_OPTIONS = [
  { value: "", label: "Select a gift card brand" },
  { value: "apple", label: "Apple" },
  { value: "walmart", label: "Walmart" },
  { value: "amazon", label: "Amazon" },
  { value: "target", label: "Target" },
  { value: "google-play", label: "Google Play" },
  { value: "steam", label: "Steam" },
  { value: "visa", label: "Visa (Gift)" },
  { value: "mastercard", label: "Mastercard (Gift)" },
  { value: "other", label: "Other" },
];

export default function GiftCardPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
const [giftCardImageUrl, setGiftCardImageUrl] = useState("");
const [uploadingImage, setUploadingImage] = useState(false);

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "TicketGen";
const handleGiftCardImageUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploadingImage(true);
  setFileName(file.name);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      setGiftCardImageUrl(data.secure_url);
    } else {
      alert("Image upload failed. Check Cloudinary settings.");
    }
  } catch (err) {
    console.error("Gift card image upload error:", err);
    alert("Upload failed. Try again.");
  } finally {
    setUploadingImage(false);
  }
};

  const event = location.state?.event || null;
  const tickets = location.state?.tickets || [];

  const [giftCardBrand, setGiftCardBrand] = useState("");
  const [giftCardBrandOther, setGiftCardBrandOther] = useState("");
  const [giftCode, setGiftCode] = useState("");
  const [note, setNote] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalPrice = useMemo(
    () => tickets.reduce((sum, t) => sum + (Number(t.price) || 0), 0),
    [tickets]
  );

  if (!event || tickets.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          No order found. Go back to checkout.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Gift card payment
        </h1>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          You must be logged in to submit a payment.
        </p>
        <button
          onClick={() =>
            navigate("/auth/login", { state: { from: "/checkout" } })
          }
          className="px-4 py-2 rounded-full bg-emerald-600 text-sm font-medium text-white"
        >
          Log in
        </button>
      </div>
    );
  }

  const totalTickets = tickets.length;

  const resolvedBrand =
    giftCardBrand === "other"
      ? (giftCardBrandOther || "").trim()
      : giftCardBrand;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!giftCardBrand) {
      alert("Please select a gift card brand.");
      return;
    }
    if (giftCardBrand === "other" && !giftCardBrandOther.trim()) {
      alert("Please enter the gift card brand name.");
      return;
    }
    if (!giftCode.trim()) {
      alert("Please enter a gift card code.");
      return;
    }
if (!giftCardImageUrl) {
  alert("Please upload an image of the gift card (required).");
  return;
}


    setSubmitting(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        eventId: event.id,
        tickets: tickets.map((t) => t.id),
        total: totalPrice,
        status: "pending",
        paymentMethod: "gift-card",

        // ✅ Added fields
        giftCardBrand: resolvedBrand || null,

        giftCardCode: giftCode.trim(),
        giftCardNote: note || null,
        giftCardImageUrl: giftCardImageUrl,
        giftCardImageName: fileName || null,
        createdAt: serverTimestamp(),
      });

      navigate("/profile");
    } catch (err) {
      console.error("Gift card submit error", err);
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-8 space-y-6"
      variants={pageStagger}
      initial="hidden"
      animate="visible"
    >


      {/* HEADER + BACK */}
      <motion.header
        variants={fadeUp}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-semibold text-white">
              2
            </span>
            <span>Payment — Gift card</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Pay with gift card
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Select the gift card brand, enter the code, and upload a clear
            photo of the card.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/checkout")}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to checkout
        </button>
      </motion.header>

      {/* MAIN GRID: LEFT = ORDER, RIGHT = FORM */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.4fr)]">
        {/* LEFT: ORDER SUMMARY */}
        <motion.section variants={fadeUp} className="space-y-4">
          {/* Event card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Order summary
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {event.artistName} — {event.eventName}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {event.date} • {event.time} • {event.venue} • {event.city}
                </p>
              </div>
              <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                <Gift className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
              <p>
                {totalTickets} ticket{totalTickets !== 1 ? "s" : ""} • Total:{" "}
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </p>
            </div>
          </div>

          {/* Small "What happens next" card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              How this works
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>Select a gift card brand.</li>
              <li>Enter a gift card code.</li>
              <li>Upload a clear image of the “gift card”.</li>
              <li>
                Submit your request — your order will be created as{" "}
                <span className="font-semibold">pending</span>.
              </li>
              <li>
                An admin reviews and marks it as{" "}
                <span className="font-semibold">paid</span> or{" "}
                <span className="font-semibold">rejected</span>.
              </li>
            </ol>
          </div>
        </motion.section>

        {/* RIGHT: PAYMENT FORM */}
        <motion.form
          onSubmit={handleSubmit}
          variants={fadeUp}
          className="bg-white border border-slate-200 rounded-xl p-4 space-y-5 shadow-sm dark:bg-slate-900 dark:border-slate-800"
        >
          {/* Gift card brand */}
          <div className="space-y-1 text-xs">
            <label className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
              <Store className="w-3 h-3" />
              Gift card brand <span className="text-red-500">*</span>
            </label>
            <select
              value={giftCardBrand}
              onChange={(e) => {
                setGiftCardBrand(e.target.value);
                if (e.target.value !== "other") setGiftCardBrandOther("");
              }}
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
            >
              {GIFT_CARD_OPTIONS.map((opt) => (
                <option key={opt.value || "empty"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {giftCardBrand === "other" && (
              <div className="mt-2 space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-medium">
                  Enter brand name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={giftCardBrandOther}
                  onChange={(e) => setGiftCardBrandOther(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
                  placeholder="e.g. Best Buy, Sephora, etc."
                />
              </div>
            )}
          </div>

          {/* Gift code */}
          <div className="space-y-1 text-xs">
            <label className="text-slate-700 dark:text-slate-300 font-medium">
              Gift card code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
              placeholder=""
            />
            
          </div>

          {/* Gift card image upload (REQUIRED) */}
          <div className="space-y-1 text-xs">
            <label className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
              <FileImage className="w-3 h-3" />
              Gift card image <span className="text-red-500">*</span>
            </label>

            <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
              <label className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                <span className="text-[11px] font-medium">
                  Click to upload a photo of the gift card
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  PNG, JPG up to a few MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  required
                  disabled={uploadingImage}
                  onChange={handleGiftCardImageUpload}
                  className="mt-2 block w-full text-[11px] text-slate-600 dark:text-slate-300"
                />
                {submitting || uploadingImage
                ? "Uploading..."
                : "Submit gift card"}

              </label>
            </div>

            {fileName && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Selected: <span className="font-medium">{fileName}</span> (file
                name stored for admin review).
              </p>
            )}
          </div>

          {/* Note for admin */}
          <div className="space-y-1 text-xs">
            <label className="text-slate-700 dark:text-slate-300 font-medium">
              Note for admin (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
              placeholder="Add any comments or instructions you want the admin to see..."
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit gift card"}
            </button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}
