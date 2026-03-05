"use client";

import { useEffect } from "react";

export const THEMES = [
  { id: "nebula",   label: "Nebula",   bg: "#1a1a2e", accent: "#7c6cf5", description: "Dark purple (default)", dark: true },
  { id: "light",    label: "Light",    bg: "#f8f8fc", accent: "#6d5ee4", description: "Clean white",           dark: false },
  { id: "midnight", label: "Midnight", bg: "#0a0a10", accent: "#8b7fff", description: "Near-black",            dark: true },
  { id: "sepia",    label: "Sepia",    bg: "#f2ead8", accent: "#8b6340", description: "Warm parchment",        dark: false },
  { id: "nord",     label: "Nord",     bg: "#2e3440", accent: "#88c0d0", description: "Cool slate",            dark: true },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export function getTheme(): ThemeId {
  if (typeof window === "undefined") return "nebula";
  return (localStorage.getItem("nexusai-theme") as ThemeId) || "nebula";
}

export function setTheme(theme: ThemeId) {
  localStorage.setItem("nexusai-theme", theme);
  applyTheme(theme);
}

export function applyTheme(theme: ThemeId) {
  const html = document.documentElement;
  const def = THEMES.find((t) => t.id === theme);
  if (theme === "nebula") {
    html.removeAttribute("data-theme");
  } else {
    html.setAttribute("data-theme", theme);
  }
  if (def?.dark) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme(getTheme());
  }, []);

  return <>{children}</>;
}
