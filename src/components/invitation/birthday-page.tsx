'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  MapPin,
  Clock,
  Calendar,
  ChevronDown,
  Send,
  VolumeX,
  Volume2,
  PartyPopper,
  Cake,
  Gift,
  Sparkles,
  Balloon,
  Users,
  Heart
} from 'lucide-react'
import { Invitation } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { submitRSVP } from '@/lib/actions/invitations'
import { getEventTimestamp } from '@/lib/utils'
import { EntryAnimation, EntryAnimationType } from './entry-animation'

interface BirthdayPageProps {
  invitation: Invitation
}

/**
 * BirthdayPage Component
 *
 * A fun, colorful birthday invitation with:
 * - Animated confetti and floating balloons
 * - Animated age counter with rainbow gradients
 * - Video background support (responsive)
 * - Turkish language support
 * - Party-themed decorations
 * - Interactive RSVP form
 * - Countdown timer with vibrant styling
 *
 * Usage:
 * <BirthdayPage invitation={invitationData} />
 *
 * Props structure:
 * - title, message, event_date, event_time
 * - venue_name, venue_address
 * - hosts (array), video_url
 * - invitation_type, theme_color, theme_style
 * - custom_fields: { age?: number }
 */

// Confetti particle component - pre-calculated to avoid hydration mismatch
function ConfettiParticle({ delay, index }: { delay: number; index: number }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const colors = [
    '#FF6B9D', '#C44569', '#FFA502', '#FF6348',
    '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DFE6E9', '#A29BFE', '#FF85A2', '#5F27CD'
  ]
  // Use index-based calculations instead of random
  const color = colors[index % colors.length]
  const left = (index * 7.3 + 5) % 100
  const size = 5 + (index % 6)
  const duration = 2 + (index % 4)
  const rotation = (index * 37) % 360
  const isCircle = index % 2 === 0

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${left}%`,
        top: '-20px',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: isCircle ? '50%' : '0%',
      }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{
        y: typeof window !== 'undefined' ? window.innerHeight + 20 : 1000,
        opacity: [1, 1, 0],
        rotate: rotation + 720,
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: index % 3,
        ease: 'linear',
      }}
    />
  )
}

// Floating balloons component - client-side only to avoid hydration mismatch
function FloatingBalloons() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const balloonColors = [
    '#FF6B9D', '#4ECDC4', '#FFA502', '#A29BFE',
    '#FF6348', '#96CEB4', '#FFEAA7', '#45B7D1'
  ]
  // Pre-calculated positions
  const balloonPositions = [10, 25, 40, 55, 70, 85, 95, 5]
  const xMovements = [30, -20, 40, -30, 25, -40, 35, -25]
  const durations = [8, 10, 9, 11, 8, 12, 9, 10]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {balloonPositions.map((left, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${left}%`,
            bottom: '-100px',
          }}
          animate={{
            y: typeof window !== 'undefined'
              ? [-100, -window.innerHeight - 200]
              : [-100, -1200],
            x: [0, xMovements[i]],
          }}
          transition={{
            duration: durations[i],
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="relative">
            <div
              className="w-16 h-20 rounded-full opacity-80"
              style={{
                backgroundColor: balloonColors[i],
                boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.1)',
              }}
            />
            <div
              className="absolute top-full left-1/2 w-0.5 h-12 bg-gray-400"
              style={{ transform: 'translateX(-50%)' }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Animated number counter
function AnimatedAge({ age }: { age: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = age
    const duration = 2000
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [age])

  return (
    <motion.div
      className="text-9xl md:text-[12rem] lg:text-[16rem] font-bold bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent leading-none"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', duration: 1.5, delay: 0.3 }}
    >
      {count}
    </motion.div>
  )
}

// Countdown component
function BirthdayCountdown({
  targetDate,
  targetTime,
  timeZone
}: {
  targetDate: string
  targetTime?: string | null
  timeZone?: string
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = getEventTimestamp(targetDate, targetTime, timeZone) - Date.now()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate, targetTime, timeZone])

  const padNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
      {[
        { value: timeLeft.days, label: 'Gün', color: 'from-pink-500 to-rose-500' },
        { value: timeLeft.hours, label: 'Saat', color: 'from-purple-500 to-pink-500' },
        { value: timeLeft.minutes, label: 'Dakika', color: 'from-blue-500 to-purple-500' },
        { value: timeLeft.seconds, label: 'Saniye', color: 'from-cyan-500 to-blue-500' }
      ].map((item, idx) => (
        <motion.div
          key={idx}
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1, type: 'spring' }}
          viewport={{ once: true }}
        >
          <div className={`bg-gradient-to-br ${item.color} text-white rounded-2xl p-4 md:p-6 shadow-lg min-w-[70px] md:min-w-[100px]`}>
            <span className="block text-3xl md:text-5xl lg:text-6xl font-bold tabular-nums">
              {item.value < 100 ? padNumber(item.value) : item.value}
            </span>
          </div>
          <span className="block mt-3 text-sm md:text-base font-semibold text-gray-700 uppercase tracking-wider">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

// Music player component
function MusicPlayer({ musicUrl }: { musicUrl?: string | null }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  if (!musicUrl) return null

  return (
    <>
      <audio ref={audioRef} src={musicUrl} preload="auto" loop />
      <motion.button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-2xl hover:shadow-pink-500/50 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? 'Sesi kapat' : 'Sesi aç'}
      >
        {isPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
      </motion.button>
    </>
  )
}

// RSVP Form
function RSVPForm({ invitationId, onSuccess }: { invitationId: string; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [attending, setAttending] = useState('yes')
  const [guestCount, setGuestCount] = useState(1)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    formData.set('attending', attending === 'yes' ? 'true' : 'false')
    formData.set('guest_count', String(guestCount))

    try {
      await submitRSVP(invitationId, formData)
      onSuccess()
    } catch (error) {
      console.error('RSVP error:', error)
      setErrorMessage('Yanıtınız gönderilemedi. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl space-y-6">
      <div>
        <Label className="text-gray-700 font-semibold text-lg" htmlFor="name">
          Adınız Soyadınız *
        </Label>
        <Input
          className="mt-2 border-2 border-gray-200 focus:border-pink-400 rounded-xl text-lg"
          id="name"
          name="name"
          required
          placeholder="Adınızı girin"
        />
      </div>

      <div>
        <Label className="text-gray-700 font-semibold text-lg" htmlFor="email">
          E-posta (isteğe bağlı)
        </Label>
        <Input
          type="email"
          className="mt-2 border-2 border-gray-200 focus:border-pink-400 rounded-xl text-lg"
          id="email"
          name="email"
          placeholder="ornek@email.com"
        />
      </div>

      <div>
        <Label className="text-gray-700 font-semibold text-lg mb-3 block">Katılacak mısınız? *</Label>
        <RadioGroup
          value={attending}
          onValueChange={setAttending}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2 flex-1">
            <RadioGroupItem value="yes" id="yes" className="border-pink-500 text-pink-500" />
            <Label htmlFor="yes" className="cursor-pointer text-gray-700 font-medium">
              Evet, geleceğim!
            </Label>
          </div>
          <div className="flex items-center space-x-2 flex-1">
            <RadioGroupItem value="no" id="no" className="border-gray-500 text-gray-500" />
            <Label htmlFor="no" className="cursor-pointer text-gray-700 font-medium">
              Katılamayacağım
            </Label>
          </div>
        </RadioGroup>
      </div>

      {attending === 'yes' && (
        <div>
          <Label className="text-gray-700 font-semibold text-lg" htmlFor="guests">
            Kaç kişi geleceksiniz?
          </Label>
          <Input
            type="number"
            className="mt-2 w-32 border-2 border-gray-200 focus:border-pink-400 rounded-xl text-lg"
            id="guests"
            min={1}
            max={10}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
          />
        </div>
      )}

      <div>
        <Label className="text-gray-700 font-semibold text-lg" htmlFor="message">
          Doğum günü mesajınız (isteğe bağlı)
        </Label>
        <Textarea
          className="mt-2 border-2 border-gray-200 focus:border-pink-400 rounded-xl text-lg"
          id="message"
          name="message"
          placeholder="Dileklerinizi yazın..."
          rows={3}
        />
      </div>

      {errorMessage && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold text-lg py-6 rounded-xl shadow-lg"
      >
        <Send className="w-5 h-5" />
        {loading ? 'Gönderiliyor...' : 'Katılımı Onayla'}
      </Button>
    </form>
  )
}

// Party decorations component
function PartyDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Streamers */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`streamer-${i}`}
          className="absolute top-0 w-8 h-full"
          style={{
            left: `${(i + 1) * 12}%`,
            background: `linear-gradient(180deg,
              ${['#FF6B9D', '#4ECDC4', '#FFA502', '#A29BFE', '#FF6348', '#96CEB4', '#FFEAA7', '#DFE6E9'][i]} 0%,
              transparent 100%)`,
            opacity: 0.15,
          }}
          animate={{
            scaleY: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export function BirthdayPage({ invitation }: BirthdayPageProps) {
  const [showRSVPSuccess, setShowRSVPSuccess] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)
  const heroRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()

  // Parallax effect for video/image
  const videoY = useTransform(scrollY, [0, 500], [0, 100])
  const videoScale = useTransform(scrollY, [0, 500], [1.1, 1])

  // Extract age from custom fields if available
  const customFields = invitation.custom_fields as {
    age?: number
    entry_animation?: string
    timezone?: string
    show_dietary?: boolean
    show_gift_section?: boolean
  }
  const age = customFields?.age || 0

  // Extract Google Maps embed URL
  const getMapEmbedUrl = (mapUrl: string) => {
    if (mapUrl.includes('maps/embed')) return mapUrl

    const placeMatch = mapUrl.match(/place\/([^/]+)/)
    if (placeMatch) {
      const place = placeMatch[1]
      return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(place)}`
    }

    if (invitation.location_name) {
      return `https://www.google.com/maps?q=${encodeURIComponent(invitation.location_name + ' ' + (invitation.location_address || ''))}&output=embed`
    }

    return mapUrl
  }

  const scrollToRSVP = () => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })
  }

  const entryAnimation = (customFields?.entry_animation || 'confetti_burst') as EntryAnimationType
  const showGiftSection = customFields?.show_gift_section !== false

  return (
    <EntryAnimation
      type={entryAnimation}
      primaryColor={invitation.primary_color}
      secondaryColor={invitation.secondary_color}
      accentColor={invitation.accent_color}
      invitationType={invitation.invitation_type}
      title={invitation.title}
    >
    <main className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen">
      {/* Music Player */}
      <MusicPlayer musicUrl={invitation.music_url} />

      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <ConfettiParticle key={i} delay={i * 0.05} index={i} />
          ))}
        </div>
      )}

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden flex items-center justify-center">
        {/* Decorative elements */}
        <PartyDecorations />
        <FloatingBalloons />

        {/* Video Background - Responsive */}
        {invitation.video_url && (
          <div className="absolute inset-0 w-full h-full">
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{ y: videoY, scale: videoScale }}
            >
              <video
                src={invitation.video_url}
                className="w-full h-full object-cover opacity-30"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />
            </motion.div>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 py-20 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6"
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <PartyPopper className="w-16 h-16 md:w-20 md:h-20 text-pink-500 mx-auto" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              {invitation.title || 'Doğum Günü Partisi'}
            </h1>

            {invitation.subtitle && (
              <p className="text-2xl md:text-4xl font-bold text-gray-700 mb-8">
                {invitation.subtitle}
              </p>
            )}

            {age > 0 && (
              <div className="my-12">
                <motion.p
                  className="text-xl md:text-2xl font-semibold text-purple-600 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Yaşına Basıyor!
                </motion.p>
                <AnimatedAge age={age} />
              </div>
            )}

            {invitation.message && (
              <motion.p
                className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {invitation.message}
              </motion.p>
            )}

            {invitation.event_date && (
              <motion.div
                className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: 'spring' }}
              >
                <Calendar className="w-6 h-6 text-pink-500" />
                <span className="text-xl font-bold text-gray-800">
                  {format(new Date(invitation.event_date), 'd MMMM yyyy', { locale: tr })}
                </span>
                {invitation.event_time && (
                  <>
                    <Clock className="w-6 h-6 text-purple-500 ml-4" />
                    <span className="text-xl font-bold text-gray-800">
                      {invitation.event_time}
                    </span>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.button
            onClick={scrollToRSVP}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-purple-600 hover:text-pink-500 transition-colors cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span className="text-sm font-semibold uppercase tracking-wider">
              Katıl
            </span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-8 h-8" />
            </motion.div>
          </motion.button>
        </div>
      </section>

      {/* Countdown Section */}
      {invitation.show_countdown && invitation.event_date && (
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-100/50 via-purple-100/50 to-blue-100/50" />
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                <h2 className="text-4xl md:text-5xl font-black text-gray-800">
                  Geri Sayım Başladı!
                </h2>
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-xl text-gray-600 font-medium">
                Büyük güne ne kadar kaldı?
              </p>
            </motion.div>
            <BirthdayCountdown
              targetDate={invitation.event_date}
              targetTime={invitation.event_time}
              timeZone={customFields?.timezone}
            />
          </div>
        </section>
      )}

      {/* Event Details Section */}
      <section className="py-20 px-6 bg-white/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Cake className="w-16 h-16 text-pink-500 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
              Parti Detayları
            </h2>
            <p className="text-xl text-gray-600">
              Tüm bilgiler burada!
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {invitation.location_name || invitation.location_name || 'Mekan'}
            </h3>

            {(invitation.location_address || invitation.location_address) && (
              <p className="text-lg text-gray-600 text-center mb-8">
                {invitation.location_address || invitation.location_address}
              </p>
            )}

            {/* Map Embed */}
            {invitation.location_map_url && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src={getMapEmbedUrl(invitation.location_map_url)}
                  width="100%"
                  height="350"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${invitation.location_name || invitation.location_name} Haritası`}
                  style={{ border: 0 }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {invitation.location_map_url && (
                <a
                  href={invitation.location_map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-bold border-2 border-pink-500 rounded-full text-pink-500 hover:bg-pink-500 hover:text-white transition-all"
                >
                  <MapPin className="w-5 h-5" />
                  Haritada Aç
                </a>
              )}
              {invitation.event_date && (
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(invitation.title)}&dates=${invitation.event_date.replace(/-/g, '')}/${invitation.event_date.replace(/-/g, '')}&location=${encodeURIComponent((invitation.location_name || invitation.location_name || '') + ', ' + (invitation.location_address || invitation.location_address || ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-bold border-2 border-purple-500 rounded-full text-purple-500 hover:bg-purple-500 hover:text-white transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  Takvime Ekle
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hosts Section */}
      {invitation.hosts && invitation.hosts.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Balloon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-8">
                Ev Sahipleri
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {invitation.hosts.map((host: string, index: number) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {host}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Gifts Section */}
      {showGiftSection && (
        <section className="py-20 px-6 bg-gradient-to-r from-pink-100/50 via-purple-100/50 to-blue-100/50">
          <div className="max-w-2xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Gift className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
                Hediyeler
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                En güzel hediye sizin gelmeniz!
                <br />
                Hediye vermek isterseniz, bize dilediğiniz şekilde ulaştırabilirsiniz.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      {invitation.show_rsvp && (
        <section id="rsvp" className="py-20 px-6 bg-white/60 backdrop-blur-sm">
          <div className="max-w-xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
                Katılacak mısınız?
              </h2>
              <p className="text-xl text-gray-600 font-medium">
                Sizi aramızda görmek isteriz!
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {showRSVPSuccess ? (
                <motion.div
                  key="success"
                  className="bg-white rounded-3xl p-12 shadow-2xl text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <PartyPopper className="w-24 h-24 mx-auto text-pink-500 mb-6" />
                  </motion.div>
                  <h3 className="text-4xl font-black text-gray-800 mb-4">
                    Harika!
                  </h3>
                  <p className="text-xl text-gray-600">
                    Katılımınız onaylandı. Sizinle birlikte kutlamayı sabırsızlıkla bekliyoruz!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <RSVPForm
                    invitationId={invitation.id}
                    onSuccess={() => setShowRSVPSuccess(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <PartyPopper className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <p className="text-5xl font-black text-white mb-2">
            {invitation.title}
          </p>
          {invitation.event_date && (
            <p className="text-xl text-white/90 font-semibold">
              {format(new Date(invitation.event_date), 'd MMMM yyyy', { locale: tr })}
            </p>
          )}
          <p className="text-sm text-white/70 mt-8 uppercase tracking-wider font-medium">
            Hep birlikte kutlayalım!
          </p>
        </motion.div>
      </footer>
    </main>
    </EntryAnimation>
  )
}
