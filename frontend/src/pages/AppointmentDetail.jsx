import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAppointmentById } from '../services/api'
import { useAppointments } from '../context/AppointmentContext'
import './AppointmentDetail.css'

const STATUS_STEPS = ['pending', 'confirmed', 'completed']

const badgeClass = {
  pending: 'badge-pending', confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled', completed: 'badge-completed',
}

export default function AppointmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { removeAppointment, updateStatus } = useAppointments()
  const [appt, setAppt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    getAppointmentById(id)
      .then(res => setAppt(res.data.data))
      .catch(() => setError('Appointment not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const formatCreated = (d) =>
    new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true)
    try {
      const res = await updateStatus(id, newStatus)
      setAppt(res.data)
      setStatusMsg(`Status updated to "${newStatus}" successfully.`)
      setTimeout(() => setStatusMsg(''), 3500)
    } catch {
      setStatusMsg('Failed to update status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleDelete = async () => {
    try {
      await removeAppointment(id)
      navigate('/appointments')
    } catch {
      setError('Failed to delete appointment.')
      setDeleteModal(false)
    }
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>
  if (error) return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="alert alert-error">⚠️ {error}</div>
      <button className="btn btn-outline" onClick={() => navigate('/appointments')}>← Back</button>
    </div>
  )

  const stepIdx = STATUS_STEPS.indexOf(appt.status)

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/appointments')}>← Back to Appointments</button>
          <h1>Appointment Details</h1>
          <p>View complete information for this appointment</p>
        </div>
      </div>

      <div className="container detail-container">

        {statusMsg && (
          <div className={`alert ${statusMsg.includes('Failed') ? 'alert-error' : 'alert-success'} fade-in`}>
            {statusMsg.includes('Failed') ? '⚠️' : '✅'} {statusMsg}
          </div>
        )}

        <div className="detail-layout">
          {/* Main info */}
          <div className="detail-main">
            <div className="card detail-card fade-in">
              <div className="detail-card-top">
                <div>
                  <h2 className="detail-patient">{appt.patientName}</h2>
                  <p className="detail-treatment">{appt.treatmentType}</p>
                </div>
                <span className={`badge ${badgeClass[appt.status]}`}>{appt.status}</span>
              </div>

              <div className="detail-info-grid">
                <div className="detail-info-item">
                  <span className="detail-info-label">📅 Date</span>
                  <span className="detail-info-val">{formatDate(appt.appointmentDate)}</span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-info-label">🕐 Time Slot</span>
                  <span className="detail-info-val">{appt.timeSlot}</span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-info-label">👨‍⚕️ Dentist</span>
                  <span className="detail-info-val">{appt.dentist}</span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-info-label">📧 Email</span>
                  <span className="detail-info-val">{appt.email}</span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-info-label">📞 Phone</span>
                  <span className="detail-info-val">{appt.phone}</span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-info-label">🗓️ Booked On</span>
                  <span className="detail-info-val">{formatCreated(appt.createdAt)}</span>
                </div>
              </div>

              {appt.notes && (
                <div className="detail-notes">
                  <p className="detail-info-label">📝 Notes</p>
                  <p className="notes-text">{appt.notes}</p>
                </div>
              )}

              <div className="detail-actions">
                <button className="btn btn-primary" onClick={() => navigate(`/appointments/${id}/edit`)}>
                  ✏️ Edit Appointment
                </button>
                <button className="btn btn-danger" onClick={() => setDeleteModal(true)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            {/* Status stepper */}
            {appt.status !== 'cancelled' && (
              <div className="card sidebar-section">
                <h3>Appointment Status</h3>
                <div className="status-stepper">
                  {STATUS_STEPS.map((s, i) => (
                    <div key={s} className={`step ${i <= stepIdx ? 'done' : ''} ${i === stepIdx ? 'current' : ''}`}>
                      <div className="step-circle">{i < stepIdx ? '✓' : i + 1}</div>
                      <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Update status */}
            <div className="card sidebar-section">
              <h3>Update Status</h3>
              <div className="status-btn-group">
                {['pending', 'confirmed', 'cancelled', 'completed'].map(s => (
                  <button
                    key={s}
                    className={`status-update-btn ${appt.status === s ? 'active' : ''}`}
                    onClick={() => handleStatusChange(s)}
                    disabled={appt.status === s || updatingStatus}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick info */}
            <div className="card sidebar-section">
              <h3>Quick Info</h3>
              <div className="quick-info">
                <div className="qi-row"><span>ID</span><code>{appt._id.slice(-8)}</code></div>
                <div className="qi-row"><span>Duration</span><span>2 Hours</span></div>
                <div className="qi-row"><span>Day</span><span>{new Date(appt.appointmentDate).toLocaleDateString('en-US',{weekday:'long'})}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>🗑️ Delete Appointment</h3>
            <p>Delete appointment for <strong>{appt.patientName}</strong>? This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setDeleteModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
