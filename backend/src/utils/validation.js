// Server-side validation for incoming request bodies.
// These rules mirror the client-side checks so the two stay in sync, but the
// server never trusts the client: every request is validated here as well.
//
// Rules (per the agreed spec):
//  - email: must be a gmail.com address
//  - work contact number: exactly 8 digits (spaces are ignored)

const GMAIL_REGEX = /^[^\s@]+@gmail\.com$/i;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(email) {
  return typeof email === "string" && GMAIL_REGEX.test(email.trim());
}

function isValidContactNumber(contactNumber) {
  return (
    typeof contactNumber === "string" &&
    /^\d{8}$/.test(contactNumber.replace(/\s+/g, ""))
  );
}

// Each validator returns an error message string, or null when the body is valid.

function validateTeacher({ name, subject, email, contactNumber } = {}) {
  if (!isNonEmptyString(name)) return "Name is required";
  if (!isNonEmptyString(subject)) return "Subject is required";
  if (!isNonEmptyString(email)) return "Email is required";
  if (!isValidEmail(email)) return "Email must be a valid gmail.com address";
  if (!isNonEmptyString(contactNumber)) return "Contact number is required";
  if (!isValidContactNumber(contactNumber)) {
    return "Contact number must be exactly 8 digits";
  }
  return null;
}

function validateClass({ level, name, teacherEmail } = {}) {
  if (!isNonEmptyString(level)) return "Level is required";
  if (!isNonEmptyString(name)) return "Class name is required";
  if (!isNonEmptyString(teacherEmail)) return "teacherEmail is required";
  return null;
}

module.exports = {
  isValidEmail,
  isValidContactNumber,
  validateTeacher,
  validateClass,
};
