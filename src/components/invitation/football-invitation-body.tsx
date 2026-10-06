'use client'

import { ArrowUpRight, CalendarDays, ChevronDown, Clock3, MapPin, ShieldCheck } from 'lucide-react'
import { format } from 'date-fns'
import type { Invitation } from '@/types/database'
import { BirthdayCountdown, RSVPForm } from './birthday-functional-sections'

interface FootballInvitationBodyProps {
  invitation: Invitation
  age: number
  celebrantName: string
  timezone: string
  showRSVPSuccess: boolean
  onRSVPSuccess: () => void
}

function getMapEmbedUrl(invitation: Invitation) {
  const mapUrl = invitation.location_map_url
  if (!mapUrl) return null
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

function getFixtureDateLabel(eventDate: string | null, eventTime: string | null) {
  if (!eventDate) return 'DATE TO BE CONFIRMED'
  const [year, month, day] = eventDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const dateLabel = format(date, 'EEE dd MMM').toUpperCase()
  const timeLabel = eventTime ? eventTime.slice(0, 5) : 'TBC'
  return `${dateLabel} · ${timeLabel}`
}

export function FootballInvitationBody({
  invitation,
  age,
  celebrantName,
  timezone,
  showRSVPSuccess,
  onRSVPSuccess
}: FootballInvitationBodyProps) {
  const fixtureDate = getFixtureDateLabel(invitation.event_date, invitation.event_time)
  const mapEmbedUrl = getMapEmbedUrl(invitation)
  const titleParts = celebrantName.trim().split(/\s+/)
  const firstName = titleParts[0] || celebrantName

  return (
    <main className="takaven-football-invitation min-h-screen">
      <section className="takaven-football-matchday-hero" aria-labelledby="matchday-title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="takaven-football-matchday-hero__image"
          src="/takaven/football/stadium.webp"
          alt="Floodlit football stadium at night"
        />
        <div className="takaven-football-matchday-hero__veil" aria-hidden />
        <div className="takaven-football-pitch-grid" aria-hidden />

        <div className="relative z-10 mx-auto flex min-h-[670px] w-full max-w-6xl flex-col justify-between px-5 pb-10 pt-12 sm:min-h-[760px] sm:px-10 sm:pb-14 sm:pt-16">
          <div className="flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.28em] text-white/60 sm:text-xs">
            <span className="flex items-center gap-2 text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.85)]" />
              Takaven FC
            </span>
            <span>Invitation / 01</span>
          </div>

          <div className="max-w-3xl pt-16 sm:pt-24">
            <p className="takaven-football-kicker">The fixture is locked in</p>
            <h1 id="matchday-title" className="mt-5 max-w-2xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
              <span className="block text-[clamp(3.5rem,16vw,9rem)]">Matchday</span>
              <span className="mt-3 block text-[clamp(1.9rem,7vw,4.5rem)] text-emerald-200">{firstName}&apos;s {age}th birthday</span>
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-l-2 border-emerald-300 pl-4 text-xs font-bold uppercase tracking-[0.16em] text-white/80 sm:text-sm">
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-emerald-300" /> {fixtureDate}</span>
              <span className="text-white/35">{timezone}</span>
            </div>
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="takaven-football-fixture-strip">
              <div>
                <p className="takaven-football-micro-label">Home fixture</p>
                <p className="mt-2 text-lg font-black uppercase tracking-[0.04em] text-white sm:text-2xl">{firstName.toUpperCase()} XI</p>
              </div>
              <div className="takaven-football-fixture-divider">VS</div>
              <div className="text-right">
                <p className="takaven-football-micro-label">Under the lights</p>
                <p className="mt-2 text-lg font-black uppercase tracking-[0.04em] text-white sm:text-2xl">The Squad</p>
              </div>
            </div>
            <a href="#kickoff" className="takaven-football-scroll-cue" aria-label="Scroll to kickoff details">
              <span>View fixture</span>
              <ChevronDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="kickoff" className="takaven-football-section takaven-football-kickoff-section" aria-labelledby="kickoff-title">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-10 sm:py-28">
          <div className="flex flex-col gap-8 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="takaven-football-kicker">Countdown to kickoff</p>
              <h2 id="kickoff-title" className="takaven-football-section-title">The clock is running.</h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-white/55">Bring your best energy. The lights come on at {invitation.event_time?.slice(0, 5) || 'kickoff'}.</p>
          </div>
          {invitation.show_countdown && invitation.event_date && (
            <div className="takaven-football-countdown-board mt-10">
              <div className="takaven-football-board-label">MATCHDAY CLOCK / {timezone}</div>
              <BirthdayCountdown targetDate={invitation.event_date} targetTime={invitation.event_time} timeZone={timezone} football />
            </div>
          )}
        </div>
      </section>

      <section className="takaven-football-section takaven-football-venue-section" aria-labelledby="venue-title">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-10 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="takaven-football-kicker">The venue</p>
            <h2 id="venue-title" className="takaven-football-section-title">Where the squad meets.</h2>
            <div className="mt-10 flex gap-4 border-t border-white/10 pt-6">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />
              <div>
                <p className="text-xl font-black uppercase tracking-[0.04em] text-white">{invitation.location_name || 'Venue to be confirmed'}</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/55">{invitation.location_address || 'Full venue details will be shared with the squad.'}</p>
              </div>
            </div>
            {invitation.location_map_url && (
              <a className="takaven-football-text-link mt-8 inline-flex" href={invitation.location_map_url} target="_blank" rel="noreferrer">
                Get directions <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
          <div className="takaven-football-map-frame">
            {mapEmbedUrl ? (
              <iframe title="Venue map" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="flex h-full min-h-[270px] items-center justify-center text-center text-sm uppercase tracking-[0.2em] text-white/35">Map details coming soon</div>
            )}
            <div className="takaven-football-map-tag"><span className="h-2 w-2 rounded-full bg-emerald-300" /> VENUE / 01</div>
          </div>
        </div>
      </section>

      <section className="takaven-football-section takaven-football-details-section" aria-labelledby="details-title">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-10 sm:py-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="takaven-football-kicker">Match details</p>
            <h2 id="details-title" className="takaven-football-section-title">One big day.<br /><span>One unforgettable fixture.</span></h2>
            <p className="mt-8 max-w-xl text-base leading-8 text-white/60">{invitation.message || 'Join us for an unforgettable matchday celebration under the lights.'}</p>
          </div>
          <div className="takaven-football-stat-list">
            <div><span>DATE</span><strong>{fixtureDate.split(' · ')[0]}</strong></div>
            <div><span>KICKOFF</span><strong><Clock3 className="mr-2 inline-block h-4 w-4 text-emerald-300" />{invitation.event_time?.slice(0, 5) || 'TBC'}</strong></div>
            <div><span>HOSTED BY</span><strong>{invitation.hosts?.join(' / ') || 'TAKAVEN FC'}</strong></div>
          </div>
        </div>
      </section>

      {invitation.show_rsvp && (
        <section id="rsvp" className="takaven-football-section takaven-football-rsvp-section" aria-labelledby="rsvp-title">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-10 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="takaven-football-kicker">Squad selection</p>
                <h2 id="rsvp-title" className="takaven-football-section-title">You&apos;re on the team.</h2>
                <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">Lock in your place before kickoff so the hosts can prepare the line-up.</p>
                <div className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200"><ShieldCheck className="h-5 w-5" /> Secure RSVP</div>
              </div>
              <div className="takaven-football-rsvp-shell">
                {showRSVPSuccess ? (
                  <div className="takaven-football-rsvp-success"><span className="takaven-football-success-mark">✓</span><p className="takaven-football-kicker">Selection confirmed</p><h3>You&apos;re in the squad.</h3><p>We&apos;ll see you under the lights.</p></div>
                ) : (
                  <RSVPForm invitationId={invitation.id} onSuccess={onRSVPSuccess} football />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="takaven-football-footer">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span className="text-xs font-black uppercase tracking-[0.32em] text-emerald-200">Takaven FC</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">See you under the lights / {fixtureDate}</span>
        </div>
      </footer>
    </main>
  )
}
