import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  fetchRegistrationSettings,
  firstError,
  submitRegistration,
  type RegistrationSettings,
} from '../api/registrations'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Field, Input, Select } from '../components/ui/Field'
import { DEMO_ROSTER, DIVISIONS, ORGANIZATIONS } from '../data/demo'
import type { GameTitle, RosterPlayer } from '../types'

const roles = ['JUNGLER', 'MID', 'GOLD', 'ROAM', 'EXP'] as const
const DEFAULT_MLBB_MIN_PLAYERS = 5
const DEFAULT_MLBB_MAX_PLAYERS = 7

type TeamForm = {
  teamName: string
  teamTag: string
  organization: string
  discordId: string
}

type SoloForm = {
  fullName: string
  psnId: string
  employeeId: string
  nrc: string
  email: string
  dualsenseProfile: string
}

const initialTeam: TeamForm = {
  teamName: 'Nexus Prime',
  teamTag: 'NXP',
  organization: ORGANIZATIONS[0],
  discordId: 'nexus_captain#2048',
}

const initialSolo: SoloForm = {
  fullName: 'Alex Striker',
  psnId: 'STRIKER_9',
  employeeId: 'NX-49001',
  nrc: '12/XYZ(N)778899',
  email: 'alex.striker@nexus.corp',
  dualsenseProfile: 'competitive-v4',
}

function emptyRosterPlayer(index: number): RosterPlayer {
  return {
    id: `p${index + 1}-${Date.now()}`,
    label: `P${index + 1}`,
    role: roles[index] ?? 'MID',
    name: '',
    nrc: '',
    employeeId: '',
    phone: '',
    corporateEmail: '',
    gameUserId: '',
    zoneId: '',
    verified: false,
  }
}

function relabelRoster(players: RosterPlayer[]): RosterPlayer[] {
  return players.map((player, index) => ({
    ...player,
    label: `P${index + 1}`,
  }))
}

export function RegisterPage() {
  const [params] = useSearchParams()
  const initial =
    params.get('division') === 'ps5' ? 'ps5' : ('mlbb' as Exclude<GameTitle, 'all'>)
  const [division, setDivision] = useState(initial)
  const [roster, setRoster] = useState<RosterPlayer[]>(DEMO_ROSTER)
  const [captainPlayerId, setCaptainPlayerId] = useState<string | null>(
    DEMO_ROSTER[0]?.id ?? null,
  )
  const [team, setTeam] = useState(initialTeam)
  const [solo, setSolo] = useState(initialSolo)
  const [crest, setCrest] = useState<File | null>(null)
  const [employeeCertified, setEmployeeCertified] = useState(false)
  const [rulesAccepted, setRulesAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [referenceId, setReferenceId] = useState<number | null>(null)
  const [settings, setSettings] = useState<RegistrationSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [settingsError, setSettingsError] = useState<string | null>(null)
  const [mlbbMinPlayers, setMlbbMinPlayers] = useState(DEFAULT_MLBB_MIN_PLAYERS)
  const [mlbbMaxPlayers, setMlbbMaxPlayers] = useState(DEFAULT_MLBB_MAX_PLAYERS)

  const selected = useMemo(
    () => DIVISIONS.find((d) => d.id === division)!,
    [division],
  )

  const accepting = settings?.is_accepting_registrations ?? false

  useEffect(() => {
    let active = true

    fetchRegistrationSettings()
      .then((result) => {
        if (!active) {
          return
        }
        setSettings(result)
        setMlbbMinPlayers(result.mlbb_min_players)
        setMlbbMaxPlayers(result.mlbb_max_players)
        setRoster((current) => {
          if (current.length >= result.mlbb_min_players) {
            return current.slice(0, result.mlbb_max_players)
          }
          const next = [...current]
          while (next.length < result.mlbb_min_players) {
            next.push(emptyRosterPlayer(next.length))
          }
          return next
        })
        setSettingsError(null)
      })
      .catch((caught: unknown) => {
        if (active) {
          setSettingsError(firstError(caught))
        }
      })
      .finally(() => {
        if (active) {
          setSettingsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  function updatePlayer(id: string, key: keyof RosterPlayer, value: string) {
    setRoster((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)),
    )
  }

  function addPlayer() {
    setRoster((prev) => {
      if (prev.length >= mlbbMaxPlayers) {
        return prev
      }

      return [...prev, emptyRosterPlayer(prev.length)]
    })
  }

  function removePlayer(id: string) {
    setRoster((prev) => {
      if (prev.length <= mlbbMinPlayers) {
        return prev
      }

      const next = relabelRoster(prev.filter((player) => player.id !== id))
      setCaptainPlayerId((current) =>
        current === id ? (next[0]?.id ?? null) : current,
      )
      return next
    })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!accepting) {
      setError(settings?.closed_reason ?? 'Registration is currently closed.')
      return
    }
    if (division === 'mlbb') {
      if (!captainPlayerId || !roster.some((p) => p.id === captainPlayerId)) {
        setError('Select one roster player as team captain.')
        return
      }
    }

    setSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.set('division', division)
    formData.set('team_name', team.teamName)
    formData.set('team_tag', team.teamTag)
    formData.set('organization', team.organization)
    formData.set('discord_id', team.discordId)
    formData.set('employee_certified', employeeCertified ? '1' : '0')
    formData.set('rules_accepted', rulesAccepted ? '1' : '0')

    if (crest) {
      formData.set('crest', crest)
    }

    if (division === 'mlbb') {
      formData.set(
        'players',
        JSON.stringify(
          roster.map((player) => ({
            slot_label: player.label,
            role: player.role,
            full_name: player.name,
            nrc: player.nrc,
            employee_id: player.employeeId,
            phone: player.phone,
            email: player.corporateEmail,
            game_id: player.gameUserId,
            zone_id: player.zoneId,
            is_captain: player.id === captainPlayerId,
          })),
        ),
      )
    } else {
      formData.set('dualsense_profile', solo.dualsenseProfile)
      formData.set(
        'players',
        JSON.stringify([
          {
            slot_label: 'SOLO',
            full_name: solo.fullName,
            nrc: solo.nrc,
            employee_id: solo.employeeId,
            game_id: solo.psnId,
            email: solo.email,
          },
        ]),
      )
    }

    try {
      const result = await submitRegistration(formData)
      setReferenceId(result.data?.id ?? null)
      setSubmitted(true)
    } catch (caught) {
      setError(firstError(caught))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[960px] px-5 py-10 md:px-12 md:py-14">
      <div className="mb-2 label-code text-cyan">
        HOME / REGISTRATION / TOURNAMENT ENTRY
      </div>
      <div className="mb-6">
        <Badge tone="violet" className="mb-4">
          CORPORATE ESPORTS LEAGUE 2026 // APAC REGIONAL QUALIFIER
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

      {!settingsLoading && !accepting ? (
        <div className="mb-8 border border-critical/40 bg-critical/10 p-6">
          <p className="label-code text-critical">REGISTRATION UNAVAILABLE</p>
          <h2 className="mt-2 font-display text-2xl font-bold">
            Public registration is closed
          </h2>
          <p className="mt-2 text-muted">
            {settingsError ??
              settings?.closed_reason ??
              'Registration is currently unavailable.'}
          </p>
        </div>
      ) : null}

      {submitted ? (
        <div className="border border-cyan bg-cyan/10 p-8 text-center">
          <p className="label-code text-cyan">ENTRY RECEIVED</p>
          <h2 className="mt-2 font-display text-2xl font-bold">
            Registration Pending Admin Review
          </h2>
          <p className="mt-2 text-muted">
            Your {selected.title} entry is locked and waiting for verification.
            {referenceId ? ` Reference #${referenceId}.` : ''}
          </p>
          <Button
            className="mt-6"
            type="button"
            onClick={() => {
              setSubmitted(false)
              setReferenceId(null)
            }}
          >
            Submit Another Entry
          </Button>
        </div>
      ) : accepting ? (
        <form onSubmit={(event) => void onSubmit(event)} className="space-y-8">
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
                <Input
                  value={team.teamName}
                  onChange={(e) => setTeam({ ...team, teamName: e.target.value })}
                  required
                />
              </Field>
              <Field label="Team Tag (Acronym)" required hint="2 to 4 alphanumeric chars">
                <Input
                  value={team.teamTag}
                  maxLength={4}
                  onChange={(e) =>
                    setTeam({
                      ...team,
                      teamTag: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''),
                    })
                  }
                  required
                />
              </Field>
              <Field label="Organization / Entity" required>
                <Select
                  value={team.organization}
                  onChange={(e) => setTeam({ ...team, organization: e.target.value })}
                  required
                >
                  {ORGANIZATIONS.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Discord ID / Tag" required>
                <Input
                  value={team.discordId}
                  onChange={(e) => setTeam({ ...team, discordId: e.target.value })}
                  required
                />
              </Field>
              <Field label="Team Crest / Avatar" hint="Min. 512×512 transparent PNG">
                <Input
                  type="file"
                  accept="image/png,image/svg+xml"
                  onChange={(e) => setCrest(e.target.files?.[0] ?? null)}
                />
              </Field>
            </div>
          </section>

          {division === 'mlbb' ? (
            <section className="border border-border bg-chassis p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold">
                    02 · Roster Registration ({mlbbMinPlayers}–{mlbbMaxPlayers} Players)
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Register at least {mlbbMinPlayers} players and up to{' '}
                    {mlbbMaxPlayers}. All players must provide verified employee
                    identification, corporate contact details, valid MLBB Game & Zone
                    IDs, and exactly one designated team captain.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="cyan">
                    Roster Slots: {roster.length} / {mlbbMaxPlayers}
                  </Badge>
                  <Button
                    type="button"
                    variant="secondary"
                    clip={false}
                    disabled={!accepting || roster.length >= mlbbMaxPlayers}
                    onClick={addPlayer}
                  >
                    Add player
                  </Button>
                </div>
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
                          {player.name || `Player #${index + 1}`}
                        </span>
                        <span className="ml-2 label-code text-muted">
                          Assigned Role: {player.role}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="flex cursor-pointer items-center gap-2 border border-border bg-surface-high px-3 py-1.5 text-xs uppercase tracking-wide text-muted">
                          <input
                            type="radio"
                            name="team-captain"
                            className="accent-cyan"
                            checked={captainPlayerId === player.id}
                            disabled={!accepting}
                            onChange={() => setCaptainPlayerId(player.id)}
                          />
                          <span
                            className={
                              captainPlayerId === player.id ? 'text-cyan' : undefined
                            }
                          >
                            Team Captain
                          </span>
                        </label>
                        {roster.length > mlbbMinPlayers ? (
                          <Button
                            type="button"
                            variant="critical"
                            clip={false}
                            disabled={!accepting}
                            onClick={() => removePlayer(player.id)}
                          >
                            Remove
                          </Button>
                        ) : null}
                      </div>
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
                      <Field label="Phone Number" required>
                        <Input
                          type="tel"
                          value={player.phone}
                          onChange={(e) =>
                            updatePlayer(player.id, 'phone', e.target.value)
                          }
                          required
                        />
                      </Field>
                      <Field label="Mail" required>
                        <Input
                          type="email"
                          value={player.corporateEmail}
                          onChange={(e) =>
                            updatePlayer(player.id, 'corporateEmail', e.target.value)
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
                        <Input
                          value={player.zoneId}
                          onChange={(e) =>
                            updatePlayer(player.id, 'zoneId', e.target.value)
                          }
                          required
                        />
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
                  <Input
                    value={solo.fullName}
                    onChange={(e) => setSolo({ ...solo, fullName: e.target.value })}
                    required
                  />
                </Field>
                <Field label="PSN ID" required>
                  <Input
                    value={solo.psnId}
                    onChange={(e) => setSolo({ ...solo, psnId: e.target.value })}
                    required
                  />
                </Field>
                <Field label="Corporate Employee ID" required>
                  <Input
                    value={solo.employeeId}
                    onChange={(e) => setSolo({ ...solo, employeeId: e.target.value })}
                    required
                  />
                </Field>
                <Field label="National Reg. Card (NRC / ID)" required>
                  <Input
                    value={solo.nrc}
                    onChange={(e) => setSolo({ ...solo, nrc: e.target.value })}
                    required
                  />
                </Field>
                <Field label="Corporate Email" required>
                  <Input
                    type="email"
                    value={solo.email}
                    onChange={(e) => setSolo({ ...solo, email: e.target.value })}
                    required
                  />
                </Field>
                <Field label="Preferred DualSense Profile">
                  <Select
                    value={solo.dualsenseProfile}
                    onChange={(e) =>
                      setSolo({ ...solo, dualsenseProfile: e.target.value })
                    }
                  >
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
                <input
                  type="checkbox"
                  required
                  className="mt-1 accent-cyan"
                  checked={employeeCertified}
                  onChange={(e) => setEmployeeCertified(e.target.checked)}
                />
                <span>
                  I certify that all registered players are verified corporate
                  employees / accredited contractors and that NRC details match
                  the employer register.
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 accent-cyan"
                  checked={rulesAccepted}
                  onChange={(e) => setRulesAccepted(e.target.checked)}
                />
                <span>
                  I accept the Official Rulebook, Anti-Cheat Armored-V4 policy, and
                  broadcasting rights release for YFD Days Season 4.
                </span>
              </label>
            </div>
          </section>

          {error ? (
            <p className="border border-critical/40 bg-critical/10 px-4 py-3 text-sm text-critical">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              className="min-w-[240px]"
              disabled={submitting || !employeeCertified || !rulesAccepted}
            >
              {submitting ? 'Submitting...' : 'Confirm & Lock Registration'}
            </Button>
            <Button type="button" variant="secondary">
              Save Draft
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  )
}
