import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

const fieldBase =
  'w-full bg-chassis border border-border px-3 py-2.5 text-sm outline-none focus:border-cyan focus:shadow-[0_0_0_1px_rgba(0,240,255,0.25)] transition-colors'

const fieldClass = `${fieldBase} text-ink placeholder:text-faint`

const fieldErrorClass =
  '[&_input]:border-critical [&_select]:border-critical [&_textarea]:border-critical [&_input]:focus:border-critical [&_select]:focus:border-critical [&_textarea]:focus:border-critical [&_input]:focus:shadow-[0_0_0_1px_rgba(255,51,102,0.35)] [&_select]:focus:shadow-[0_0_0_1px_rgba(255,51,102,0.35)] [&_textarea]:focus:shadow-[0_0_0_1px_rgba(255,51,102,0.35)]'

interface FieldProps {
  label: string
  hint?: string
  error?: string | null
  required?: boolean
  children: ReactNode
}

export function Field({ label, hint, error, required, children }: FieldProps) {
  return (
    <label
      className={['flex flex-col gap-1.5', error ? fieldErrorClass : '']
        .filter(Boolean)
        .join(' ')}
    >
      <span className="label-code text-muted">
        {label}
        {required ? <span className="text-cyan"> *</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs text-critical">{error}</span> : null}
      {hint && !error ? (
        <span className="text-xs text-faint">{hint}</span>
      ) : null}
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
  value,
  defaultValue,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const currentValue = value ?? defaultValue
  const isPlaceholder =
    currentValue === undefined || currentValue === null || currentValue === ''

  return (
    <select
      value={value}
      defaultValue={defaultValue}
      className={[
        fieldBase,
        'disabled:cursor-not-allowed disabled:opacity-50',
        '[&>option]:text-ink [&>option:disabled]:text-faint',
        isPlaceholder ? 'text-faint' : 'text-ink',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
}

export function Textarea({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`${fieldClass} min-h-24 resize-y ${className}`}
      {...props}
    />
  )
}
