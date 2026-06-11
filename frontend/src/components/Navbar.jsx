import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🦷</span>
          <span className="brand-text">
            <span className="brand-main">SmileCare</span>
            <span className="brand-sub">Dental Clinic</span>
          </span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/appointments" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMenuOpen(false)}>
            Appointments
          </NavLink>
          <button className="btn btn-primary btn-sm" onClick={() => { navigate('/book'); setMenuOpen(false); }}>
            Book Now
          </button>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={menuOpen ? 'bar open' : 'bar'} />
          <span className={menuOpen ? 'bar open' : 'bar'} />
          <span className={menuOpen ? 'bar open' : 'bar'} />
        </button>
      </div>
    </nav>
  )
}
