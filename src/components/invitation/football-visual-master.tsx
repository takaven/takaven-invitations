'use client'

import { useEffect, useRef } from 'react'
import type { EventConfig } from '@/lib/engine/contracts'

interface FootballVisualMasterProps {
  config: EventConfig
  onComplete: () => void
}

const STADIUM_ASSET = '/takaven/football/stadium.webp'
const PLAYER_ASSET = '/takaven/football/child-player.webp'
const BALL_ASSET = '/takaven/football/ball.webp'
const MASTER_DURATION_MS = 6800

function preloadAsset(source: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new window.Image()
    image.onload = () => resolve()
    image.onerror = () => reject(new Error(`Football asset failed to load: ${source}`))
    image.src = source
  })
}

export function FootballVisualMaster({ config, onComplete }: FootballVisualMasterProps) {
  const completedRef = useRef(false)
  const assetsReadyRef = useRef(false)

  useEffect(() => {
    let mounted = true
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      completedRef.current = true
      onComplete()
      return () => {
        mounted = false
      }
    }

    Promise.all([STADIUM_ASSET, PLAYER_ASSET, BALL_ASSET].map(preloadAsset))
      .then(() => {
        if (mounted) {
          assetsReadyRef.current = true
        }
      })
      .catch(() => {
        if (mounted && !completedRef.current) {
          completedRef.current = true
          onComplete()
        }
      })

    const fallbackTimer = window.setTimeout(() => {
      if (mounted && !assetsReadyRef.current) onComplete()
    }, 7000)

    return () => {
      mounted = false
      window.clearTimeout(fallbackTimer)
    }
  }, [onComplete])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (completedRef.current) return
      completedRef.current = true
      onComplete()
    }, MASTER_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [onComplete])

  const complete = () => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }

  return (
    <section aria-label="Football opening experience" className="takaven-football-master is-ready">
      <div className="takaven-football-master__backdrop" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STADIUM_ASSET} alt="" onError={complete} />
      </div>
      <div className="takaven-football-master__shade" aria-hidden />
      <div className="takaven-football-master__grain" aria-hidden />
      <div className="takaven-football-master__scanline" aria-hidden />

      <div className="takaven-football-master__topline">
        <span>TAKAVEN / MATCHDAY</span>
        <span>01 / {config.themeId.toUpperCase()}</span>
      </div>

      <div className="takaven-football-master__copy" aria-hidden>
        <span className="takaven-football-master__eyebrow">The fixture is locked in</span>
        <span className="takaven-football-master__headline">Step into the lights.</span>
        <span className="takaven-football-master__rule" />
      </div>

      <div className="takaven-football-master__player" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PLAYER_ASSET} alt="" onError={complete} />
        {config.age && <span className="takaven-football-master__jersey-number">{config.age}</span>}
      </div>

      <div className="takaven-football-master__ball" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BALL_ASSET} alt="" onError={complete} />
      </div>

      <div className="takaven-football-master__impact" aria-hidden>
        <span className="takaven-football-master__impact-ring" />
        <span className="takaven-football-master__impact-flash" />
      </div>

      <div className="takaven-football-master__footer">
        <span className="takaven-football-master__status">LIVE / APPROACHING</span>
        <button type="button" onClick={complete} className="takaven-football-master__skip">
          Skip opening
        </button>
      </div>
    </section>
  )
}
