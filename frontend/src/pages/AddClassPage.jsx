import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createClass } from '../api/classes'
import { getTeachers } from '../api/teachers'
import { CLASS_LEVELS } from '../constants/classLevels'
import { validateClass } from '../utils/validation'

// The form starts blank
// This shape also defines which fields the form tracks

const EMPTY_FORM = {
  level: '',
  name: '',
  teacherEmail: '',
}

// Page for creating a new class and assigning one of the existing teachers
// as its form teacher
function AddClassPage() {
  const navigate = useNavigate()

  // Form values and the state around validating them
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({}) // per-field validation messages
  const [submitted, setSubmitted] = useState(false) // has the user tried to submit yet
  const [submitError, setSubmitError] = useState('') // error from the API call
  const [saving, setSaving] = useState(false) // disables the button while saving

  // Teachers populate the "Form Teacher" dropdown.
  const [teachers, setTeachers] = useState([])
  const [teachersLoaded, setTeachersLoaded] = useState(false)

  // Load the list of teachers once when the page mounts
  useEffect(() => {
    // `active` guards against setting state after the component unmounts
    //  An example like if the user navigates away before the request finishes
    let active = true
    getTeachers()
      .then((data) => {
        if (!active) return
        setTeachers(data)
      })
      .catch(() => {
        // If teachers can't load, the picker simply shows the empty state.
      })
      .finally(() => {
        if (active) setTeachersLoaded(true)
      })
    return () => {
      active = false
    }
  }, [])

  const hasTeachers = teachers.length > 0

  // Update a single field. 
  // Once the user has attempted a submit, re-validate on every keystroke so the error messages stay live as they fix them.

  function updateField(field, value) {
    const next = { ...form, [field]: value }
    setForm(next)
    if (submitted) {
      setErrors(validateClass(next))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setSubmitError('')

    // Validate on the client first; bail out before calling the API if invalid.
    const validationErrors = validateClass(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSaving(true)
    try {
      await createClass({
        level: form.level,
        name: form.name.trim(),
        teacherEmail: form.teacherEmail,
      })
      // On success, go back to the list where the new class will appear.
      navigate('/classes')
    } catch (err) {
      // Surface the backend's error message (e.g. teacher already assigned).
      setSubmitError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Add Class</h1>
      </div>

      <form className="card form" onSubmit={handleSubmit} noValidate>
        <div className="form__field">
          <label className="form__label" htmlFor="level">
            Class Level
          </label>
          <select
            id="level"
            className={`input select ${errors.level ? 'input--error' : ''} ${
              form.level ? '' : 'select--placeholder'
            }`}
            value={form.level}
            onChange={(e) => updateField('level', e.target.value)}
          >
            <option value="" disabled>
              Select a level
            </option>
            {CLASS_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.level && <p className="field-error">{errors.level}</p>}
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="name">
            Class Name
          </label>
          <input
            id="name"
            type="text"
            className={`input ${errors.name ? 'input--error' : ''}`}
            placeholder="Class Name"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        {/* Form Teacher picker. A class needs a teacher to exist first, so the
            dropdown is disabled when there are none, and a shortcut is offered to
            go create one. */}

        <div className="form__field">
          <label className="form__label" htmlFor="teacherEmail">
            Form Teacher
          </label>
          <select
            id="teacherEmail"
            className={`input select ${errors.teacherEmail ? 'input--error' : ''} ${
              form.teacherEmail ? '' : 'select--placeholder'
            }`}
            value={form.teacherEmail}
            onChange={(e) => updateField('teacherEmail', e.target.value)}
            disabled={!hasTeachers}
          >
            <option value="" disabled>
              {hasTeachers ? 'Assign a form teacher' : 'No existing teachers'}
            </option>
            {teachers.map((teacher) => (
              <option key={teacher.email} value={teacher.email}>
                {teacher.name}
              </option>
            ))}
          </select>
          {/* Only show the shortcut once the fetch has finished and found none,
              so it doesn't flash while teachers are still loading. */}
          {teachersLoaded && !hasTeachers && (
            <Link to="/teachers/new" className="field-link">
              Add a teacher
            </Link>
          )}
          {errors.teacherEmail && (
            <p className="field-error">{errors.teacherEmail}</p>
          )}
        </div>

        {submitError && (
          <p className="field-error form__submit-error">{submitError}</p>
        )}
      </form>

      <div className="page__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => navigate('/classes')}
        >
          <span className="btn__icon">←</span> Back
        </button>
        <button
          type="submit"
          className="btn btn--primary"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Adding…' : 'Add Class'}
        </button>
      </div>
    </div>
  )
}

export default AddClassPage
