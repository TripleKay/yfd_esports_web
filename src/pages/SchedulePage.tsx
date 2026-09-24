import { useMemo, useState } from 'react'
import { MatchCard } from '../components/MatchCard'
import { Badge } from '../components/ui/Badge'
import { Button, LinkButton } from '../components/ui/Button'
import { Section } from '../components/ui/Section'
import { MATCHES, MLBB_BRACKET } from '../data/demo'
import type { GameTitle, MatchStatus } from '../types'

type ViewMode = 'list' | 'tree'

export function SchedulePage() {
  const [game, setGame] = useState<GameTitle>('all')
  const [view, setView] = useState<ViewMode>('list')

  const live = useMemo(
    () =>
      MATCHES.filter(
        (m) =>
          m.status === 'live' &&
          (game === 'all' || m.game === game),
      ),
    [game],
  )

  const upcoming = useMemo(
    () =>
      MATCHES.filter(
        (m) =>
          m.status === 'upcoming' &&
          (game === 'all' || m.game === game),
      ),
    [game],
  )

  const completed = useMemo(
    () =>
      MATCHES.filter(
        (m) =>
          m.status === 'completed' &&
          (game === 'all' || m.game === game),
      ),
    [game],
  )

  return (
    <>
      <div className="border-b border-border bg-surface-low">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-5 py-2.5 md:px-12">
          <div className="flex items-center gap-3 overflow-hidden">
            <Badge tone="live" pulse>
              LIVE FEED
            </Badge>
            <p className="truncate text-sm text-muted">
              GRAND STAGE 01 // VALKYRIE SQUAD VS SHADOW REAPERS (MAP 3 TIE-BREAKER)
            </p>
          </div>
          <LinkButton to="/schedule" variant="critical" className="!py-1.5 !px-3 text-[11px]">
            Tune In Broadcast →
          </LinkButton>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 py-10 md:px-12 md:py-14">
        <div className="label-code text-cyan">
          HOME // TOURNAMENT // SCHEDULE & BRACKETS
        </div>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge>SEASON 4 // 128 SQUADS</Badge>
              <Badge tone="violet">$50,000 COMBINED POOL</Badge>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
              Match Fixtures &{' '}
              <span className="text-cyan text-glow-cyan">Bracket Intel</span>
            </h1>
            <p className="mt-4 text-muted">
              Live broadcast feeds, round progression timestamps, and real-time
              playoff bracket trees across the MLBB 5v5 Championship and Next-Gen
              PS5 Football 1v1 Virtual Arena.
            </p>
          </div>
          <div className="grid w-full max-w-md grid-cols-3 gap-2">
            {[
              { label: 'Arena Ping', value: '14ms' },
              { label: 'Anti-Cheat', value: 'V4 ACTIVE' },
              { label: 'Map Stage', value: 'APAC-CYBER 1' },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-border bg-chassis px-3 py-3 text-center"
              >
                <p className="label-code text-muted">{item.label}</p>
                <p className="mt-1 font-mono text-xs font-semibold text-cyan">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border border-border bg-chassis p-3">
          <select
            value={game}
            onChange={(e) => setGame(e.target.value as GameTitle)}
            className="border border-border bg-surface-low px-3 py-2 label-code text-ink outline-none focus:border-cyan"
          >
            <option value="all">All Titles (MLBB + PS5)</option>
            <option value="mlbb">Mobile Legends (5v5)</option>
            <option value="ps5">PS5 Football (1v1)</option>
          </select>
          <div className="ml-auto flex gap-2">
            <Button
              type="button"
              variant={view === 'list' ? 'primary' : 'secondary'}
              onClick={() => setView('list')}
              className="!px-3 !py-2 text-[11px]"
            >
              List Fixtures
            </Button>
            <Button
              type="button"
              variant={view === 'tree' ? 'primary' : 'secondary'}
              onClick={() => setView('tree')}
              className="!px-3 !py-2 text-[11px]"
            >
              Playoff Tree
            </Button>
          </div>
        </div>
      </div>

      {view === 'list' ? (
        <>
          <Section
            eyebrow="LIVE TELEMETRY"
            title={
              <>
                Live & Today&apos;s Highlights
              </>
            }
            description={`${live.length} fixtures underway`}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              {live.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </Section>

          <Section
            eyebrow="NEXT 48 HOURS · UTC"
            title="Upcoming Tournament Fixtures"
            className="border-t border-border bg-surface-low/40"
          >
            <div className="grid gap-4 md:grid-cols-3">
              {upcoming.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </Section>

          <Section
            eyebrow="OFFICIAL AUDITED TELEMETRY"
            title="Completed Match Results & VODs"
            className="border-t border-border"
          >
            <div className="space-y-3">
              {completed.map((match) => (
                <CompletedRow key={match.id} match={match} />
              ))}
            </div>
          </Section>
        </>
      ) : (
        <Section
          eyebrow="MLBB 5V5 CHAMPIONSHIP TREE"
          title="Quarter-Finals Bracket"
          description="Winning paths illuminate in cyan. Demo tree — bind live brackets later."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {MLBB_BRACKET.map((node) => (
              <div
                key={node.id}
                className={[
                  'border bg-chassis p-4',
                  node.status === 'live'
                    ? 'border-critical glow-cyan'
                    : node.status === 'completed'
                      ? 'border-cyan/40'
                      : 'border-border',
                ].join(' ')}
              >
                <Badge tone={statusTone(node.status)} pulse={node.status === 'live'}>
                  {node.label}
                </Badge>
                <div className="mt-4 space-y-2">
                  <BracketTeam
                    name={node.teamA}
                    score={node.scoreA}
                    winner={
                      node.scoreA !== undefined &&
                      node.scoreB !== undefined &&
                      node.scoreA > node.scoreB
                    }
                  />
                  <BracketTeam
                    name={node.teamB}
                    score={node.scoreB}
                    winner={
                      node.scoreA !== undefined &&
                      node.scoreB !== undefined &&
                      node.scoreB > node.scoreA
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-12">
          <div className="flex flex-col gap-6 border border-cyan/30 bg-cyan/5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <h2 className="font-display text-2xl font-bold">
                Official Tournament Integrity Protocol
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Anti-cheat Armored-V4, seeding matrix, and referee dispute windows
                stay live throughout broadcast blocks.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton to="/rules">Official Rulebook</LinkButton>
              <Button type="button" variant="secondary">
                Seeding Matrix
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function statusTone(status: MatchStatus | 'scheduled') {
  if (status === 'live') return 'live' as const
  if (status === 'completed') return 'completed' as const
  return 'upcoming' as const
}

function BracketTeam({
  name,
  score,
  winner,
}: {
  name: string
  score?: number
  winner?: boolean
}) {
  return (
    <div
      className={[
        'flex items-center justify-between border px-3 py-2',
        winner ? 'border-cyan bg-cyan/10' : 'border-border bg-surface-low',
      ].join(' ')}
    >
      <span className="text-sm font-medium">{name}</span>
      <span className="font-mono tabular text-cyan">
        {score !== undefined ? score : '—'}
      </span>
    </div>
  )
}

function CompletedRow({
  match,
}: {
  match: (typeof MATCHES)[number]
}) {
  const gameLabel = match.game === 'mlbb' ? 'MLBB' : 'PS5 FOOTBALL'
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border border-border bg-chassis px-4 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="completed">Completed</Badge>
        <span className="label-code text-muted">
          {gameLabel} {match.round}
        </span>
        <span className="font-display font-semibold">
          {match.teamA.name}{' '}
          <span className="tabular text-cyan">
            {match.scoreA} - {match.scoreB}
          </span>{' '}
          {match.teamB.name}
        </span>
        {match.duration ? (
          <span className="label-code text-faint">Duration: {match.duration}</span>
        ) : null}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" className="!px-3 !py-2 text-[11px]">
          Stats
        </Button>
        <Button type="button" variant="ghost" className="!px-3 !py-2 text-[11px]">
          VOD
        </Button>
      </div>
    </div>
  )
}
