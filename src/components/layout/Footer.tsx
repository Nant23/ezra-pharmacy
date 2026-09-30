import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Globe, Share2, MessageCircleHeart, Link2 } from 'lucide-react';
import ezraLogo from '../../assets/ezra-logo.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand-logo">
              <img src={ezraLogo} alt="Ezra Pharmacy" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
            </div>
            <p className="footer-desc">
              Your trusted healthcare partner in Nepal. We provide quality medicines, 
              expert pharmacist guidance, and reliable home delivery — because your 
              health is our priority.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook"><Globe size={15} /></a>
              <a href="#" className="social-link" aria-label="Instagram"><MessageCircleHeart size={15} /></a>
              <a href="#" className="social-link" aria-label="Twitter"><Share2 size={15} /></a>
              <a href="#" className="social-link" aria-label="YouTube"><Link2 size={15} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/medicines" className="footer-link">All Medicines</Link></li>
              <li><Link to="/categories" className="footer-link">Categories</Link></li>
              <li><Link to="/articles" className="footer-link">Health Tips</Link></li>
              <li><Link to="/prescription" className="footer-link">Upload Prescription</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li><Link to="/medicines" className="footer-link">Home Delivery</Link></li>
              <li><Link to="/prescription" className="footer-link">Prescription Upload</Link></li>
              <li><Link to="/contact" className="footer-link">Health Consultation</Link></li>
              <li><Link to="/medicines?cat=Diabetes Care" className="footer-link">Diabetes Support</Link></li>
              <li><Link to="/medicines?cat=First Aid" className="footer-link">First Aid Supplies</Link></li>
              <li><Link to="/contact" className="footer-link">Medicine Reminders</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href="https://www.google.com/maps?q=27.7469722,85.3561389"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Ezra Pharmacy in Golphutar on Google Maps"
                className="footer-link"
                style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', textDecoration: 'none' }}
              >
                <MapPin size={15} style={{ flexShrink: 0, marginTop: 2, color: 'var(--blue-500)' }} />
                Golphutar, Budhanilkantha-08<br />Budhanilkantha Municipality, Kathmandu 44622, Nepal
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--gray-400)' }}>
                <Phone size={15} style={{ color: 'var(--blue-500)' }} />
                <a href="tel:+9779843116918" className="footer-link">9843116918</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--gray-400)' }}>
                <Mail size={15} style={{ color: 'var(--blue-500)' }} />
                <a href="mailto:ezrameds@gmail.com" className="footer-link">ezrameds@gmail.com</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: 'var(--gray-400)' }}>
                <Clock size={15} style={{ flexShrink: 0, marginTop: 2, color: 'var(--blue-500)' }} />
                <span>Sun–Fri: 7:00 AM – 9:00 PM<br />Sat: 8:00 AM – 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p style={{ color: 'var(--gray-500)' }}>
            © {new Date().getFullYear()} Ezra Pharmacy. All rights reserved. Registered with Department of Drug Administration, Nepal.
          </p>
          <div className="footer-badges">
            <span className="footer-badge">🔒 SSL Secured</span>
            <span className="footer-badge">✅ DDA Registered</span>
            <span className="footer-badge">🇳🇵 Made in Nepal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
