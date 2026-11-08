"use client"
import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Home,
  Sparkles,
  MapPin,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import LogoIcon from "@/assets/logo/logo-icon"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { whatsappEnquiry } from "@/lib/salon-contact"

const NavLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}) => (
  <Link
    href={href}
    className="group flex items-center gap-1.5 text-sm font-medium text-zinc-200 hover:text-[#e60073] dark:text-zinc-200 dark:hover:text-[#ff3b9a] transition-colors whitespace-nowrap"
  >
    <Icon className="w-4 h-4 text-[#e60073] dark:text-[#ff3b9a] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
    <span>{label}</span>
  </Link>
)

const MobileThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-8 h-8" />

  const isDark = theme === "dark" || resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#e60073]/10 transition-colors text-zinc-200 dark:text-zinc-200 hover:text-[#e60073]"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}

export function NotchNavbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { logo?: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
      menuButtonRef.current?.focus()
    }
  }, [isMobileMenuOpen])

  const items = {
    left: [
      { label: "Home", href: "#home", icon: Home },
      { label: "Our Services", href: "#our-services", icon: Sparkles },
      { label: "Gallery", href: "#gallery", icon: Sparkles },
      { label: "Products", href: "#services", icon: Sparkles },
      { label: "About", href: "#about", icon: Sparkles },
    ],
    right: [{ label: "Visit Us", href: "#visit", icon: MapPin }],
  }

  return (
    <>
      <header
        className={cn("fixed top-0 inset-x-0 z-[500] isolate h-[52px] xl:h-[68px] flex px-0", className)}
        {...props}
      >
        {/* Left Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-black backdrop-blur-md z-20 relative min-w-0">
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="39.5"
              x2="100%"
              y2="39.5"
              stroke="#e60073"
              strokeOpacity={0.38}
              strokeWidth={1}
            />
            <line
              x1="0"
              y1="36.5"
              x2="100%"
              y2="36.5"
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={0.6}
              className="text-white"
            />
          </svg>
        </div>

        {/* Responsive Notch Container - 3 Slices */}
        <div className="flex h-[52px] xl:h-[68px] relative z-10 shrink-0 -ml-px">
          {/* Left Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0">
            <div
              className="absolute inset-0 hidden bg-black backdrop-blur-md xl:block"
              style={{
                clipPath: "path('M0 0 H50 V68 C25 68 25 40 0 40 Z')",
              }}
            />
            <div
              className="absolute inset-0 bg-black backdrop-blur-md xl:hidden"
              style={{ clipPath: "path('M0 0 H50 V52 C25 52 25 40 0 40 Z')" }}
            />
            <svg
              className="absolute inset-0 hidden w-full h-full pointer-events-none xl:block"
              viewBox="0 0 50 68"
            >
              <path
                d="M0 39.5 C25 39.5 25 67.5 50 67.5"
                fill="none"
                stroke="#e60073"
                strokeOpacity={0.45}
                strokeWidth={1.1}
              />
              <path
                d="M0 36.5 C25 36.5 25 64.5 50 64.5"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={0.6}
                className="text-white"
              />
            </svg>
            <svg className="absolute inset-0 h-full w-full pointer-events-none xl:hidden" viewBox="0 0 50 52">
              <path d="M0 39.5 C25 39.5 25 51.5 50 51.5" fill="none" stroke="#e60073" strokeOpacity={0.45} strokeWidth={1.1} />
              <path d="M0 36.5 C25 36.5 25 48.5 50 48.5" fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={0.6} className="text-white" />
            </svg>
          </div>

          {/* Center Slice (Flexible Content Area) */}
          <div className="flex-1 h-full relative min-w-0 -ml-px">
            {/* Background & Lines Layer */}
            <div className="absolute inset-0 bg-black backdrop-blur-md">
              <svg
                className="absolute inset-0 hidden w-full h-full pointer-events-none xl:block"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="67.5"
                  x2="100%"
                  y2="67.5"
                  stroke="#e60073"
                  strokeOpacity={0.5}
                  strokeWidth={1.1}
                />
                <line
                  x1="0"
                  y1="64.5"
                  x2="100%"
                  y2="64.5"
                  stroke="currentColor"
                  strokeOpacity={0.08}
                  strokeWidth={0.6}
                  className="text-white"
                />
              </svg>
              <svg className="absolute inset-0 h-full w-full pointer-events-none xl:hidden" preserveAspectRatio="none">
                <line x1="0" y1="51.5" x2="100%" y2="51.5" stroke="#e60073" strokeOpacity={0.5} strokeWidth={1.1} />
                <line x1="0" y1="48.5" x2="100%" y2="48.5" stroke="currentColor" strokeOpacity={0.08} strokeWidth={0.6} className="text-white" />
              </svg>
            </div>

            {/* Content Layer */}
            <div className="relative w-full h-full flex items-center justify-between px-4 md:px-8 pt-0.5">
              {/* Desktop Left Nav */}
              <nav
                className="hidden xl:flex h-10 items-center gap-7 shrink-0"
                aria-label="Left navigation"
              >
                {items.left.map((item) => (
                  <NavLink key={item.label} {...item} />
                ))}
              </nav>

              {/* Mobile Menu Button (Left) */}
              <div className="flex xl:hidden h-10 items-center">
                <button
                  ref={menuButtonRef}
                  type="button"
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#e60073]/10 text-zinc-200 dark:text-zinc-200 hover:text-[#e60073] transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-navigation"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Official BLOSSOM Logo (Centerpiece) */}
              <div className="flex h-10 items-center justify-center shrink-0 mx-3 md:mx-6">
                {props.logo || (
                  <Link
                    href="#home"
                    aria-label="Blossom Family Salon"
                    data-testid="navbar-blossom-logo"
                    className="group relative flex items-center justify-center transition-transform duration-300 hover:scale-105"
                  >
                    <LogoIcon
                      variant="light"
                      className="h-[18px] sm:h-5 md:h-[22px] w-auto block drop-shadow-[0_2px_12px_rgba(240,18,122,0.2)]"
                    />
                  </Link>
                )}
              </div>

              {/* Desktop Right Nav */}
              <nav
                className="hidden xl:flex h-10 gap-6 items-center shrink-0"
                aria-label="Right navigation"
              >
                {items.right.map((item) => (
                  <NavLink key={item.label} {...item} />
                ))}

                <div className="flex h-9 gap-3.5 pl-4 border-l border-zinc-800 shrink-0 items-center">
                  <div className="text-zinc-200 [&_button]:text-zinc-200 [&_button:hover]:bg-white/10 [&_button:hover]:text-white"><ThemeToggle /></div>
                  <Link
                    href={whatsappEnquiry()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#1b0829] via-[#2d0c42] to-[#e60073] hover:from-[#e60073] hover:to-[#b8005c] rounded-full transition-all duration-300 shadow-[0_2px_14px_rgba(230,0,115,0.3)] whitespace-nowrap"
                  >
                    <span>Enquire on WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </nav>

              {/* Mobile Right Actions */}
              <div className="flex xl:hidden h-10 items-center">
                <MobileThemeToggle />
              </div>
            </div>
          </div>

          {/* Right Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0 -ml-px">
            <div
              className="absolute inset-0 hidden bg-black backdrop-blur-md xl:block"
              style={{
                clipPath: "path('M0 0 H50 V40 C25 40 25 68 0 68 Z')",
              }}
            />
            <div
              className="absolute inset-0 bg-black backdrop-blur-md xl:hidden"
              style={{ clipPath: "path('M0 0 H50 V40 C25 40 25 52 0 52 Z')" }}
            />
            <svg
              className="absolute inset-0 hidden w-full h-full pointer-events-none xl:block"
              viewBox="0 0 50 68"
            >
              <path
                d="M0 67.5 C25 67.5 25 39.5 50 39.5"
                fill="none"
                stroke="#e60073"
                strokeOpacity={0.45}
                strokeWidth={1.1}
              />
              <path
                d="M0 64.5 C25 64.5 25 36.5 50 36.5"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={0.6}
                className="text-white"
              />
            </svg>
            <svg className="absolute inset-0 h-full w-full pointer-events-none xl:hidden" viewBox="0 0 50 52">
              <path d="M0 51.5 C25 51.5 25 39.5 50 39.5" fill="none" stroke="#e60073" strokeOpacity={0.45} strokeWidth={1.1} />
              <path d="M0 48.5 C25 48.5 25 36.5 50 36.5" fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={0.6} className="text-white" />
            </svg>
          </div>
        </div>

        {/* Right Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-black backdrop-blur-md z-20 relative min-w-0 -ml-px">
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="39.5"
              x2="100%"
              y2="39.5"
              stroke="#e60073"
              strokeOpacity={0.38}
              strokeWidth={1}
            />
            <line
              x1="0"
              y1="36.5"
              x2="100%"
              y2="36.5"
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={0.6}
              className="text-white"
            />
          </svg>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-x-0 bottom-0 top-10 z-[510] xl:hidden">
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="absolute inset-0 w-full bg-black/55 backdrop-blur-[2px]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ opacity: 0, y: -34, scaleY: 0.92 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -24, scaleY: 0.94 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              style={{ transformOrigin: "top left" }}
              className="absolute left-2 top-3 flex max-h-[calc(100dvh-64px)] w-[min(88vw,350px)] flex-col overflow-y-auto rounded-br-[30px] rounded-tr-[28px] border border-l-0 border-[#e60073]/55 bg-[#0d0d10] text-white shadow-[18px_20px_60px_rgba(0,0,0,0.55),0_0_30px_rgba(230,0,115,0.12)]"
            >
              <div className="absolute left-0 top-0 h-20 w-[2px] bg-[#e60073] shadow-[0_0_15px_#e60073]" />
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.27em] text-[#ff78b9]">The Blossom Edit</span>
                <button ref={closeButtonRef} type="button" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-zinc-200 hover:border-[#e60073] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e60073]">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-6 pt-7 pb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500">Explore</div>
              <nav className="flex flex-col px-3" aria-label="Mobile navigation">
                {[...items.left, ...items.right].map((item, index) => (
                  <Link key={item.label} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="group flex min-h-16 items-center gap-4 rounded-lg px-3 text-zinc-100 transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06] focus-visible:outline-none">
                    <span className="w-6 text-xs font-medium tracking-wider text-[#e60073]">0{index + 1}</span>
                    <span className="flex-1 border-b border-white/10 py-5 text-[17px] font-medium tracking-tight group-hover:border-[#e60073]/40">{item.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-zinc-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ff6caf]" />
                  </Link>
                ))}
              </nav>
              <div className="mt-auto p-6 pt-10">
                <p className="mb-4 text-xs leading-relaxed text-zinc-400">Your next look starts here.</p>
                <Link href={whatsappEnquiry()} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="flex min-h-12 items-center justify-between rounded-lg bg-[#e60073] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(230,0,115,0.25)] transition-colors hover:bg-[#c90065] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  Enquire on WhatsApp <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
