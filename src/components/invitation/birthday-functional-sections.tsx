'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { submitRSVP } from '@/lib/actions/invitations'
import { getEventTimestamp } from '@/lib/utils'

export function BirthdayCountdown({
  targetDate,
  targetTime,
  timeZone,
  football = false
}: {
  targetDate: string
  targetTime?: string | null
  timeZone?: string
  football?: boolean
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
        { value: timeLeft.days, label: football ? 'Days' : 'Gün', color: football ? 'from-emerald-700 to-teal-500' : 'from-pink-500 to-rose-500' },
        { value: timeLeft.hours, label: football ? 'Hours' : 'Saat', color: football ? 'from-slate-800 to-slate-600' : 'from-purple-500 to-pink-500' },
        { value: timeLeft.minutes, label: football ? 'Min' : 'Dakika', color: football ? 'from-lime-700 to-emerald-500' : 'from-blue-500 to-purple-500' },
        { value: timeLeft.seconds, label: football ? 'Sec' : 'Saniye', color: football ? 'from-cyan-700 to-teal-500' : 'from-cyan-500 to-blue-500' }
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

export function RSVPForm({ invitationId, onSuccess, football = false }: { invitationId: string; onSuccess: () => void; football?: boolean }) {
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
    <form onSubmit={handleSubmit} className={football ? 'takaven-football-rsvp-form' : 'bg-white rounded-3xl p-8 shadow-2xl space-y-6'}>
      <div>
        <Label className={football ? 'takaven-football-form-label' : 'text-gray-700 font-semibold text-lg'} htmlFor="name">
          Adınız Soyadınız *
        </Label>
        <Input
          className={football ? 'takaven-football-form-input mt-2' : 'mt-2 border-2 border-gray-200 focus:border-pink-400 rounded-xl text-lg'}
          id="name"
          name="name"
          required
          placeholder="Adınızı girin"
        />
      </div>

      <div>
        <Label className={football ? 'takaven-football-form-label' : 'text-gray-700 font-semibold text-lg'} htmlFor="email">
          E-posta (isteğe bağlı)
        </Label>
        <Input
          type="email"
          className={football ? 'takaven-football-form-input mt-2' : 'mt-2 border-2 border-gray-200 focus:border-pink-400 rounded-xl text-lg'}
          id="email"
          name="email"
          placeholder="ornek@email.com"
        />
      </div>

      <div>
        <Label className={football ? 'takaven-football-form-label mb-3 block' : 'text-gray-700 font-semibold text-lg mb-3 block'}>{football ? 'Will you join the squad? *' : 'Katılacak mısınız? *'}</Label>
        <RadioGroup value={attending} onValueChange={setAttending} className="flex gap-4">
          <div className="flex items-center space-x-2 flex-1">
            <RadioGroupItem value="yes" id="yes" className={football ? 'border-emerald-300 text-emerald-300' : 'border-pink-500 text-pink-500'} />
            <Label htmlFor="yes" className={football ? 'cursor-pointer text-white/80 font-medium' : 'cursor-pointer text-gray-700 font-medium'}>{football ? "I'm in!" : 'Evet, geleceğim!'}</Label>
          </div>
          <div className="flex items-center space-x-2 flex-1">
            <RadioGroupItem value="no" id="no" className={football ? 'border-white/35 text-white/55' : 'border-gray-500 text-gray-500'} />
            <Label htmlFor="no" className={football ? 'cursor-pointer text-white/65 font-medium' : 'cursor-pointer text-gray-700 font-medium'}>{football ? "Can't make it" : 'Katılamayacağım'}</Label>
          </div>
        </RadioGroup>
      </div>

      {attending === 'yes' && (
        <div>
          <Label className={football ? 'takaven-football-form-label' : 'text-gray-700 font-semibold text-lg'} htmlFor="guests">{football ? 'How many players?' : 'Kaç kişi geleceksiniz?'}</Label>
          <Input
            type="number"
            className={football ? 'takaven-football-form-input mt-2 w-32' : 'mt-2 w-32 border-2 border-gray-200 focus:border-pink-400 rounded-xl text-lg'}
            id="guests"
            min={1}
            max={10}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
          />
        </div>
      )}

      <div>
        <Label className={football ? 'takaven-football-form-label' : 'text-gray-700 font-semibold text-lg'} htmlFor="message">{football ? 'Message for matchday (optional)' : 'Doğum günü mesajınız (isteğe bağlı)'}</Label>
        <Textarea
          className={football ? 'takaven-football-form-input mt-2' : 'mt-2 border-2 border-gray-200 focus:border-pink-400 rounded-xl text-lg'}
          id="message"
          name="message"
          placeholder={football ? 'Leave a note for the squad...' : 'Dileklerinizi yazın...'}
          rows={3}
        />
      </div>

      {errorMessage && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}

      <Button type="submit" disabled={loading} className={football ? 'takaven-football-rsvp-submit' : 'w-full gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold text-lg py-6 rounded-xl shadow-lg'}>
        <Send className="w-5 h-5" />
        {loading ? 'Sending...' : football ? 'Confirm my place' : 'Katılımı Onayla'}
      </Button>
    </form>
  )
}
