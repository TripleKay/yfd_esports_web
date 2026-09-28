import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchRegistrationSettings,
  type RegistrationSettings,
} from '../api/registrations'
import { Countdown } from '../components/Countdown'
import { DivisionCard } from '../components/DivisionCard'
import { MatchCard } from '../components/MatchCard'
import { NewsCard } from '../components/NewsCard'
import { LinkButton } from '../components/ui/Button'
import { ARTICLES, DIVISIONS, MATCHES, STATS } from '../data/demo'
import type { GameTitle } from '../types'

const filters: { id: GameTitle | 'live'; label: string }[] = [
  { id: 'all', label: 'All Games' },
  { id: 'mlbb', label: 'MLBB 5v5' },
  { id: 'ps5', label: 'PS5 Football 1v1' },
  { id: 'live', label: 'Live Only' },
]

const toneClass = {
  cyan: 'text-cyan',
  violet: 'text-violet',
  primary: 'text-[#dbfcff]',
  critical: 'text-critical',
} as const

function countdownFromSettings(settings: RegistrationSettings | null): {
  target: Date | null
  title: string
  phase: string
} {
  if (!settings || !settings.is_enabled) {
    return {
      target: null,
      title: 'Tournament Kickoff Countdown',
      phase: 'PHASE: REGISTRATION_OFF',
    }
  }

  const now = Date.now()
  const startsAt = settings.starts_at ? new Date(settings.starts_at) : null
  const endsAt = settings.ends_at ? new Date(settings.ends_at) : null

  if (startsAt && now < startsAt.getTime()) {
    return {
      target: startsAt,
      title: 'Registration Opens Countdown',
      phase: 'PHASE: PRE_REGISTRATION',
    }
  }

  if (endsAt && now < endsAt.getTime()) {
    return {
      target: endsAt,
      title: 'Tournament Kickoff Countdown',
      phase: 'PHASE: REGISTRATION_LOCK',
    }
  }

  return {
    target: null,
    title: 'Tournament Kickoff Countdown',
    phase: 'PHASE: REGISTRATION_CLOSED',
  }
}

export function HomePage() {
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const [settings, setSettings] = useState<RegistrationSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  useEffect(() => {
    let active = true

    fetchRegistrationSettings()
      .then((result) => {
        if (active) {
          setSettings(result)
        }
      })
      .catch(() => {
        if (active) {
          setSettings(null)
        }
      })
      .finally(() => {
        if (active) {
          setSettingsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const countdown = useMemo(() => countdownFromSettings(settings), [settings])

  const fixtures = useMemo(() => {
    const homeSet = MATCHES.filter((m) =>
      ['m1', 'm2', 'm3', 'm4'].includes(m.id),
    )
    return homeSet.filter((m) => {
      if (filter === 'all') return true
      if (filter === 'live') return m.status === 'live'
      return m.game === filter
    })
  }, [filter])

  const news = ARTICLES.filter((a) => !a.featured).slice(0, 3)

  return (
    <>
      {/* Hero — centered, matches Stitch landing */}
      <section className="relative w-full overflow-hidden bg-[#0c0e16] pb-20 pt-10 md:pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-arena.png"
            alt=""
            className="h-full w-full scale-105 object-cover object-center opacity-30 brightness-90 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11131b] via-[#0c0e16]/80 to-[#0c0e16]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,240,255,0.1),rgba(111,0,190,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 text-center md:px-6">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-cyan/40 bg-[#282a32]/90 px-4 py-1.5 shadow-[0_0_20px_rgba(0,240,255,0.25)] backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-90" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan" />
            </span>
            <span className="label-code font-semibold tracking-widest text-[#dbfcff]">
              Yoma Family Day E-Sport TOURNAMENT CHAMPIONSHIP
            </span>
          </div>

          <h1 className="max-w-5xl font-display text-4xl font-extrabold uppercase leading-none tracking-tight text-white drop-shadow-[0_0_35px_rgba(0,240,255,0.35)] md:text-6xl lg:text-[64px] lg:leading-[72px]">
            YFD Days{' '}
            <span className="bg-gradient-to-r from-cyan via-[#7df4ff] to-violet bg-clip-text text-transparent">
              Esports Showdown
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted md:text-lg md:leading-7">
            Compete against elite squads and solo champions in the ultimate
            competitive gaming arena. Claim national supremacy, hardware
            contracts, and your slice of the $50,000 pool.
          </p>

          <div className="mt-9 flex w-full justify-center">
            <Countdown
              target={countdown.target}
              title={countdown.title}
              phase={countdown.phase}
              loading={settingsLoading}
            />
          </div>

          <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-6 text-left md:grid-cols-2">
            <DivisionCard division={DIVISIONS[0]} accent="cyan" />
            <DivisionCard division={DIVISIONS[1]} accent="violet" />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="w-full border-y border-[#3b494b]/30 bg-[#0c0e16] py-4">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 text-center md:grid-cols-4 md:px-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center p-2"
            >
              <span
                className={`font-display text-2xl font-extrabold tracking-tight tabular md:text-[32px] ${toneClass[stat.tone]}`}
              >
                {stat.value}
              </span>
              <span className="label-code tracking-wider text-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule & Fixtures */}
      <section className="relative w-full bg-[#11131b] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-code tracking-widest text-cyan">
                CYBER_STADIUM // TELEMETRY_STREAM
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
                Schedule & Fixtures
              </h2>
              <p className="mt-3 max-w-2xl text-muted">
                Real-time match updates, broadcast scores, and upcoming knockout
                seedings.
              </p>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={[
                  'rounded px-4 py-2 label-tactical transition-colors',
                  filter === f.id
                    ? 'bg-cyan font-bold text-[#00363a] shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'text-muted hover:bg-[#282a32] hover:text-white',
                ].join(' ')}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {fixtures.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 rounded border border-[#3b494b]/50 bg-[#191b24] px-6 py-3 label-tactical text-cyan transition-all hover:border-cyan hover:shadow-[0_0_18px_rgba(0,240,255,0.25)]"
            >
              View Full Tournament Bracket & Schedule →
            </Link>
          </div>
        </div>
      </section>

      {/* Tournament Transmissions */}
      <section className="relative w-full border-t border-[#3b494b]/30 bg-[#0c0e16] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-code tracking-widest text-cyan">
                SECURE_FEED // COMM_ARRAY
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
                Tournament Transmissions
              </h2>
              <p className="mt-3 max-w-2xl text-muted">
                Direct alerts, balance adjustments, prize updates, and production
                broadcasts.
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {news.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-[#3b494b]/30 bg-[#191b24] py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center md:px-6">
          <span className="label-code font-bold tracking-widest text-cyan">
            ARENA ADMISSION DEADLINE IN 96 HOURS
          </span>
          <h2 className="mx-auto mt-2 max-w-2xl font-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
            Ready to etch your name in cyber esports history?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Register your squad or solo slot before brackets finalize. Verify ID,
            secure seeding, and step onto the main arena stage.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LinkButton
              to="/register"
              className="w-full px-8 py-3.5 shadow-[0_0_25px_rgba(0,240,255,0.5)] sm:w-auto"
            >
              Enter Tournament Bracket
            </LinkButton>
            <LinkButton
              to="/rules"
              variant="secondary"
              className="w-full rounded px-8 py-3.5 sm:w-auto"
              clip={false}
            >
              Read Competitive Code
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  )
}
