import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppointments } from '../context/AppointmentContext'
import { getAvailableSlots } from '../services/api'
import './BookAppointment.css'

const DENTISTS = ['Dr. Sarah Ahmed', 'Dr. Omar Khalid', 'Dr. Fatima Rizvi']
const TREATMENTS = [
  'General Checkup', 'Teeth Cleaning', 'Cavity Filling',
  'Root Canal', 'Tooth Extraction', 'Orthodontics Consultation',
  'Teeth Whitening', 'Dental X-Ray', 'Other',
]
const ALL_SLOTS = ['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00']
const SLOT_LABELS = { '09:00 - 11:00': 'Morning', '11:00 - 13:00': 'Late Morning', '13:00 - 15:00': 'Afternoon', '15:00 - 17:00': 'Late Afternoon' }

const getTodayMin = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}

const initialForm = {
  patientName: '', email: '', phone: '',
  appointmentDate: '', timeSlot: '', dentist: '',
  treatmentType: '', notes: '',
}

export default function BookAppointment() {
  const navigate = useNavigate()
  const { addAppointment } = useAppointments()

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [availableSlots, setAvailableSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  // Fetch available slots when date + dentist change
  useEffect(() => {
    if (form.appointmentDate && form.dentist) {
      setSlotsLoading(true)
      setAvailableSlots([])
      setForm(f => ({ ...f, timeSlot: '' }))
      getAvailableSlots(form.appointmentDate, form.dentist)
        .then(res => setAvailableSlots(res.data.data.availableSlots))
        .catch(() => setAvailableSlots([]))
        .finally(() => setSlotsLoading(false))
    }
  }, [form.appointmentDate, form.dentist])

  const isWeekend = (dateStr) => {
    const day = new Date(dateStr).getUTCDay()
    return day === 0 || day === 6
  }

  const validate = () => {
    const e = {}
    if (!form.patientName.trim()) e.patientName = 'Full name is required'
    else if (form.patientName.trim().length < 2) e.patientName = 'Name must be at least 2 characters'

    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address'

    if (!form.phone.trim()) e.phone = 'Phone number is required'
    else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone)) e.phone = 'Enter a valid phone number'

    if (!form.appointmentDate) e.appointmentDate = 'Please select a date'
    else if (isWeekend(form.appointmentDate)) e.appointmentDate = 'We are only open Monday to Friday'

    if (!form.dentist) e.dentist = 'Please select a dentist'
    if (!form.timeSlot) e.timeSlot = 'Please select a time slot'
    if (!form.treatmentType) e.treatmentType = 'Please select a treatment type'

    if (form.notes && form.notes.length > 500) e.notes = 'Notes cannot exceed 500 characters'

    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    setServerError('')
    try {
      await addAppointment(form)
      setSuccess(true)
      setForm(initialForm)
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div>
        <div className="page-header">
          <div className="container">
            <h1>Book an Appointment</h1>
            <p>Schedule your visit with one of our expert dentists</p>
          </div>
        </div>
        <div className="container" style={{ maxWidth: 520, paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div className="success-screen card fade-in">
            <div className="success-icon">🎉</div>
            <h2>Appointment Booked!</h2>
            <p>Your appointment has been successfully scheduled. We'll see you soon!</p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/appointments')}>View All Appointments</button>
              <button className="btn btn-outline" onClick={() => setSuccess(false)}>Book Another</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Book an Appointment</h1>
          <p>Fill in the form below to schedule your dental visit</p>
        </div>
      </div>

      <div className="container book-container">
        <div className="book-layout">
          {/* Sidebar info */}
          <aside className="book-sidebar">
            <div className="card sidebar-card">
              <h3>📋 Booking Info</h3>
              <ul className="sidebar-list">
                <li>📅 Available Monday – Friday</li>
                <li>🕐 4 time slots per day</li>
                <li>⏱️ Each slot is 2 hours long</li>
                <li>👨‍⚕️ 3 dentists to choose from</li>
                <li>✅ Instant confirmation</li>
              </ul>
            </div>
            <div className="card sidebar-card slots-info">
              <h3>🕐 Time Slots</h3>
              {ALL_SLOTS.map(s => (
                <div className="sidebar-slot" key={s}>
                  <span>{SLOT_LABELS[s]}</span>
                  <strong>{s}</strong>
                </div>
              ))}
            </div>
          </aside>

          {/* Form */}
          <div className="book-form-wrap card">
            <h2 className="form-title">Patient Information</h2>

            {serverError && (
              <div className="alert alert-error">
                <span>⚠️</span> {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name <span>*</span></label>
                  <input
                    className={`form-control ${errors.patientName ? 'error' : ''}`}
                    name="patientName" value={form.patientName}
                    onChange={handleChange} placeholder="e.g. Ali Hassan"
                  />
                  {errors.patientName && <p className="form-error">{errors.patientName}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number <span>*</span></label>
                  <input
                    className={`form-control ${errors.phone ? 'error' : ''}`}
                    name="phone" value={form.phone}
                    onChange={handleChange} placeholder="e.g. 0300-1234567"
                  />
                  {errors.phone && <p className="form-error">{errors.phone}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address <span>*</span></label>
                <input
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  name="email" type="email" value={form.email}
                  onChange={handleChange} placeholder="e.g. ali@example.com"
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Treatment Type <span>*</span></label>
                <select
                  className={`form-control ${errors.treatmentType ? 'error' : ''}`}
                  name="treatmentType" value={form.treatmentType} onChange={handleChange}
                >
                  <option value="">Select treatment...</option>
                  {TREATMENTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.treatmentType && <p className="form-error">{errors.treatmentType}</p>}
              </div>

              <div className="form-section-title">📅 Schedule</div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Appointment Date <span>*</span></label>
                  <input
                    className={`form-control ${errors.appointmentDate ? 'error' : ''}`}
                    name="appointmentDate" type="date" value={form.appointmentDate}
                    min={getTodayMin()} onChange={handleChange}
                  />
                  {errors.appointmentDate && <p className="form-error">{errors.appointmentDate}</p>}
                  {form.appointmentDate && isWeekend(form.appointmentDate) && (
                    <p className="form-error">Weekend selected — please pick a weekday</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Select Dentist <span>*</span></label>
                  <select
                    className={`form-control ${errors.dentist ? 'error' : ''}`}
                    name="dentist" value={form.dentist} onChange={handleChange}
                  >
                    <option value="">Choose dentist...</option>
                    {DENTISTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.dentist && <p className="form-error">{errors.dentist}</p>}
                </div>
              </div>

              {/* Time slot picker */}
              <div className="form-group">
                <label className="form-label">Time Slot <span>*</span></label>
                {!form.appointmentDate || !form.dentist ? (
                  <p className="slot-hint">Select a date and dentist to see available slots.</p>
                ) : slotsLoading ? (
                  <p className="slot-hint">Checking availability...</p>
                ) : (
                  <div className="slot-picker">
                    {ALL_SLOTS.map(slot => {
                      const available = availableSlots.includes(slot)
                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`slot-btn ${form.timeSlot === slot ? 'selected' : ''} ${!available ? 'unavailable' : ''}`}
                          onClick={() => available && setForm(f => ({ ...f, timeSlot: slot }))}
                          disabled={!available}
                        >
                          <span className="slot-label">{SLOT_LABELS[slot]}</span>
                          <span className="slot-time-text">{slot}</span>
                          <span className={`slot-status ${available ? 'avail' : 'booked'}`}>
                            {available ? '✓ Available' : '✗ Booked'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
                {errors.timeSlot && <p className="form-error">{errors.timeSlot}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Additional Notes</label>
                <textarea
                  className={`form-control ${errors.notes ? 'error' : ''}`}
                  name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Any specific concerns or information for the dentist..."
                  rows={3}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                  {form.notes.length}/500
                </p>
                {errors.notes && <p className="form-error">{errors.notes}</p>}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                  {submitting ? 'Booking...' : '✓ Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
