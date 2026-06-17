// Shared fetch helpers for talking to the backend API.
// Requests use relative /api/* paths, which are proxied to the Express backend:
//   - in development, by the Vite dev server (see vite.config.js)
//   - in production, by Vercel (see vercel.json)

// Paths are kept relative so that the same code works in both environments.

const BASE_URL = '/api'

/**
 * Parses a fetch response and normalizes error handling.
 * On a non-2xx status, throws an Error carrying the backend's `error` message
 * The API returns errors as { "error": "..." }. On success, returns the body.
 */

async function handle(response) {
  let body = null
  try {
    body = await response.json()
  } catch {
    // Some responses like certain errors may not carry a JSON body
  }

  if (!response.ok) {
    const message = body?.error || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return body
}

/** Sends a GET request to /api{path} and returns the parsed JSON body. */
export async function apiGet(path) {
  const response = await fetch(`${BASE_URL}${path}`)
  return handle(response)
}

/** Sends a POST request to /api{path} with a JSON payload and returns the parsed body. */
export async function apiPost(path, payload) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handle(response)
}
