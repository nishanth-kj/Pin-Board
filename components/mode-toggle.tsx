"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
        <Button variant="ghost" size="icon" className="ghost">
            <Sun className="h-[1.2rem] w-[1.2rem]" />
        </Button>
    )
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Laptop

  return (
    <Button variant="ghost" size="icon" className="ghost" onClick={cycleTheme} title={`Current theme: ${theme}`}>
      <Icon className="h-[1.2rem] w-[1.2rem] transition-all" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
