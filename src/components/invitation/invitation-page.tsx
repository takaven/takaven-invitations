'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Calendar, MapPin, Clock, Navigation, Heart } from 'lucide-react'
import { Invitation } from '@/types/database'
import { getTimeUntil } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { submitRSVP } from '@/lib/actions/invitations'

interface InvitationPageProps {
  invitation: Invitation
}

const themeGradients: Record<string, string> = {
  classic: 'from-amber-400 via-orange-400 to-orange-500',
  modern: 'from-slate-700 via-slate-800 to-slate-900',
  elegant: 'from-purple-500 via-indigo-500 to-indigo-600',
  romantic: 'from-pink-400 via-rose-400 to-rose-500',
  playful: 'from-cyan-400 via-blue-400 to-blue-500',
  minimal: 'from-gray-200 via-gray-300 to-gray-400',
  rustic: 'from-amber-500 via-amber-600 to-yellow-700',
  luxury: 'from-yellow-300 via-yellow-400 to-amber-500',
  vintage: 'from-rose-200 via-rose-300 to-pink-400',
  tropical: 'from-emerald-400 via-teal-400 to-teal-500'
}

const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1 }
  },
  slide_up: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  },
  slide_down: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  },
  zoom: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 }
  },
  rotate: {
    initial: { opacity: 0, rotate: -10, scale: 0.9 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 0.7 }
  },
  bounce: {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring' as const, bounce: 0.5 }
  },
  flip: {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0 },
    transition: { duration: 0.8 }
  },
  confetti: {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring' as const, stiffness: 200 }
  },
  sparkle: {
    initial: { opacity: 0, scale: 0.5, rotate: 180 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    transition: { duration: 0.8 }
  },
  elegant: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 1.2, ease: 'easeOut' as const }
  },
  none: {
    initial: {},
    animate: {},
    transition: {}
  }
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntil(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntil(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex justify-center gap-3 sm:gap-6 mt-8">
      {[
        { value: timeLeft.days, label: 'Gün' },
        { value: timeLeft.hours, label: 'Saat' },
        { value: timeLeft.minutes, label: 'Dakika' },
        { value: timeLeft.seconds, label: 'Saniye' }
      ].map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + idx * 0.1, type: 'spring' }}
          className="text-center"
        >
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <span className="text-xl sm:text-3xl font-bold">{item.value}</span>
          </div>
          <span className="text-xs sm:text-sm mt-2 block opacity-80">{item.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

function RSVPForm({ invitationId, onSuccess }: { invitationId: string; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [attending, setAttending] = useState(true)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('attending', String(attending))

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Adınız *</Label>
        <Input id="name" name="name" required placeholder="Adınızı girin" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" name="email" type="email" placeholder="E-posta adresiniz" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input id="phone" name="phone" type="tel" placeholder="Telefon numaranız" />
      </div>

      <div className="space-y-2">
        <Label>Katılım Durumu</Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={attending ? 'default' : 'outline'}
            onClick={() => setAttending(true)}
            className="flex-1"
          >
            <Heart className="w-4 h-4 mr-2" />
            Katılacağım
          </Button>
          <Button
            type="button"
            variant={!attending ? 'default' : 'outline'}
            onClick={() => setAttending(false)}
            className="flex-1"
          >
            Katılamayacağım
          </Button>
        </div>
      </div>

      {attending && (
        <div className="space-y-2">
          <Label htmlFor="guest_count">Kişi Sayısı</Label>
          <Input
            id="guest_count"
            name="guest_count"
            type="number"
            min={1}
            max={10}
            defaultValue={1}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Mesajınız</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Bir not bırakmak ister misiniz?"
          rows={3}
        />
      </div>

      {attending && (
        <div className="space-y-2">
          <Label htmlFor="dietary_requirements">Özel Diyet Gereksinimleri</Label>
          <Input
            id="dietary_requirements"
            name="dietary_requirements"
            placeholder="Varsa belirtin (vejetaryen, vegan, alerji vb.)"
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Gönderiliyor...' : 'Yanıtı Gönder'}
      </Button>
    </form>
  )
}

export function InvitationPage({ invitation }: InvitationPageProps) {
  const [showRSVP, setShowRSVP] = useState(false)
  const [rsvpSuccess, setRsvpSuccess] = useState(false)

  const animation = animationVariants[invitation.animation_type as keyof typeof animationVariants] || animationVariants.fade
  const gradient = themeGradients[invitation.theme_style] || themeGradients.modern

  const isLightTheme = ['minimal', 'vintage', 'luxury'].includes(invitation.theme_style)
  const textColorClass = isLightTheme ? 'text-slate-800' : 'text-white'

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: invitation.background_color,
        fontFamily: invitation.font_family
      }}
    >
      {/* Background */}
      {invitation.background_image_url ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${invitation.background_image_url})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {invitation.animation_type === 'confetti' && (
          <>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: i % 3 === 0 ? invitation.primary_color : i % 3 === 1 ? invitation.secondary_color : invitation.accent_color,
                  left: `${Math.random() * 100}%`,
                  top: -30
                }}
                animate={{
                  y: ['0vh', '120vh'],
                  x: [0, Math.random() * 200 - 100],
                  rotate: [0, 720 * (Math.random() > 0.5 ? 1 : -1)]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: 'linear'
                }}
              />
            ))}
          </>
        )}

        {invitation.animation_type === 'sparkle' && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              >
                <svg width="24" height="24" viewBox="0 0 20 20" fill={invitation.accent_color}>
                  <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8L10 0Z" />
                </svg>
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Content */}
      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 ${textColorClass}`}>
        <AnimatePresence>
          <motion.div
            className="text-center max-w-2xl mx-auto space-y-8"
            {...animation}
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                {invitation.title}
              </h1>
              {invitation.subtitle && (
                <p className="text-2xl sm:text-3xl font-light opacity-90 mt-4">
                  {invitation.subtitle}
                </p>
              )}
            </motion.div>

            {/* Decorative Divider */}
            <motion.div
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="h-px w-16 bg-current opacity-30" />
              <Heart className="w-5 h-5 opacity-50" />
              <div className="h-px w-16 bg-current opacity-30" />
            </motion.div>

            {/* Message */}
            {invitation.message && (
              <motion.p
                className="text-lg sm:text-xl opacity-90 leading-relaxed max-w-lg mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {invitation.message}
              </motion.p>
            )}

            {/* Event Details Card */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="space-y-4">
                {invitation.event_date && (
                  <div className="flex items-center justify-center gap-3 text-lg">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="font-medium">
                      {format(new Date(invitation.event_date), 'd MMMM yyyy, EEEE', { locale: tr })}
                    </span>
                  </div>
                )}

                {invitation.event_time && (
                  <div className="flex items-center justify-center gap-3 text-lg">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{invitation.event_time}</span>
                  </div>
                )}

                {invitation.location_name && (
                  <div className="flex items-center justify-center gap-3 text-lg">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium block">{invitation.location_name}</span>
                      {invitation.location_address && (
                        <span className="text-sm opacity-70">{invitation.location_address}</span>
                      )}
                    </div>
                  </div>
                )}

                {invitation.location_map_url && (
                  <a
                    href={invitation.location_map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Navigation className="w-4 h-4" />
                    Haritada Görüntüle
                  </a>
                )}
              </div>
            </motion.div>

            {/* Countdown */}
            {invitation.show_countdown && invitation.event_date && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-sm uppercase tracking-wider opacity-70 mb-2">Etkinliğe Kalan Süre</p>
                <Countdown targetDate={invitation.event_date} />
              </motion.div>
            )}

            {/* RSVP Button */}
            {invitation.show_rsvp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                <Button
                  size="lg"
                  onClick={() => setShowRSVP(true)}
                  className="px-10 py-6 text-lg rounded-full font-semibold shadow-xl"
                  style={{
                    backgroundColor: isLightTheme ? invitation.primary_color : 'white',
                    color: isLightTheme ? 'white' : invitation.primary_color
                  }}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Katılım Bildirin
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* RSVP Dialog */}
      <Dialog open={showRSVP} onOpenChange={setShowRSVP}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {rsvpSuccess ? 'Teşekkürler!' : 'Katılım Bildirimi'}
            </DialogTitle>
            <DialogDescription>
              {rsvpSuccess
                ? 'Yanıtınız başarıyla kaydedildi. Sizi aramızda görmekten mutluluk duyacağız!'
                : 'Lütfen aşağıdaki formu doldurun.'}
            </DialogDescription>
          </DialogHeader>

          {rsvpSuccess ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <Heart className="w-16 h-16 mx-auto text-pink-500 fill-pink-500" />
              </motion.div>
              <Button onClick={() => setShowRSVP(false)} className="mt-6">
                Kapat
              </Button>
            </div>
          ) : (
            <RSVPForm
              invitationId={invitation.id}
              onSuccess={() => setRsvpSuccess(true)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className={`relative z-10 text-center pb-6 ${textColorClass} opacity-50`}>
        <p className="text-xs">
          Davetiye ile oluşturuldu
        </p>
      </div>
    </div>
  )
}
