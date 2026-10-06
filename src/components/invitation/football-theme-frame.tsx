import type { ReactNode } from 'react'
import type { EventConfig } from '@/lib/engine/contracts'

interface FootballThemeFrameProps {
  config: EventConfig
  children: ReactNode
}

export function FootballThemeFrame({ config, children }: FootballThemeFrameProps) {
  if (config.themeId !== 'football') return <>{children}</>

  return (
    <div className="takaven-football-theme relative min-h-screen overflow-x-hidden">
      <header className="takaven-football-scoreboard sticky top-0 z-30 flex min-h-12 items-center justify-between gap-3 border-b border-emerald-100/15 bg-[#06131d]/95 px-4 py-3 text-white shadow-lg shadow-black/10 backdrop-blur-md sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-200 sm:text-xs">TAKAVEN FC</span>
          <span className="hidden h-4 w-px bg-white/20 sm:block" />
          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 sm:text-xs">Matchday invitation</span>
        </div>
        <a href="#rsvp" className="shrink-0 rounded-full border border-emerald-200/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-100 transition hover:bg-emerald-100/10 focus:outline-none focus:ring-2 focus:ring-emerald-200">
          Join the squad
        </a>
      </header>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-12 z-20 h-px bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />
      <div className="relative z-10">{children}</div>
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-28 w-px -translate-x-1/2 bg-gradient-to-b from-emerald-300/20 to-transparent" />
    </div>
  )
}
