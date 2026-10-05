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
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Star,
  Send,
  VolumeX,
  Volume2,
  Sparkles,
  Trophy
} from 'lucide-react'
import { Invitation } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { submitRSVP } from '@/lib/actions/invitations'
import { EntryAnimation, EntryAnimationType } from './entry-animation'

interface GraduationPageProps {
  invitation: Invitation
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
    <div className="grid grid-cols-4 gap-3 md:gap-8 max-w-2xl mx-auto">
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
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-lg blur-lg" />
            <span className="relative block font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-[#1e3a8a] tracking-tight tabular-nums bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg border-2 border-amber-400/30 shadow-lg">
              {item.value < 100 ? padNumber(item.value) : item.value}
            </span>
          </div>
          <span className="block mt-3 text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#1e3a8a]/70 font-semibold">
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
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#1e3a8a]/90 text-amber-400 shadow-lg hover:bg-[#1e3a8a]/80 transition-all duration-300 backdrop-blur-sm border border-amber-400/30"
        aria-label={isPlaying ? 'Sesi kapat' : 'Sesi aç'}
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </>
  )
}

// RSVP Form
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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-amber-400/20 space-y-6">
      <div>
        <Label className="text-[#1e3a8a] font-semibold" htmlFor="name">
          Adınız Soyadınız *
        </Label>
        <Input
          className="mt-2 bg-white border-[#1e3a8a]/20 text-[#1e3a8a] placeholder:text-[#1e3a8a]/40 focus:border-amber-500 focus:ring-amber-500"
          id="name"
          name="name"
          required
          placeholder="Adınız"
        />
      </div>

      <div>
        <Label className="text-[#1e3a8a] font-semibold" htmlFor="email">
          E-posta (isteğe bağlı)
        </Label>
        <Input
          type="email"
          className="mt-2 bg-white border-[#1e3a8a]/20 text-[#1e3a8a] placeholder:text-[#1e3a8a]/40 focus:border-amber-500 focus:ring-amber-500"
          id="email"
          name="email"
          placeholder="ornek@email.com"
        />
      </div>

      <div>
        <Label className="text-[#1e3a8a] font-semibold">Katılacak mısınız? *</Label>
        <RadioGroup
          value={attending}
          onValueChange={setAttending}
          className="flex gap-6 mt-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" className="border-[#1e3a8a] text-amber-600" />
            <Label htmlFor="yes" className="cursor-pointer text-[#1e3a8a]">
              Evet, katılacağım
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" className="border-[#1e3a8a] text-amber-600" />
            <Label htmlFor="no" className="cursor-pointer text-[#1e3a8a]">
              Katılamayacağım
            </Label>
          </div>
        </RadioGroup>
      </div>

      {attending === 'yes' && (
        <div>
          <Label className="text-[#1e3a8a] font-semibold" htmlFor="guests">
            Kişi sayısı (siz dahil)
          </Label>
          <Input
            type="number"
            className="mt-2 w-24 bg-white border-[#1e3a8a]/20 text-[#1e3a8a] focus:border-amber-500 focus:ring-amber-500"
            id="guests"
            min={1}
            max={10}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
          />
        </div>
      )}

      <div>
        <Label className="text-[#1e3a8a] font-semibold" htmlFor="message">
          Mesajınız (isteğe bağlı)
        </Label>
        <Textarea
          className="mt-2 bg-white border-[#1e3a8a]/20 text-[#1e3a8a] placeholder:text-[#1e3a8a]/40 focus:border-amber-500 focus:ring-amber-500"
          id="message"
          name="message"
          placeholder="Tebrik mesajınız..."
          rows={3}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full gap-2 bg-gradient-to-r from-[#1e3a8a] to-[#1e3a8a]/90 hover:from-[#1e3a8a]/90 hover:to-[#1e3a8a]/80 text-white font-semibold shadow-lg"
      >
        <Send className="w-4 h-4" />
        {loading ? 'Gönderiliyor...' : 'Katılımı Onayla'}
      </Button>
    </form>
  )
}

// Floating graduation cap animation - client-side only to avoid hydration mismatch
function FloatingCaps() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Pre-calculated positions and durations
  const caps = [
    { id: 0, delay: 0, duration: 4, x: 10 },
    { id: 1, delay: 0.8, duration: 5, x: 25 },
    { id: 2, delay: 1.6, duration: 3.5, x: 40 },
    { id: 3, delay: 2.4, duration: 4.5, x: 55 },
    { id: 4, delay: 3.2, duration: 3, x: 70 },
    { id: 5, delay: 4, duration: 5, x: 85 },
    { id: 6, delay: 4.8, duration: 4, x: 95 },
    { id: 7, delay: 5.6, duration: 3.5, x: 5 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {caps.map((cap) => (
        <motion.div
          key={cap.id}
          className="absolute text-amber-400/20"
          style={{ left: `${cap.x}%`, top: '100%' }}
          initial={{ y: 0, rotate: 0 }}
          animate={{
            y: -1200,
            rotate: [0, 180, 360],
            x: [0, 50, -50, 0],
          }}
          transition={{
            duration: cap.duration,
            delay: cap.delay,
            repeat: Infinity,
            repeatDelay: 5,
            ease: 'easeInOut',
          }}
        >
          <GraduationCap className="w-8 h-8 md:w-12 md:h-12" />
        </motion.div>
      ))}
    </div>
  )
}

// Academic divider component
function AcademicDivider() {
  return (
    <motion.div
      className="flex items-center justify-center py-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <span className="h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent w-32 md:w-48" />
      <span className="mx-4 text-amber-500">
        <Star className="w-5 h-5 fill-amber-500" />
      </span>
      <span className="h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent w-32 md:w-48" />
    </motion.div>
  )
}

export function GraduationPage({ invitation }: GraduationPageProps) {
  const [showRSVPSuccess, setShowRSVPSuccess] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()

  // Parallax effect for hero video
  const videoY = useTransform(scrollY, [0, 500], [0, 100])
  const videoScale = useTransform(scrollY, [0, 500], [1.1, 1])

  // Extract custom fields for graduation
  const customFields = invitation.custom_fields as {
    graduate_name?: string
    degree?: string
    school_name?: string
    entry_animation?: string
    show_gift_section?: boolean
  } | null

  // Extract hosts from invitation
  const hosts = invitation.hosts || []
  const graduateName = customFields?.graduate_name || (hosts.length > 0 ? hosts[0] : invitation.title)
  const degree = customFields?.degree || ''
  const schoolName = customFields?.school_name || ''

  const entryAnimation = (customFields?.entry_animation || 'cap_toss') as EntryAnimationType
  const showGiftSection = customFields?.show_gift_section !== false

  const scrollToRSVP = () => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <EntryAnimation
      type={entryAnimation}
      primaryColor={invitation.primary_color}
      secondaryColor={invitation.secondary_color}
      accentColor={invitation.accent_color}
      invitationType={invitation.invitation_type}
      title={invitation.title}
    >
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      {/* Music Player */}
      <MusicPlayer musicUrl={invitation.music_url} />

      {/* Hero Section with Video Background */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        {/* Video or Background */}
        {invitation.video_url ? (
          <div className="absolute inset-0">
            <motion.div
              className="w-full h-full"
              style={{ y: videoY, scale: videoScale }}
            >
              <video
                src={invitation.video_url}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a8a]/85 via-[#1e3a8a]/70 to-[#1e3a8a]/90" />
          </div>
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#1e3a8a]/95 to-[#1e3a8a]" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
            </div>
          </div>
        )}

        {/* Floating caps animation */}
        <FloatingCaps />

        {/* Hero Content */}
        <div className="relative z-20 min-h-screen flex flex-col">
          {/* Top decoration */}
          <motion.div
            className="pt-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-amber-400 font-bold">
                Mezuniyet Töreni
              </span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </motion.div>
          </motion.div>

          {/* Main title area */}
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center max-w-4xl">
              {/* Graduation cap icon */}
              <motion.div
                className="mb-8"
                initial={{ y: -50, opacity: 0, rotate: -15 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative inline-block">
                  <motion.div
                    className="absolute inset-0 bg-amber-400/30 rounded-full blur-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <GraduationCap className="relative w-24 h-24 md:w-32 md:h-32 text-amber-400" strokeWidth={1.5} />
                </div>
              </motion.div>

              {/* Main title */}
              <motion.h1
                className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {graduateName}
              </motion.h1>

              {/* Degree and School */}
              {(degree || schoolName) && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {degree && (
                    <p className="text-xl md:text-2xl text-amber-400 font-medium">{degree}</p>
                  )}
                  {schoolName && (
                    <p className="text-lg md:text-xl text-white/80 font-light mt-1">{schoolName}</p>
                  )}
                </motion.div>
              )}

              {/* Message */}
              {invitation.message && (
                <motion.p
                  className="text-lg md:text-2xl text-amber-400/90 font-light mb-8 max-w-2xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  {invitation.message}
                </motion.p>
              )}

              {/* Date */}
              {invitation.event_date && (
                <motion.div
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-amber-400/30 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                >
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span className="text-base md:text-lg text-white font-semibold tracking-wide">
                    {format(new Date(invitation.event_date), 'd MMMM yyyy', { locale: tr })}
                  </span>
                  {invitation.event_time && (
                    <>
                      <span className="text-amber-400">•</span>
                      <Clock className="w-5 h-5 text-amber-400" />
                      <span className="text-base md:text-lg text-white font-semibold">
                        {invitation.event_time}
                      </span>
                    </>
                  )}
                </motion.div>
              )}

              {/* Decorative line */}
              <motion.div
                className="mt-12 flex items-center justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <span className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-24 md:w-32" />
                <Award className="w-6 h-6 text-amber-400" />
                <span className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-24 md:w-32" />
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.button
            onClick={scrollToRSVP}
            className="pb-8 flex flex-col items-center gap-2 mx-auto text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase font-semibold">
              Devamı için kaydırın
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </section>

      {/* Countdown Section */}
      {invitation.show_countdown && invitation.event_date && (
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl md:text-6xl text-[#1e3a8a] font-bold mb-4">
                Geri Sayım
              </h2>
              <p className="text-[#1e3a8a]/70 text-lg">Büyük güne</p>
            </motion.div>
            <Countdown targetDate={invitation.event_date} />
          </div>
        </section>
      )}

      <AcademicDivider />

      {/* Event Details Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-6xl text-[#1e3a8a] font-bold mb-4">
              Tören Detayları
            </h2>
            <p className="text-[#1e3a8a]/70 text-lg">Sizinle bu özel anı paylaşmak istiyoruz</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Location Card */}
            {invitation.location_name && (
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-amber-400/20"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-serif text-2xl text-[#1e3a8a] font-bold mb-4 text-center">Konum</h3>
                <div className="space-y-3 text-center">
                  <p className="font-semibold text-xl text-[#1e3a8a]">
                    {invitation.location_name}
                  </p>
                  {invitation.location_address && (
                    <p className="text-[#1e3a8a]/70 leading-relaxed">
                      {invitation.location_address}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Time Card */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-amber-400/20"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#1e3a8a]/80 flex items-center justify-center shadow-lg">
                <Clock className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="font-serif text-2xl text-[#1e3a8a] font-bold mb-4 text-center">Tarih & Saat</h3>
              <div className="space-y-3 text-center">
                {invitation.event_date && (
                  <p className="font-semibold text-xl text-[#1e3a8a]">
                    {format(new Date(invitation.event_date), 'd MMMM yyyy, EEEE', { locale: tr })}
                  </p>
                )}
                {invitation.event_time && (
                  <p className="text-[#1e3a8a]/70 text-lg">
                    Saat: {invitation.event_time}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Hosts Section */}
          {hosts.length > 0 && (
            <motion.div
              className="mt-12 max-w-2xl mx-auto bg-gradient-to-br from-[#1e3a8a] to-[#1e3a8a]/90 rounded-2xl p-8 md:p-12 shadow-2xl border-2 border-amber-400/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Users className="w-6 h-6 text-amber-400" />
                <h3 className="font-serif text-2xl text-white font-bold">Mezun</h3>
              </div>
              <div className="text-center space-y-2">
                {hosts.map((host, idx) => (
                  <p key={idx} className="text-2xl md:text-3xl text-amber-400 font-semibold">
                    {host}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <AcademicDivider />

      {/* Achievement Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-amber-500" />
            <h2 className="font-serif text-4xl md:text-5xl text-[#1e3a8a] font-bold mb-6">
              Başarı Hikayesi
            </h2>
            <p className="text-lg md:text-xl text-[#1e3a8a]/70 leading-relaxed max-w-2xl mx-auto">
              Yılların emek, özveri ve azmiyle dolu bu yolculuğun sonuna geldik.
              Bu özel anı sizlerle paylaşmak bizim için çok önemli.
            </p>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="mt-12 grid grid-cols-3 gap-6 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {[
              { icon: Award, label: 'Başarı' },
              { icon: Star, label: 'Onur' },
              { icon: GraduationCap, label: 'Mezuniyet' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border-2 border-amber-400/30 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-amber-600" />
                </div>
                <span className="text-sm font-semibold text-[#1e3a8a]/70 uppercase tracking-wider">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* RSVP Section */}
      {invitation.show_rsvp && (
        <section id="rsvp" className="py-20 md:py-32 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-xl mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl md:text-6xl text-[#1e3a8a] font-bold mb-4">
                Katılımınızı Onaylayın
              </h2>
              <p className="text-[#1e3a8a]/70 text-lg">Sizi aramızda görmek isteriz</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {showRSVPSuccess ? (
                <motion.div
                  key="success"
                  className="bg-white rounded-2xl p-12 shadow-2xl border-2 border-amber-400/20 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                      <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="font-serif text-3xl text-[#1e3a8a] font-bold mb-2">
                    Teşekkürler!
                  </h3>
                  <p className="text-[#1e3a8a]/70 text-lg">
                    Yanıtınız başarıyla kaydedildi. Sizi aramızda görmekten mutluluk duyacağız!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
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
      <footer className="py-16 bg-gradient-to-br from-[#1e3a8a] to-[#1e3a8a]/90 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-400 rounded-full blur-3xl" />
        </div>
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-amber-400" />
          <p className="font-serif text-4xl text-white font-bold mb-2">
            {graduateName}
          </p>
          {degree && (
            <p className="text-lg text-amber-400 font-medium">{degree}</p>
          )}
          {schoolName && (
            <p className="text-base text-white/80 mb-2">{schoolName}</p>
          )}
          {invitation.event_date && (
            <p className="text-lg text-amber-400/90 tracking-wide font-semibold mt-2">
              {format(new Date(invitation.event_date), 'd MMMM yyyy', { locale: tr })}
            </p>
          )}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-24" />
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-24" />
          </div>
          <p className="text-sm text-white/70 mt-6">Geleceğe doğru ilk adım</p>
        </motion.div>
      </footer>
    </main>
    </EntryAnimation>
  )
}
