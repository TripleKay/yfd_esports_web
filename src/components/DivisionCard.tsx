import type { TournamentDivision } from '../types'
import { LinkButton } from './ui/Button'

export function DivisionCard({
  division,
  accent = 'cyan',
}: {
  division: TournamentDivision
  accent?: 'cyan' | 'violet'
}) {
  const pct = Math.round((division.slotsFilled / division.slotsTotal) * 100)
  const to = `/register?division=${division.id}`
  const isCyan = accent === 'cyan'

  return (
    <article
      className={[
        'group relative flex flex-col overflow-hidden rounded-xl border bg-[#191b24] shadow-[0_4px_25px_rgba(0,0,0,0.6)] transition-all duration-300',
        isCyan
          ? 'border-[#3b494b]/50 hover:border-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.25)]'
          : 'border-[#3b494b]/50 hover:border-violet hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]',
      ].join(' ')}
    >
      <div
        className={`h-1 ${
          isCyan
            ? 'bg-gradient-to-r from-cyan via-[#7df4ff] to-violet'
            : 'bg-gradient-to-r from-violet via-[#ddb7ff] to-cyan'
        }`}
      />

      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={division.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#191b24] via-[#191b24]/40 to-transparent" />

        <div className="absolute left-4 top-4 flex gap-2">
          <span
            className={[
              'rounded border bg-[#0c0e16]/90 px-2.5 py-1 label-code font-bold',
              isCyan
                ? 'border-cyan/40 text-cyan'
                : 'border-violet/40 text-violet',
            ].join(' ')}
          >
            {division.subtitle}
          </span>
          <span className="rounded bg-[#6f00be]/80 px-2.5 py-1 label-code font-bold text-[#ddb7ff]">
            {division.badge}
          </span>
        </div>

        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
          <div className="text-left">
            <span
              className={[
                'mb-1 block label-code tracking-widest',
                isCyan ? 'text-[#dbfcff]' : 'text-violet',
              ].join(' ')}
            >
              {division.tierLabel}
            </span>
            <h3 className="font-display text-2xl font-bold leading-none text-white md:text-[32px]">
              {division.title}
            </h3>
          </div>
          <div className="text-right">
            <span className="block label-code text-muted">Prize Pool</span>
            <span
              className={[
                'font-display text-2xl font-bold leading-none tabular',
                isCyan ? 'text-cyan' : 'text-violet',
              ].join(' ')}
            >
              {division.prizePool}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-4">
          <p className="text-left text-sm leading-relaxed text-muted">
            {division.description}
          </p>
          <div>
            <div className="mb-1.5 flex items-center justify-between label-tactical">
              <span className="text-muted">Bracket Slots Filled</span>
              <span className={isCyan ? 'font-bold text-[#dbfcff]' : 'font-bold text-violet'}>
                {division.slotsFilled} / {division.slotsTotal} {division.slotsUnit} (
                {pct}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-[#33343d]">
              <div
                className={
                  isCyan
                    ? 'h-full bg-gradient-to-r from-[#dbfcff] to-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)]'
                    : 'h-full bg-gradient-to-r from-[#6f00be] to-violet shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                }
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#3b494b]/30 pt-5">
          <span className="label-code text-ink">{division.rosterNote}</span>
          <LinkButton
            to={to}
            variant={isCyan ? 'primary' : 'secondary'}
            className={
              isCyan
                ? '!bg-cyan !text-[#00363a] shadow-[0_0_18px_rgba(0,240,255,0.4)]'
                : '!bg-[#6f00be] !text-white !border-transparent shadow-[0_0_18px_rgba(111,0,190,0.5)] hover:!text-white'
            }
          >
            {division.id === 'mlbb' ? 'Register Squad →' : 'Register Solo →'}
          </LinkButton>
        </div>
      </div>
    </article>
  )
}
