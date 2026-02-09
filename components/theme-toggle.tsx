"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

type Theme = "light" | "dark"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    setMounted(true)
    try {
      const stored = window.localStorage.getItem("theme") as Theme | null
      if (stored === "light" || stored === "dark") {
        applyTheme(stored)
        return
      }
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      applyTheme(prefersDark ? "dark" : "light")
    } catch {
      applyTheme("light")
    }
  }, [])

  function applyTheme(next: Theme) {
    setTheme(next)
    if (typeof document !== "undefined") {
      const isDark = next === "dark"
      document.documentElement.classList.toggle("dark", isDark)
      document.body.classList.toggle("dark", isDark)
    }
    try {
      window.localStorage.setItem("theme", next)
    } catch {
      // ignore
    }
  }

  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => applyTheme(isDark ? "light" : "dark")}
      className="h-9 w-9"
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}

