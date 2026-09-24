import type { ReactNode } from 'react'

interface SectionProps {
  eyebrow?: string
  title: ReactNode
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  id?: string
}

export function Section({
  eyebrow,
  title,
  description,
  action,
  children,
  className = '',
  id,
}: SectionProps) {
  return (
    <section id={id} className={`py-16 md:py-20 ${className}`}>
      <div className="mx-auto max-w-[1280px] px-5 md:px-12">
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="mb-3 label-code text-cyan">{eyebrow}</p>
            ) : null}
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-3 text-base leading-7 text-muted md:text-lg">
                {description}
              </p>
            ) : null}
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  )
}
