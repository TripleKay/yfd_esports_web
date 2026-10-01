import { useEffect, useMemo, useRef, useState } from 'react'
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
const ORGANIZATION_OTHER = 'Other'

type TeamForm = {
  teamName: string
  teamTag: string
  organization: string
  organizationOther: string
  discordId: string
}

type SoloForm = {
  fullName: string
  psnId: string
  employeeId: string
  nrc: string
  email: string
  phone: string
}

const initialTeam: TeamForm = {
  teamName: '',
  teamTag: '',
  organization: ORGANIZATIONS[0],
  organizationOther: '',
  discordId: '',
}

function resolvedOrganization(team: TeamForm): string {
  if (team.organization === ORGANIZATION_OTHER) {
    return team.organizationOther.trim()
  }
  return team.organization
}

const initialSolo: SoloForm = {
  fullName: 'Alex Striker',
  psnId: 'STRIKER_9',
  employeeId: 'NX-49001',
  nrc: '12/XYZ(N)778899',
  email: 'alex.striker@nexus.corp',
  phone: '+95 9 876 543 210',
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

const ROSTER_REQUIRED_FIELDS: { key: keyof RosterPlayer; label: string }[] = [
  { key: 'name', label: 'Full Legal Name' },
  { key: 'nrc', label: 'National Reg. Card (NRC / ID)' },
  { key: 'employeeId', label: 'Corporate Employee ID' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'corporateEmail', label: 'Mail' },
  { key: 'gameUserId', label: 'MLBB Game User ID' },
  { key: 'zoneId', label: 'Server / Zone ID' },
]

function missingRosterFieldLabels(player: RosterPlayer): string[] {
  return ROSTER_REQUIRED_FIELDS.filter(({ key }) => {
    const value = player[key]
    return typeof value !== 'string' || !value.trim()
  }).map(({ label }) => label)
}

function initialDivisionFromSearch(
  params: URLSearchParams,
): Exclude<GameTitle, 'all'> | null {
  const value = params.get('division')
  if (value === 'mlbb' || value === 'ps5') {
    return value
  }
  return null
}

function collectMlbbRosterValidation(
  roster: RosterPlayer[],
  captainPlayerId: string | null,
): { messages: string[]; incompletePlayerIds: string[] } {
  const messages: string[] = []
  const incompletePlayerIds: string[] = []

  if (!captainPlayerId || !roster.some((player) => player.id === captainPlayerId)) {
    messages.push('Select exactly one Team Captain.')
  }

  for (const player of roster) {
    const missing = missingRosterFieldLabels(player)
    if (missing.length === 0) {
      continue
    }
    incompletePlayerIds.push(player.id)
    const who = player.name.trim()
      ? `${player.label} (${player.name})`
      : player.label
    messages.push(`${who}: ${missing.join(', ')}`)
  }

  return { messages, incompletePlayerIds }
}

function collectTeamIdentityIssues(team: TeamForm): string[] {
  const missing: string[] = []
  if (!team.teamName.trim()) missing.push('Team Name')
  if (!team.teamTag.trim()) missing.push('Team Tag (Acronym)')
  if (team.organization === ORGANIZATION_OTHER && !team.organizationOther.trim()) {
    missing.push('Organization Name')
  }
  if (!team.discordId.trim()) missing.push('Discord ID / Tag')
  return missing.map((field) => `${field} is required.`)
}

function collectSoloRegistrationIssues(solo: SoloForm): string[] {
  const missing: string[] = []
  if (!solo.fullName.trim()) missing.push('Full Legal Name')
  if (!solo.psnId.trim()) missing.push('PSN ID')
  if (!solo.employeeId.trim()) missing.push('Corporate Employee ID')
  if (!solo.nrc.trim()) missing.push('National Reg. Card (NRC / ID)')
  if (!solo.email.trim()) missing.push('Corporate Email')
  if (!solo.phone.trim()) missing.push('Phone Number')
  return missing.map((field) => `${field} is required.`)
}

function collectComplianceIssues(
  employeeCertified: boolean,
  rulesAccepted: boolean,
): string[] {
  const issues: string[] = []
  if (!employeeCertified) {
    issues.push('Confirm employee / contractor certification (section 04).')
  }
  if (!rulesAccepted) {
    issues.push('Accept the Official Rulebook and policies (section 04).')
  }
  return issues
}

type RegistrationStep = 'identity' | 'players' | 'compliance'

function validateFieldsInContainer(container: HTMLElement | null): boolean {
  if (!container) {
    return false
  }

  const fields = container.querySelectorAll('input, select, textarea')
  for (const field of fields) {
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLSelectElement ||
      field instanceof HTMLTextAreaElement
    ) {
      if (field.type === 'file') {
        continue
      }
      if (!field.checkValidity()) {
        field.reportValidity()
        return false
      }
    }
  }
  return true
}

export function RegisterPage() {
  const [params] = useSearchParams()
  const [division, setDivision] = useState<Exclude<GameTitle, 'all'> | null>(() =>
    initialDivisionFromSearch(params),
  )
  const [roster, setRoster] = useState<RosterPlayer[]>(DEMO_ROSTER)
  const [captainPlayerId, setCaptainPlayerId] = useState<string | null>(null)
  const [team, setTeam] = useState(initialTeam)
  const [solo, setSolo] = useState(initialSolo)
  const [crest, setCrest] = useState<File | null>(null)
  const [employeeCertified, setEmployeeCertified] = useState(false)
  const [rulesAccepted, setRulesAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rosterAlertMessages, setRosterAlertMessages] = useState<string[]>([])
  const [identityAlertMessages, setIdentityAlertMessages] = useState<string[]>([])
  const [soloAlertMessages, setSoloAlertMessages] = useState<string[]>([])
  const [complianceAlertMessages, setComplianceAlertMessages] = useState<string[]>([])
  const [incompleteRosterPlayerIds, setIncompleteRosterPlayerIds] = useState<
    string[]
  >([])
  const rosterSectionRef = useRef<HTMLElement>(null)
  const identitySectionRef = useRef<HTMLElement>(null)
  const soloSectionRef = useRef<HTMLElement>(null)
  const complianceSectionRef = useRef<HTMLElement>(null)
  const divisionSectionRef = useRef<HTMLDivElement>(null)
  const playerCardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [referenceId, setReferenceId] = useState<number | null>(null)
  const [settings, setSettings] = useState<RegistrationSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [settingsError, setSettingsError] = useState<string | null>(null)
  const [mlbbMinPlayers, setMlbbMinPlayers] = useState(DEFAULT_MLBB_MIN_PLAYERS)
  const [mlbbMaxPlayers, setMlbbMaxPlayers] = useState(DEFAULT_MLBB_MAX_PLAYERS)
  const [registrationStep, setRegistrationStep] =
    useState<RegistrationStep>('identity')

  const selected = useMemo(
    () => (division ? DIVISIONS.find((d) => d.id === division) ?? null : null),
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

  function clearRosterValidation() {
    setRosterAlertMessages([])
    setIncompleteRosterPlayerIds([])
  }

  function clearIdentityValidation() {
    setIdentityAlertMessages([])
  }

  function clearSoloValidation() {
    setSoloAlertMessages([])
  }

  function clearComplianceValidation() {
    setComplianceAlertMessages([])
  }

  function clearAllFormValidation() {
    clearRosterValidation()
    clearIdentityValidation()
    clearSoloValidation()
    clearComplianceValidation()
  }

  useEffect(() => {
    setRegistrationStep('identity')
    clearAllFormValidation()
    setError(null)
  }, [division])

  function goToPlayersStep() {
    const issues = collectTeamIdentityIssues(team)
    if (issues.length > 0) {
      setIdentityAlertMessages(issues)
      setError(issues[0])
      identitySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (!validateFieldsInContainer(identitySectionRef.current)) {
      setError('Please complete all required fields marked with *.')
      return
    }
    clearIdentityValidation()
    setError(null)
    setRegistrationStep('players')
    window.setTimeout(() => {
      const target =
        division === 'mlbb' ? rosterSectionRef.current : soloSectionRef.current
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  function goToComplianceStep() {
    const playersSection =
      division === 'mlbb' ? rosterSectionRef.current : soloSectionRef.current
    let messages: string[] = []
    let incompletePlayerIds: string[] = []

    if (division === 'mlbb') {
      const rosterResult = collectMlbbRosterValidation(roster, captainPlayerId)
      messages = rosterResult.messages
      incompletePlayerIds = rosterResult.incompletePlayerIds
      setRosterAlertMessages(messages)
      setIncompleteRosterPlayerIds(incompletePlayerIds)
      setSoloAlertMessages([])
    } else {
      messages = collectSoloRegistrationIssues(solo)
      setSoloAlertMessages(messages)
      setRosterAlertMessages([])
      setIncompleteRosterPlayerIds([])
    }

    if (messages.length > 0 || !validateFieldsInContainer(playersSection)) {
      setError(messages[0] ?? 'Please complete all required fields marked with *.')
      playersSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (division === 'mlbb' && incompletePlayerIds[0]) {
        window.setTimeout(() => {
          playerCardRefs.current[incompletePlayerIds[0]!]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }, 200)
      }
      return
    }

    clearRosterValidation()
    clearSoloValidation()
    setError(null)
    setRegistrationStep('compliance')
    window.setTimeout(() => {
      complianceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  function updatePlayer(id: string, key: keyof RosterPlayer, value: string) {
    setRoster((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)),
    )
    clearRosterValidation()
    setError(null)
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
      setCaptainPlayerId((current) => (current === id ? null : current))
      return next
    })
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!accepting) {
      setError(settings?.closed_reason ?? 'Registration is currently closed.')
      return
    }

    if (!division) {
      setError('Choose one competition format (MLBB squad or PS5 solo) to continue.')
      divisionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    if (registrationStep !== 'compliance') {
      setError('Use Next step to complete each section before confirming registration.')
      if (registrationStep === 'identity') {
        identitySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        const target =
          division === 'mlbb' ? rosterSectionRef.current : soloSectionRef.current
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    const form = e.currentTarget
    const identityIssues = collectTeamIdentityIssues(team)
    const soloIssues =
      division === 'ps5' ? collectSoloRegistrationIssues(solo) : []
    const complianceIssues = collectComplianceIssues(
      employeeCertified,
      rulesAccepted,
    )
    let rosterIssues: string[] = []
    let incompletePlayerIds: string[] = []
    if (division === 'mlbb') {
      const rosterResult = collectMlbbRosterValidation(roster, captainPlayerId)
      rosterIssues = rosterResult.messages
      incompletePlayerIds = rosterResult.incompletePlayerIds
    }

    const htmlValid = form.reportValidity()
    const hasValidationErrors =
      !htmlValid ||
      identityIssues.length > 0 ||
      soloIssues.length > 0 ||
      complianceIssues.length > 0 ||
      rosterIssues.length > 0

    if (hasValidationErrors) {
      setIdentityAlertMessages(identityIssues)
      setSoloAlertMessages(soloIssues)
      setComplianceAlertMessages(complianceIssues)
      setRosterAlertMessages(rosterIssues)
      setIncompleteRosterPlayerIds(incompletePlayerIds)

      const firstMessage =
        identityIssues[0] ??
        soloIssues[0] ??
        rosterIssues[0] ??
        complianceIssues[0] ??
        'Please complete all required fields marked with *.'
      setError(firstMessage)

      if (!htmlValid) {
        form.reportValidity()
      }

      if (identityIssues.length > 0) {
        identitySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (soloIssues.length > 0) {
        soloSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (rosterIssues.length > 0) {
        rosterSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        const scrollTarget =
          incompletePlayerIds[0] ??
          (captainPlayerId ? null : roster[0]?.id ?? null)
        if (scrollTarget && playerCardRefs.current[scrollTarget]) {
          window.setTimeout(() => {
            playerCardRefs.current[scrollTarget]?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }, 200)
        }
      } else if (complianceIssues.length > 0) {
        complianceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    clearAllFormValidation()
    setSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.set('division', division)
    formData.set('team_name', team.teamName)
    formData.set('team_tag', team.teamTag)
    formData.set('organization', resolvedOrganization(team))
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
            phone: solo.phone,
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

      <div ref={divisionSectionRef} className="mb-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">
              Step 1 · Choose your competition
              <span className="text-cyan"> *</span>
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              Select exactly one tournament format. You can switch anytime before
              you submit — the form below updates to match your choice.
            </p>
          </div>
          {division ? (
            <Badge tone="cyan">Format selected</Badge>
          ) : (
            <Badge tone="upcoming">Pick one to continue</Badge>
          )}
        </div>

        {!division ? (
          <div
            role="status"
            className="mb-4 border border-violet/40 bg-violet/10 px-4 py-3 text-sm text-ink"
          >
            Tap <strong className="text-cyan">MLBB 5v5 Squad</strong> or{' '}
            <strong className="text-cyan">PS5 Football 1v1</strong> to unlock the
            registration form.
          </div>
        ) : null}

        <div
          className="grid gap-4 md:grid-cols-2"
          role="radiogroup"
          aria-label="Tournament format"
        >
          {DIVISIONS.map((d) => {
            const active = division === d.id
            const awaitingChoice = division === null
            return (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setDivision(d.id)
                  setError(null)
                }}
                className={[
                  'border p-5 text-left transition-colors',
                  active
                    ? 'border-cyan bg-cyan/5 glow-cyan'
                    : awaitingChoice
                      ? 'border-dashed border-violet/50 bg-chassis hover:border-cyan/60 hover:bg-cyan/5'
                      : 'border-border bg-chassis hover:border-violet/50',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="label-code text-muted">
                    {d.id === 'mlbb' ? '5v5 SQUAD' : '1v1 SOLO'}
                  </span>
                  {active ? (
                    <Badge tone="cyan">Your selection</Badge>
                  ) : (
                    <span className="label-code text-faint">Select this format</span>
                  )}
                </div>
                <h2 className="mt-2 font-display text-xl font-bold">{d.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  {d.tierLabel} · {d.badge}
                </p>
                <p className="mt-4 font-display text-2xl font-bold text-cyan tabular">
                  {d.prizePool}
                </p>
              </button>
            )
          })}
        </div>
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
            Your {selected?.title ?? 'tournament'} entry is locked and waiting for
            verification.
            {referenceId ? ` Reference #${referenceId}.` : ''}
          </p>
          <Button
            className="mt-6"
            type="button"
            onClick={() => {
              setSubmitted(false)
              setReferenceId(null)
              setDivision(null)
              setRegistrationStep('identity')
            }}
          >
            Submit Another Entry
          </Button>
        </div>
      ) : accepting && !division ? (
        <div className="border border-border bg-chassis p-8 text-center">
          <p className="label-code text-muted">Registration form locked</p>
          <p className="mt-2 text-sm text-muted">
            Choose MLBB squad or PS5 solo above to open team details and roster
            fields.
          </p>
        </div>
      ) : accepting && division ? (
        <form onSubmit={(event) => void onSubmit(event)} className="space-y-8">
          <section
            ref={identitySectionRef}
            className={`border bg-chassis p-5 md:p-6 ${
              identityAlertMessages.length > 0
                ? 'border-critical/60 ring-1 ring-critical/30'
                : 'border-border'
            }`}
          >
            <h2 className="font-display text-xl font-semibold">
              02 · Team Identity & Contact
            </h2>
            <p className="mt-1 text-sm text-muted">
              Primary organization affiliation and roster meta identifiers for{' '}
              {selected?.title ?? 'your division'}. Fields marked{' '}
              <span className="text-cyan">*</span> are required.
            </p>
            {identityAlertMessages.length > 0 ? (
              <div
                role="alert"
                className="mt-4 border border-critical/40 bg-critical/10 px-4 py-3 text-sm text-critical"
              >
                <p className="label-code text-critical">Section incomplete</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {identityAlertMessages.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Team Name" required>
                <Input
                  value={team.teamName}
                  onChange={(e) => {
                    setTeam({ ...team, teamName: e.target.value })
                    clearIdentityValidation()
                    setError(null)
                  }}
                  required
                />
              </Field>
              <Field label="Team Tag (Acronym)" required hint="2 to 4 alphanumeric chars">
                <Input
                  value={team.teamTag}
                  maxLength={4}
                  minLength={2}
                  onChange={(e) => {
                    setTeam({
                      ...team,
                      teamTag: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''),
                    })
                    clearIdentityValidation()
                    setError(null)
                  }}
                  required
                />
              </Field>
              <Field label="Organization / Entity" required>
                <Select
                  value={team.organization}
                  onChange={(e) => {
                    const organization = e.target.value
                    setTeam({
                      ...team,
                      organization,
                      organizationOther:
                        organization === ORGANIZATION_OTHER ? team.organizationOther : '',
                    })
                    clearIdentityValidation()
                    setError(null)
                  }}
                  required
                >
                  {ORGANIZATIONS.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                  <option value={ORGANIZATION_OTHER}>Other</option>
                </Select>
              </Field>
              {team.organization === ORGANIZATION_OTHER ? (
                <Field label="Organization Name" required>
                  <Input
                    value={team.organizationOther}
                    onChange={(e) => {
                      setTeam({ ...team, organizationOther: e.target.value })
                      clearIdentityValidation()
                      setError(null)
                    }}
                    placeholder="Enter your organization / entity name"
                    required
                  />
                </Field>
              ) : null}
              <Field label="Discord ID / Tag" required>
                <Input
                  value={team.discordId}
                  onChange={(e) => {
                    setTeam({ ...team, discordId: e.target.value })
                    clearIdentityValidation()
                    setError(null)
                  }}
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
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <p className="text-sm text-muted">
                {registrationStep === 'identity'
                  ? 'Fill every field marked * before continuing.'
                  : 'Team identity complete. You can go back to edit.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {registrationStep !== 'identity' ? (
                  <Button
                    type="button"
                    variant="secondary"
                    clip={false}
                    onClick={() => {
                      setRegistrationStep('identity')
                      identitySectionRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      })
                    }}
                  >
                    Back
                  </Button>
                ) : null}
                {registrationStep === 'identity' ? (
                  <Button type="button" clip={false} onClick={goToPlayersStep}>
                    Next step:{' '}
                    {division === 'mlbb' ? 'Roster registration' : 'Solo player'} →
                  </Button>
                ) : null}
              </div>
            </div>
          </section>

          {registrationStep === 'players' && division === 'mlbb' ? (
            <section
              ref={rosterSectionRef}
              className={`border bg-chassis p-5 md:p-6 ${
                rosterAlertMessages.length > 0
                  ? 'border-critical/60 ring-1 ring-critical/30'
                  : 'border-border'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold">
                    03 · Roster Registration ({mlbbMinPlayers}–{mlbbMaxPlayers} Players)
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

              {rosterAlertMessages.length > 0 ? (
                <div
                  role="alert"
                  className="mt-4 border border-critical/40 bg-critical/10 px-4 py-3 text-sm text-critical"
                >
                  <p className="label-code text-critical">Roster incomplete</p>
                  <p className="mt-1 text-ink">
                    Fix the items below before you confirm registration.
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {rosterAlertMessages.map((message) => (
                      <li key={message}>{message}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-6 space-y-4">
                {roster.map((player, index) => (
                  <div
                    key={player.id}
                    ref={(element) => {
                      playerCardRefs.current[player.id] = element
                    }}
                    className={`border bg-surface-low p-4 ${
                      incompleteRosterPlayerIds.includes(player.id)
                        ? 'border-critical/60 ring-1 ring-critical/30'
                        : 'border-border'
                    }`}
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
                            required={index === 0}
                            onChange={() => {
                              setCaptainPlayerId(player.id)
                              clearRosterValidation()
                              setError(null)
                            }}
                          />
                          <span
                            className={
                              captainPlayerId === player.id ? 'text-cyan' : undefined
                            }
                          >
                            Team Captain *
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
              {registrationStep === 'players' ? (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                  <p className="text-sm text-muted">
                    Complete all roster fields and select one Team Captain before
                    continuing.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      clip={false}
                      onClick={() => setRegistrationStep('identity')}
                    >
                      Back
                    </Button>
                    <Button type="button" clip={false} onClick={goToComplianceStep}>
                      Next step: Certification →
                    </Button>
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {registrationStep === 'players' && division === 'ps5' ? (
            <section
              ref={soloSectionRef}
              className={`border bg-chassis p-5 md:p-6 ${
                soloAlertMessages.length > 0
                  ? 'border-critical/60 ring-1 ring-critical/30'
                  : 'border-border'
              }`}
            >
              <h2 className="font-display text-xl font-semibold">
                03 · Solo Gladiator Registration (PS5 1v1)
              </h2>
              <p className="mt-1 text-sm text-muted">
                All player details marked <span className="text-cyan">*</span> are
                required before you can confirm registration.
              </p>
              {soloAlertMessages.length > 0 ? (
                <div
                  role="alert"
                  className="mt-4 border border-critical/40 bg-critical/10 px-4 py-3 text-sm text-critical"
                >
                  <p className="label-code text-critical">Section incomplete</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {soloAlertMessages.map((message) => (
                      <li key={message}>{message}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Full Legal Name" required>
                  <Input
                    value={solo.fullName}
                    onChange={(e) => {
                      setSolo({ ...solo, fullName: e.target.value })
                      clearSoloValidation()
                      setError(null)
                    }}
                    required
                  />
                </Field>
                <Field label="PSN ID" required>
                  <Input
                    value={solo.psnId}
                    onChange={(e) => {
                      setSolo({ ...solo, psnId: e.target.value })
                      clearSoloValidation()
                      setError(null)
                    }}
                    required
                  />
                </Field>
                <Field label="Corporate Employee ID" required>
                  <Input
                    value={solo.employeeId}
                    onChange={(e) => {
                      setSolo({ ...solo, employeeId: e.target.value })
                      clearSoloValidation()
                      setError(null)
                    }}
                    required
                  />
                </Field>
                <Field label="National Reg. Card (NRC / ID)" required>
                  <Input
                    value={solo.nrc}
                    onChange={(e) => {
                      setSolo({ ...solo, nrc: e.target.value })
                      clearSoloValidation()
                      setError(null)
                    }}
                    required
                  />
                </Field>
                <Field label="Corporate Email" required>
                  <Input
                    type="email"
                    value={solo.email}
                    onChange={(e) => {
                      setSolo({ ...solo, email: e.target.value })
                      clearSoloValidation()
                      setError(null)
                    }}
                    required
                  />
                </Field>
                <Field label="Phone Number" required>
                  <Input
                    type="tel"
                    value={solo.phone}
                    onChange={(e) => {
                      setSolo({ ...solo, phone: e.target.value })
                      clearSoloValidation()
                      setError(null)
                    }}
                    required
                  />
                </Field>
              </div>
              {registrationStep === 'players' ? (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                  <p className="text-sm text-muted">
                    Fill every solo player field marked * before continuing.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      clip={false}
                      onClick={() => setRegistrationStep('identity')}
                    >
                      Back
                    </Button>
                    <Button type="button" clip={false} onClick={goToComplianceStep}>
                      Next step: Certification →
                    </Button>
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {registrationStep === 'compliance' ? (
          <section
            ref={complianceSectionRef}
            className={`border bg-chassis p-5 md:p-6 ${
              complianceAlertMessages.length > 0
                ? 'border-critical/60 ring-1 ring-critical/30'
                : 'border-border'
            }`}
          >
            <h2 className="font-display text-xl font-semibold">
              04 · Compliance & Verification Certification
            </h2>
            {complianceAlertMessages.length > 0 ? (
              <div
                role="alert"
                className="mt-4 border border-critical/40 bg-critical/10 px-4 py-3 text-sm text-critical"
              >
                <p className="label-code text-critical">Certification required</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {complianceAlertMessages.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-5 space-y-4 text-sm text-muted">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 accent-cyan"
                  checked={employeeCertified}
                  onChange={(e) => {
                    setEmployeeCertified(e.target.checked)
                    clearComplianceValidation()
                    setError(null)
                  }}
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
                  onChange={(e) => {
                    setRulesAccepted(e.target.checked)
                    clearComplianceValidation()
                    setError(null)
                  }}
                />
                <span>
                  I accept the Official Rulebook, Anti-Cheat Armored-V4 policy, and
                  broadcasting rights release for YFD Days Season 4.
                </span>
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
              <Button
                type="button"
                variant="secondary"
                clip={false}
                onClick={() => {
                  setRegistrationStep('players')
                  const target =
                    division === 'mlbb'
                      ? rosterSectionRef.current
                      : soloSectionRef.current
                  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                Back
              </Button>
            </div>
          </section>
          ) : null}

          {error ? (
            <p className="border border-critical/40 bg-critical/10 px-4 py-3 text-sm text-critical">
              {error}
            </p>
          ) : null}

          {registrationStep === 'compliance' ? (
          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              className="min-w-[240px]"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Confirm & Lock Registration'}
            </Button>
            <Button type="button" variant="secondary">
              Save Draft
            </Button>
          </div>
          ) : null}
        </form>
      ) : null}
    </div>
  )
}
