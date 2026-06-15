import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getClasses } from '../api/classes'

function AddClassButton({ className }) {
  return (
    <Link to="/classes/new" className={`btn btn--primary ${className ?? ''}`}>
      <span className="btn__icon">+</span> Add Class
    </Link>
  )
}

function ClassesPage() {
  const [classes, setClasses] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')

  useEffect(() => {
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
        {status === 'ready' && !isEmpty && <AddClassButton />}
      </div>

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
                <tr key={`${cls.level}-${cls.name}`}>
                  <td className="table__index">{index + 1}</td>
                  <td>{cls.level}</td>
                  <td>{cls.name}</td>
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
