// src/pages/payments/CryptoPayment.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import useAuth from "../../hooks/useAuth";
import { motion } from "framer-motion";
import {
  Bitcoin,
  ArrowLeft,
  Copy,
  CheckCircle2,
  Wallet,
  ShieldAlert,
} from "lucide-react";

/**
 * ✅ Configure your (test) receiving addresses here.
 * You can swap these to real addresses later.
 */
const CRYPTO_OPTIONS = [
  {
    value: "btc",
    label: "Bitcoin (BTC)",
    short: "BTC",
    address: "17i2TQycxWjp4h4nU5FPy6z5bK3gUXCPXd",
    network: "Bitcoin",
    note: "Send BTC on the Bitcoin network only.",
  },
  {
    value: "eth",
    label: "Ethereum (ETH)",
    short: "ETH",
    address: "0x1f160f6af8b83abded799ea3efb0718693b767fe",
    network: "Ethereum",
    note: "Send ETH on Ethereum mainnet only.",
  },
  {
    value: "usdt-erc20",
    label: "USDT (ERC-20)",
    short: "USDT",
    address: "0x1f160f6af8b83abded799ea3efb0718693b767fe",
    network: "Ethereum (ERC-20)",
    note: "Send USDT via ERC-20 only (Ethereum).",
  },
  {
    value: "usdc-erc20",
    label: "USDC (ERC-20)",
    short: "USDC",
    address: "0x1f160f6af8b83abded799ea3efb0718693b767fe",
    network: "Ethereum (ERC-20)",
    note: "Send USDC via ERC-20 only (Ethereum).",
  },
  {
    value: "sol",
    label: "Solana (SOL)",
    short: "SOL",
    address: "EsvBxbR4cX1D1CokicXdcLcuvS5k6jqsqeMuZ4i6k9NC",
    network: "Solana",
    note: "Send SOL on Solana network only.",
  },
];

const pageStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

function shortAddr(addr = "") {
  if (!addr) return "";
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

export default function CryptoPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const event = location.state?.event || null;
  const tickets = location.state?.tickets || [];

  const totalPrice = useMemo(
    () => tickets.reduce((sum, t) => sum + (Number(t.price) || 0), 0),
    [tickets]
  );

  // Form state
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTO_OPTIONS[0].value);
  const [txRef, setTxRef] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // UI state
  const [copied, setCopied] = useState(false);

  const cryptoMeta =
    CRYPTO_OPTIONS.find((c) => c.value === selectedCrypto) ||
    CRYPTO_OPTIONS[0];

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
          Crypto payment
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cryptoMeta.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      // fallback
      const el = document.createElement("textarea");
      el.value = cryptoMeta.address;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCrypto) {
      alert("Please select a cryptocurrency.");
      return;
    }

    // In test mode, still require a reference so admin can "verify" it
    if (!txRef.trim()) {
      alert("Please enter a transaction reference/hash.");
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
        paymentMethod: "crypto",

        // ✅ Crypto details
        cryptoCurrency: cryptoMeta.short,
        cryptoNetwork: cryptoMeta.network,
        cryptoAddress: cryptoMeta.address,
        cryptoTxRef: txRef.trim(),
        cryptoNote: note || null,

        createdAt: serverTimestamp(),
      });

      navigate("/profile");
    } catch (err) {
      console.error("Crypto submit error", err);
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const totalTickets = tickets.length;

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
            <span>Payment — Crypto</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Pay with crypto
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Select the crypto you want to use and we’ll show the correct address
            automatically.
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

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.4fr)]">
        {/* LEFT: ORDER SUMMARY */}
        <motion.section variants={fadeUp} className="space-y-4">
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
              <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200">
                <Bitcoin className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
              <p>
                {totalTickets} ticket{totalTickets !== 1 ? "s" : ""} • Total:{" "}
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Important
            </h3>
            <div className="flex gap-2 text-slate-600 dark:text-slate-400">
              <ShieldAlert className="w-4 h-4 mt-[2px]" />
              <p>
                Only send the selected coin on the specified network. 
              </p>
            </div>
          </div>
        </motion.section>

        {/* RIGHT: FORM */}
        <motion.form
          onSubmit={handleSubmit}
          variants={fadeUp}
          className="bg-white border border-slate-200 rounded-xl p-4 space-y-5 shadow-sm dark:bg-slate-900 dark:border-slate-800"
        >
          {/* Select crypto */}
          <div className="space-y-1 text-xs">
            <label className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
              <Wallet className="w-3 h-3" />
              Choose cryptocurrency <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
            >
              {CRYPTO_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Network: <span className="font-medium">{cryptoMeta.network}</span>{" "}
              • {cryptoMeta.note}
            </p>
          </div>

          {/* Address box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Send to this address
              </p>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {cryptoMeta.short} address
              </p>
              <p className="mt-1 font-mono text-xs text-slate-900 break-all dark:text-slate-100">
                {cryptoMeta.address}
              </p>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                Preview: {shortAddr(cryptoMeta.address)}
              </p>
            </div>
          </div>

          {/* Tx reference/hash */}
          <div className="space-y-1 text-xs">
            <label className="text-slate-700 dark:text-slate-300 font-medium">
              Transaction reference / hash <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={txRef}
              onChange={(e) => setTxRef(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
              placeholder="Paste transaction hash"
            />

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
              placeholder="Anything you want the admin to know…"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Your order is
              created as <span className="font-semibold">pending</span>.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit crypto"}
            </button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}
