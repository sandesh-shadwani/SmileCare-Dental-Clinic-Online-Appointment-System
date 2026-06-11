import { useNavigate } from 'react-router-dom'
import './Home.css'

const services = [
  { icon: '🦷', title: 'General Checkup', desc: 'Comprehensive oral health examination and assessment.' },
  { icon: '✨', title: 'Teeth Cleaning', desc: 'Professional cleaning to remove plaque and tartar buildup.' },
  { icon: '🔬', title: 'Cavity Filling', desc: 'Restore damaged teeth with safe, durable filling materials.' },
  { icon: '⚕️', title: 'Root Canal', desc: 'Pain-free treatment to save infected or damaged teeth.' },
  { icon: '😁', title: 'Teeth Whitening', desc: 'Brighten your smile with professional whitening treatments.' },
  { icon: '🦴', title: 'Orthodontics', desc: 'Consultation for braces and teeth alignment solutions.' },
]

const dentists = [
  { name: 'Dr. Sarah Ahmed', spec: 'General & Cosmetic Dentistry', exp: '12 years', emoji: '👩‍⚕️' },
  { name: 'Dr. Omar Khalid', spec: 'Orthodontics & Root Canal', exp: '9 years', emoji: '👨‍⚕️' },
  { name: 'Dr. Fatima Rizvi', spec: 'Pediatric & Preventive Care', exp: '7 years', emoji: '👩‍⚕️' },
]

const steps = [
  { num: '01', title: 'Choose a Date', desc: 'Pick any weekday (Mon–Fri) that suits your schedule.' },
  { num: '02', title: 'Select a Slot', desc: 'Choose from four 2-hour time slots between 9 AM and 5 PM.' },
  { num: '03', title: 'Pick a Dentist', desc: 'Select from our experienced dental professionals.' },
  { num: '04', title: 'Confirm Booking', desc: 'Fill in your details and confirm your appointment instantly.' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-shape" />
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">🦷 Trusted Dental Care</span>
            <h1 className="hero-title">
              Your Smile is Our
              <span className="hero-accent"> Priority</span>
            </h1>
            <p className="hero-desc">
              Book your appointment online in minutes. Choose your preferred dentist,
              date, and time slot — all from the comfort of your home.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/book')}>
                Book Appointment
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/appointments')}>
                View Appointments
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong>500+</strong><span>Happy Patients</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>3</strong><span>Expert Dentists</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>10+</strong><span>Years of Care</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-float card">
              <div className="float-icon">🗓️</div>
              <div>
                <p className="float-title">Next Available</p>
                <p className="float-value">Today, 11:00 AM</p>
              </div>
            </div>
            <div className="hero-illustration">
              <div className="illus-circle c1" />
              <div className="illus-circle c2" />
              <div className="illus-circle c3" />
              <span className="illus-tooth">🦷</span>
            </div>
            <div className="hero-card-float card card-bottom">
              <div className="float-icon">⭐</div>
              <div>
                <p className="float-title">Patient Rating</p>
                <p className="float-value">4.9 / 5.0</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Book your dental appointment in 4 simple steps</p>
          </div>
          <div className="steps-grid">
            {steps.map((s) => (
              <div className="step-card" key={s.num}>
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive dental care for your entire family</p>
          </div>
          <div className="services-grid">
            {services.map((s) => (
              <div className="service-card card" key={s.title}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dentists */}
      <section className="section bg-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Dentists</h2>
            <p>Experienced professionals dedicated to your dental health</p>
          </div>
          <div className="dentists-grid">
            {dentists.map((d) => (
              <div className="dentist-card card" key={d.name}>
                <div className="dentist-avatar">{d.emoji}</div>
                <h3>{d.name}</h3>
                <p className="dentist-spec">{d.spec}</p>
                <span className="dentist-exp">{d.exp} experience</span>
                <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem', width: '100%' }} onClick={() => navigate('/book')}>
                  Book with {d.name.split(' ')[1]}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Time slots info */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Available Time Slots</h2>
            <p>Monday to Friday — choose the slot that fits your day</p>
          </div>
          <div className="slots-grid">
            {['09:00 – 11:00', '11:00 – 13:00', '13:00 – 15:00', '15:00 – 17:00'].map((slot, i) => (
              <div className="slot-display" key={slot}>
                <span className="slot-period">{['Morning', 'Late Morning', 'Afternoon', 'Late Afternoon'][i]}</span>
                <span className="slot-time">{slot}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2>Ready for a Healthier Smile?</h2>
          <p>Book your appointment today — it only takes 2 minutes.</p>
          <button className="btn btn-accent btn-lg" onClick={() => navigate('/book')}>
            Book Your Appointment Now
          </button>
        </div>
      </section>
    </div>
  )
}
