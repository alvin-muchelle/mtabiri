"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="inline-flex rounded-lg border bg-background p-1">
      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("light")}
        className="px-3"
      > 
        <SunIcon />
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("dark")}
        className="px-3"
      >
        <MoonIcon />
      </Button>
    </div>
  );
}
