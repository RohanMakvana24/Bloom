'use client'
import * as React from 'react'
import { MoonStar, SunDim } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export const ThemeToggle = () => {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme, systemTheme } = useTheme()

  const getTheme = () => {
    if (theme === 'system') {
      return systemTheme
    }
    return theme
  }

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="toggle theme"
        className="size-8 rounded-full p-0"
      >
        <SunDim className="size-5 shrink-0" />
      </Button>
    )
  }

  return (
    <Button
      onClick={() => setTheme(getTheme() === 'dark' ? 'light' : 'dark')}
      variant="ghost"
      size="icon"
      aria-label="toggle theme"
      className="size-8 rounded-full p-0"
    >
      {getTheme() === 'dark' ? <SunDim className="size-5 shrink-0" /> : <MoonStar className="size-4 shrink-0" />}
    </Button>
  )
}
