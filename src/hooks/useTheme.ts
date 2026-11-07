"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "night" | "day";

const STORAGE_KEY = "torre4000-theme";
const CHANGE_EVENT = "torre4000-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

// El tema vive en <html data-theme="..."> (lo fija un script en layout.tsx)
function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "day" ? "day" : "night";
}

function getServerSnapshot(): Theme {
  return "night";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;

    // Clase temporal para que el cambio de colores sea suave
    root.classList.add("theme-anim");
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove("theme-anim"), 500);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Sin almacenamiento disponible: el tema solo dura esta visita
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(getSnapshot() === "day" ? "night" : "day");
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
}