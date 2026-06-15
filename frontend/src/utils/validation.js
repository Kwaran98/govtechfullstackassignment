// Client-side validation for the Add Teacher form.
// Rules (per the agreed spec):
//  - email: must be a gmail.com address
//  - work contact number: exactly 8 digits (spaces are ignored)

const GMAIL_REGEX = /^[^\s@]+@gmail\.com$/i

export function isValidEmail(email) {
  return GMAIL_REGEX.test(email.trim())
}

export function isValidContactNumber(contactNumber) {
  const digits = contactNumber.replace(/\s+/g, '')
  return /^\d{8}$/.test(digits)
}

// Returns an object of field -> error message. Empty object means valid.
export function validateTeacher({ name, subject, email, contactNumber }) {
  const errors = {}

  if (!name.trim()) {
    errors.name = 'This field is required.'
  }

  if (!subject) {
    errors.subject = 'Please select a subject.'
  }

  if (!email.trim()) {
    errors.email = 'This field is required.'
  } else if (!isValidEmail(email)) {
    errors.email = 'This email address is invalid.'
  }

  if (!contactNumber.trim()) {
    errors.contactNumber = 'This field is required.'
  } else if (!isValidContactNumber(contactNumber)) {
    errors.contactNumber = 'This work contact number is invalid.'
  }

  return errors
}

// Validation for the Add Class form.
export function validateClass({ level, name, teacherEmail }) {
  const errors = {}

  if (!level) {
    errors.level = 'Please select a class level.'
  }

  if (!name.trim()) {
    errors.name = 'This field is required.'
  }

  if (!teacherEmail) {
    errors.teacherEmail = 'Please assign a form teacher.'
  }

  return errors
}
