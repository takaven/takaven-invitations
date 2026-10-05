'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { EventConfig } from '@/lib/engine/contracts'
import { openingExperienceRegistry } from '@/lib/engine/theme-registry'
import { FootballOpening } from './football-opening'

interface InvitationEngineProps {
  config: EventConfig
  children: ReactNode
}

export function InvitationEngine({ config, children }: InvitationEngineProps) {
  const experience = openingExperienceRegistry[config.openingExperienceId]
  const [openingVisible, setOpeningVisible] = useState(config.openingExperienceId !== 'none')
  const [revealVisible, setRevealVisible] = useState(false)

  const completeOpening = useCallback(() => {
    setOpeningVisible(false)
    setRevealVisible(true)
    window.setTimeout(() => setRevealVisible(false), 1050)
  }, [])

  useEffect(() => {
    if (!openingVisible) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !experience.supportsReducedMotion) {
      const timer = window.setTimeout(completeOpening, 0)
      return () => window.clearTimeout(timer)
    }
  }, [completeOpening, experience.supportsReducedMotion, openingVisible])

  return (
    <>
      <AnimatePresence>
        {openingVisible && config.openingExperienceId === 'football-kick' && (
          <motion.div
            key="football-opening"
            className="fixed inset-0 z-[10000]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <FootballOpening config={config} onComplete={completeOpening} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {revealVisible && (
          <motion.div
            key="football-reveal"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.55 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#07111d] px-6 text-center text-white"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">The reveal</p>
              <h2 className="mt-5 text-4xl font-black uppercase tracking-tight sm:text-7xl">
                {config.celebrantName} {config.age ? `turns ${config.age}` : 'is celebrating'}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div aria-hidden={openingVisible || revealVisible}>{children}</div>
    </>
  )
}
