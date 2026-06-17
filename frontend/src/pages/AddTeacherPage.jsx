import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTeacher } from '../api/teachers'
import { SUBJECTS } from '../constants/subjects'
import { validateTeacher } from '../utils/validation'

// The form starts blank. This shape also defines which fields the form tracks
const EMPTY_FORM = {
  name: '',
  subject: '',
  email: '',
  contactNumber: '',
}

// Page for registering a new teacher
function AddTeacherPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({}) // per-field validation messages
  const [submitted, setSubmitted] = useState(false) // has the user tried to submit yet
  const [submitError, setSubmitError] = useState('') // error from the API call
  const [saving, setSaving] = useState(false) // disables the button while saving

  // Update a single field. Once the user has attempted a submit, re-validate
  // on every keystroke so the error messages stay live as they fix them
  function updateField(field, value) {
    const next = { ...form, [field]: value }
    setForm(next)
    if (submitted) {
      setErrors(validateTeacher(next))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setSubmitError('')

    // Validate on the client first; bail out before calling the API if invalid
    const validationErrors = validateTeacher(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSaving(true)
    try {
      await createTeacher({
        name: form.name.trim(),
        subject: form.subject,
        email: form.email.trim(),
        contactNumber: form.contactNumber.trim(),
      })
      // On success, go back to the list where the new teacher will appear
      navigate('/teachers')
    } catch (err) {
      // Surface the backend's error message like if the email already exists
      setSubmitError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Add Teacher</h1>
      </div>

      <form className="card form" onSubmit={handleSubmit} noValidate>
        <div className="form__field">
          <label className="form__label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            className={`input ${errors.name ? 'input--error' : ''}`}
            placeholder="Name"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="subject">
            Subject
          </label>
          <select
            id="subject"
            className={`input select ${errors.subject ? 'input--error' : ''} ${
              form.subject ? '' : 'select--placeholder'
            }`}
            value={form.subject}
            onChange={(e) => updateField('subject', e.target.value)}
          >
            <option value="" disabled>
              Select a subject
            </option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {errors.subject && <p className="field-error">{errors.subject}</p>}
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className={`input ${errors.email ? 'input--error' : ''}`}
            placeholder="Email address"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="contactNumber">
            Work Contact Number
          </label>
          <input
            id="contactNumber"
            type="tel"
            className={`input ${errors.contactNumber ? 'input--error' : ''}`}
            placeholder="Work contact number"
            value={form.contactNumber}
            onChange={(e) => updateField('contactNumber', e.target.value)}
          />
          {errors.contactNumber && (
            <p className="field-error">{errors.contactNumber}</p>
          )}
        </div>

        {submitError && <p className="field-error form__submit-error">{submitError}</p>}
      </form>

      <div className="page__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => navigate('/teachers')}
        >
          <span className="btn__icon">←</span> Back
        </button>
        <button
          type="submit"
          className="btn btn--primary"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Adding…' : 'Add Teacher'}
        </button>
      </div>
    </div>
  )
}

export default AddTeacherPage
