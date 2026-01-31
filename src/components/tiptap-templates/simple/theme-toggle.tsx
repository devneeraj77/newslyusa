"use client"

import * as React from "react"
import { useTheme } from "next-themes"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"

// --- Icons ---
import { MoonStarIcon } from "@/components/tiptap-icons/moon-star-icon"
import { SunIcon } from "@/components/tiptap-icons/sun-icon"
import { LaptopIcon } from "@/components/tiptap-icons/laptop-icon"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button data-style="ghost" type="button">
        <SunIcon className="tiptap-button-icon" />
      </Button>
    )
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      data-style="ghost"
      className="relative"
    >
      <SunIcon
        className={`tiptap-button-icon transition-all ${
          theme === "light" ? "scale-100 rotate-0" : "scale-0 -rotate-90 absolute"
        }`}
      />
      <MoonStarIcon
        className={`tiptap-button-icon transition-all ${
          theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90 absolute"
        }`}
      />
      <LaptopIcon
        className={`tiptap-button-icon transition-all ${
          theme === "system" ? "scale-100 rotate-0" : "scale-0 rotate-90 absolute"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}