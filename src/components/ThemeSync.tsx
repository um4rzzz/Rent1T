import { useEffect, useState } from "react";

// Keeps Tailwind darkMode: 'class' in sync with Chakra color storage
export function ThemeSync() {
  const [, setMode] = useState<"light" | "dark">("light");
  useEffect(() => {
    try {
      const html = document.documentElement;
      const stored = (localStorage.getItem("chakra-ui-color-mode") as "light" | "dark" | null)
        || (localStorage.getItem("rent1t-theme") as "light" | "dark" | null);
      const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const mode: "light" | "dark" = stored || (systemDark ? "dark" : "light");
      setMode(mode);
      if (mode === "dark") html.classList.add("dark"); else html.classList.remove("dark");
      html.setAttribute("data-theme", mode);
      html.setAttribute("data-theme-transition", "true");
      try { localStorage.setItem("chakra-ui-color-mode", mode); } catch {}
      try { localStorage.setItem("rent1t-theme", mode); } catch {}
    } catch {}
  }, []);
  return null;
}


