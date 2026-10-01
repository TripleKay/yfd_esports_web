export const CREST_MAX_BYTES = 5 * 1024 * 1024

export const CREST_ACCEPT = 'image/png,image/jpeg'

const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg'])

export function crestFileError(file: File | null | undefined): string | null {
  if (!file) {
    return null
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return 'Team crest must be a PNG or JPG image.'
  }

  if (file.size > CREST_MAX_BYTES) {
    return 'Team crest must not be larger than 5 MB.'
  }

  return null
}
