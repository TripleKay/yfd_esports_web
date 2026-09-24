import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'critical'

const variants: Record<Variant, string> = {
  primary:
    'bg-cyan text-ground font-bold hover:glow-cyan hover:brightness-110',
  secondary:
    'bg-chassis border border-border text-ink hover:border-violet hover:text-cyan',
  ghost:
    'bg-transparent border border-cyan/40 text-cyan hover:bg-cyan/10',
  critical:
    'bg-critical/15 border border-critical text-critical hover:bg-critical/25',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  clip?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  clip = true,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 px-5 py-2.5 label-tactical transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none',
        clip ? 'clip-cyber-sm' : '',
        variants[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}

interface LinkButtonProps {
  to: string
  variant?: Variant
  clip?: boolean
  className?: string
  children: ReactNode
}

export function LinkButton({
  to,
  variant = 'primary',
  clip = true,
  className = '',
  children,
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      className={[
        'inline-flex items-center justify-center gap-2 px-5 py-2.5 label-tactical transition-all duration-200',
        clip ? 'clip-cyber-sm' : '',
        variants[variant],
        className,
      ].join(' ')}
    >
      {children}
    </Link>
  )
}
