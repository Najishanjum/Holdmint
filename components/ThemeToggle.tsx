"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-muted">
        <Sun className="w-4 h-4 opacity-50" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-8 h-8 rounded-lg bg-surface hover:bg-surface-elevated border border-border flex items-center justify-center text-muted hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? <Sun className="w-4 h-4 text-tax" /> : <Moon className="w-4 h-4 text-savings" />}
    </button>
  );
}
