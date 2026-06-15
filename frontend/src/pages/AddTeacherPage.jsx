import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTeacher } from '../api/teachers'
import { SUBJECTS } from '../constants/subjects'
import { validateTeacher } from '../utils/validation'

const EMPTY_FORM = {
  name: '',
  subject: '',
  email: '',
  contactNumber: '',
}

function AddTeacherPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)

  function updateField(field, value) {
    const next = { ...form, [field]: value }
    setForm(next)
    // Once the user has tried to submit, keep errors live as they type.
    if (submitted) {
      setErrors(validateTeacher(next))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setSubmitError('')

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
      navigate('/teachers')
    } catch (err) {
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
