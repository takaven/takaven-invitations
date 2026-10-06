'use client'

import { useEffect, useRef } from 'react'
import type { EventConfig } from '@/lib/engine/contracts'

interface FootballOpeningProps {
  config: EventConfig
  onComplete: () => void
}

const OPENING_SECONDS = 4.8

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function easeOut(value: number) {
  const progress = clamp(value)
  return 1 - (1 - progress) ** 3
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function drawPlayer(ctx: CanvasRenderingContext2D, x: number, ground: number, scale: number, kick: number) {
  ctx.save()
  ctx.translate(x, ground)
  ctx.scale(scale, scale)

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.beginPath()
  ctx.ellipse(0, 4, 34, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  const jersey = ctx.createLinearGradient(-18, -116, 20, -45)
  jersey.addColorStop(0, '#f3f7f4')
  jersey.addColorStop(0.5, '#b8d2c3')
  jersey.addColorStop(1, '#4d8068')
  ctx.fillStyle = jersey
  ctx.beginPath()
  ctx.moveTo(-17, -118)
  ctx.lineTo(17, -118)
  ctx.lineTo(23, -60)
  ctx.lineTo(-21, -60)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#09131d'
  ctx.beginPath()
  ctx.arc(0, -139, 13, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#c6dcd0'
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(-14, -103)
  ctx.lineTo(-28, -55)
  ctx.lineTo(-36, -10)
  ctx.moveTo(14, -103)
  ctx.lineTo(28, -55)
  ctx.lineTo(kick > 0.5 ? 62 : 40, kick > 0.5 ? -8 : -10)
  ctx.stroke()

  ctx.strokeStyle = '#162838'
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.moveTo(-8, -61)
  ctx.lineTo(kick > 0.5 ? -3 : -14, -8)
  ctx.lineTo(kick > 0.5 ? -30 : -21, 4)
  ctx.moveTo(8, -61)
  ctx.lineTo(kick > 0.5 ? 39 : 18, -18)
  ctx.lineTo(kick > 0.5 ? 68 : 33, -10)
  ctx.stroke()

  ctx.restore()
}

function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, rotation: number, alpha = 1) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.translate(x, y)
  ctx.rotate(rotation)

  ctx.shadowColor = 'rgba(216, 255, 230, 0.85)'
  ctx.shadowBlur = Math.max(12, radius * 0.8)
  const ball = ctx.createRadialGradient(-radius * 0.35, -radius * 0.4, radius * 0.1, 0, 0, radius)
  ball.addColorStop(0, '#ffffff')
  ball.addColorStop(0.7, '#e0efe6')
  ball.addColorStop(1, '#6f9a84')
  ctx.fillStyle = ball
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.shadowBlur = 0
  ctx.strokeStyle = 'rgba(11, 45, 31, 0.5)'
  ctx.lineWidth = Math.max(1, radius * 0.06)
  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.62, 0.2, 1.8)
  ctx.arc(0, 0, radius * 0.62, 2.25, 3.6)
  ctx.stroke()
  ctx.restore()
}

function drawScene(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  const horizon = height * 0.51
  const approach = easeOut(clamp((progress - 0.08) / 0.36))
  const kickProgress = clamp((progress - 0.42) / 0.16)
  const flightProgress = easeOut(clamp((progress - 0.56) / 0.25))
  const impactProgress = clamp((progress - 0.79) / 0.18)
  const playerX = lerp(width * 0.25, width * 0.48, approach)
  const playerGround = lerp(height * 0.73, height * 0.68, approach)

  const sky = ctx.createLinearGradient(0, 0, 0, height)
  sky.addColorStop(0, '#030812')
  sky.addColorStop(0.52, '#0b2634')
  sky.addColorStop(1, '#061810')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, width, height)

  const glow = ctx.createRadialGradient(width * 0.5, horizon, 0, width * 0.5, horizon, width * 0.72)
  glow.addColorStop(0, 'rgba(83, 177, 122, 0.22)')
  glow.addColorStop(0.55, 'rgba(24, 76, 69, 0.08)')
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = 'rgba(7, 13, 22, 0.95)'
  ctx.beginPath()
  ctx.ellipse(width * 0.5, horizon + 30, width * 0.74, height * 0.25, 0, Math.PI, Math.PI * 2)
  ctx.fill()
  for (let row = 0; row < 5; row += 1) {
    const rowY = horizon - 4 + row * 15
    for (let index = 0; index < 42; index += 1) {
      const light = (index * 17 + row * 29) % 11 === 0
      ctx.fillStyle = light ? 'rgba(214, 243, 222, 0.55)' : 'rgba(91, 139, 117, 0.18)'
      ctx.fillRect(width * 0.08 + index * width * 0.021, rowY, 3, 2)
    }
  }

  const beam = (x: number, tilt: number) => {
    const gradient = ctx.createLinearGradient(x, 0, width * 0.5, horizon)
    gradient.addColorStop(0, 'rgba(224, 255, 234, 0.2)')
    gradient.addColorStop(1, 'rgba(93, 207, 137, 0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(x - 10, 20)
    ctx.lineTo(x + 22, 20)
    ctx.lineTo(width * 0.5 + tilt, horizon + 26)
    ctx.lineTo(width * 0.5 + tilt - 48, horizon + 26)
    ctx.closePath()
    ctx.fill()
  }
  beam(width * 0.12, -width * 0.09)
  beam(width * 0.88, width * 0.09)

  const pitch = ctx.createLinearGradient(0, horizon, 0, height)
  pitch.addColorStop(0, '#124d37')
  pitch.addColorStop(1, '#061c13')
  ctx.fillStyle = pitch
  ctx.beginPath()
  ctx.moveTo(width * 0.35, horizon)
  ctx.lineTo(width * 0.65, horizon)
  ctx.lineTo(width * 1.16, height)
  ctx.lineTo(width * -0.16, height)
  ctx.closePath()
  ctx.fill()
  ctx.save()
  ctx.globalAlpha = 0.12
  for (let stripe = -2; stripe < 8; stripe += 1) {
    ctx.fillStyle = stripe % 2 === 0 ? '#8bd59e' : '#03150d'
    ctx.beginPath()
    ctx.moveTo(width * 0.35 + stripe * width * 0.05, horizon)
    ctx.lineTo(width * 0.39 + stripe * width * 0.05, horizon)
    ctx.lineTo(width * 0.64 + stripe * width * 0.16, height)
    ctx.lineTo(width * 0.35 + stripe * width * 0.16, height)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
  ctx.strokeStyle = 'rgba(220, 255, 226, 0.42)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(width * 0.5, horizon)
  ctx.lineTo(width * 0.5, height)
  ctx.moveTo(width * 0.38, horizon + 2)
  ctx.lineTo(width * 0.08, height)
  ctx.moveTo(width * 0.62, horizon + 2)
  ctx.lineTo(width * 0.92, height)
  ctx.stroke()

  if (impactProgress < 0.9) {
    const ballX = lerp(width * 0.52, width * 0.5, flightProgress)
    const ballY = lerp(height * 0.64, height * 0.28, flightProgress)
    const ballRadius = lerp(11, Math.max(width, height) * 0.1, flightProgress ** 1.2)
    ctx.strokeStyle = `rgba(214, 255, 227, ${0.25 + flightProgress * 0.3})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(width * 0.52, height * 0.64)
    ctx.lineTo(ballX, ballY)
    ctx.stroke()
    if (impactProgress < 0.82) {
      drawPlayer(ctx, playerX, playerGround, lerp(0.55, 0.9, approach), kickProgress)
    }
    drawBall(ctx, ballX, ballY, ballRadius, progress * 14)
  } else if (impactProgress < 0.82) {
    drawPlayer(ctx, playerX, playerGround, lerp(0.55, 0.9, approach), kickProgress)
  }

  if (impactProgress > 0) {
    const ring = lerp(width * 0.12, Math.max(width, height) * 0.8, easeOut(impactProgress))
    ctx.strokeStyle = `rgba(224, 255, 232, ${1 - impactProgress})`
    ctx.lineWidth = lerp(8, 1, impactProgress)
    ctx.beginPath()
    ctx.arc(width * 0.5, height * 0.5, ring, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = `rgba(227, 255, 238, ${Math.max(0, 0.74 - impactProgress * 0.72)})`
    ctx.fillRect(0, 0, width, height)
  }

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.48, width * 0.18, width * 0.5, height * 0.48, width * 0.76)
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.62)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)
}

export function FootballOpening({ config, onComplete }: FootballOpeningProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const completedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      const reducedMotionTimer = window.setTimeout(() => {
        if (completedRef.current) return
        completedRef.current = true
        onComplete()
      }, 0)
      return () => window.clearTimeout(reducedMotionTimer)
    }

    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      const fallbackTimer = window.setTimeout(onComplete, 250)
      return () => window.clearTimeout(fallbackTimer)
    }

    let animationFrame = 0
    let width = window.innerWidth
    let height = window.innerHeight
    let devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * devicePixelRatio)
      canvas.height = Math.floor(height * devicePixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    const startedAt = performance.now()
    const render = (now: number) => {
      const progress = clamp((now - startedAt) / 1000 / OPENING_SECONDS)
      drawScene(context, width, height, progress)
      if (progress >= 1) {
        if (!completedRef.current) {
          completedRef.current = true
          onComplete()
        }
        return
      }
      animationFrame = window.requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    animationFrame = window.requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [onComplete])

  const complete = () => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }

  return (
    <section aria-label="Football opening experience" className="takaven-football-opening fixed inset-0 z-[80] overflow-hidden bg-[#030812] text-white">
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
      <div className="relative flex h-full flex-col justify-between px-5 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-9">
        <div className="flex items-start justify-between text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-100/70 sm:text-xs">
          <span>TAKAVEN / MATCHDAY</span>
          <span>01 — {config.themeId.toUpperCase()}</span>
        </div>
        <div className="pointer-events-none flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-emerald-200/75">A new fixture awaits</p>
            <p className="mt-2 max-w-[18rem] text-sm font-medium leading-relaxed text-white/75">Stay with the moment. The invitation is about to enter the arena.</p>
          </div>
          <button type="button" onClick={complete} className="pointer-events-auto min-h-11 shrink-0 rounded-full border border-white/35 bg-black/20 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:border-emerald-200 hover:bg-emerald-100/10 focus:outline-none focus:ring-2 focus:ring-emerald-200">
            Skip
          </button>
        </div>
      </div>
    </section>
  )
}
