import { ApiError } from './registrations'

export type Organization = {
  id: string
  name: string
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export async function fetchOrganizations(): Promise<Organization[]> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/organizations`,
    {
      headers: { Accept: 'application/json' },
    },
  )

  const body = (await response.json().catch(() => ({}))) as {
    message?: string
    data?: Organization[]
  }

  if (!response.ok || !body.data) {
    throw new ApiError(
      body.message ?? 'Failed to load organizations',
      response.status,
    )
  }

  return body.data
}
