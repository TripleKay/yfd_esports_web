export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export type DivisionCapacitySettings = {
  team_max_limit: number
  approved_team_count: number
  slots_remaining: number
  is_full: boolean
  closed_reason: string | null
}

export type RegistrationSettings = {
  is_enabled: boolean
  starts_at: string | null
  ends_at: string | null
  mlbb_min_players: number
  mlbb_max_players: number
  is_accepting_registrations: boolean
  closed_reason: string | null
  mlbb: DivisionCapacitySettings
  ps5: DivisionCapacitySettings
}

export async function fetchRegistrationSettings(): Promise<RegistrationSettings> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/registration-settings`,
    {
      headers: { Accept: 'application/json' },
    },
  )

  const body = (await response.json().catch(() => ({}))) as {
    message?: string
    data?: RegistrationSettings
  }

  if (!response.ok || !body.data) {
    throw new ApiError(
      body.message ?? 'Failed to load registration settings',
      response.status,
    )
  }

  return body.data
}

export async function submitRegistration(formData: FormData) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/registrations`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    },
  )

  const body = (await response.json().catch(() => ({}))) as {
    message?: string
    errors?: Record<string, string[]>
    data?: unknown
  }

  if (!response.ok) {
    throw new ApiError(
      body.message ?? 'Registration failed',
      response.status,
      body.errors,
    )
  }

  return body
}

export function firstError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.errors) {
      const first = Object.values(error.errors)[0]?.[0]
      if (first) {
        return first
      }
    }
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong.'
}
