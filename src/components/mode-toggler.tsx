"use client"

import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { useEffect, useState } from "react"

export default function ModeToggler() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button className="cursor-pointer bg-transparent hover:bg-transparent text-foreground hover:text-primary" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <SunIcon className="w-4 h-4   " /> : <MoonIcon className="w-4 h-4" />}
    </Button>
  )
}