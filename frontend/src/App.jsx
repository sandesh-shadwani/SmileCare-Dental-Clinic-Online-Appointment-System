import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import BookAppointment from './pages/BookAppointment'
import AppointmentsList from './pages/AppointmentsList'
import AppointmentDetail from './pages/AppointmentDetail'
import EditAppointment from './pages/EditAppointment'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route path="/appointments/:id" element={<AppointmentDetail />} />
          <Route path="/appointments/:id/edit" element={<EditAppointment />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
