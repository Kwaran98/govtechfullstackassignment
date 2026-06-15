import { describe, test, expect } from 'vitest'
import {
  isValidEmail,
  isValidContactNumber,
  validateTeacher,
  validateClass,
} from './validation'

describe('isValidEmail', () => {
  test('accepts a gmail.com address', () => {
    expect(isValidEmail('teachermary@gmail.com')).toBe(true)
  })

  test('rejects a non-gmail domain', () => {
    expect(isValidEmail('mary@yahoo.com')).toBe(false)
  })

  test('rejects a malformed address', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
  })
})

describe('isValidContactNumber', () => {
  test('accepts exactly 8 digits', () => {
    expect(isValidContactNumber('68129414')).toBe(true)
  })

  test('accepts 8 digits with spaces', () => {
    expect(isValidContactNumber('6812 9414')).toBe(true)
  })

  test('rejects fewer than 8 digits', () => {
    expect(isValidContactNumber('1234567')).toBe(false)
  })

  test('rejects letters', () => {
    expect(isValidContactNumber('1234567a')).toBe(false)
  })
})

describe('validateTeacher', () => {
  const valid = {
    name: 'Mary',
    subject: 'Mathematics',
    email: 'teachermary@gmail.com',
    contactNumber: '68129414',
  }

  test('returns no errors for a valid teacher', () => {
    expect(validateTeacher(valid)).toEqual({})
  })

  test('flags a missing name', () => {
    expect(validateTeacher({ ...valid, name: '' })).toHaveProperty('name')
  })

  test('flags a missing subject', () => {
    expect(validateTeacher({ ...valid, subject: '' })).toHaveProperty('subject')
  })

  test('flags an invalid email', () => {
    expect(validateTeacher({ ...valid, email: 'mary@outlook.com' })).toHaveProperty('email')
  })

  test('flags an invalid contact number', () => {
    expect(validateTeacher({ ...valid, contactNumber: '12' })).toHaveProperty('contactNumber')
  })
})

describe('validateClass', () => {
  const valid = {
    level: 'Primary 1',
    name: 'Class 1A',
    teacherEmail: 'teachermary@gmail.com',
  }

  test('returns no errors for a valid class', () => {
    expect(validateClass(valid)).toEqual({})
  })

  test('flags a missing level', () => {
    expect(validateClass({ ...valid, level: '' })).toHaveProperty('level')
  })

  test('flags a missing name', () => {
    expect(validateClass({ ...valid, name: '' })).toHaveProperty('name')
  })

  test('flags a missing teacher', () => {
    expect(validateClass({ ...valid, teacherEmail: '' })).toHaveProperty('teacherEmail')
  })
})
