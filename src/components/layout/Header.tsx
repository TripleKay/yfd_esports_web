import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NAV_LINKS, SITE } from '../../data/demo'
import { LinkButton } from '../ui/Button'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-ground/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-5 md:h-[72px] md:px-12">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center clip-cyber-sm bg-cyan font-display text-sm font-extrabold text-ground">
            YFD
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-bold tracking-wide">
              {SITE.name}
            </span>
            <span className="label-code text-cyan">{SITE.season}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                [
                  'px-3 py-2 label-tactical transition-colors',
                  isActive
                    ? 'text-cyan border-b-2 border-cyan'
                    : 'text-muted hover:text-ink',
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex">
          <LinkButton to="/register">Register Now</LinkButton>
        </div>

        <button
          type="button"
          className="border border-border px-3 py-2 label-code text-cyan lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-chassis px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    'px-3 py-3 label-tactical',
                    isActive ? 'bg-cyan/10 text-cyan' : 'text-muted',
                  ].join(' ')
                }
              >
                {link.label}
              </NavLink>
            ))}
            <LinkButton to="/register" className="mt-2" >
              Register Now
            </LinkButton>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
