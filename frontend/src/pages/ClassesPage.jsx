import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getClasses } from '../api/classes'

// Small reusable button that links to the "Add Class" form. Used in both the
// header (when classes exist) and the empty state.
function AddClassButton({ className }) {
  return (
    <Link to="/classes/new" className={`btn btn--primary ${className ?? ''}`}>
      <span className="btn__icon">+</span> Add Class
    </Link>
  )
}

// Page that lists all classes. Rendering is driven by a single `status` value
// so the screen always shows exactly one of: loading, error, empty, or the table.
function ClassesPage() {
  const [classes, setClasses] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')

  // Fetch the classes once when the page mounts.
  useEffect(() => {
    // `active` prevents state updates if the user navigates away before the
    // request resolves (avoids a React "set state on unmounted component" warning).
    let active = true

    getClasses()
      .then((data) => {
        if (!active) return
        setClasses(data)
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

  const isEmpty = classes.length === 0

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Classes</h1>
        {/* The header "Add" button only appears once there are classes to show;
            In the empty state the button lives inside the empty card instead. */}
        {status === 'ready' && !isEmpty && <AddClassButton />}
      </div>

      {/* The four blocks below are mutually exclusive — `status` (plus isEmpty)
          guarantees only one renders at a time. */}

      {status === 'loading' && (
        <div className="card card--centered">
          <p className="muted">Loading classes…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="card card--centered">
          <p className="error-text">Could not load classes: {error}</p>
        </div>
      )}

      {status === 'ready' && isEmpty && (
        <div className="card card--centered empty-state">
          <p className="empty-state__text">There are no existing classes yet.</p>
          <AddClassButton />
        </div>
      )}

      {status === 'ready' && !isEmpty && (
        <div className="card card--table">
          <table className="table">
            <thead>
              <tr>
                <th className="table__index">#</th>
                <th>Class Level</th>
                <th>Class Name</th>
                <th>Form Teacher</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, index) => (
                // level + name uniquely identifies a class row the API does not expose an id
                //  `index + 1` is just the display number
                <tr key={`${cls.level}-${cls.name}`}>
                  <td className="table__index">{index + 1}</td>
                  <td>{cls.level}</td>
                  <td>{cls.name}</td>
                  {/* formTeacher is a nested object which is guarded in case it's missing */}
                  <td>{cls.formTeacher?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ClassesPage
