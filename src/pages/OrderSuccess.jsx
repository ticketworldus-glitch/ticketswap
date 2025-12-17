// src/pages/OrderSuccess.jsx
import { useLocation, Link } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId || null;

  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-4">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/20 border border-emerald-500 text-emerald-400 text-2xl">
        ✓
      </div>
      <h1 className="text-2xl font-semibold">Order Confirmed</h1>
      <p className="text-sm text-slate-300">
        Your ticket purchase was successful. You’ll receive a confirmation email
        shortly.
      </p>
      {orderId && (
        <p className="text-xs text-slate-400">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>
      )}
      <div className="flex justify-center gap-3 pt-4">
        <Link
          to="/events"
          className="px-4 py-2 rounded-full bg-slate-800 text-xs"
        >
          Browse more events
        </Link>
        <Link
          to="/"
          className="px-4 py-2 rounded-full bg-emerald-600 text-xs font-medium"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
