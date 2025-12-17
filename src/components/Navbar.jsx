// src/components/Navbar.jsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Ticket,
  Menu,
  X,
  Search,
  User,
  LogOut,
  ChevronDown,
  SunMedium,
  Moon,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useTheme } from "../contexts/ThemeContext";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "text-xs font-medium transition-colors",
          isActive
            ? "text-emerald-600"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [desktopSearch, setDesktopSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");

  const isAdmin = profile?.role === "admin" || profile?.isAdmin === true;
  const isSeller = profile?.role === "seller" || profile?.isSeller === true;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      setUserMenuOpen(false);
      setMobileOpen(false);
      navigate("/");
    }
  };

  const handleSignIn = () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate("/auth/login");
  };

  const handleLogoClick = () => {
    setMobileOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (e, mode) => {
    e.preventDefault();
    const term =
      mode === "mobile"
        ? mobileSearch.trim()
        : desktopSearch.trim();

    if (!term) return;

    navigate(`/events?search=${encodeURIComponent(term)}`);

    if (mode === "mobile") {
      setMobileSearch("");
      setMobileOpen(false);
    } else {
      setDesktopSearch("");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 transition-colors duration-300">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 gap-3">
        {/* Left: logo */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-2"
        >
          <Ticket className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
          <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-white">
            FanPass
          </span>
        </button>

        {/* Center: search (desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <form
            onSubmit={(e) => handleSearchSubmit(e, "desktop")}
            className="flex items-center w-full bg-slate-50 border border-slate-200 rounded-full px-3 py-2 gap-2 shadow-sm dark:bg-slate-900 dark:border-slate-700"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events, artists, teams, and more"
              className="bg-transparent flex-1 text-xs text-slate-900 placeholder:text-slate-500 outline-none dark:text-slate-100"
              value={desktopSearch}
              onChange={(e) => setDesktopSearch(e.target.value)}
            />
          </form>
        </div>

        {/* Right: desktop nav + user button */}
        <div className="hidden md:flex items-center gap-5 text-xs">
          <nav className="flex items-center gap-5">
            <NavItem to="/events">Sports</NavItem>
            <NavItem to="/events">Concerts</NavItem>
            <NavItem to="/events">Theatre</NavItem>
            <NavItem to="/events">Top Cities</NavItem>
          </nav>

          {/* Seller/Admin quick links */}
          <nav className="flex items-center gap-4">
            {isSeller && <NavItem to="/seller">Sell</NavItem>}
            {isAdmin && <NavItem to="/admin">Admin</NavItem>}
            <NavItem to="/events">My Tickets</NavItem>
          </nav>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle light/dark mode"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <SunMedium className="w-4 h-4" />
            )}
          </button>

          {/* User button + dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  handleSignIn();
                  return;
                }
                setUserMenuOpen((v) => !v);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs bg-slate-50 hover:border-emerald-500 transition-colors dark:bg-slate-900 dark:border-slate-700"
            >
              <div className="flex items-center justify-center rounded-full bg-emerald-600 text-white w-6 h-6 text-[11px]">
                {user ? (
                  (profile?.name?.[0] || user.email?.[0] || "U").toUpperCase()
                ) : (
                  <User className="w-3 h-3" />
                )}
              </div>
              <span className="max-w-[120px] truncate text-slate-900 dark:text-slate-100">
                {user ? profile?.name || user.email : "Sign in"}
              </span>
              {user && <ChevronDown className="w-3 h-3 text-slate-400" />}
            </button>

            {/* Dropdown */}
            {user && userMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-slate-200 shadow-lg text-xs py-1 dark:bg-slate-900 dark:border-slate-800">
                <div className="px-3 py-2 border-b border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300">
                  <p className="font-medium truncate">
                    {profile?.name || user.email}
                  </p>
                  <p className="text-[10px] uppercase text-emerald-500 mt-1">
                    {isAdmin ? "ADMIN" : isSeller ? "SELLER" : "BUYER"}
                  </p>
                </div>

                {isSeller && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/seller");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-800 dark:hover:bg-slate-800 dark:text-slate-200"
                  >
                    Seller dashboard
                  </button>
                )}

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/admin");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-800 dark:hover:bg-slate-800 dark:text-slate-200"
                  >
                    Admin dashboard
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-500 flex items-center gap-2 dark:hover:bg-red-500/10"
                >
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: combined search + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <SunMedium className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="p-1 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            ) : (
              <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          {/* Mobile search full width */}
          <div className="px-4 py-3">
            <form
              onSubmit={(e) => handleSearchSubmit(e, "mobile")}
              className="flex items-center w-full bg-slate-50 border border-slate-200 rounded-full px-3 py-2 gap-2 dark:bg-slate-900 dark:border-slate-700"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search events, artists, teams..."
                className="bg-transparent flex-1 text-xs text-slate-900 placeholder:text-slate-500 outline-none dark:text-slate-100"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
              />
            </form>
          </div>

          {/* Links */}
          <nav className="px-4 pb-4 text-xs space-y-1">
            <p className="text-[10px] uppercase text-slate-500 mt-1">
              Browse
            </p>
            <Link
              to="/events"
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-slate-800 dark:text-slate-200"
            >
              Sports
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-slate-800 dark:text-slate-200"
            >
              Concerts
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-slate-800 dark:text-slate-200"
            >
              Theatre &amp; Comedy
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-slate-800 dark:text-slate-200"
            >
              Top cities
            </Link>

            <div className="h-px bg-slate-200 my-2 dark:bg-slate-800" />

            <p className="text-[10px] uppercase text-slate-500 mt-1">
              Actions
            </p>

            {isSeller && (
              <Link
                to="/seller"
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-slate-800 dark:text-slate-200"
              >
                Seller dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-slate-800 dark:text-slate-200"
              >
                Admin dashboard
              </Link>
            )}

            <Link
              to="/events"
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-slate-800 dark:text-slate-200"
            >
              My tickets
            </Link>

            <div className="h-px bg-slate-200 my-2 dark:bg-slate-800" />

            {/* Auth area */}
            {user ? (
              <>
                <p className="text-[10px] uppercase text-slate-500 mt-1">
                  Account
                </p>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-800 truncate max-w-[60%] dark:text-slate-200">
                    {profile?.name || user.email}
                  </span>
                  <span className="text-[10px] uppercase text-emerald-500">
                    {isAdmin
                      ? "ADMIN"
                      : isSeller
                      ? "SELLER"
                      : "BUYER"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full mt-1 py-2 rounded-full bg-red-50 text-red-500 flex items-center justify-center gap-2 dark:bg-red-500/10"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                className="w-full mt-2 py-2 rounded-full bg-emerald-600 text-xs font-medium text-white"
              >
                Sign in
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
