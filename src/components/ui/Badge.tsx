import type { ReactNode } from 'react'

type Tone = 'live' | 'upcoming' | 'completed' | 'cyan' | 'violet'

const tones: Record<Tone, string> = {
  live: 'bg-critical/15 border-critical text-critical',
  upcoming: 'bg-cyan/10 border-cyan/40 text-cyan',
  completed: 'bg-border border-faint text-muted',
  cyan: 'bg-cyan/10 border-cyan/40 text-cyan',
  violet: 'bg-violet/15 border-violet/50 text-violet',
}

interface BadgeProps {
  tone?: Tone
  pulse?: boolean
  children: ReactNode
  className?: string
}

export function Badge({ tone = 'cyan', pulse, children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 border px-2.5 py-1 label-code',
        tones[tone],
        className,
      ].join(' ')}
    >
      {pulse ? (
        <span className="size-1.5 rounded-full bg-current pulse-live" />
      ) : null}
      {children}
    </span>
  )
}
