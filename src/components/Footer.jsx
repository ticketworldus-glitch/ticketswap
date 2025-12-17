// src/components/Footer.jsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-xs text-slate-400 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Top guarantee / app-like bar */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <h3 className="text-slate-100 font-semibold mb-2">
              Ticket Swap guarantee
            </h3>
            <ul className="space-y-1">
              <li>Verified tickets only</li>
              <li>Secure payments</li>
              <li>24/7 customer support</li>
              <li>Refund if event is cancelled</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-100 font-semibold mb-2">
              Our company
            </h4>
            <ul className="space-y-1">
              <li>About us</li>
              <li>Press</li>
              <li>Affiliates</li>
              <li>Investors</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-100 font-semibold mb-2">
              Help & support
            </h4>
            <ul className="space-y-1">
              <li>Help center</li>
              <li>Contact us</li>
              <li>Buying tickets</li>
              <li>Selling tickets</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-100 font-semibold mb-2">
              Live events
            </h4>
            <ul className="space-y-1">
              <li>Sports</li>
              <li>Concerts</li>
              <li>Theatre & comedy</li>
              <li>Festivals</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[11px]">
            © {year} Ticket Swap. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-3 text-[11px]">
            <span>Terms & Conditions</span>
            <span>Privacy policy</span>
            <span>Cookie policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
