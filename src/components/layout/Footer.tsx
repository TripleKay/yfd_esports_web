import { Link } from 'react-router-dom'
import { SITE } from '../../data/demo'

const navCols = [
  {
    title: 'Navigation',
    links: [
      { to: '/', label: 'Tournament Home' },
      { to: '/register', label: 'Team Registration' },
      { to: '/news', label: 'News' },
      { to: '/rules', label: 'Rules & Code of Conduct' },
    ],
  },
  {
    title: 'Comms Hub',
    links: [{ to: '#', label: 'Twitch Official Stream' }],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-low">
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between lg:gap-x-12 lg:gap-y-10">
          <div className="w-full min-w-0 flex-1 basis-[min(100%,320px)] lg:max-w-md">
            <div className="font-display text-lg font-bold">{SITE.name}</div>
            <p className="mt-1 label-code text-cyan">{SITE.season}</p>
            <p className="mt-4 text-sm leading-6 text-muted">
              Corporate esports championship for elite MLBB 5v5 and PS5 Football
              1v1 brackets across the APAC region.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 border border-border bg-chassis px-4 py-2 label-tactical text-cyan hover:border-cyan"
            >
              ↓ Download Rulebook (PDF)
            </button>
          </div>

          <div className="flex w-full flex-1 flex-wrap gap-10 sm:gap-12 md:gap-14 lg:w-auto lg:justify-end">
            {navCols.map((col) => (
              <div
                key={col.title}
                className="min-w-[140px] flex-1 sm:flex-none"
              >
                <h3 className="label-tactical text-ink">{col.title}</h3>
                <ul className="mt-4 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted transition-colors hover:text-cyan"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-5 py-4 text-xs text-faint md:flex-row md:items-center md:justify-between md:px-12">
          <span>Yoma Family Day · MLBB 5v5 and PS5 Football 1v1</span>
          <span>© 2026 YFD Esports. All competitive rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
