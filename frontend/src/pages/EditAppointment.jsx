import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAppointmentById } from '../services/api'
import { useAppointments } from '../context/AppointmentContext'
import { getAvailableSlots } from '../services/api'

const DENTISTS = ['Dr. Sarah Ahmed', 'Dr. Omar Khalid', 'Dr. Fatima Rizvi']
const TREATMENTS = [
  'General Checkup', 'Teeth Cleaning', 'Cavity Filling',
  'Root Canal', 'Tooth Extraction', 'Orthodontics Consultation',
  'Teeth Whitening', 'Dental X-Ray', 'Other',
]
const ALL_SLOTS = ['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00']
const SLOT_LABELS = {
  '09:00 - 11:00': 'Morning', '11:00 - 13:00': 'Late Morning',
  '13:00 - 15:00': 'Afternoon', '15:00 - 17:00': 'Late Afternoon',
}
const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed']

export default function EditAppointment() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { editAppointment } = useAppointments()

  const [form, setForm] = useState(null)
  const [originalSlot, setOriginalSlot] = useState('')
  const [errors, setErrors] = useState({})
  const [availableSlots, setAvailableSlots] = useState(ALL_SLOTS)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    getAppointmentById(id)
      .then(res => {
        const a = res.data.data
        const dateStr = new Date(a.appointmentDate).toISOString().split('T')[0]
        setForm({
          patientName: a.patientName, email: a.email, phone: a.phone,
          appointmentDate: dateStr, timeSlot: a.timeSlot,
          dentist: a.dentist, treatmentType: a.treatmentType,
          notes: a.notes || '', status: a.status,
        })
        setOriginalSlot(a.timeSlot)
      })
      .catch(() => setFetchError('Could not load appointment.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!form || !form.appointmentDate || !form.dentist) return
    setSlotsLoading(true)
    getAvailableSlots(form.appointmentDate, form.dentist)
      .then(res => {
        const avail = res.data.data.availableSlots
        // Always include the original slot as available (it's this appointment's slot)
        const merged = [...new Set([...avail, originalSlot])]
        setAvailableSlots(merged)
      })
      .catch(() => setAvailableSlots(ALL_SLOTS))
      .finally(() => setSlotsLoading(false))
  }, [form?.appointmentDate, form?.dentist, originalSlot])

  const isWeekend = (d) => { const day = new Date(d).getUTCDay(); return day === 0 || day === 6 }

  const validate = () => {
    const e = {}
    if (!form.patientName.trim()) e.patientName = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    if (!form.appointmentDate) e.appointmentDate = 'Date is required'
    else if (isWeekend(form.appointmentDate)) e.appointmentDate = 'Only weekdays allowed'
    if (!form.dentist) e.dentist = 'Select a dentist'
    if (!form.timeSlot) e.timeSlot = 'Select a time slot'
    if (!form.treatmentType) e.treatmentType = 'Select treatment type'
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
    try {
      await editAppointment(id, form)
      setSuccess(true)
    } catch (err) {
      setServerError(err.response?.data?.message || 'Update failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>
  if (fetchError) return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="alert alert-error">{fetchError}</div>
      <button className="btn btn-outline" onClick={() => navigate('/appointments')}>← Back</button>
    </div>
  )

  if (success) {
    return (
      <div>
        <div className="page-header">
          <div className="container"><h1>Edit Appointment</h1></div>
        </div>
        <div className="container" style={{ maxWidth: 520, paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div className="card fade-in" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--success)', marginBottom: '0.75rem' }}>
              Appointment Updated!
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              The appointment details have been saved successfully.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => navigate(`/appointments/${id}`)}>View Details</button>
              <button className="btn btn-outline" onClick={() => navigate('/appointments')}>All Appointments</button>
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
          <button className="back-btn" onClick={() => navigate(`/appointments/${id}`)}>← Back to Details</button>
          <h1>Edit Appointment</h1>
          <p>Update appointment information</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 720, paddingBottom: '4rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
            Update Information
          </h2>

          {serverError && <div className="alert alert-error">⚠️ {serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name <span>*</span></label>
                <input className={`form-control ${errors.patientName ? 'error' : ''}`} name="patientName" value={form.patientName} onChange={handleChange} />
                {errors.patientName && <p className="form-error">{errors.patientName}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone <span>*</span></label>
                <input className={`form-control ${errors.phone ? 'error' : ''}`} name="phone" value={form.phone} onChange={handleChange} />
                {errors.phone && <p className="form-error">{errors.phone}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email <span>*</span></label>
              <input className={`form-control ${errors.email ? 'error' : ''}`} name="email" type="email" value={form.email} onChange={handleChange} />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Treatment Type <span>*</span></label>
              <select className={`form-control ${errors.treatmentType ? 'error' : ''}`} name="treatmentType" value={form.treatmentType} onChange={handleChange}>
                {TREATMENTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.treatmentType && <p className="form-error">{errors.treatmentType}</p>}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Date <span>*</span></label>
                <input className={`form-control ${errors.appointmentDate ? 'error' : ''}`} name="appointmentDate" type="date" value={form.appointmentDate} onChange={handleChange} />
                {errors.appointmentDate && <p className="form-error">{errors.appointmentDate}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Dentist <span>*</span></label>
                <select className={`form-control ${errors.dentist ? 'error' : ''}`} name="dentist" value={form.dentist} onChange={handleChange}>
                  {DENTISTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.dentist && <p className="form-error">{errors.dentist}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Time Slot <span>*</span></label>
              {slotsLoading ? (
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Checking availability...</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem' }}>
                  {ALL_SLOTS.map(slot => {
                    const available = availableSlots.includes(slot)
                    return (
                      <button
                        key={slot} type="button"
                        className={`slot-btn ${form.timeSlot === slot ? 'selected' : ''} ${!available ? 'unavailable' : ''}`}
                        onClick={() => available && setForm(f => ({ ...f, timeSlot: slot }))}
                        disabled={!available}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                          padding: '0.9rem 1rem', borderRadius: 'var(--radius-sm)',
                          border: `2px solid ${form.timeSlot === slot ? 'var(--primary)' : 'var(--border)'}`,
                          background: form.timeSlot === slot ? 'rgba(10,110,110,0.06)' : (available ? 'white' : 'var(--bg-section)'),
                          cursor: available ? 'pointer' : 'not-allowed', opacity: available ? 1 : 0.5,
                        }}
                      >
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{SLOT_LABELS[slot]}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', margin: '0.15rem 0' }}>{slot}</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 500, color: available ? 'var(--success)' : 'var(--error)' }}>
                          {slot === originalSlot ? '✓ Current Slot' : available ? '✓ Available' : '✗ Booked'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
              {errors.timeSlot && <p className="form-error">{errors.timeSlot}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} rows={3} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
              <button type="button" className="btn btn-outline" onClick={() => navigate(`/appointments/${id}`)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                {submitting ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
