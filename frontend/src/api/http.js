// Shared fetch helpers. Requests go to /api/* and are proxied to the
// Express backend in development (see vite.config.js).

const BASE_URL = '/api'

async function handle(response) {
  let body = null
  try {
    body = await response.json()
  } catch {
    // Some responses (or errors) may not carry a JSON body.
  }

  if (!response.ok) {
    const message = body?.error || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return body
}

export async function apiGet(path) {
  const response = await fetch(`${BASE_URL}${path}`)
  return handle(response)
}

export async function apiPost(path, payload) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handle(response)
}
