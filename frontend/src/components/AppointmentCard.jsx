import { useNavigate } from 'react-router-dom'
import './AppointmentCard.css'

const statusColors = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
  completed: 'badge-completed',
}

export default function AppointmentCard({ appointment, onDelete }) {
  const navigate = useNavigate()

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="appt-card card fade-in">
      <div className="appt-card-top">
        <div>
          <h3 className="appt-name">{appointment.patientName}</h3>
          <p className="appt-treatment">{appointment.treatmentType}</p>
        </div>
        <span className={`badge ${statusColors[appointment.status]}`}>{appointment.status}</span>
      </div>

      <div className="appt-meta">
        <div className="meta-item">
          <span className="meta-icon">📅</span>
          <span>{formatDate(appointment.appointmentDate)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-icon">🕐</span>
          <span>{appointment.timeSlot}</span>
        </div>
        <div className="meta-item">
          <span className="meta-icon">👨‍⚕️</span>
          <span>{appointment.dentist}</span>
        </div>
        <div className="meta-item">
          <span className="meta-icon">📧</span>
          <span>{appointment.email}</span>
        </div>
      </div>

      <div className="appt-actions">
        <button className="btn btn-outline btn-sm" onClick={() => navigate(`/appointments/${appointment._id}`)}>
          View Details
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => navigate(`/appointments/${appointment._id}/edit`)}>
          Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(appointment._id, appointment.patientName)}>
          Delete
        </button>
      </div>
    </div>
  )
}
