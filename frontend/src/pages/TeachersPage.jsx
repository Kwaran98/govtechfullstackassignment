import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTeachers } from '../api/teachers'

// Small reusable button that links to the "Add Teacher" form. Used in both the
// header when teachers exist and the empty state.
function AddTeacherButton({ className }) {
  return (
    <Link to="/teachers/new" className={`btn btn--primary ${className ?? ''}`}>
      <span className="btn__icon">+</span> Add Teacher
    </Link>
  )
}

// Page that lists all teachers. Rendering is driven by a single `status` value
// so the screen always shows exactly one of the status: loading, error, empty, or the table.

function TeachersPage() {
  const [teachers, setTeachers] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')

  // Fetch the teachers once when the page mounts.
  useEffect(() => {
    // `active` prevents state updates if the user navigates away before the request resolves 
    let active = true

    getTeachers()
      .then((data) => {
        if (!active) return
        setTeachers(data)
        setStatus('ready')
      })
      .catch((err) => {
        if (!active) return
        setError(err.message)
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  const isEmpty = teachers.length === 0

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Teachers</h1>
        {/* The header "Add" button only appears once there are teachers to show;
            in the empty state the button lives inside the empty card instead. */}
        {status === 'ready' && !isEmpty && <AddTeacherButton />}
      </div>

      {/* The four blocks below are mutually exclusive `status` 
          guarantees only one renders at a time. */}

      {status === 'loading' && (
        <div className="card card--centered">
          <p className="muted">Loading teachers…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="card card--centered">
          <p className="error-text">Could not load teachers: {error}</p>
        </div>
      )}

      {status === 'ready' && isEmpty && (
        <div className="card card--centered empty-state">
          <p className="empty-state__text">There are no existing teachers yet.</p>
          <AddTeacherButton />
        </div>
      )}

      {status === 'ready' && !isEmpty && (
        <div className="card card--table">
          <table className="table">
            <thead>
              <tr>
                <th className="table__index">#</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Email</th>
                <th>Work Contact</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                // email is unique per teacher, so it's a stable row key
                // The API does not expose an id
                // `index + 1` is the display number.
                <tr key={teacher.email}>
                  <td className="table__index">{index + 1}</td>
                  <td>{teacher.name}</td>
                  <td>{teacher.subject}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.contactNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TeachersPage
