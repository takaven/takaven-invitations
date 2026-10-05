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
  Heart,
  Users,
  Wine,
  UtensilsCrossed,
  Music,
  PartyPopper,
  Send,
  VolumeX,
  Volume2,
  TriangleAlert,
  Gift
} from 'lucide-react'
import { Invitation } from '@/types/database'
import { EntryAnimation, EntryAnimationType } from './entry-animation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { submitRSVP } from '@/lib/actions/invitations'

interface ElegantWeddingPageProps {
  invitation: Invitation
}

// Timeline event type
interface TimelineEvent {
  time: string
  title: string
  description: string
  icon: string
}

// Default timeline events for weddings
const defaultTimelineEvents: TimelineEvent[] = [
  { time: '16:30', title: 'Misafir Karşılama', description: 'Hoş geldiniz', icon: 'users' },
  { time: '17:00', title: 'Nikah Töreni', description: 'Resmi nikah', icon: 'heart' },
  { time: '18:00', title: 'Kokteyl', description: 'Aperatif ve içecekler', icon: 'wine' },
  { time: '20:00', title: 'Yemek', description: 'Düğün ziyafeti', icon: 'utensils' },
  { time: '22:30', title: 'İlk Dans', description: 'Gelin ve damadın dansı', icon: 'heart' },
  { time: '23:00', title: 'Parti', description: 'Dans başlasın!', icon: 'music' },
  { time: '02:30', title: 'Kapanış', description: 'Hoşçakalın', icon: 'party' }
]

const iconMap = {
  users: Users,
  heart: Heart,
  wine: Wine,
  utensils: UtensilsCrossed,
  music: Music,
  party: PartyPopper
}

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
    <div className="grid grid-cols-4 gap-2 md:gap-8 max-w-2xl mx-auto">
      {[
        { value: timeLeft.days, label: 'Gün' },
        { value: timeLeft.hours, label: 'Saat' },
        { value: timeLeft.minutes, label: 'Dakika' },
        { value: timeLeft.seconds, label: 'Saniye' }
      ].map((item, idx) => (
        <motion.div
          key={idx}
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true }}
        >
          <span className="block font-display text-4xl md:text-6xl lg:text-7xl font-light text-neutral-700 tracking-tight tabular-nums">
            {item.value < 100 ? padNumber(item.value) : item.value}
          </span>
          <span className="block mt-2 text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-body">
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
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-neutral-800/90 text-white shadow-lg hover:bg-neutral-700 transition-all duration-300 backdrop-blur-sm"
        aria-label={isPlaying ? 'Sesi kapat' : 'Sesi aç'}
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </>
  )
}

// RSVP Form with dietary restrictions
function RSVPForm({ invitationId, onSuccess, showDietary = true }: { invitationId: string; onSuccess: () => void; showDietary?: boolean }) {
  const [loading, setLoading] = useState(false)
  const [attending, setAttending] = useState('yes')
  const [guestCount, setGuestCount] = useState(1)
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([])
  const [otherAllergy, setOtherAllergy] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('attending', attending === 'yes' ? 'true' : 'false')
    formData.set('guest_count', String(guestCount))

    // Combine dietary restrictions
    const allRestrictions = [...dietaryRestrictions]
    if (otherAllergy.trim()) {
      allRestrictions.push(otherAllergy.trim())
    }
    formData.set('dietary_requirements', allRestrictions.join(', '))

    try {
      await submitRSVP(invitationId, formData)
      onSuccess()
    } catch (error) {
      console.error('RSVP error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions(prev =>
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card-elegant space-y-6 shadow-soft">
      <div>
        <Label className="text-neutral-700 font-medium" htmlFor="name">
          Adınız Soyadınız *
        </Label>
        <Input
          className="mt-2 bg-white border-neutral-200 text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-500"
          id="name"
          name="name"
          required
          placeholder="Adınız"
        />
      </div>

      <div>
        <Label className="text-neutral-700 font-medium" htmlFor="email">
          E-posta (isteğe bağlı)
        </Label>
        <Input
          type="email"
          className="mt-2 bg-white border-neutral-200 text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-500"
          id="email"
          name="email"
          placeholder="ornek@email.com"
        />
      </div>

      <div>
        <Label className="text-neutral-700 font-medium">Katılacak mısınız? *</Label>
        <RadioGroup
          value={attending}
          onValueChange={setAttending}
          className="flex gap-6 mt-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" className="border-neutral-500 text-neutral-700" />
            <Label htmlFor="yes" className="cursor-pointer text-neutral-700">
              Evet, katılacağım
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" className="border-neutral-500 text-neutral-700" />
            <Label htmlFor="no" className="cursor-pointer text-neutral-700">
              Katılamayacağım
            </Label>
          </div>
        </RadioGroup>
      </div>

      {attending === 'yes' && (
        <>
          <div>
            <Label className="text-neutral-700 font-medium" htmlFor="guests">
              Kişi sayısı (siz dahil)
            </Label>
            <Input
              type="number"
              className="mt-2 w-24 bg-white border-neutral-200 text-neutral-700 focus:border-neutral-500"
              id="guests"
              min={1}
              max={10}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
            />
          </div>

          {showDietary && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TriangleAlert className="w-4 h-4 text-amber-600" />
              <Label className="text-base text-neutral-700 font-medium">
                Alerji ve diyet kısıtlamaları
              </Label>
            </div>
            <p className="text-sm text-neutral-500 font-body">
              Herhangi bir diyet kısıtlamanızı bilmek bizim için çok önemli. Geçerli olanları seçin:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'gluten', label: 'Glutensiz / Çölyak' },
                { id: 'lactose', label: 'Laktozsuz' },
                { id: 'vegetarian', label: 'Vejetaryen' },
                { id: 'vegan', label: 'Vegan' },
                { id: 'nuts', label: 'Kuruyemiş alerjisi' },
                { id: 'seafood', label: 'Deniz ürünleri alerjisi' }
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={dietaryRestrictions.includes(item.id)}
                    onCheckedChange={() => toggleDietaryRestriction(item.id)}
                    className="border-neutral-500 data-[state=checked]:bg-neutral-700 data-[state=checked]:border-neutral-700"
                  />
                  <Label
                    htmlFor={item.id}
                    className="text-sm cursor-pointer text-neutral-700"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
            <div>
              <Label className="text-sm text-neutral-700 font-medium" htmlFor="other-allergy">
                Diğer alerji veya kısıtlamalar:
              </Label>
              <Input
                className="mt-2 bg-white border-neutral-200 text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-500"
                id="other-allergy"
                placeholder="Örn: yumurta alerjisi, fruktoz intoleransı..."
                value={otherAllergy}
                onChange={(e) => setOtherAllergy(e.target.value)}
              />
            </div>
          </div>
          )}
        </>
      )}

      <div>
        <Label className="text-neutral-700 font-medium" htmlFor="message">
          Çifte mesajınız (isteğe bağlı)
        </Label>
        <Textarea
          className="mt-2 bg-white border-neutral-200 text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-500"
          id="message"
          name="message"
          placeholder="Birkaç kelime yazmak ister misiniz..."
          rows={3}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
      >
        <Send className="w-4 h-4" />
        {loading ? 'Gönderiliyor...' : 'Katılımı Onayla'}
      </Button>
    </form>
  )
}

// Elegant divider component
function ElegantDivider() {
  return (
    <motion.div
      className="flex items-center justify-center py-2 bg-ivory"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <span className="h-px bg-neutral-700/30 w-16 md:w-24" />
      <span className="mx-4 text-neutral-400 text-sm font-body">&#9829;</span>
      <span className="h-px bg-neutral-700/30 w-16 md:w-24" />
    </motion.div>
  )
}

export function ElegantWeddingPage({ invitation }: ElegantWeddingPageProps) {
  const [showRSVPSuccess, setShowRSVPSuccess] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()

  // Parallax effect for hero video
  const videoY = useTransform(scrollY, [0, 500], [0, 150])
  const videoScale = useTransform(scrollY, [0, 500], [1.18, 1])

  // Extract couple names from custom_fields
  const customFields = invitation.custom_fields as {
    timeline?: TimelineEvent[]
    couple_names?: { bride: string; groom: string }
    entry_animation?: string
    show_dietary?: boolean
    show_gift_section?: boolean
  } | null

  const coupleNames = customFields?.couple_names
  const brideName = coupleNames?.bride || invitation.title || 'Gelin'
  const groomName = coupleNames?.groom || invitation.subtitle || 'Damat'

  // Get timeline events from custom_fields or use default
  const timelineEvents: TimelineEvent[] = customFields?.timeline || defaultTimelineEvents

  // Extract Google Maps embed URL from map URL
  const getMapEmbedUrl = (mapUrl: string) => {
    // If it's already an embed URL, return it
    if (mapUrl.includes('maps/embed')) return mapUrl

    // Try to extract place from Google Maps URL
    const placeMatch = mapUrl.match(/place\/([^/]+)/)
    if (placeMatch) {
      const place = placeMatch[1]
      return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(place)}`
    }

    // If location name exists, use that
    if (invitation.location_name) {
      return `https://www.google.com/maps?q=${encodeURIComponent(invitation.location_name + ' ' + (invitation.location_address || ''))}&output=embed`
    }

    return mapUrl
  }

  const scrollToRSVP = () => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })
  }

  const entryAnimation = (customFields?.entry_animation || 'envelope') as EntryAnimationType
  const showDietary = customFields?.show_dietary !== false
  const showGiftSection = customFields?.show_gift_section !== false

  return (
    <EntryAnimation
      type={entryAnimation}
      primaryColor={invitation.primary_color}
      secondaryColor={invitation.secondary_color}
      accentColor={invitation.accent_color}
      invitationType={invitation.invitation_type}
      title={brideName}
      subtitle={groomName}
      eventDate={invitation.event_date || undefined}
      eventTime={invitation.event_time || undefined}
      locationName={invitation.location_name || undefined}
    >
    <main className="bg-cream">
      {/* Music Player */}
      <MusicPlayer musicUrl={invitation.music_url} />

      {/* Hero Section with Video Background */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-cream">
        {/* Video or Image Background */}
        {invitation.video_url ? (
          // Check if it's a direct video file or embed URL
          invitation.video_url.includes('.mp4') || invitation.video_url.includes('.webm') ? (
            <motion.video
              src={invitation.video_url}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              style={{ y: videoY, scale: videoScale, transformOrigin: 'center center' }}
            />
          ) : (
            // YouTube/Vimeo embed
            <div className="absolute inset-0">
              <iframe
                src={invitation.video_url}
                className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ border: 0, pointerEvents: 'none' }}
              />
            </div>
          )
        ) : invitation.hero_image_url ? (
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${invitation.hero_image_url})`,
              y: videoY,
              scale: videoScale,
              transformOrigin: 'center center'
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-neutral-200" />
        )}

        {/* Hero Content */}
        <div className="relative z-20 min-h-screen flex flex-col">
          <motion.div
            className="pt-12 md:pt-16 text-center px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-neutral-500 mb-3 font-light font-body">
              {invitation.invitation_type === 'wedding' ? 'Evleniyoruz' : 'Davetlisiniz'}
            </p>
            <h1 className="font-script text-4xl md:text-6xl lg:text-7xl text-neutral-700 leading-tight italic font-light">
              {brideName}
              {groomName && (
                <>
                  {' '}
                  <span className="text-neutral-400 font-normal not-italic">&</span>{' '}
                  {groomName}
                </>
              )}
            </h1>
            <motion.p
              className="mt-3 text-[10px] md:text-xs font-light tracking-[0.3em] text-neutral-500 uppercase font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {invitation.event_date && format(new Date(invitation.event_date), 'd MMMM yyyy', { locale: tr })}
            </motion.p>
          </motion.div>

          <div className="flex-1" />

          {/* Scroll Indicator */}
          <motion.button
            onClick={scrollToRSVP}
            className="pb-8 flex flex-col items-center gap-2 mx-auto text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase font-light font-body">
              Katılımı Onayla
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </div>
      </section>

      {/* Countdown Section */}
      {invitation.show_countdown && invitation.event_date && (
        <section id="countdown" className="section-padding bg-cream">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              className="text-neutral-400 text-[10px] font-body tracking-[0.4em] uppercase mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Geri Sayım
            </motion.p>
            <motion.h2
              className="font-script text-3xl md:text-4xl text-neutral-700 mb-16 font-light italic"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              O Özel Güne
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Countdown targetDate={invitation.event_date} />
            </motion.div>
          </div>
        </section>
      )}

      {/* Event Details Section */}
      <section className="section-padding bg-ivory">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-script text-5xl md:text-6xl text-neutral-700 mb-2">
              Etkinlik Detayları
            </h2>
            <p className="text-neutral-500 font-body tracking-wide">
              Bilmeniz gereken her şey
            </p>
          </motion.div>

          <motion.div
            className="card-elegant text-center shadow-soft"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-neutral-700" />
            </div>
            <h3 className="font-display text-2xl text-neutral-700 mb-4">Konum</h3>
            <div className="space-y-3 mb-6">
              {invitation.location_name && (
                <span className="font-display text-xl text-neutral-700 block">
                  {invitation.location_name}
                </span>
              )}
              {invitation.location_address && (
                <p className="text-sm text-neutral-500 font-body">
                  {invitation.location_address}
                </p>
              )}
              {invitation.event_time && (
                <div className="flex items-center justify-center gap-2 mt-4 text-neutral-500">
                  <Clock className="w-4 h-4" />
                  <span className="font-body">{invitation.event_time}</span>
                </div>
              )}
            </div>

            {/* Map Embed */}
            {invitation.location_map_url && (
              <div className="mb-6 rounded-sm overflow-hidden border border-neutral-200">
                <iframe
                  src={getMapEmbedUrl(invitation.location_map_url)}
                  width="100%"
                  height="250"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${invitation.location_name} Haritası`}
                  className="map-sepia"
                  style={{ border: 0 }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {invitation.location_map_url && (
                <a
                  href={invitation.location_map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Haritada Aç
                </a>
              )}
              {invitation.event_date && (
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(invitation.title)}&dates=${invitation.event_date.replace(/-/g, '')}/${invitation.event_date.replace(/-/g, '')}&location=${encodeURIComponent((invitation.location_name || '') + ', ' + (invitation.location_address || ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Takvime Ekle
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <ElegantDivider />

      {/* Timeline/Program Section */}
      <section className="section-padding bg-ivory">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-script text-5xl md:text-6xl text-neutral-700 mb-2">
              Günün Programı
            </h2>
            <p className="text-neutral-500 font-body tracking-wide">
              Sizin için hazırladıklarımız
            </p>
          </motion.div>

          <div className="relative">
            {/* Desktop Timeline */}
            <div className="hidden md:block">
              <div className="absolute top-16 left-0 right-0 h-px bg-neutral-200" />
              <div className="grid grid-cols-7 gap-2">
                {timelineEvents.map((event, idx) => {
                  const IconComponent = iconMap[event.icon as keyof typeof iconMap] || Heart
                  return (
                    <motion.div
                      key={idx}
                      className="flex flex-col items-center text-center group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="bg-neutral-700 text-white px-3 py-1.5 rounded-full text-sm font-display font-medium mb-4 group-hover:bg-neutral-600 transition-colors duration-300">
                        {event.time}
                      </div>
                      <div className="w-14 h-14 rounded-full bg-white border-2 border-neutral-200 flex items-center justify-center text-neutral-700 mb-4 shadow-sm group-hover:border-neutral-500 group-hover:scale-110 transition-all duration-300 z-10">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-display text-base lg:text-lg text-neutral-700 mb-1 leading-tight">
                        {event.title}
                      </h3>
                      <p className="text-neutral-500 font-body text-xs leading-relaxed px-1">
                        {event.description}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Mobile Timeline */}
            <div className="md:hidden relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-neutral-200" />
              <div className="space-y-6">
                {timelineEvents.map((event, idx) => {
                  const IconComponent = iconMap[event.icon as keyof typeof iconMap] || Heart
                  return (
                    <motion.div
                      key={idx}
                      className="flex items-start gap-4 pl-1"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="w-11 h-11 rounded-full bg-white border-2 border-neutral-200 flex items-center justify-center text-neutral-700 flex-shrink-0 shadow-sm z-10">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-baseline gap-3 mb-0.5">
                          <span className="bg-neutral-700 text-white px-2 py-0.5 rounded text-xs font-display font-medium">
                            {event.time}
                          </span>
                          <h3 className="font-display text-lg text-neutral-700">{event.title}</h3>
                        </div>
                        <p className="text-neutral-500 font-body text-sm">{event.description}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ElegantDivider />

      {/* Gifts Section */}
      {showGiftSection && (
      <section className="section-padding bg-ivory relative">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-script text-5xl md:text-6xl text-neutral-700 mb-6">Hediyeler</h2>
            <p className="text-neutral-500 font-body leading-relaxed max-w-lg mx-auto">
              Bizim için en önemlisi sizin varlığınız.
              <br className="hidden md:block" /> Hediye vermek isterseniz, size en uygun şekilde yapabilirsiniz.
            </p>
          </motion.div>

          <motion.div
            className="card-elegant overflow-hidden !p-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="px-6 py-5 flex items-center gap-3 text-neutral-700">
              <Gift className="w-5 h-5" />
              <span className="font-display text-lg">Katkı</span>
            </div>
          </motion.div>
        </div>
      </section>
      )}

      {/* RSVP Section */}
      {invitation.show_rsvp && (
        <section id="rsvp" className="section-padding bg-ivory">
          <div className="max-w-xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-script text-5xl md:text-6xl text-neutral-700 mb-2">
                Katılımınızı Onaylayın
              </h2>
              <p className="text-neutral-500 font-body tracking-wide">Sizi aramızda görmek istiyoruz</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {showRSVPSuccess ? (
                <motion.div
                  key="success"
                  className="card-elegant text-center shadow-soft"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <Heart className="w-16 h-16 mx-auto text-rose-400 fill-rose-400" />
                  </motion.div>
                  <h3 className="font-script text-3xl text-neutral-700 mt-6 mb-2">Teşekkürler!</h3>
                  <p className="text-neutral-500 font-body">
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
                    showDietary={showDietary}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 bg-neutral-800 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-white/70 text-lg">&#9829;</span>
          <p className="font-script text-4xl text-white mt-4 mb-2">
            {brideName}
            {groomName && ` & ${groomName}`}
          </p>
          {invitation.event_date && (
            <p className="text-sm text-white/80 font-body tracking-wide">
              {format(new Date(invitation.event_date), 'd MMMM yyyy', { locale: tr })}
            </p>
          )}
          <p className="text-xs text-white/60 mt-8 font-body">Tüm sevgimizle</p>
        </motion.div>
      </footer>
    </main>
    </EntryAnimation>
  )
}
