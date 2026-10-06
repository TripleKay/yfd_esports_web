const encoder = new TextEncoder()

function hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function arrayBuffer(data: Uint8Array): ArrayBuffer {
  const copy = new ArrayBuffer(data.byteLength)
  new Uint8Array(copy).set(data)

  return copy
}

async function sha256Hex(data: Uint8Array): Promise<string> {
  return hex(await crypto.subtle.digest('SHA-256', arrayBuffer(data)))
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    arrayBuffer(encoder.encode(secret)),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  return hex(
    await crypto.subtle.sign('HMAC', key, arrayBuffer(encoder.encode(message))),
  )
}

/**
 * Add X-GSignature when a frontend secret is configured.
 * That secret ships in the JS bundle, so this is attestation, not a private credential.
 * With no secret, the request is left unchanged.
 */
export async function applySignature(
  url: string,
  init: RequestInit = {},
): Promise<RequestInit> {
  const secret = import.meta.env.VITE_REQUEST_SIGNATURE_SECRET
  if (!secret) {
    return init
  }

  const headers = new Headers(init.headers)
  const method = (init.method ?? 'GET').toUpperCase()
  let body = init.body

  if (body instanceof FormData) {
    const frozen = new Request('https://signature.invalid/', {
      method: 'POST',
      body,
    })
    const type = frozen.headers.get('content-type')
    if (type) {
      headers.set('Content-Type', type)
    }
    body = await frozen.arrayBuffer()
  }

  const raw =
    body == null
      ? new Uint8Array()
      : typeof body === 'string'
        ? encoder.encode(body)
        : body instanceof URLSearchParams
          ? encoder.encode(body.toString())
          : body instanceof Blob
            ? new Uint8Array(await body.arrayBuffer())
            : body instanceof ArrayBuffer
              ? new Uint8Array(body)
              : new Uint8Array()

  const parsed = new URL(url, window.location.origin)
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const canonical = `${method}\n${parsed.pathname}${parsed.search}\n${await sha256Hex(raw)}\n${timestamp}`

  headers.set('X-GSignature', await hmacHex(secret, canonical))
  headers.set('X-GTimestamp', timestamp)

  return { ...init, headers, body: body ?? null }
}

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = `${import.meta.env.VITE_API_URL}${path}`

  return fetch(url, await applySignature(url, init))
}
