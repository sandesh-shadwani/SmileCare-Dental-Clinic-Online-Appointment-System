import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span>🦷</span>
          <span className="footer-name">SmileCare Dental Clinic</span>
        </div>
        <div className="footer-info">
          <span>📍 123 Dental Ave, Karachi</span>
          <span>📞 (021) 111-SMILE</span>
          <span>🕐 Mon–Fri: 9:00 AM – 5:00 PM</span>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} SmileCare Dental Clinic. All rights reserved.</p>
      </div>
    </footer>
  )
}
