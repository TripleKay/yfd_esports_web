import { NavLink } from 'react-router-dom'

const tabs = [
  {
    to: '/rules/mlbb',
    code: 'MLBB',
    label: '5v5 Squad',
    active:
      'border-cyan bg-cyan/10 text-cyan shadow-[0_0_18px_rgba(0,240,255,0.12)]',
  },
  {
    to: '/rules/ps5',
    code: 'PS5',
    label: 'Football 1v1',
    active:
      'border-violet bg-violet/10 text-violet shadow-[0_0_18px_rgba(168,85,247,0.16)]',
  },
] as const

export function RulebookTabs() {
  return (
    <nav aria-label="Competition rulebooks" className="mt-6">
      <div className="flex w-full max-w-xl gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end
            className={({ isActive }) =>
              [
                'flex min-w-0 flex-1 flex-col border px-4 py-3 transition-colors',
                isActive
                  ? tab.active
                  : 'border-border bg-chassis text-muted hover:border-cyan/40 hover:text-ink',
              ].join(' ')
            }
          >
            <span className="label-code">{tab.code}</span>
            <span className="mt-1 font-display text-sm font-semibold">
              {tab.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
