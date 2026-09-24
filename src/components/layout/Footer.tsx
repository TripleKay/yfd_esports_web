import { Link } from 'react-router-dom'
import { SITE } from '../../data/demo'

const navCols = [
  {
    title: 'Navigation',
    links: [
      { to: '/', label: 'Tournament Home' },
      { to: '/register', label: 'Team Registration' },
      { to: '/schedule', label: 'Match Fixtures' },
      { to: '/news', label: 'News & Media' },
      { to: '/rules', label: 'Rules & Code of Conduct' },
    ],
  },
  {
    title: 'Comms Hub',
    links: [
      { to: '#', label: 'Twitch Official Stream' },
      { to: '#', label: 'YouTube Gaming Broadcast' },
      { to: '#', label: 'Discord Scrim Lobby' },
      { to: '#', label: 'X / Twitter Intel Feed' },
      { to: '#', label: 'Instagram Highlights' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-low">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-14 md:grid-cols-2 md:px-12 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="font-display text-lg font-bold">{SITE.name}</div>
          <p className="mt-1 label-code text-cyan">{SITE.season}</p>
          <p className="mt-4 text-sm leading-6 text-muted">
            Corporate esports championship staging elite MLBB 5v5 and PS5 Football
            1v1 brackets across the APAC region.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 border border-border bg-chassis px-4 py-2 label-tactical text-cyan hover:border-cyan"
          >
            ↓ Download Rulebook (PDF)
          </button>
        </div>

        {navCols.map((col) => (
          <div key={col.title}>
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

        <div>
          <h3 className="label-tactical text-ink">Telemetry & Integrity</h3>
          <ul className="mt-4 space-y-2 font-mono text-xs text-muted">
            <li>SERVER: APAC-SOUTHEAST-1</li>
            <li>ANTI-CHEAT: ARMORED-V4 ACTIVE</li>
            <li>ARENA PING TARGET: &lt; 25ms</li>
            <li>BROADCAST: 128 HZ ENGINE</li>
            <li>ARBITER PROTOCOL: v4.2</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-5 py-4 text-xs text-faint md:flex-row md:items-center md:justify-between md:px-12">
          <span className="font-mono">
            NEXUS_TECH · QUANTUM_RIGS · PULSE_AUDIO · ARMORED_DATA
          </span>
          <span>© 2025 YFD Esports. All competitive rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
