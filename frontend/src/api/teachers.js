// API layer for the Teachers resource.
import { apiGet, apiPost } from './http'

export async function getTeachers() {
  const body = await apiGet('/teachers')
  return body?.data ?? []
}

export async function createTeacher(teacher) {
  return apiPost('/teachers', teacher)
}
