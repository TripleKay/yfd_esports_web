import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { FAQS } from '../data/demo'

export function RulesPage() {
  const [openId, setOpenId] = useState<string>(FAQS[0]?.id ?? '')

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-5 py-10 md:px-12 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label-code text-cyan">
            HOME // KNOWLEDGE BASE // RULES & FAQ
          </p>
          <p className="label-code text-muted">
            ARBITER PROTOCOL v4.2 · AVG DISPUTE RESOLUTION: &lt; 15 MIN
          </p>
        </div>

        <div className="mt-6 max-w-3xl">
          <p className="label-code text-violet">
            COMMUNICATION & ARBITRATION MATRIX // KNOWLEDGE REPOSITORY
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">
            Frequently Asked{' '}
            <span className="text-cyan text-glow-cyan">Questions</span> & Tournament
            Rules
          </h1>
          <p className="mt-4 text-muted">
            Official arbitration rulings, corporate employee eligibility
            guidelines, game-specific disconnect policies, and technical dispute
            workflows for YFD Days Season 4.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 pb-16 md:px-12 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="mb-4 label-code text-muted">
            Showing {FAQS.length} arbitration articles
          </p>

          <div className="space-y-3">
            {FAQS.map((faq) => {
              const open = openId === faq.id
              return (
                <div
                  key={faq.id}
                  className={[
                    'border bg-chassis transition-colors',
                    open ? 'border-cyan' : 'border-border',
                  ].join(' ')}
                >
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left"
                    onClick={() => setOpenId(open ? '' : faq.id)}
                    aria-expanded={open}
                  >
                    <div>
                      <p className="label-code text-muted">
                        {faq.category} · {faq.section}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-semibold">
                        {faq.question}
                      </h3>
                    </div>
                    <span className="font-mono text-cyan">{open ? '−' : '+'}</span>
                  </button>
                  {open ? (
                    <div className="border-t border-border px-4 py-4 text-sm leading-6 text-muted">
                      <p>{faq.answer}</p>
                      {faq.bullets ? (
                        <ul className="mt-3 space-y-2">
                          {faq.bullets.map((b) => (
                            <li key={b} className="flex gap-2">
                              <span className="text-cyan">▹</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {faq.linkLabel ? (
                        <button
                          type="button"
                          className="mt-4 label-tactical text-cyan hover:underline"
                        >
                          {faq.linkLabel} →
                        </button>
                      ) : null}
                      <p className="mt-4 label-code text-faint">
                        LAST RATIFIED: 28 JAN 2026 // ARBITER COUNCIL
                      </p>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border border-border bg-chassis p-5">
            <p className="label-code text-cyan">Community Rules</p>
            <ul className="mt-4 space-y-2 font-mono text-xs text-muted">
              <li>Updated: 28 Jan 2026</li>
              <li>Region: Asia SE</li>
              <li>Version: 2.10.4</li>
            </ul>
            <Button type="button" className="mt-5 w-full">
              ↓ Full Rulebook (PDF)
            </Button>
          </div>
          {[
            ['Zero Tolerance Policy', 'Exploits & account sharing'],
            ['15-Minute Timeout Rule', 'Dispute filing window'],
            ['Hosting Disconnect Step', 'Pause & remake criteria'],
          ].map(([title, desc]) => (
            <div key={title} className="border border-border bg-surface-low p-4">
              <h3 className="font-display text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-xs text-muted">{desc}</p>
            </div>
          ))}
          <div className="relative overflow-hidden border border-border">
            <img
              src="/images/hero-arena.png"
              alt=""
              className="h-36 w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ground to-transparent p-4">
              <p className="label-code text-cyan">2026 FINAL ARENA · SINGAPORE</p>
            </div>
          </div>
        </aside>
      </div>

      <section className="border-t border-border bg-surface-low/50">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Didn&apos;t find your answer? Contact YFD Esports Committee
            </h2>
            <p className="mt-2 text-sm text-muted">
              Arbiter desk stands by during live broadcast windows.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button">Open Discord Ticket</Button>
          </div>
        </div>
      </section>
    </>
  )
}
