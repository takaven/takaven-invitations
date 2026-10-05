'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { EventConfig } from '@/lib/engine/contracts'

interface FootballOpeningProps {
  config: EventConfig
  onComplete: () => void
}

export function FootballOpening({ config, onComplete }: FootballOpeningProps) {
  const [failedMedia, setFailedMedia] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(onComplete, 3600)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  return (
    <section
      aria-label="Football opening experience"
      className="takaven-football-opening fixed inset-0 z-[80] overflow-hidden bg-[#07111d] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(46,158,92,0.35),transparent_45%),linear-gradient(180deg,#0b2134_0%,#07111d_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(22,116,61,0.1),rgba(18,105,54,0.8)),repeating-linear-gradient(90deg,rgba(255,255,255,0.07)_0_2px,transparent_2px_80px)] [transform:perspective(420px)_rotateX(52deg)] [transform-origin:bottom]" />
      <div className="absolute left-1/2 top-[18%] h-24 w-24 -translate-x-1/2 rounded-full border border-white/20 bg-white/5 blur-2xl" />

      {!failedMedia && config.openingExperienceId === 'football-kick' && (
        <Image
          src="/takaven/opening/football-placeholder.svg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-10"
          onError={() => setFailedMedia(true)}
        />
      )}

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.45em] text-emerald-300/80">TAKAVEN STADIUM</p>
        <h1 className="text-3xl font-black uppercase tracking-[0.12em] sm:text-5xl">Matchday invitation</h1>
        <div className="relative mt-16 h-36 w-full max-w-sm">
          <div className="takaven-player absolute bottom-5 left-[19%] h-24 w-10 rounded-t-full bg-gradient-to-b from-slate-200 to-slate-500" />
          <div className="takaven-ball absolute bottom-5 left-[47%] h-8 w-8 rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,0.65)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/30" />
        </div>
        <p className="mt-8 max-w-xs text-sm text-slate-300">{failedMedia ? 'Opening media unavailable — continuing safely.' : 'A placeholder cinematic opening is loading.'}</p>
        <button
          type="button"
          onClick={onComplete}
          className="mt-8 min-h-11 rounded-full border border-white/40 bg-white/10 px-6 text-sm font-semibold backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          Skip opening
        </button>
      </div>
    </section>
  )
}
