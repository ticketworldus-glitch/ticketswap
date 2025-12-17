// src/pages/Contact.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  MessageCircle,
  Megaphone,
  ArrowUpRight,
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import useAuth from "../hooks/useAuth";

const TELEGRAM_ADMIN_USERNAME = "yourAdminUsername"; // <-- change
const TELEGRAM_CHANNEL_LINK = "https://t.me/yourChannelName"; // <-- change

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function Contact() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: user?.email || "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.message.trim()) {
      setError("Please enter a message.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "contactMessages"), {
        name: form.name || null,
        email: form.email || null,
        message: form.message,
        userId: user?.uid || null,
        createdAt: serverTimestamp(),
        status: "new",
      });

      setSent(true);
      setForm({ name: "", email: user?.email || "", message: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* HEADER */}
        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            Contact & Support
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Reach out to our team or join the community for updates.
          </p>
        </motion.header>

        {/* TELEGRAM ACTIONS */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2"
        >
          {/* Telegram Admin */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-sky-100 text-sky-700 p-2 dark:bg-sky-900/40 dark:text-sky-200">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Contact admin on Telegram
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Fastest way to reach us for support, issues, or questions.
                </p>
                <a
                  href={`https://t.me/${TELEGRAM_ADMIN_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Open Telegram chat
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Telegram Channel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-indigo-100 text-indigo-700 p-2 dark:bg-indigo-900/40 dark:text-indigo-200">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Join our Telegram channel
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Get announcements, updates, and important notices.
                </p>
                <a
                  href={TELEGRAM_CHANNEL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  View Telegram channel
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CONTACT FORM */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800"
        >
          <div className="space-y-2 mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Send us a message
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Prefer email-style contact? Send a message and we’ll respond.
            </p>
          </div>

          {sent && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-200">
              Your message has been sent. We’ll get back to you soon.
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">
                  Name (optional)
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300">
                  Email (optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 dark:text-slate-300">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                required
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
                placeholder="Write your message here..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-5 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                {submitting ? "Sending..." : "Send message"}
              </button>
            </div>
          </form>
        </motion.section>
      </div>
    </div>
  );
}
