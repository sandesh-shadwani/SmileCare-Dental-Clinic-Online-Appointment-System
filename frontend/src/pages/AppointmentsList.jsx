import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppointments } from '../context/AppointmentContext'
import AppointmentCard from '../components/AppointmentCard'
import './AppointmentsList.css'

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'cancelled', 'completed']
const DENTISTS = ['all', 'Dr. Sarah Ahmed', 'Dr. Omar Khalid', 'Dr. Fatima Rizvi']

export default function AppointmentsList() {
  const navigate = useNavigate()
  const { appointments, loading, error, fetchAppointments, removeAppointment } = useAppointments()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dentistFilter, setDentistFilter] = useState('all')
  const [deleteModal, setDeleteModal] = useState(null) // { id, name }
  const [deleteMsg, setDeleteMsg] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const handleDelete = (id, name) => setDeleteModal({ id, name })

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await removeAppointment(deleteModal.id)
      setDeleteMsg(`Appointment for ${deleteModal.name} deleted successfully.`)
      setDeleteModal(null)
      fetchAppointments()
    } catch {
      setDeleteMsg('Failed to delete appointment.')
    } finally {
      setDeleting(false)
      setTimeout(() => setDeleteMsg(''), 4000)
    }
  }

  const filtered = appointments.filter(a => {
    const matchSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.treatmentType.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    const matchDentist = dentistFilter === 'all' || a.dentist === dentistFilter
    return matchSearch && matchStatus && matchDentist
  })

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>All Appointments</h1>
          <p>Manage and track all dental appointments</p>
        </div>
      </div>

      <div className="container list-container">

        {deleteMsg && (
          <div className={`alert ${deleteMsg.includes('Failed') ? 'alert-error' : 'alert-success'} fade-in`}>
            {deleteMsg.includes('Failed') ? '⚠️' : '✅'} {deleteMsg}
          </div>
        )}

        {/* Status tabs */}
        <div className="status-tabs">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              className={`status-tab ${statusFilter === s ? 'active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="tab-count">{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>

        {/* Filters + actions */}
        <div className="list-toolbar">
          <div className="toolbar-left">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search by name, email, treatment..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>
            <select className="filter-select form-control" value={dentistFilter} onChange={e => setDentistFilter(e.target.value)}>
              {DENTISTS.map(d => (
                <option key={d} value={d}>{d === 'all' ? 'All Dentists' : d}</option>
              ))}
            </select>
          </div>
          <div className="toolbar-right">
            <span className="result-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            <button className="btn btn-primary" onClick={() => navigate('/book')}>
              + Book Appointment
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">⚠️ {error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🗓️</div>
            <h3>{search || statusFilter !== 'all' ? 'No matching appointments' : 'No appointments yet'}</h3>
            <p>{search || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Book your first appointment and it will appear here.'}</p>
            {!search && statusFilter === 'all' && (
              <button className="btn btn-primary" onClick={() => navigate('/book')}>Book Now</button>
            )}
          </div>
        ) : (
          <div className="appt-grid">
            {filtered.map(a => (
              <AppointmentCard key={a._id} appointment={a} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>🗑️ Delete Appointment</h3>
            <p>Are you sure you want to delete the appointment for <strong>{deleteModal.name}</strong>? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
