import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Tone = 'default' | 'cyan' | 'violet' | 'critical'

const tones: Record<Tone, string> = {
  default: 'border-border text-muted hover:border-cyan hover:text-cyan',
  cyan: 'border-cyan/40 text-cyan hover:bg-cyan/10',
  violet: 'border-violet/40 text-violet hover:bg-violet/10',
  critical: 'border-critical/40 text-critical hover:bg-critical/10',
}

interface IconActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  tone?: Tone
  children: ReactNode
}

export function IconAction({
  label,
  tone = 'default',
  className = '',
  children,
  ...props
}: IconActionProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={[
        'group relative inline-flex size-9 cursor-pointer items-center justify-center border transition-all duration-200 hover:scale-[1.04] active:scale-[0.96] disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-40',
        tones[tone],
        className,
      ].join(' ')}
      {...props}
    >
      <span className="pointer-events-none size-4 transition-transform duration-200 group-hover:-translate-y-px">
        {children}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap border border-border bg-chassis px-2 py-1 label-code text-cyan opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </button>
  )
}

export function IconDelete() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}
