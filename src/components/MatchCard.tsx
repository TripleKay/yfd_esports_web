import { Link } from 'react-router-dom'
import type { Match } from '../types'

function TeamSide({
  name,
  tag,
  region,
  align = 'left',
  accent = 'cyan',
}: {
  name: string
  tag: string
  region?: string
  align?: 'left' | 'right'
  accent?: 'cyan' | 'violet'
}) {
  const border =
    accent === 'cyan'
      ? 'border-cyan/40 text-cyan shadow-[0_0_12px_rgba(0,240,255,0.3)]'
      : 'border-violet/40 text-violet shadow-[0_0_12px_rgba(168,85,247,0.3)]'
  const meta = accent === 'cyan' ? 'text-[#dbfcff]' : 'text-violet'

  return (
    <div
      className={`col-span-2 flex items-center gap-3 ${
        align === 'right' ? 'flex-row-reverse text-right justify-end' : ''
      }`}
    >
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded border bg-[#282a32] font-display text-sm font-bold ${border}`}
      >
        {tag.slice(0, 2)}
      </div>
      <div className="min-w-0 truncate">
        <span className="block truncate font-display text-sm font-bold uppercase text-white md:text-base">
          {name}
        </span>
        {region ? (
          <span className={`label-code tracking-widest ${meta}`}>{region}</span>
        ) : null}
      </div>
    </div>
  )
}

export function MatchCard({ match }: { match: Match }) {
  const gameLabel = match.game === 'mlbb' ? 'MLBB 5v5' : 'PS5 FOOTBALL 1v1'
  const topBar =
    match.status === 'live'
      ? 'from-critical to-[#ffb4ab]'
      : match.status === 'upcoming'
        ? 'from-[#6f00be] to-violet'
        : 'from-[#3b494b] to-[#849495]'

  return (
    <article className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#3b494b]/50 bg-[#191b24]/90 p-6 backdrop-blur-md transition-all hover:border-cyan/50">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${topBar}`} />

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          {match.status === 'live' ? (
            <div className="inline-flex items-center gap-2 rounded border border-critical/50 bg-[#93000a]/30 px-3 py-1 text-critical">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-critical opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-critical" />
              </span>
              <span className="label-code font-bold tracking-widest">LIVE NOW</span>
            </div>
          ) : match.status === 'upcoming' ? (
            <div className="inline-flex items-center gap-2 rounded border border-cyan/40 bg-cyan/10 px-3 py-1 text-cyan">
              <span className="label-code font-bold tracking-widest">
                UPCOMING •{' '}
                {new Date(match.startsAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                UTC
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded border border-[#334155] bg-[#1e2433] px-3 py-1 text-muted">
              <span className="label-code font-bold tracking-widest">COMPLETED</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <span className="label-code text-muted">
              {gameLabel} • {match.round}
            </span>
            {match.viewers ? (
              <span className="rounded bg-[#33343d] px-2 py-0.5 label-code text-cyan">
                {match.viewers}
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-5 items-center gap-3 rounded-lg border border-[#3b494b]/30 bg-[#0c0e16]/80 px-4 py-4">
          <TeamSide {...match.teamA} accent="cyan" />
          <div className="col-span-1 flex flex-col items-center justify-center text-center">
            {match.status === 'upcoming' ? (
              <>
                <span className="rounded bg-[#6f00be]/30 px-2 py-1 font-mono text-xs font-bold text-violet">
                  VS
                </span>
                {match.meta ? (
                  <span className="mt-1 label-code text-muted">{match.meta}</span>
                ) : null}
              </>
            ) : (
              <>
                <span className="font-display text-3xl font-extrabold tracking-tight text-white tabular md:text-4xl">
                  {match.scoreA ?? 0} - {match.scoreB ?? 0}
                </span>
                {match.meta ? (
                  <span
                    className={`mt-1 label-code font-bold tracking-wider ${
                      match.status === 'live' ? 'animate-pulse text-critical' : 'text-muted'
                    }`}
                  >
                    {match.meta}
                  </span>
                ) : null}
              </>
            )}
          </div>
          <TeamSide {...match.teamB} align="right" accent="violet" />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-[#3b494b]/20 pt-4 sm:flex-row">
        <p className="label-code text-muted">
          {match.mapLabel || match.venue || match.duration || '—'}
        </p>
        {match.status === 'live' ? (
          <a
            href="https://twitch.tv"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded bg-critical px-5 py-2.5 label-tactical font-bold text-white shadow-[0_0_20px_rgba(255,51,102,0.4)] transition-all hover:bg-white hover:text-critical sm:w-auto"
          >
            Watch Live Stream (Twitch/YT)
          </a>
        ) : match.status === 'upcoming' ? (
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded border border-[#3b494b]/60 bg-[#282a32] px-5 py-2.5 label-tactical text-white transition-all hover:border-cyan hover:text-cyan sm:w-auto"
          >
            Set Stream Reminder
          </button>
        ) : (
          <Link
            to="/schedule"
            className="inline-flex w-full items-center justify-center gap-2 rounded border border-[#3b494b]/60 bg-[#282a32] px-5 py-2.5 label-tactical text-muted transition-all hover:border-cyan hover:text-cyan sm:w-auto"
          >
            View VOD & Match Stats
          </Link>
        )}
      </div>
    </article>
  )
}
