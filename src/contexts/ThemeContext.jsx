// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light"); // default light

  // Load from localStorage on first mount
  useEffect(() => {
    const stored = window.localStorage.getItem("fanpass-theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      applyThemeClass(stored);
    } else {
      // default to light
      setTheme("light");
      applyThemeClass("light");
    }
  }, []);

  const applyThemeClass = (value) => {
    const root = document.documentElement;

    if (value === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    root.dataset.theme = value;
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      window.localStorage.setItem("fanpass-theme", next);
      applyThemeClass(next);
      return next;
    });
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
