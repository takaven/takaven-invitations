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
  Users,
  Send,
  CheckCircle2,
  Sparkles,
  CalendarCheck,
  Building2,
  ArrowRight
} from 'lucide-react'
import { Invitation } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { submitRSVP } from '@/lib/actions/invitations'
import { EntryAnimation, EntryAnimationType } from './entry-animation'

interface CorporatePageProps {
  invitation: Invitation
}

/**
 * Professional Corporate Event Invitation Page
 *
 * Features:
 * - Responsive video background with proper scaling
 * - Dark/light mode support
 * - Elegant animations with Framer Motion
 * - Turkish language support
 * - Minimalist, modern design
 * - Works for corporate, party, religious, and other events
 *
 * Usage:
 * <CorporatePage invitation={invitationData} />
 */

// Countdown component
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
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4 md:p-6">
            <span className="block text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tabular-nums">
              {item.value < 100 ? padNumber(item.value) : item.value}
            </span>
            <span className="block mt-1 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              {item.label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="text-slate-700 dark:text-slate-300 font-medium" htmlFor="name">
          Adınız Soyadınız *
        </Label>
        <Input
          className="mt-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
          id="name"
          name="name"
          required
          placeholder="Adınız ve soyadınız"
        />
      </div>

      <div>
        <Label className="text-slate-700 dark:text-slate-300 font-medium" htmlFor="email">
          E-posta
        </Label>
        <Input
          type="email"
          className="mt-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
          id="email"
          name="email"
          placeholder="ornek@email.com"
        />
      </div>

      <div>
        <Label className="text-slate-700 dark:text-slate-300 font-medium">Katılacak mısınız? *</Label>
        <RadioGroup
          value={attending}
          onValueChange={setAttending}
          className="flex gap-4 mt-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes" className="cursor-pointer text-slate-700 dark:text-slate-300">
              Evet, katılacağım
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no" className="cursor-pointer text-slate-700 dark:text-slate-300">
              Hayır, katılamayacağım
            </Label>
          </div>
        </RadioGroup>
      </div>

      {attending === 'yes' && (
        <div>
          <Label className="text-slate-700 dark:text-slate-300 font-medium" htmlFor="guests">
            Kişi sayısı (siz dahil)
          </Label>
          <Input
            type="number"
            className="mt-2 w-28 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
            id="guests"
            min={1}
            max={10}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
          />
        </div>
      )}

      <div>
        <Label className="text-slate-700 dark:text-slate-300 font-medium" htmlFor="message">
          Mesajınız (isteğe bağlı)
        </Label>
        <Textarea
          className="mt-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
          id="message"
          name="message"
          placeholder="Mesajınızı buraya yazabilirsiniz..."
          rows={4}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-medium py-6 text-base"
      >
        <Send className="w-5 h-5" />
        {loading ? 'Gönderiliyor...' : 'Katılımı Onayla'}
      </Button>
    </form>
  )
}

// Main component
export function CorporatePage({ invitation }: CorporatePageProps) {
  const [showRSVPSuccess, setShowRSVPSuccess] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  // Parallax effects for hero
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.15])

  // Extract custom fields for corporate events
  const customFields = invitation.custom_fields as {
    company_name?: string
    event_type?: string
    entry_animation?: string
    show_gift_section?: boolean
  } | null

  const companyName = customFields?.company_name || ''
  const eventType = customFields?.event_type || ''

  const entryAnimation = (customFields?.entry_animation || 'curtain') as EntryAnimationType
  const showGiftSection = customFields?.show_gift_section !== false

  // Get theme color from invitation or use defaults based on type
  const getThemeColor = () => {
    if (invitation.primary_color) return invitation.primary_color

    switch (invitation.invitation_type) {
      case 'corporate':
        return '#0f172a'
      case 'party':
        return '#7c3aed'
      case 'religious':
        return '#064e3b'
      default:
        return '#1e293b'
    }
  }

  const themeColor = getThemeColor()

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

  // Check if video URL exists and is valid
  const hasVideo = invitation.video_url && (
    invitation.video_url.includes('.mp4') ||
    invitation.video_url.includes('.webm') ||
    invitation.video_url.includes('youtube') ||
    invitation.video_url.includes('vimeo')
  )

  return (
    <EntryAnimation
      type={entryAnimation}
      primaryColor={invitation.primary_color}
      secondaryColor={invitation.secondary_color}
      accentColor={invitation.accent_color}
      invitationType={invitation.invitation_type}
      title={invitation.title}
    >
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section with Video Background */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: themeColor }}
      >
        {/* Responsive Video Background */}
        {hasVideo && (
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{ scale: heroScale }}
            >
              {invitation.video_url?.includes('.mp4') || invitation.video_url?.includes('.webm') ? (
                <video
                  src={invitation.video_url}
                  className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <iframe
                  src={invitation.video_url || undefined}
                  className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{ border: 0, pointerEvents: 'none' }}
                />
              )}
            </motion.div>
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
          </div>
        )}

        {/* Gradient Background (fallback when no video) */}
        {!hasVideo && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Animated gradient orbs */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
            </div>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ opacity: heroOpacity }}
          >
            {/* Decorative icon */}
            <motion.div
              className="inline-block mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                {invitation.invitation_type === 'corporate' ? (
                  <Building2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
                ) : invitation.invitation_type === 'party' ? (
                  <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-white" />
                ) : (
                  <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-white" />
                )}
              </div>
            </motion.div>

            {/* Event type badge */}
            <motion.div
              className="inline-block mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs md:text-sm text-white font-medium tracking-wider uppercase">
                {invitation.invitation_type === 'corporate' ? 'Kurumsal Etkinlik' :
                 invitation.invitation_type === 'party' ? 'Parti' :
                 invitation.invitation_type === 'religious' ? 'Dini Tören' : 'Özel Davet'}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {invitation.title}
            </motion.h1>

            {/* Company Name and Event Type */}
            {(companyName || eventType) && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                {companyName && (
                  <p className="text-xl md:text-2xl text-white/90 font-semibold">{companyName}</p>
                )}
                {eventType && (
                  <p className="text-lg md:text-xl text-white/70 mt-1">{eventType}</p>
                )}
              </motion.div>
            )}

            {/* Message */}
            {invitation.message && (
              <motion.p
                className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {invitation.message}
              </motion.p>
            )}

            {/* Date and Time */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-white/90 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {invitation.event_date && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm md:text-base font-medium">
                    {format(new Date(invitation.event_date), 'd MMMM yyyy, EEEE', { locale: tr })}
                  </span>
                </div>
              )}
              {invitation.event_time && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm md:text-base font-medium">{invitation.event_time}</span>
                </div>
              )}
            </motion.div>

            {/* Hosts */}
            {invitation.hosts && invitation.hosts.length > 0 && (
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center justify-center gap-2 text-white/70 mb-3">
                  <Users className="w-4 h-4" />
                  <span className="text-sm uppercase tracking-wider">Ev Sahipleri</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {invitation.hosts?.map((host, idx) => (
                    <span key={idx} className="text-lg md:text-xl text-white font-medium">
                      {host}
                      {idx < (invitation.hosts?.length || 0) - 1 && (
                        <span className="text-white/50 mx-2">•</span>
                      )}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Button */}
            {invitation.show_rsvp && (
              <motion.button
                onClick={scrollToRSVP}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold text-base md:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <CalendarCheck className="w-5 h-5" />
                Katılımı Onayla
              </motion.button>
            )}
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            onClick={scrollToRSVP}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </div>
      </section>

      {/* Countdown Section */}
      {invitation.show_countdown && invitation.event_date && (
        <section className="py-16 md:py-24 bg-white dark:bg-slate-800">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                Etkinliğe Kalan Süre
              </h2>
              <p className="text-slate-600 dark:text-slate-400">Her saniye bir adım daha yaklaşıyoruz</p>
            </motion.div>
            <Countdown targetDate={invitation.event_date} />
          </div>
        </section>
      )}

      {/* Event Details Section */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Etkinlik Detayları
            </h2>
            <p className="text-slate-600 dark:text-slate-400">Bilmeniz gereken her şey</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Venue Card */}
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-slate-900 dark:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Konum</h3>
              </div>

              {invitation.location_name && (
                <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {invitation.location_name}
                </p>
              )}

              {invitation.location_address && (
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {invitation.location_address}
                </p>
              )}

              {/* Map */}
              {invitation.location_map_url && (
                <div className="mb-6 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <iframe
                    src={getMapEmbedUrl(invitation.location_map_url)}
                    width="100%"
                    height="200"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${invitation.location_name} Haritası`}
                    className="w-full"
                    style={{ border: 0 }}
                  />
                </div>
              )}

              {invitation.location_map_url && (
                <a
                  href={invitation.location_map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Haritada Görüntüle
                </a>
              )}
            </motion.div>

            {/* Date and Time Card */}
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-slate-900 dark:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tarih ve Saat</h3>
              </div>

              {invitation.event_date && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium uppercase tracking-wider">Tarih</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {format(new Date(invitation.event_date), 'd MMMM yyyy, EEEE', { locale: tr })}
                  </p>
                </div>
              )}

              {invitation.event_time && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium uppercase tracking-wider">Saat</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {invitation.event_time}
                  </p>
                </div>
              )}

              {invitation.event_date && (
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(invitation.title)}&dates=${invitation.event_date.replace(/-/g, '')}/${invitation.event_date.replace(/-/g, '')}&location=${encodeURIComponent((invitation.location_name || '') + ', ' + (invitation.location_address || ''))}&details=${encodeURIComponent(invitation.message || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Takvime Ekle
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      {invitation.show_rsvp && (
        <section id="rsvp" className="py-16 md:py-24 bg-white dark:bg-slate-800">
          <div className="max-w-2xl mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                Katılımınızı Onaylayın
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Sizi aramızda görmek için sabırsızlanıyoruz
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {showRSVPSuccess ? (
                <motion.div
                  key="success"
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 text-center border border-slate-200 dark:border-slate-700"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <CheckCircle2 className="w-20 h-20 mx-auto text-green-500 mb-6" />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    Teşekkürler!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Yanıtınız başarıyla kaydedildi. Sizi etkinliğimizde görmekten mutluluk duyacağız!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12 border border-slate-200 dark:border-slate-700"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
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
      <footer className="py-12 bg-slate-900 dark:bg-black text-center border-t border-slate-800">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">
            {invitation.title}
          </p>
          {invitation.event_date && (
            <p className="text-slate-400">
              {format(new Date(invitation.event_date), 'd MMMM yyyy', { locale: tr })}
            </p>
          )}
          {invitation.hosts && invitation.hosts.length > 0 && (
            <p className="text-slate-500 text-sm mt-4">
              {invitation.hosts.join(' • ')}
            </p>
          )}
        </motion.div>
      </footer>
    </main>
    </EntryAnimation>
  )
}
