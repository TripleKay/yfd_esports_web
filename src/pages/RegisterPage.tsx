import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchOrganizations, type Organization } from '../api/organizations'
import {
  ApiError,
  fetchRegistrationSettings,
  firstError,
  submitRegistration,
  type RegistrationSettings,
} from '../api/registrations'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Field, Input, Select } from '../components/ui/Field'
import { IconAction, IconDelete } from '../components/ui/IconAction'
import { DIVISIONS } from '../data/demo'
import type { GameTitle, RosterPlayer } from '../types'

const roles = ['JUNGLER', 'MID', 'GOLD', 'ROAM', 'EXP'] as const
const DEFAULT_MLBB_MIN_PLAYERS = 5
const DEFAULT_MLBB_MAX_PLAYERS = 7

type TeamForm = {
  teamName: string
  teamTag: string
  organizationId: string
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

type IdentityErrors = Partial<
  Record<'teamName' | 'teamTag' | 'organizationId' | 'discordId', string>
>
type SoloErrors = Partial<
  Record<
    'fullName' | 'psnId' | 'employeeId' | 'nrc' | 'email' | 'phone',
    string
  >
>
type RosterFieldKey =
  | 'name'
  | 'nrc'
  | 'employeeId'
  | 'phone'
  | 'corporateEmail'
  | 'gameUserId'
  | 'zoneId'
  | 'role'
type RosterErrors = Record<string, Partial<Record<RosterFieldKey, string>>>
type ComplianceErrors = Partial<
  Record<'employeeCertified' | 'rulesAccepted', string>
>

const initialTeam: TeamForm = {
  teamName: '',
  teamTag: '',
  organizationId: '',
  discordId: '',
}

const initialSolo: SoloForm = {
  fullName: '',
  psnId: '',
  employeeId: '',
  nrc: '',
  email: '',
  phone: '',
}

function emptyRosterPlayer(index: number): RosterPlayer {
  return {
    id: `p${index + 1}-${Date.now()}-${index}`,
    label: `P${index + 1}`,
    role: '',
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

function createEmptyRoster(count: number): RosterPlayer[] {
  return Array.from({ length: count }, (_, index) => emptyRosterPlayer(index))
}

function relabelRoster(players: RosterPlayer[]): RosterPlayer[] {
  return players.map((player, index) => ({
    ...player,
    label: `P${index + 1}`,
  }))
}

const ROSTER_REQUIRED_FIELDS: { key: RosterFieldKey; label: string }[] = [
  { key: 'name', label: 'Full Legal Name' },
  { key: 'nrc', label: 'National Reg. Card (NRC / ID)' },
  { key: 'employeeId', label: 'Corporate Employee ID' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'corporateEmail', label: 'Mail' },
  { key: 'gameUserId', label: 'MLBB Game User ID' },
  { key: 'zoneId', label: 'Server / Zone ID' },
  { key: 'role', label: 'Primary Specialization' },
]

function hasFieldErrors(errors: object) {
  return Object.keys(errors).length > 0
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

function collectTeamIdentityErrors(team: TeamForm): IdentityErrors {
  const errors: IdentityErrors = {}
  if (!team.teamName.trim()) {
    errors.teamName = 'Team name is required.'
  }
  if (!team.teamTag.trim()) {
    errors.teamTag = 'Team tag is required.'
  } else if (team.teamTag.trim().length < 2) {
    errors.teamTag = 'Team tag must be at least 2 characters.'
  }
  if (!team.organizationId.trim()) {
    errors.organizationId = 'Organization / Entity is required.'
  }
  if (!team.discordId.trim()) {
    errors.discordId = 'Discord ID / Tag is required.'
  }
  return errors
}

function collectSoloRegistrationErrors(solo: SoloForm): SoloErrors {
  const errors: SoloErrors = {}
  if (!solo.fullName.trim()) {
    errors.fullName = 'Full Legal Name is required.'
  }
  if (!solo.psnId.trim()) {
    errors.psnId = 'PSN ID is required.'
  }
  if (!solo.employeeId.trim()) {
    errors.employeeId = 'Corporate Employee ID is required.'
  }
  if (!solo.nrc.trim()) {
    errors.nrc = 'National Reg. Card (NRC / ID) is required.'
  }
  if (!solo.email.trim()) {
    errors.email = 'Corporate Email is required.'
  }
  if (!solo.phone.trim()) {
    errors.phone = 'Phone Number is required.'
  }
  return errors
}

function collectMlbbRosterErrors(
  roster: RosterPlayer[],
  captainPlayerId: string | null,
): { fieldErrors: RosterErrors; captainError: string | null } {
  const fieldErrors: RosterErrors = {}
  const captainError =
    !captainPlayerId || !roster.some((player) => player.id === captainPlayerId)
      ? 'Select exactly one Team Captain.'
      : null

  for (const player of roster) {
    const playerErrors: Partial<Record<RosterFieldKey, string>> = {}
    for (const { key, label } of ROSTER_REQUIRED_FIELDS) {
      const value = player[key]
      if (typeof value !== 'string' || !value.trim()) {
        playerErrors[key] = `${label} is required.`
      }
    }
    if (hasFieldErrors(playerErrors)) {
      fieldErrors[player.id] = playerErrors
    }
  }

  return { fieldErrors, captainError }
}

function collectComplianceErrors(
  employeeCertified: boolean,
  rulesAccepted: boolean,
): ComplianceErrors {
  const errors: ComplianceErrors = {}
  if (!employeeCertified) {
    errors.employeeCertified =
      'Confirm employee / contractor certification (section 04).'
  }
  if (!rulesAccepted) {
    errors.rulesAccepted =
      'Accept the Official Rulebook and policies (section 04).'
  }
  return errors
}

type RegistrationStep = 'identity' | 'players' | 'compliance'

export function RegisterPage() {
  const [params] = useSearchParams()
  const [division, setDivision] = useState<Exclude<GameTitle, 'all'> | null>(
    () => initialDivisionFromSearch(params),
  )
  const [roster, setRoster] = useState<RosterPlayer[]>(() =>
    createEmptyRoster(DEFAULT_MLBB_MIN_PLAYERS),
  )
  const [captainPlayerId, setCaptainPlayerId] = useState<string | null>(null)
  const [team, setTeam] = useState(initialTeam)
  const [solo, setSolo] = useState(initialSolo)
  const [crest, setCrest] = useState<File | null>(null)
  const [employeeCertified, setEmployeeCertified] = useState(false)
  const [rulesAccepted, setRulesAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [identityErrors, setIdentityErrors] = useState<IdentityErrors>({})
  const [soloErrors, setSoloErrors] = useState<SoloErrors>({})
  const [rosterErrors, setRosterErrors] = useState<RosterErrors>({})
  const [captainError, setCaptainError] = useState<string | null>(null)
  const [complianceErrors, setComplianceErrors] = useState<ComplianceErrors>({})
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
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [organizationsLoading, setOrganizationsLoading] = useState(true)
  const [organizationsError, setOrganizationsError] = useState<string | null>(
    null,
  )
  const [mlbbMinPlayers, setMlbbMinPlayers] = useState(DEFAULT_MLBB_MIN_PLAYERS)
  const [mlbbMaxPlayers, setMlbbMaxPlayers] = useState(DEFAULT_MLBB_MAX_PLAYERS)
  const [registrationStep, setRegistrationStep] =
    useState<RegistrationStep>('identity')

  const selected = useMemo(
    () =>
      division ? (DIVISIONS.find((d) => d.id === division) ?? null) : null,
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

    fetchOrganizations()
      .then((result) => {
        if (!active) {
          return
        }
        setOrganizations(result)
        setOrganizationsError(null)
      })
      .catch((caught: unknown) => {
        if (active) {
          setOrganizationsError(firstError(caught))
        }
      })
      .finally(() => {
        if (active) {
          setOrganizationsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  function clearAllFormValidation() {
    setIdentityErrors({})
    setSoloErrors({})
    setRosterErrors({})
    setCaptainError(null)
    setComplianceErrors({})
  }

  useEffect(() => {
    setRegistrationStep('identity')
    clearAllFormValidation()
    setError(null)
  }, [division])

  function goToPlayersStep() {
    const nextIdentityErrors = collectTeamIdentityErrors(team)
    setIdentityErrors(nextIdentityErrors)
    if (hasFieldErrors(nextIdentityErrors)) {
      identitySectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      return
    }
    setError(null)
    setRegistrationStep('players')
    window.setTimeout(() => {
      const target =
        division === 'mlbb' ? rosterSectionRef.current : soloSectionRef.current
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  function goToComplianceStep() {
    if (division === 'mlbb') {
      const { fieldErrors, captainError: nextCaptainError } =
        collectMlbbRosterErrors(roster, captainPlayerId)
      setRosterErrors(fieldErrors)
      setCaptainError(nextCaptainError)
      setSoloErrors({})

      if (hasFieldErrors(fieldErrors) || nextCaptainError) {
        rosterSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
        const firstIncompleteId = Object.keys(fieldErrors)[0]
        if (firstIncompleteId) {
          window.setTimeout(() => {
            playerCardRefs.current[firstIncompleteId]?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }, 200)
        }
        return
      }
    } else {
      const nextSoloErrors = collectSoloRegistrationErrors(solo)
      setSoloErrors(nextSoloErrors)
      setRosterErrors({})
      setCaptainError(null)

      if (hasFieldErrors(nextSoloErrors)) {
        soloSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
        return
      }
    }

    setError(null)
    setRegistrationStep('compliance')
    window.setTimeout(() => {
      complianceSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 150)
  }

  function clearRosterFieldError(playerId: string, key: RosterFieldKey) {
    setRosterErrors((prev) => {
      const playerErrors = prev[playerId]
      if (!playerErrors?.[key]) {
        return prev
      }
      const nextPlayer = { ...playerErrors }
      delete nextPlayer[key]
      const next = { ...prev }
      if (hasFieldErrors(nextPlayer)) {
        next[playerId] = nextPlayer
      } else {
        delete next[playerId]
      }
      return next
    })
  }

  function updatePlayer(id: string, key: RosterFieldKey, value: string) {
    setRoster((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)),
    )
    clearRosterFieldError(id, key)
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
      setRosterErrors((prevErrors) => {
        if (!prevErrors[id]) {
          return prevErrors
        }
        const nextErrors = { ...prevErrors }
        delete nextErrors[id]
        return nextErrors
      })
      return next
    })
  }

  function applyServerFieldErrors(serverErrors: Record<string, string[]>) {
    const nextIdentity: IdentityErrors = {}
    const nextSolo: SoloErrors = {}
    const nextCompliance: ComplianceErrors = {}
    const unmapped: string[] = []

    for (const [key, messages] of Object.entries(serverErrors)) {
      const message = messages[0]
      if (!message) {
        continue
      }

      switch (key) {
        case 'team_name':
          nextIdentity.teamName = message
          break
        case 'team_tag':
          nextIdentity.teamTag = message
          break
        case 'organization_id':
        case 'organization':
          nextIdentity.organizationId = message
          break
        case 'discord_id':
          nextIdentity.discordId = message
          break
        case 'employee_certified':
          nextCompliance.employeeCertified = message
          break
        case 'rules_accepted':
          nextCompliance.rulesAccepted = message
          break
        case 'full_name':
        case 'players.0.full_name':
          nextSolo.fullName = message
          break
        case 'nrc':
        case 'players.0.nrc':
          nextSolo.nrc = message
          break
        case 'employee_id':
        case 'players.0.employee_id':
          nextSolo.employeeId = message
          break
        case 'game_id':
        case 'players.0.game_id':
        case 'psn_id':
          nextSolo.psnId = message
          break
        case 'email':
        case 'players.0.email':
          nextSolo.email = message
          break
        case 'phone':
        case 'players.0.phone':
          nextSolo.phone = message
          break
        default:
          unmapped.push(message)
          break
      }
    }

    if (hasFieldErrors(nextIdentity)) {
      setIdentityErrors((prev) => ({ ...prev, ...nextIdentity }))
    }
    if (hasFieldErrors(nextSolo)) {
      setSoloErrors((prev) => ({ ...prev, ...nextSolo }))
    }
    if (hasFieldErrors(nextCompliance)) {
      setComplianceErrors((prev) => ({ ...prev, ...nextCompliance }))
    }

    return unmapped
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!accepting) {
      setError(settings?.closed_reason ?? 'Registration is currently closed.')
      return
    }

    if (!division) {
      setError(
        'Choose one competition format (MLBB squad or PS5 solo) to continue.',
      )
      divisionSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      return
    }

    if (registrationStep !== 'compliance') {
      setError(
        'Use Next step to complete each section before confirming registration.',
      )
      if (registrationStep === 'identity') {
        identitySectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      } else {
        const target =
          division === 'mlbb'
            ? rosterSectionRef.current
            : soloSectionRef.current
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    const nextIdentityErrors = collectTeamIdentityErrors(team)
    const nextSoloErrors =
      division === 'ps5' ? collectSoloRegistrationErrors(solo) : {}
    const nextComplianceErrors = collectComplianceErrors(
      employeeCertified,
      rulesAccepted,
    )
    let nextRosterErrors: RosterErrors = {}
    let nextCaptainError: string | null = null
    if (division === 'mlbb') {
      const rosterResult = collectMlbbRosterErrors(roster, captainPlayerId)
      nextRosterErrors = rosterResult.fieldErrors
      nextCaptainError = rosterResult.captainError
    }

    const hasClientFieldErrors =
      hasFieldErrors(nextIdentityErrors) ||
      hasFieldErrors(nextSoloErrors) ||
      hasFieldErrors(nextRosterErrors) ||
      Boolean(nextCaptainError) ||
      hasFieldErrors(nextComplianceErrors)

    if (hasClientFieldErrors) {
      setIdentityErrors(nextIdentityErrors)
      setSoloErrors(nextSoloErrors)
      setRosterErrors(nextRosterErrors)
      setCaptainError(nextCaptainError)
      setComplianceErrors(nextComplianceErrors)

      if (hasFieldErrors(nextIdentityErrors)) {
        identitySectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      } else if (hasFieldErrors(nextSoloErrors)) {
        soloSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      } else if (hasFieldErrors(nextRosterErrors) || nextCaptainError) {
        rosterSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
        const scrollTarget =
          Object.keys(nextRosterErrors)[0] ??
          (nextCaptainError ? (roster[0]?.id ?? null) : null)
        if (scrollTarget && playerCardRefs.current[scrollTarget]) {
          window.setTimeout(() => {
            playerCardRefs.current[scrollTarget]?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }, 200)
        }
      } else if (hasFieldErrors(nextComplianceErrors)) {
        complianceSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
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
    formData.set('organization_id', team.organizationId)
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
      if (caught instanceof ApiError && caught.errors) {
        const unmapped = applyServerFieldErrors(caught.errors)
        if (unmapped.length > 0) {
          setError(unmapped.join(' '))
        } else {
          setError(null)
        }
      } else {
        setError(firstError(caught))
      }
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
              Select exactly one tournament format. You can switch anytime
              before you submit — the form below updates to match your choice.
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
            <strong className="text-cyan">PS5 Football 1v1</strong> to unlock
            the registration form.
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
                    <span className="label-code text-faint">
                      Select this format
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-display text-xl font-bold">
                  {d.title}
                </h2>
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
            Your {selected?.title ?? 'tournament'} entry is locked and waiting
            for verification.
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
        <form
          noValidate
          onSubmit={(event) => void onSubmit(event)}
          className="space-y-8"
        >
          <section
            ref={identitySectionRef}
            className="border border-border bg-chassis p-5 md:p-6"
          >
            <h2 className="font-display text-xl font-semibold">
              02 · Team Identity & Contact
            </h2>
            <p className="mt-1 text-sm text-muted">
              Primary organization affiliation and roster meta identifiers for{' '}
              {selected?.title ?? 'your division'}. Fields marked{' '}
              <span className="text-cyan">*</span> are required.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Team Name" required error={identityErrors.teamName}>
                <Input
                  value={team.teamName}
                  onChange={(e) => {
                    setTeam({ ...team, teamName: e.target.value })
                    setIdentityErrors((prev) => {
                      if (!prev.teamName) return prev
                      const next = { ...prev }
                      delete next.teamName
                      return next
                    })
                    setError(null)
                  }}
                  required
                />
              </Field>
              <Field
                label="Team Tag (Acronym)"
                required
                hint="2 to 4 alphanumeric chars"
                error={identityErrors.teamTag}
              >
                <Input
                  value={team.teamTag}
                  maxLength={4}
                  minLength={2}
                  onChange={(e) => {
                    setTeam({
                      ...team,
                      teamTag: e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, ''),
                    })
                    setIdentityErrors((prev) => {
                      if (!prev.teamTag) return prev
                      const next = { ...prev }
                      delete next.teamTag
                      return next
                    })
                    setError(null)
                  }}
                  required
                />
              </Field>
              <Field
                label="Organization / Entity"
                required
                error={identityErrors.organizationId}
                hint={
                  organizationsError
                    ? organizationsError
                    : organizationsLoading
                      ? 'Loading organizations…'
                      : organizations.length === 0
                        ? 'No active organizations available. Ask an admin to add one in the portal.'
                        : undefined
                }
              >
                <Select
                  value={team.organizationId}
                  onChange={(e) => {
                    setTeam({
                      ...team,
                      organizationId: e.target.value,
                    })
                    setIdentityErrors((prev) => {
                      if (!prev.organizationId) return prev
                      const next = { ...prev }
                      delete next.organizationId
                      return next
                    })
                    setError(null)
                  }}
                  disabled={organizationsLoading || organizations.length === 0}
                  required
                >
                  <option value="" disabled>
                    {organizationsLoading
                      ? 'Loading organizations…'
                      : organizations.length === 0
                        ? 'No organizations available'
                        : 'Select organization'}
                  </option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="Discord ID / Tag"
                required
                error={identityErrors.discordId}
              >
                <Input
                  value={team.discordId}
                  onChange={(e) => {
                    setTeam({ ...team, discordId: e.target.value })
                    setIdentityErrors((prev) => {
                      if (!prev.discordId) return prev
                      const next = { ...prev }
                      delete next.discordId
                      return next
                    })
                    setError(null)
                  }}
                  required
                />
              </Field>
              <Field
                label="Team Crest / Avatar"
                hint="Min. 512×512 transparent PNG"
              >
                <Input
                  type="file"
                  accept="image/png,image/svg+xml"
                  onChange={(e) => setCrest(e.target.files?.[0] ?? null)}
                  className={[
                    'file:mr-3 file:border-0 file:bg-transparent file:p-0 file:text-sm file:font-medium',
                    crest
                      ? 'text-ink file:text-muted'
                      : '!text-faint file:text-faint',
                  ].join(' ')}
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
                    {division === 'mlbb'
                      ? 'Roster registration'
                      : 'Solo player'}{' '}
                    →
                  </Button>
                ) : null}
              </div>
            </div>
          </section>

          {(registrationStep === 'players' ||
            registrationStep === 'compliance') &&
          division === 'mlbb' ? (
            <section
              ref={rosterSectionRef}
              className="border border-border bg-chassis p-5 md:p-6"
            >
              <div>
                <h2 className="font-display text-xl font-semibold">
                  03 · Roster Registration ({mlbbMinPlayers}–{mlbbMaxPlayers}{' '}
                  Players)
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Register at least {mlbbMinPlayers} players and up to{' '}
                  {mlbbMaxPlayers}. All players must provide verified employee
                  identification, corporate contact details, valid MLBB Game &
                  Zone IDs, and exactly one designated team captain.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
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

              {captainError ? (
                <p className="mt-4 text-xs text-critical">{captainError}</p>
              ) : null}

              <div className="mt-6 space-y-4">
                {roster.map((player, index) => {
                  const playerFieldErrors = rosterErrors[player.id]
                  const playerIncomplete = Boolean(playerFieldErrors)
                  return (
                    <div
                      key={player.id}
                      ref={(element) => {
                        playerCardRefs.current[player.id] = element
                      }}
                      className={`border bg-surface-low p-4 ${
                        playerIncomplete
                          ? 'border-critical/60 ring-1 ring-critical/30'
                          : 'border-border'
                      }`}
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-mono text-cyan">
                            {player.label}
                          </span>
                          <span className="ml-3 font-display font-semibold uppercase">
                            {player.name || `Player #${index + 1}`}
                          </span>
                          <span className="ml-2 label-code text-muted">
                            Assigned Role: {player.role}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <label
                            className={`flex h-9 cursor-pointer items-center gap-2 border px-3 text-xs uppercase tracking-wide transition-colors ${
                              captainPlayerId === player.id
                                ? 'border-violet/50 bg-violet/15 text-violet'
                                : 'border-violet/40 bg-violet/10 text-violet'
                            }`}
                          >
                            <input
                              type="radio"
                              name="team-captain"
                              className="accent-violet"
                              checked={captainPlayerId === player.id}
                              disabled={!accepting}
                              required={index === 0}
                              onChange={() => {
                                setCaptainPlayerId(player.id)
                                setCaptainError(null)
                                setError(null)
                              }}
                            />
                            <span>Team Captain *</span>
                          </label>
                          {roster.length > mlbbMinPlayers ? (
                            <IconAction
                              label="Remove player"
                              tone="critical"
                              disabled={!accepting}
                              onClick={() => removePlayer(player.id)}
                            >
                              <IconDelete />
                            </IconAction>
                          ) : null}
                        </div>
                      </div>
                      <div className="grid gap-3 md:grid-cols-3">
                        <Field
                          label="Full Legal Name"
                          required
                          error={playerFieldErrors?.name}
                        >
                          <Input
                            value={player.name}
                            onChange={(e) =>
                              updatePlayer(player.id, 'name', e.target.value)
                            }
                            placeholder="Full legal name"
                            required
                          />
                        </Field>
                        <Field
                          label="National Reg. Card (NRC / ID)"
                          required
                          error={playerFieldErrors?.nrc}
                        >
                          <Input
                            value={player.nrc}
                            onChange={(e) =>
                              updatePlayer(player.id, 'nrc', e.target.value)
                            }
                            placeholder="NRC / government ID"
                            required
                          />
                        </Field>
                        <Field
                          label="Corporate Employee ID"
                          required
                          error={playerFieldErrors?.employeeId}
                        >
                          <Input
                            value={player.employeeId}
                            onChange={(e) =>
                              updatePlayer(
                                player.id,
                                'employeeId',
                                e.target.value,
                              )
                            }
                            placeholder="Employee ID"
                            required
                          />
                        </Field>
                        <Field
                          label="Phone Number"
                          required
                          error={playerFieldErrors?.phone}
                        >
                          <Input
                            type="tel"
                            value={player.phone}
                            onChange={(e) =>
                              updatePlayer(player.id, 'phone', e.target.value)
                            }
                            placeholder="Phone number"
                            required
                          />
                        </Field>
                        <Field
                          label="Mail"
                          required
                          error={playerFieldErrors?.corporateEmail}
                        >
                          <Input
                            type="email"
                            value={player.corporateEmail}
                            onChange={(e) =>
                              updatePlayer(
                                player.id,
                                'corporateEmail',
                                e.target.value,
                              )
                            }
                            placeholder="Corporate email"
                            required
                          />
                        </Field>
                        <Field
                          label="MLBB Game User ID"
                          required
                          error={playerFieldErrors?.gameUserId}
                        >
                          <Input
                            value={player.gameUserId}
                            onChange={(e) =>
                              updatePlayer(
                                player.id,
                                'gameUserId',
                                e.target.value,
                              )
                            }
                            placeholder="In-game user ID"
                            required
                          />
                        </Field>
                        <Field
                          label="Server / Zone ID"
                          required
                          error={playerFieldErrors?.zoneId}
                        >
                          <Input
                            value={player.zoneId}
                            onChange={(e) =>
                              updatePlayer(player.id, 'zoneId', e.target.value)
                            }
                            placeholder="Server / zone ID"
                            required
                          />
                        </Field>
                        <Field
                          label="Primary Specialization"
                          required
                          error={playerFieldErrors?.role}
                        >
                          <Select
                            value={player.role}
                            onChange={(e) =>
                              updatePlayer(player.id, 'role', e.target.value)
                            }
                            required
                          >
                            <option value="" disabled>
                              Select role
                            </option>
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </Select>
                        </Field>
                      </div>
                    </div>
                  )
                })}
              </div>
              {registrationStep === 'players' ||
              registrationStep === 'compliance' ? (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                  <p className="text-sm text-muted">
                    {registrationStep === 'players'
                      ? 'Complete all roster fields and select one Team Captain before continuing.'
                      : 'Roster complete. You can edit players above before confirming.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {registrationStep === 'players' ? (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          clip={false}
                          onClick={() => setRegistrationStep('identity')}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          clip={false}
                          onClick={goToComplianceStep}
                        >
                          Next step: Certification →
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {(registrationStep === 'players' ||
            registrationStep === 'compliance') &&
          division === 'ps5' ? (
            <section
              ref={soloSectionRef}
              className="border border-border bg-chassis p-5 md:p-6"
            >
              <h2 className="font-display text-xl font-semibold">
                03 · Solo Gladiator Registration (PS5 1v1)
              </h2>
              <p className="mt-1 text-sm text-muted">
                All player details marked <span className="text-cyan">*</span>{' '}
                are required before you can confirm registration.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field
                  label="Full Legal Name"
                  required
                  error={soloErrors.fullName}
                >
                  <Input
                    value={solo.fullName}
                    onChange={(e) => {
                      setSolo({ ...solo, fullName: e.target.value })
                      setSoloErrors((prev) => {
                        if (!prev.fullName) return prev
                        const next = { ...prev }
                        delete next.fullName
                        return next
                      })
                      setError(null)
                    }}
                    placeholder="Full legal name"
                    required
                  />
                </Field>
                <Field label="PSN ID" required error={soloErrors.psnId}>
                  <Input
                    value={solo.psnId}
                    onChange={(e) => {
                      setSolo({ ...solo, psnId: e.target.value })
                      setSoloErrors((prev) => {
                        if (!prev.psnId) return prev
                        const next = { ...prev }
                        delete next.psnId
                        return next
                      })
                      setError(null)
                    }}
                    placeholder="PSN ID"
                    required
                  />
                </Field>
                <Field
                  label="Corporate Employee ID"
                  required
                  error={soloErrors.employeeId}
                >
                  <Input
                    value={solo.employeeId}
                    onChange={(e) => {
                      setSolo({ ...solo, employeeId: e.target.value })
                      setSoloErrors((prev) => {
                        if (!prev.employeeId) return prev
                        const next = { ...prev }
                        delete next.employeeId
                        return next
                      })
                      setError(null)
                    }}
                    placeholder="Employee ID"
                    required
                  />
                </Field>
                <Field
                  label="National Reg. Card (NRC / ID)"
                  required
                  error={soloErrors.nrc}
                >
                  <Input
                    value={solo.nrc}
                    onChange={(e) => {
                      setSolo({ ...solo, nrc: e.target.value })
                      setSoloErrors((prev) => {
                        if (!prev.nrc) return prev
                        const next = { ...prev }
                        delete next.nrc
                        return next
                      })
                      setError(null)
                    }}
                    placeholder="NRC / government ID"
                    required
                  />
                </Field>
                <Field
                  label="Corporate Email"
                  required
                  error={soloErrors.email}
                >
                  <Input
                    type="email"
                    value={solo.email}
                    onChange={(e) => {
                      setSolo({ ...solo, email: e.target.value })
                      setSoloErrors((prev) => {
                        if (!prev.email) return prev
                        const next = { ...prev }
                        delete next.email
                        return next
                      })
                      setError(null)
                    }}
                    placeholder="Corporate email"
                    required
                  />
                </Field>
                <Field label="Phone Number" required error={soloErrors.phone}>
                  <Input
                    type="tel"
                    value={solo.phone}
                    onChange={(e) => {
                      setSolo({ ...solo, phone: e.target.value })
                      setSoloErrors((prev) => {
                        if (!prev.phone) return prev
                        const next = { ...prev }
                        delete next.phone
                        return next
                      })
                      setError(null)
                    }}
                    placeholder="Phone number"
                    required
                  />
                </Field>
              </div>
              {registrationStep === 'players' ||
              registrationStep === 'compliance' ? (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                  <p className="text-sm text-muted">
                    {registrationStep === 'players'
                      ? 'Fill every solo player field marked * before continuing.'
                      : 'Solo player details complete. You can edit above before confirming.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {registrationStep === 'players' ? (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          clip={false}
                          onClick={() => setRegistrationStep('identity')}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          clip={false}
                          onClick={goToComplianceStep}
                        >
                          Next step: Certification →
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {registrationStep === 'compliance' ? (
            <section
              ref={complianceSectionRef}
              className="border border-border bg-chassis p-5 md:p-6"
            >
              <h2 className="font-display text-xl font-semibold">
                04 · Compliance & Verification Certification
              </h2>
              <div className="mt-5 space-y-4 text-sm text-muted">
                <div
                  className={`border px-4 py-3 ${
                    complianceErrors.employeeCertified
                      ? 'border-critical'
                      : 'border-border'
                  }`}
                >
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 accent-cyan"
                      checked={employeeCertified}
                      onChange={(e) => {
                        setEmployeeCertified(e.target.checked)
                        setComplianceErrors((prev) => {
                          if (!prev.employeeCertified) return prev
                          const next = { ...prev }
                          delete next.employeeCertified
                          return next
                        })
                        setError(null)
                      }}
                    />
                    <span>
                      I certify that all registered players are verified
                      corporate employees / accredited contractors and that NRC
                      details match the employer register.
                    </span>
                  </label>
                  {complianceErrors.employeeCertified ? (
                    <p className="mt-2 text-xs text-critical">
                      {complianceErrors.employeeCertified}
                    </p>
                  ) : null}
                </div>
                <div
                  className={`border px-4 py-3 ${
                    complianceErrors.rulesAccepted
                      ? 'border-critical'
                      : 'border-border'
                  }`}
                >
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 accent-cyan"
                      checked={rulesAccepted}
                      onChange={(e) => {
                        setRulesAccepted(e.target.checked)
                        setComplianceErrors((prev) => {
                          if (!prev.rulesAccepted) return prev
                          const next = { ...prev }
                          delete next.rulesAccepted
                          return next
                        })
                        setError(null)
                      }}
                    />
                    <span>
                      I accept the Official Rulebook, Anti-Cheat Armored-V4
                      policy, and broadcasting rights release for YFD Days
                      Season 4.
                    </span>
                  </label>
                  {complianceErrors.rulesAccepted ? (
                    <p className="mt-2 text-xs text-critical">
                      {complianceErrors.rulesAccepted}
                    </p>
                  ) : null}
                </div>
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
                    target?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                  }}
                >
                  Back
                </Button>
              </div>
            </section>
          ) : null}

          {error ? (
            <div
              role="alert"
              className="border border-critical/40 bg-critical/10 px-4 py-3 text-sm text-critical"
            >
              <p className="label-code text-critical">Registration error</p>
              <p className="mt-1">{error}</p>
            </div>
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
