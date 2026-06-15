// API layer for the Classes resource.
import { apiGet, apiPost } from './http'

export async function getClasses() {
  const body = await apiGet('/classes')
  return body?.data ?? []
}

export async function createClass(payload) {
  // payload: { level, name, teacherEmail }
  return apiPost('/classes', payload)
}
