"use client";

import { useTheme } from "@/hooks/useTheme";

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDay = theme === "day";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDay}
      aria-label={isDay ? "Cambiar a modo noche" : "Cambiar a modo día"}
      title={isDay ? "Modo noche" : "Modo día"}
      onClick={toggleTheme}
      className={`relative h-9 w-[68px] shrink-0 rounded-full border border-white/25 bg-white/10 transition-colors duration-300 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 ${className}`}
    >
      {/* Iconos del fondo del interruptor */}
      <MoonIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
      <SunIcon className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />

      {/* Perilla */}
      <span
        className={`absolute left-1 top-1 flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
          isDay
            ? "translate-x-[30px] bg-gold-400 text-night-950"
            : "translate-x-0 bg-white text-night-900"
        }`}
      >
        {isDay ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
      </span>
    </button>
  );
}