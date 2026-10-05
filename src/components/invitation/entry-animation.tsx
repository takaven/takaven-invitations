'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type EntryAnimationType = 'envelope' | 'curtain' | 'confetti_burst' | 'cloud_reveal' | 'cap_toss' | 'gift_box' | 'none'

interface EntryAnimationProps {
  type: EntryAnimationType
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  invitationType?: string
  title?: string
  subtitle?: string
  eventDate?: string
  eventTime?: string
  locationName?: string
  children: React.ReactNode
}

const IMAGE_BASE = '/images/entry-animations'

const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
]

function formatDateTurkish(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const day = date.getDate()
    const month = TURKISH_MONTHS[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  } catch {
    return dateStr
  }
}

export function EntryAnimation({
  type,
  primaryColor = '#6366f1',
  secondaryColor = '#8b5cf6',
  accentColor = '#ec4899',
  invitationType = 'party',
  title = 'Davetiye',
  subtitle,
  eventDate,
  eventTime,
  locationName,
  children
}: EntryAnimationProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    if (type === 'none') {
      setIsRevealed(true)
    }
  }, [type])

  const handleReveal = useCallback(() => {
    if (!isRevealed) setIsRevealed(true)
  }, [isRevealed])

  if (type === 'none') return <>{children}</>

  return (
    <>
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            key="intro-overlay"
            className="fixed inset-0 z-[9999]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {type === 'envelope' && (
              <EnvelopeAnimation onReveal={handleReveal} primaryColor={primaryColor} accentColor={accentColor} title={title} subtitle={subtitle} eventDate={eventDate} eventTime={eventTime} locationName={locationName} />
            )}
            {type === 'curtain' && (
              <CurtainAnimation onReveal={handleReveal} primaryColor={primaryColor} secondaryColor={secondaryColor} title={title} />
            )}
            {type === 'confetti_burst' && (
              <ConfettiBurstAnimation onReveal={handleReveal} primaryColor={primaryColor} accentColor={accentColor} title={title} />
            )}
            {type === 'cloud_reveal' && (
              <CloudRevealAnimation onReveal={handleReveal} primaryColor={primaryColor} accentColor={accentColor} title={title} />
            )}
            {type === 'cap_toss' && (
              <CapTossAnimation onReveal={handleReveal} primaryColor={primaryColor} title={title} />
            )}
            {type === 'gift_box' && (
              <GiftBoxAnimation onReveal={handleReveal} primaryColor={primaryColor} accentColor={accentColor} title={title} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isRevealed ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </>
  )
}

/* ═══════════════════════════════════════════
   ENVELOPE - Wedding / Elegant
   Real envelope photo with wax seal
   Click: flap opens, card slides out
   ═══════════════════════════════════════════ */
function EnvelopeAnimation({
  onReveal, primaryColor, accentColor, title, subtitle, eventDate, eventTime, locationName
}: { onReveal: () => void; primaryColor: string; accentColor: string; title: string; subtitle?: string; eventDate?: string; eventTime?: string; locationName?: string }) {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'extracting'>('idle')

  const handleClick = () => {
    if (phase !== 'idle') return
    setPhase('opening')
    setTimeout(() => setPhase('extracting'), 800)
    setTimeout(onReveal, 1800)
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden relative"
      onClick={handleClick}
    >
      {/* Background video - elegant floral invitation */}
      <motion.video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/engagement-entry.mp4"
        autoPlay
        loop
        muted
        playsInline
        animate={phase === 'extracting' ? { scale: 1.08, opacity: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      />
      {/* Fallback background image if video fails */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url('${IMAGE_BASE}/envelope.png')` }}
      />



    </div>
  )
}

/* ═══════════════════════════════════════════
   CURTAIN - Corporate / Theater
   Real velvet curtain photo splitting apart
   ═══════════════════════════════════════════ */
function CurtainAnimation({
  onReveal, primaryColor, secondaryColor, title
}: { onReveal: () => void; primaryColor: string; secondaryColor: string; title: string }) {
  const [opened, setOpened] = useState(false)

  const handleClick = () => {
    if (opened) return
    setOpened(true)
    setTimeout(onReveal, 1200)
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center cursor-pointer select-none overflow-hidden relative"
      style={{ background: '#0a0608' }}
      onClick={handleClick}
    >
      {/* Left curtain half - shows left 50% of the image */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full z-20 overflow-hidden"
        animate={opened ? { x: '-100%' } : {}}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      >
        <div
          className="absolute top-0 left-0 w-[200%] h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${IMAGE_BASE}/curtain.png')` }}
        />
        {/* Edge shadow for depth */}
        <div className="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-l from-black/40 to-transparent" />
      </motion.div>

      {/* Right curtain half - shows right 50% of the image */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full z-20 overflow-hidden"
        animate={opened ? { x: '100%' } : {}}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      >
        <div
          className="absolute top-0 right-0 w-[200%] h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${IMAGE_BASE}/curtain.png')` }}
        />
        {/* Edge shadow for depth */}
        <div className="absolute top-0 left-0 bottom-0 w-6 bg-gradient-to-r from-black/40 to-transparent" />
      </motion.div>

      {/* Golden ornament stays at top during opening */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[8%] z-30 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url('${IMAGE_BASE}/curtain.png')` }}
        animate={opened ? { opacity: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      {/* Center content (revealed behind curtains) */}
      <div className="relative z-10 text-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={opened ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="w-20 h-[1px] mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, #d4a574, transparent)' }} />
          <h2 className="text-3xl md:text-5xl font-serif text-white/90 tracking-wide">{title}</h2>
          <div className="w-20 h-[1px] mx-auto mt-6" style={{ background: 'linear-gradient(90deg, transparent, #d4a574, transparent)' }} />
        </motion.div>
      </div>

      {/* Title overlaid on curtain (visible before opening) */}
      {!opened && (
        <motion.div
          className="absolute inset-0 z-25 flex flex-col items-center justify-center px-8"
          style={{ zIndex: 25 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-[1px] mx-auto mb-5" style={{ background: 'linear-gradient(90deg, transparent, #f0d4a8, transparent)' }} />
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {title}
            </h2>
            <div className="w-16 h-[1px] mx-auto mt-5" style={{ background: 'linear-gradient(90deg, transparent, #f0d4a8, transparent)' }} />
            <motion.p
              className="mt-8 text-xs tracking-[0.3em] uppercase text-white/50 drop-shadow-md"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              Perdeyi Acmak Icin Dokunun
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   CONFETTI BURST - Birthday / Party
   Confetti border photo, particles burst
   ═══════════════════════════════════════════ */
function ConfettiBurstAnimation({
  onReveal, primaryColor, accentColor, title
}: { onReveal: () => void; primaryColor: string; accentColor: string; title: string }) {
  const [burst, setBurst] = useState(false)
  const colors = ['#fbbf24', '#f472b6', '#818cf8', '#34d399', '#fb923c', primaryColor, accentColor]

  const handleClick = () => {
    if (burst) return
    setBurst(true)
    setTimeout(onReveal, 1600)
  }

  // Generate confetti particles
  const confetti = Array.from({ length: 50 }, (_, i) => {
    const angle = (Math.random() * 360) * (Math.PI / 180)
    const velocity = 250 + Math.random() * 450
    const x = Math.cos(angle) * velocity
    const y = Math.sin(angle) * velocity - 200
    const rotation = Math.random() * 1080 - 540
    const size = 6 + Math.random() * 10
    const isCircle = Math.random() > 0.6
    return { x, y, rotation, size, isCircle, color: colors[i % colors.length], delay: Math.random() * 0.15 }
  })

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden relative"
      onClick={handleClick}
    >
      {/* Background image - confetti borders with clean center */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${IMAGE_BASE}/confetti.png')` }}
        animate={burst ? { scale: 1.15, opacity: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Confetti particles on burst */}
      {burst && confetti.map((c, i) => (
        <motion.div
          key={i}
          className="absolute z-30"
          style={{
            width: c.size,
            height: c.isCircle ? c.size : c.size * 0.6,
            background: c.color,
            borderRadius: c.isCircle ? '50%' : '2px',
            left: '50%',
            top: '50%',
          }}
          initial={{ x: 0, y: 0, rotate: 0, scale: 0, opacity: 1 }}
          animate={{
            x: c.x,
            y: [c.y * 0.3, c.y, c.y + 400],
            rotate: c.rotation,
            scale: [0, 1.2, 1, 0.5],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.6,
            ease: [0.2, 0, 0.3, 1],
            delay: c.delay,
            y: { duration: 1.8, ease: [0.15, 0, 0.8, 1] },
          }}
        />
      ))}

      {/* Center content - in the clean center of confetti image */}
      <motion.div
        className="relative z-20 text-center px-8"
        animate={burst ? { scale: [1, 1.3, 0], opacity: [1, 0.8, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative party icon */}
        <motion.div
          className="mx-auto mb-6 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}20, ${accentColor}20)`,
            border: `2px solid ${primaryColor}30`,
          }}
          animate={!burst ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-12 md:h-12">
            <path d="m5.8 11.3 2.4 2.4" /><path d="M14.8 6.3 5.8 11.3V18l7-4.6" />
            <path d="m18 3-3.8 3.3" /><path d="m12 8 2.8-2.3" />
            <path d="M2 22 17 7" /><circle cx="20" cy="4" r="1.5" fill={primaryColor} />
          </svg>
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#6b21a8' }}>{title}</h2>

        {!burst && (
          <motion.p
            className="text-sm tracking-[0.2em] font-medium"
            style={{ color: '#a855f7' }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Kutlamaya Katilmak Icin Dokunun
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   CLOUD REVEAL - Baby Shower
   Dreamy clouds splitting top/bottom
   ═══════════════════════════════════════════ */
function CloudRevealAnimation({
  onReveal, primaryColor, accentColor, title
}: { onReveal: () => void; primaryColor: string; accentColor: string; title: string }) {
  const [revealed, setRevealed] = useState(false)

  const handleClick = () => {
    if (revealed) return
    setRevealed(true)
    setTimeout(onReveal, 1200)
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, #e8f4fd 0%, #f3e8ff 50%, #fce7f3 100%)' }}
      onClick={handleClick}
    >
      {/* Top cloud half - shows top 50% of image, slides up */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/2 z-20 overflow-hidden"
        animate={revealed ? { y: '-100%' } : {}}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="absolute top-0 left-0 w-full h-[200%] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${IMAGE_BASE}/cloud.png')` }}
        />
        {/* Soft bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/20 to-transparent" />
      </motion.div>

      {/* Bottom cloud half - shows bottom 50% of image, slides down */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2 z-20 overflow-hidden"
        animate={revealed ? { y: '100%' } : {}}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="absolute bottom-0 left-0 w-full h-[200%] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${IMAGE_BASE}/cloud.png')` }}
        />
        {/* Soft top edge */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>

      {/* Floating sparkle particles */}
      {!revealed && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-25"
          style={{
            left: `${15 + (i * 14)}%`,
            top: `${20 + (i % 3) * 25}%`,
            zIndex: 25,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" opacity="0.7">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
          </svg>
        </motion.div>
      ))}

      {/* Center content (visible on top of clouds) */}
      <motion.div
        className="relative z-25 text-center px-8"
        style={{ zIndex: 25 }}
        animate={revealed ? { scale: 1.1, opacity: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={!revealed ? { y: [0, -8, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Baby icon */}
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.5" className="mx-auto mb-5 md:w-16 md:h-16 drop-shadow-sm">
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
            <path d="M12 3V1" />
            <path d="m8.5 4.5-1-1" />
            <path d="m15.5 4.5 1-1" />
          </svg>
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-3 drop-shadow-sm">{title}</h2>

        {!revealed && (
          <motion.p
            className="text-sm text-pink-400 tracking-[0.2em] drop-shadow-sm"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Dokunarak Kesfet
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   CAP TOSS - Graduation
   Real graduation cap photo, toss animation
   ═══════════════════════════════════════════ */
function CapTossAnimation({
  onReveal, primaryColor, title
}: { onReveal: () => void; primaryColor: string; title: string }) {
  const [tossed, setTossed] = useState(false)
  const sparkColors = ['#fbbf24', '#f472b6', '#818cf8', '#34d399', '#fb923c']

  const handleClick = () => {
    if (tossed) return
    setTossed(true)
    setTimeout(onReveal, 1500)
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden relative"
      onClick={handleClick}
    >
      {/* Background image - cap on dark navy */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${IMAGE_BASE}/cap-toss.png')` }}
        animate={tossed ? { y: '-30%', scale: 1.1, opacity: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.3, 0, 0.2, 1] }}
      />

      {/* Subtle pulse on the cap area */}
      {!tossed && (
        <motion.div
          className="absolute top-[28%] left-1/2 -translate-x-1/2 w-40 h-40 rounded-full z-10"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(251,191,36,0.2)',
              '0 0 0 30px rgba(251,191,36,0)',
              '0 0 0 0 rgba(251,191,36,0)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}

      {/* Sparkle particles on toss */}
      {tossed && Array.from({ length: 30 }, (_, i) => {
        const angle = (i / 30) * Math.PI * 2
        const dist = 100 + Math.random() * 250
        return (
          <motion.div
            key={i}
            className="absolute rounded-full z-30"
            style={{
              width: 4 + Math.random() * 6,
              height: 4 + Math.random() * 6,
              background: sparkColors[i % sparkColors.length],
              left: '50%',
              top: '40%',
            }}
            initial={{ x: 0, y: 0, scale: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1, delay: 0.3 + Math.random() * 0.3 }}
          />
        )
      })}

      {/* Title - below the cap area */}
      <motion.div
        className="absolute top-[62%] left-0 right-0 text-center z-20 px-8"
        animate={tossed ? { opacity: 0, y: 30 } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-wide drop-shadow-lg mb-4">
            {title}
          </h2>
          <div className="w-16 h-[2px] mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }} />
          <motion.p
            className="text-sm tracking-[0.25em] uppercase text-white/50"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Kepi Firlatmak Icin Dokunun
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   GIFT BOX - General Celebration
   Real gift box photo, lid lifts off
   ═══════════════════════════════════════════ */
function GiftBoxAnimation({
  onReveal, primaryColor, accentColor, title
}: { onReveal: () => void; primaryColor: string; accentColor: string; title: string }) {
  const [opened, setOpened] = useState(false)

  const handleClick = () => {
    if (opened) return
    setOpened(true)
    setTimeout(onReveal, 1400)
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden relative"
      onClick={handleClick}
    >
      {/* Background image - gift box on dark teal */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${IMAGE_BASE}/gift-box.png')` }}
        animate={opened ? { scale: 1.1 } : {}}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Light burst effect on open */}
      {opened && (
        <motion.div
          className="absolute inset-0 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 1] }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0) 70%)',
          }}
        />
      )}

      {/* Top gradient overlay for title */}
      <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-black/40 via-black/15 to-transparent z-10" />

      {/* Shimmer on gift */}
      {!opened && (
        <motion.div
          className="absolute top-[25%] left-1/2 -translate-x-1/2 w-48 h-48 rounded-full z-10"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(212,175,55,0.15)',
              '0 0 0 25px rgba(212,175,55,0)',
              '0 0 0 0 rgba(212,175,55,0)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}

      {/* Sparkle particles on open */}
      {opened && Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const dist = 80 + Math.random() * 180
        return (
          <motion.div
            key={i}
            className="absolute z-30"
            style={{ top: '40%', left: '50%' }}
            initial={{ x: 0, y: 0, scale: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: -40 + Math.sin(angle) * dist * 0.6,
              scale: [0, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{ duration: 0.9, delay: 0.1 + i * 0.03 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={['#fbbf24', '#f472b6', '#ffffff'][i % 3]}>
              <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
            </svg>
          </motion.div>
        )
      })}

      {/* Title - top area */}
      <motion.div
        className="absolute top-[10%] left-0 right-0 text-center z-20 px-8"
        animate={opened ? { y: -40, opacity: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-wide drop-shadow-lg">
            {title}
          </h2>
          <div className="w-16 h-[1px] mx-auto mt-4" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
        </motion.div>
      </motion.div>

      {/* CTA - bottom area */}
      {!opened && (
        <motion.p
          className="absolute bottom-[12%] left-0 right-0 text-center text-sm tracking-[0.25em] uppercase font-light text-white/60 z-20 drop-shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0.4, 0.8, 0.4], y: 0 }}
          transition={{ opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 0.6 } }}
        >
          Hediyenizi Acmak Icin Dokunun
        </motion.p>
      )}
    </div>
  )
}
