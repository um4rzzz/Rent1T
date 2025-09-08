import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  useEffect(() => {
    try {
      const stored = (localStorage.getItem("chakra-ui-color-mode") as "light" | "dark") || "light";
      setMode(stored);
    } catch {}
  }, []);
  const toggle = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    try { localStorage.setItem("chakra-ui-color-mode", next); } catch {}
    try { localStorage.setItem("rent1t-theme", next); } catch {}
    const html = document.documentElement;
    if (next === "dark") html.classList.add("dark"); else html.classList.remove("dark");
    html.setAttribute("data-theme", next);
  };
  const isLight = mode === "light";
  return (
    <Button aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"} onClick={toggle} variant="ghost" className="h-11 px-4 text-lg">
      {isLight ? "🌙" : "☀️"}
    </Button>
  );
}


