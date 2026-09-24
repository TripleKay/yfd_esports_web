import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const fieldClass =
  'w-full bg-chassis border border-border px-3 py-2.5 text-sm text-ink placeholder:text-faint outline-none focus:border-cyan focus:shadow-[0_0_0_1px_rgba(0,240,255,0.25)] transition-colors'

interface FieldProps {
  label: string
  hint?: string
  required?: boolean
  children: ReactNode
}

export function Field({ label, hint, required, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="label-code text-muted">
        {label}
        {required ? <span className="text-cyan"> *</span> : null}
      </span>
      {children}
      {hint ? <span className="text-xs text-faint">{hint}</span> : null}
    </label>
  )
}

export function Input({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldClass} ${className}`} {...props} />
}

export function Select({
  className = '',
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${fieldClass} ${className}`} {...props} />
}

export function Textarea({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={`${fieldClass} min-h-24 resize-y ${className}`} {...props} />
  )
}
