import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <svg
            className="navbar__logo"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="currentColor"
          >
            <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
          </svg>
          <span className="navbar__title">School Portal</span>
        </div>

        <nav className="navbar__links">
          <NavLink
            to="/classes"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            Classes
          </NavLink>
          <NavLink
            to="/teachers"
            className={({ isActive }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
          >
            Teachers
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
