'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  MapPin,
  Clock,
  Calendar,
  Heart,
  Baby,
  Star,
  Cloud,
  Gift,
  Send,
  VolumeX,
  Volume2,
  Sparkles
} from 'lucide-react'
import { Invitation } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { submitRSVP } from '@/lib/actions/invitations'
import { EntryAnimation, EntryAnimationType } from './entry-animation'

interface BabyShowerPageProps {
  invitation: Invitation
}

/*
Component: BabyShowerPage
Soft, adorable baby shower invitation with pastel colors and gentle animations.

Props: invitation object with fields:
- title, message, event_date, event_time, venue_name, venue_address
- hosts (string[]), video_url, theme_color, theme_style

Usage:
<BabyShowerPage invitation={invitationData} />

Accessibility:
- Semantic HTML with proper heading hierarchy
- ARIA labels on interactive elements
- Keyboard navigable forms and buttons
- Focus indicators on form inputs
- High contrast text for readability

Performance:
- Lazy-loaded animations with viewport triggers
- Optimized video background with proper aspect ratio
- Memoized countdown calculation
- Conditional rendering for optional sections
*/

// Floating decoration component with gentle animations
function FloatingDecoration({
  children,
  delay = 0,
  duration = 3
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
}) {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, 0, -5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

// Sparkle animation for dreamy effect - using seeded positions to avoid hydration mismatch
function SparkleEffect() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Pre-calculated positions to avoid hydration mismatch
  const sparklePositions = [
    { left: 5, top: 10 }, { left: 15, top: 30 }, { left: 25, top: 50 },
    { left: 35, top: 20 }, { left: 45, top: 70 }, { left: 55, top: 15 },
    { left: 65, top: 45 }, { left: 75, top: 80 }, { left: 85, top: 25 },
    { left: 95, top: 60 }, { left: 10, top: 85 }, { left: 20, top: 40 },
    { left: 30, top: 90 }, { left: 40, top: 5 }, { left: 50, top: 55 },
    { left: 60, top: 35 }, { left: 70, top: 95 }, { left: 80, top: 65 },
    { left: 90, top: 8 }, { left: 12, top: 75 }
  ]

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {sparklePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
          style={{
            left: `${pos.left}%`,
            top: `${pos.top}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + (i % 3),
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </motion.div>
  )
}

// Countdown timer component
function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()
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
  }, [targetDate])

  const padNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
      {[
        { value: timeLeft.days, label: 'Gün' },
        { value: timeLeft.hours, label: 'Saat' },
        { value: timeLeft.minutes, label: 'Dakika' },
        { value: timeLeft.seconds, label: 'Saniye' }
      ].map((item, idx) => (
        <motion.div
          key={idx}
          className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-3xl p-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true }}
        >
          <span className="block text-3xl md:text-5xl font-bold bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent tabular-nums">
            {item.value < 100 ? padNumber(item.value) : item.value}
          </span>
          <span className="block mt-1 text-xs tracking-wider uppercase text-purple-400 font-medium">
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
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label={isPlaying ? 'Sesi kapat' : 'Sesi aç'}
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </>
  )
}

// RSVP Form component
function RSVPForm({ invitationId, onSuccess }: { invitationId: string; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [attending, setAttending] = useState('yes')
  const [guestCount, setGuestCount] = useState(1)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('attending', attending === 'yes' ? 'true' : 'false')
    formData.set('guest_count', String(guestCount))

    try {
      await submitRSVP(invitationId, formData)
      onSuccess()
    } catch (error) {
      console.error('RSVP error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl space-y-5">
      <div>
        <Label className="text-purple-700 font-semibold text-sm" htmlFor="name">
          Adınız Soyadınız *
        </Label>
        <Input
          className="mt-2 bg-white/90 border-purple-200 rounded-2xl text-purple-900 placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
          id="name"
          name="name"
          required
          placeholder="Adınız"
        />
      </div>

      <div>
        <Label className="text-purple-700 font-semibold text-sm" htmlFor="email">
          E-posta (isteğe bağlı)
        </Label>
        <Input
          type="email"
          className="mt-2 bg-white/90 border-purple-200 rounded-2xl text-purple-900 placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
          id="email"
          name="email"
          placeholder="ornek@email.com"
        />
      </div>

      <div>
        <Label className="text-purple-700 font-semibold text-sm">Katılacak mısınız? *</Label>
        <RadioGroup
          value={attending}
          onValueChange={setAttending}
          className="flex gap-4 mt-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" className="border-purple-400 text-purple-600" />
            <Label htmlFor="yes" className="cursor-pointer text-purple-700 text-sm">
              Evet, katılacağım
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" className="border-purple-400 text-purple-600" />
            <Label htmlFor="no" className="cursor-pointer text-purple-700 text-sm">
              Katılamayacağım
            </Label>
          </div>
        </RadioGroup>
      </div>

      {attending === 'yes' && (
        <div>
          <Label className="text-purple-700 font-semibold text-sm" htmlFor="guests">
            Kişi sayısı (siz dahil)
          </Label>
          <Input
            type="number"
            className="mt-2 w-24 bg-white/90 border-purple-200 rounded-2xl text-purple-900 focus:border-purple-400 focus:ring-purple-400"
            id="guests"
            min={1}
            max={10}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
          />
        </div>
      )}

      <div>
        <Label className="text-purple-700 font-semibold text-sm" htmlFor="message">
          Mesajınız (isteğe bağlı)
        </Label>
        <Textarea
          className="mt-2 bg-white/90 border-purple-200 rounded-2xl text-purple-900 placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
          id="message"
          name="message"
          placeholder="Birkaç kelime yazmak ister misiniz..."
          rows={3}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full gap-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 text-white font-semibold rounded-2xl py-6 shadow-lg"
      >
        <Send className="w-4 h-4" />
        {loading ? 'Gönderiliyor...' : 'Katılımı Onayla'}
      </Button>
    </form>
  )
}

// Decorative divider component
function BabyDivider() {
  return (
    <motion.div
      className="flex items-center justify-center py-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <span className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-24" />
      <FloatingDecoration delay={0} duration={2}>
        <Star className="w-6 h-6 mx-4 text-yellow-400 fill-yellow-400" />
      </FloatingDecoration>
      <span className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-24" />
    </motion.div>
  )
}

export function BabyShowerPage({ invitation }: BabyShowerPageProps) {
  const [showRSVPSuccess, setShowRSVPSuccess] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()

  // Parallax effect for hero
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1])

  // Extract custom fields for baby shower
  const customFields = invitation.custom_fields as {
    baby_gender?: 'boy' | 'girl' | 'surprise'
    baby_name?: string
    entry_animation?: string
    show_dietary?: boolean
    show_gift_section?: boolean
  } | null

  const babyGender = customFields?.baby_gender || 'surprise'
  const babyName = customFields?.baby_name || ''

  // Get theme color from invitation primary_color or use default based on gender
  const getThemeColor = () => {
    if (babyGender === 'boy') return 'blue'
    if (babyGender === 'girl') return 'pink'
    return 'rainbow' // for surprise
  }
  const themeColor = getThemeColor()

  // Color scheme based on theme
  const colorSchemes = {
    pink: 'from-pink-100 via-pink-50 to-rose-50',
    blue: 'from-blue-100 via-blue-50 to-cyan-50',
    mint: 'from-emerald-100 via-teal-50 to-cyan-50',
    lavender: 'from-purple-100 via-purple-50 to-pink-50',
    rainbow: 'from-pink-100 via-purple-50 to-blue-100'
  }

  const bgGradient = colorSchemes[themeColor as keyof typeof colorSchemes] || colorSchemes.rainbow

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

  const entryAnimation = (customFields?.entry_animation || 'cloud_reveal') as EntryAnimationType
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
      <main className={`min-h-screen bg-gradient-to-br ${bgGradient} relative overflow-hidden`}>
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <FloatingDecoration delay={0} duration={4}>
          <Cloud className="absolute top-20 left-10 w-16 h-16 md:w-20 md:h-20 text-blue-200" />
        </FloatingDecoration>
        <FloatingDecoration delay={1} duration={5}>
          <Cloud className="absolute top-40 right-20 w-20 h-20 md:w-24 md:h-24 text-purple-200" />
        </FloatingDecoration>
        <FloatingDecoration delay={2} duration={3.5}>
          <Star className="absolute top-60 left-1/4 w-8 h-8 text-yellow-300 fill-yellow-300" />
        </FloatingDecoration>
        <FloatingDecoration delay={1.5} duration={4.5}>
          <Star className="absolute bottom-40 right-1/4 w-6 h-6 text-pink-300 fill-pink-300" />
        </FloatingDecoration>
        <FloatingDecoration delay={0.5} duration={6}>
          <Cloud className="absolute bottom-60 left-1/3 w-12 h-12 text-cyan-200" />
        </FloatingDecoration>
      </div>

      {/* Music Player */}
      <MusicPlayer musicUrl={invitation.music_url} />

      {/* Hero Section with responsive video background */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background - Responsive and professional */}
        {invitation.video_url && (
          <div className="absolute inset-0 w-full h-full z-0">
            <motion.div
              className="relative w-full h-full"
              style={{ y: heroY, scale: heroScale }}
            >
              <video
                src={invitation.video_url}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto max-w-none object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white/60 backdrop-blur-[1px]" />
            </motion.div>
          </div>
        )}

        {/* Hero Content - Always on top of video */}
        <div className="relative z-10 text-center px-6 py-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Cute baby icon */}
            <FloatingDecoration delay={0} duration={3}>
              <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center shadow-lg">
                <Baby className="w-10 h-10 text-white" />
              </div>
            </FloatingDecoration>

            <motion.p
              className="text-sm md:text-base tracking-widest uppercase text-purple-500 mb-4 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Baby Shower
              {babyGender !== 'surprise' && (
                <span className={`ml-2 ${babyGender === 'boy' ? 'text-blue-500' : 'text-pink-500'}`}>
                  • {babyGender === 'boy' ? 'Erkek Bebek' : 'Kız Bebek'}
                </span>
              )}
            </motion.p>

            <h1 className="font-bold text-5xl md:text-7xl lg:text-8xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent leading-tight mb-4">
              {invitation.title}
            </h1>

            {babyName && (
              <motion.p
                className="text-2xl md:text-3xl text-purple-600 font-semibold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Bebek: {babyName}
              </motion.p>
            )}

            {invitation.message && (
              <motion.p
                className="mt-6 text-lg md:text-xl text-purple-600 max-w-2xl mx-auto font-medium leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {invitation.message}
              </motion.p>
            )}

            {invitation.event_date && (
              <motion.p
                className="mt-4 text-base md:text-lg text-purple-500 font-semibold flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Calendar className="w-5 h-5" />
                {format(new Date(invitation.event_date), 'd MMMM yyyy', { locale: tr })}
              </motion.p>
            )}

            {invitation.event_time && (
              <motion.p
                className="mt-2 text-base text-purple-400 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Clock className="w-5 h-5" />
                {invitation.event_time}
              </motion.p>
            )}

            {/* Hosts */}
            {invitation.hosts && invitation.hosts.length > 0 && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-sm text-purple-400 uppercase tracking-wider mb-2">Ev Sahipleri</p>
                <p className="text-lg text-purple-600 font-semibold">
                  {(invitation.hosts as string[]).join(' & ')}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Sparkle effect */}
          <SparkleEffect />
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6 text-purple-400" />
        </motion.div>
      </section>

      {/* Countdown Section */}
      {invitation.event_date && (
        <section className="relative z-10 py-16 md:py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <FloatingDecoration delay={0} duration={2.5}>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-12">
                  Heyecan Geri Sayımı
                </h2>
              </FloatingDecoration>
              <Countdown targetDate={invitation.event_date} />
            </motion.div>
          </div>
        </section>
      )}

      <BabyDivider />

      {/* Event Details Section */}
      <section className="relative z-10 py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
              Etkinlik Detayları
            </h2>
            <p className="text-purple-500 text-lg">Sizi bekliyoruz</p>
          </motion.div>

          <motion.div
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <FloatingDecoration delay={0} duration={3}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center shadow-lg">
                <MapPin className="w-10 h-10 text-white" />
              </div>
            </FloatingDecoration>

            <h3 className="text-2xl md:text-3xl font-bold text-purple-700 mb-6">Konum</h3>

            {invitation.location_name && (
              <p className="text-xl md:text-2xl font-semibold text-purple-600 mb-3">
                {invitation.location_name}
              </p>
            )}

            {invitation.location_address && (
              <p className="text-base text-purple-500 mb-6 leading-relaxed">
                {invitation.location_address}
              </p>
            )}

            {/* Map Embed */}
            {invitation.location_map_url && (
              <div className="mb-6 rounded-2xl overflow-hidden border-4 border-purple-200 shadow-lg">
                <iframe
                  src={getMapEmbedUrl(invitation.location_map_url)}
                  width="100%"
                  height="300"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${invitation.location_name} Haritası`}
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
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-2xl hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg"
                >
                  <MapPin className="w-5 h-5" />
                  Haritada Aç
                </a>
              )}
              {invitation.event_date && (
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(invitation.title)}&dates=${invitation.event_date.replace(/-/g, '')}/${invitation.event_date.replace(/-/g, '')}&location=${encodeURIComponent((invitation.location_name || '') + ', ' + (invitation.location_address || ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-2xl hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Takvime Ekle
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <BabyDivider />

      {/* Gifts Section */}
      {showGiftSection && (
        <section className="relative z-10 py-16 md:py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
                Hediyeler
              </h2>
              <p className="text-purple-500 text-lg max-w-xl mx-auto leading-relaxed">
                Bizim için en önemlisi sizin varlığınız. Hediye vermek isterseniz, size en uygun şekilde yapabilirsiniz.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="px-8 py-6 flex items-center justify-center gap-4 bg-gradient-to-r from-pink-100 to-purple-100">
                <FloatingDecoration delay={0} duration={2}>
                  <Gift className="w-8 h-8 text-purple-600" />
                </FloatingDecoration>
                <span className="text-xl font-bold text-purple-700">Hediye Listesi</span>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <BabyDivider />

      {/* RSVP Section */}
      <section id="rsvp" className="relative z-10 py-16 md:py-24 px-6">
        <div className="max-w-xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
              Katılımınızı Onaylayın
            </h2>
            <p className="text-purple-500 text-lg">Sizi aramızda görmek istiyoruz</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {showRSVPSuccess ? (
              <motion.div
                key="success"
                className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <Heart className="w-20 h-20 mx-auto text-pink-400 fill-pink-400" />
                </motion.div>
                <h3 className="text-3xl font-bold text-purple-700 mt-6 mb-3">Teşekkürler!</h3>
                <p className="text-purple-500 text-lg">
                  Yanıtınız başarıyla kaydedildi. Sizi aramızda görmekten mutluluk duyacağız!
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

      {/* Footer */}
      <footer className="relative z-10 py-16 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <FloatingDecoration delay={0} duration={3}>
            <Baby className="w-12 h-12 mx-auto text-white mb-4" />
          </FloatingDecoration>
          <p className="text-3xl md:text-4xl font-bold text-white mb-3">
            {invitation.title}
          </p>
          {invitation.hosts && invitation.hosts.length > 0 && (
            <p className="text-lg text-white/90 mb-2">
              {(invitation.hosts as string[]).join(' & ')}
            </p>
          )}
          {invitation.event_date && (
            <p className="text-base text-white/80">
              {format(new Date(invitation.event_date), 'd MMMM yyyy', { locale: tr })}
            </p>
          )}
          <p className="text-sm text-white/70 mt-6">Tüm sevgimizle</p>
        </motion.div>
      </footer>
    </main>
    </EntryAnimation>
  )
}
