import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Field, Input, Select } from '../components/ui/Field'
import { DEMO_ROSTER, DIVISIONS, ORGANIZATIONS } from '../data/demo'
import type { GameTitle, RosterPlayer } from '../types'

const roles = ['JUNGLER', 'MID', 'GOLD', 'ROAM', 'EXP'] as const

export function RegisterPage() {
  const [params] = useSearchParams()
  const initial =
    params.get('division') === 'ps5' ? 'ps5' : ('mlbb' as Exclude<GameTitle, 'all'>)
  const [division, setDivision] = useState(initial)
  const [roster, setRoster] = useState<RosterPlayer[]>(DEMO_ROSTER)
  const [submitted, setSubmitted] = useState(false)

  const selected = useMemo(
    () => DIVISIONS.find((d) => d.id === division)!,
    [division],
  )

  function updatePlayer(id: string, key: keyof RosterPlayer, value: string) {
    setRoster((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)),
    )
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-[960px] px-5 py-10 md:px-12 md:py-14">
      <div className="mb-2 label-code text-cyan">
        HOME / REGISTRATION / TOURNAMENT ENTRY
      </div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge tone="violet" className="mb-4">
            CORPORATE ESPORTS LEAGUE 2025 // APAC REGIONAL QUALIFIER
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            Official Tournament Registration
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Assemble your squad or enter as a solo gladiator. Verify employee
            credentials, lock in roster slots, and compete for the $50,000 USD
            championship purse.
          </p>
        </div>
        <div className="min-w-[220px] border border-border bg-chassis p-4">
          <p className="label-code text-muted">Registration Status</p>
          <p className="mt-1 font-display text-sm font-semibold text-cyan">
            PHASE 2: ROSTER VERIFICATION
          </p>
          <p className="mt-3 label-code text-muted">96/120 SLOTS CLAIMED</p>
          <div className="mt-2 h-1.5 bg-border">
            <div className="h-full w-4/5 bg-cyan" />
          </div>
          <p className="mt-2 label-code text-critical">Closes in 48 hours</p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {DIVISIONS.map((d) => {
          const active = division === d.id
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setDivision(d.id)}
              className={[
                'border p-5 text-left transition-colors',
                active
                  ? 'border-cyan bg-cyan/5 glow-cyan'
                  : 'border-border bg-chassis hover:border-violet/50',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="label-code text-muted">
                  {d.id === 'mlbb' ? '5v5 SQUAD' : '1v1 SOLO'}
                </span>
                {active ? <Badge tone="cyan">Current Selection</Badge> : null}
              </div>
              <h2 className="mt-2 font-display text-xl font-bold">{d.title}</h2>
              <p className="mt-1 text-sm text-muted">{d.tierLabel} · {d.badge}</p>
              <p className="mt-4 font-display text-2xl font-bold text-cyan tabular">
                {d.prizePool}
              </p>
            </button>
          )
        })}
      </div>

      {submitted ? (
        <div className="border border-cyan bg-cyan/10 p-8 text-center">
          <p className="label-code text-cyan">DEMO MODE</p>
          <h2 className="mt-2 font-display text-2xl font-bold">
            Registration Locked (Local Demo)
          </h2>
          <p className="mt-2 text-muted">
            Form data is not sent yet. Swap this handler for your API when ready.
          </p>
          <Button className="mt-6" type="button" onClick={() => setSubmitted(false)}>
            Edit Registration
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-8">
          <section className="border border-border bg-chassis p-5 md:p-6">
            <h2 className="font-display text-xl font-semibold">
              01 · Team Identity & Contact
            </h2>
            <p className="mt-1 text-sm text-muted">
              Primary organization affiliation and roster meta identifiers for{' '}
              {selected.title}.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Team Name" required>
                <Input defaultValue="Nexus Prime" required />
              </Field>
              <Field label="Team Tag (Acronym)" required hint="2 to 4 alphanumeric chars">
                <Input defaultValue="NXP" maxLength={4} required />
              </Field>
              <Field label="Organization / Entity" required>
                <Select defaultValue={ORGANIZATIONS[0]} required>
                  {ORGANIZATIONS.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Captain Corporate Email" required>
                <Input type="email" defaultValue="captain@nexus.corp" required />
              </Field>
              <Field label="Discord ID / Tag" required>
                <Input defaultValue="nexus_captain#2048" required />
              </Field>
              <Field label="Team Crest / Avatar" hint="Min. 512×512 transparent PNG">
                <Input type="file" accept="image/png,image/svg+xml" />
              </Field>
            </div>
          </section>

          {division === 'mlbb' ? (
            <section className="border border-border bg-chassis p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold">
                    02 · Roster Registration (5 Starters Required)
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    All starters must provide verified employee identification and
                    valid MLBB Game & Zone IDs.
                  </p>
                </div>
                <Badge tone="cyan">Roster Slots: 5 / 5 Filled</Badge>
              </div>

              <div className="mt-6 space-y-4">
                {roster.map((player, index) => (
                  <div
                    key={player.id}
                    className="border border-border bg-surface-low p-4"
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-cyan">{player.label}</span>
                        <span className="ml-3 font-display font-semibold uppercase">
                          {player.name || `Starter #${index + 1}`}
                        </span>
                        <span className="ml-2 label-code text-muted">
                          Assigned Role: {player.role}
                        </span>
                      </div>
                      <Badge tone={player.verified ? 'cyan' : 'upcoming'}>
                        {player.verified ? 'EMP Verified ✓' : 'Pending Verify'}
                      </Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <Field label="Full Legal Name" required>
                        <Input
                          value={player.name}
                          onChange={(e) =>
                            updatePlayer(player.id, 'name', e.target.value)
                          }
                          required
                        />
                      </Field>
                      <Field label="National Reg. Card (NRC / ID)" required>
                        <Input
                          value={player.nrc}
                          onChange={(e) =>
                            updatePlayer(player.id, 'nrc', e.target.value)
                          }
                          required
                        />
                      </Field>
                      <Field label="Corporate Employee ID" required>
                        <Input
                          value={player.employeeId}
                          onChange={(e) =>
                            updatePlayer(player.id, 'employeeId', e.target.value)
                          }
                          required
                        />
                      </Field>
                      <Field label="MLBB Game User ID" required>
                        <Input
                          value={player.gameUserId}
                          onChange={(e) =>
                            updatePlayer(player.id, 'gameUserId', e.target.value)
                          }
                          required
                        />
                      </Field>
                      <Field label="Server / Zone ID" required>
                        <div className="flex gap-2">
                          <Input
                            value={player.zoneId}
                            onChange={(e) =>
                              updatePlayer(player.id, 'zoneId', e.target.value)
                            }
                            required
                          />
                          <Button type="button" variant="secondary" clip={false}>
                            Verify
                          </Button>
                        </div>
                      </Field>
                      <Field label="Primary Specialization" required>
                        <Select
                          value={player.role}
                          onChange={(e) =>
                            updatePlayer(player.id, 'role', e.target.value)
                          }
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="border border-border bg-chassis p-5 md:p-6">
              <h2 className="font-display text-xl font-semibold">
                02 · Solo Gladiator Registration (PS5 1v1)
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Full Legal Name" required>
                  <Input defaultValue="Alex Striker" required />
                </Field>
                <Field label="PSN ID" required>
                  <Input defaultValue="STRIKER_9" required />
                </Field>
                <Field label="Corporate Employee ID" required>
                  <Input defaultValue="NX-49001" required />
                </Field>
                <Field label="National Reg. Card (NRC / ID)" required>
                  <Input defaultValue="12/XYZ(N)778899" required />
                </Field>
                <Field label="Corporate Email" required>
                  <Input type="email" defaultValue="alex.striker@nexus.corp" required />
                </Field>
                <Field label="Preferred DualSense Profile">
                  <Select defaultValue="competitive-v4">
                    <option value="competitive-v4">Competitive Slider Pack v4</option>
                    <option value="edge">DualSense Edge Custom</option>
                  </Select>
                </Field>
              </div>
            </section>
          )}

          <section className="border border-border bg-chassis p-5 md:p-6">
            <h2 className="font-display text-xl font-semibold">
              03 · Compliance & Verification Certification
            </h2>
            <div className="mt-5 space-y-4 text-sm text-muted">
              <label className="flex items-start gap-3">
                <input type="checkbox" required className="mt-1 accent-cyan" />
                <span>
                  I certify that all registered players are verified corporate
                  employees / accredited contractors and that NRC details match
                  the employer register.
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" required className="mt-1 accent-cyan" />
                <span>
                  I accept the Official Rulebook, Anti-Cheat Armored-V4 policy, and
                  broadcasting rights release for YFD Days Season 4.
                </span>
              </label>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="min-w-[240px]">
              Confirm & Lock Registration
            </Button>
            <Button type="button" variant="secondary">
              Save Draft
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
