import { Link } from 'react-router-dom';
import { Award, Target, Eye, Heart, ShieldCheck, Users } from 'lucide-react';

const team = [
  { name: 'Dr. Sunita Karki', role: 'Chief Pharmacist', emoji: '👩‍⚕️', exp: '12 years experience', deg: 'PharmD, TU' },
  { name: 'Dr. Rohan Thapa', role: 'Clinical Pharmacist', emoji: '👨‍⚕️', exp: '8 years experience', deg: 'B.Pharm, PAHS' },
  { name: 'Anjali Shrestha', role: 'Pharmacy Manager', emoji: '👩‍💼', exp: '10 years experience', deg: 'MBA, Healthcare Management' },
  { name: 'Bikash Rai', role: 'Inventory Specialist', emoji: '👨‍💼', exp: '6 years experience', deg: 'B.Pharm, KU' },
];

const certifications = [
  { icon: '🏛️', title: 'DDA Registered', desc: 'Registered with the Department of Drug Administration, Government of Nepal' },
  { icon: '✅', title: 'Genuine Medicines', desc: 'All medicines sourced directly from licensed manufacturers and distributors' },
  { icon: '🔒', title: 'Data Protection', desc: 'Your personal and health data protected with enterprise-grade encryption' },
  { icon: '📋', title: 'Licensed Pharmacists', desc: 'All prescriptions reviewed by Nepal Pharmacy Council registered pharmacists' },
];

const values = [
  { icon: <Heart size={22} />, title: 'Patient First', desc: 'Every decision we make starts with what\'s best for the patient and their health.' },
  { icon: <ShieldCheck size={22} />, title: 'Integrity', desc: 'We stock only genuine, verified medicines and maintain complete transparency.' },
  { icon: <Users size={22} />, title: 'Accessibility', desc: 'Quality healthcare should be accessible to everyone, everywhere in Nepal.' },
  { icon: <Award size={22} />, title: 'Excellence', desc: 'We continuously strive to improve our services and healthcare outcomes.' },
];

export default function About() {
  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--green-600) 0%, var(--green-700) 100%)', color: 'white', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>⚕️</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '16px' }}>
            About Ezra Pharmacy
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            Nepal's trusted online pharmacy committed to making quality healthcare accessible to everyone, anytime, anywhere.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '16px' }}>Our Story</div>
              <h2 className="heading-lg" style={{ marginBottom: '20px' }}>
                Founded on a Mission to Improve Healthcare in Nepal
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
                Ezra Pharmacy was established in 2020 with a simple but powerful vision: to make access to quality medicines and healthcare products as easy as ordering food online. We recognized that many Nepali families struggled to find genuine medicines quickly and affordably.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '28px' }}>
                Starting from a small warehouse in Lazimpat, Kathmandu, we've grown into one of Nepal's most trusted online pharmacies, serving over 50,000 customers across the valley with a catalog of 10,000+ products.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {[
                  { value: '50,000+', label: 'Happy Customers' },
                  { value: '10,000+', label: 'Products Available' },
                  { value: '4.9 ★', label: 'Customer Rating' },
                  { value: '2-4 Hrs', label: 'Avg. Delivery Time' },
                ].map(stat => (
                  <div key={stat.label} style={{ padding: '16px', background: 'var(--green-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--green-100)' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&h=500&fit=crop"
                alt="Ezra Pharmacy team"
                style={{ width: '100%', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-xl)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Purpose & Direction</div>
            <h2 className="heading-lg">Our Mission & Vision</h2>
          </div>
          <div className="grid-2">
            <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: '40px', border: '1px solid var(--border)', borderTop: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: 48, height: 48, background: 'var(--green-100)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Target size={24} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700 }}>Our Mission</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
                To provide every Nepali household with fast, affordable access to genuine medicines and health products — backed by expert pharmacist support and delivered with care to your doorstep.
              </p>
            </div>
            <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: '40px', border: '1px solid var(--border)', borderTop: '4px solid var(--blue-500)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: 48, height: 48, background: 'var(--blue-100)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue-500)' }}>
                  <Eye size={24} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700 }}>Our Vision</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
                To become the most trusted healthcare platform in South Asia — a place where technology meets compassion to transform how people access and manage their health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">What We Stand For</div>
            <h2 className="heading-lg">Our Core Values</h2>
          </div>
          <div className="grid-4">
            {values.map((v, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: 'var(--green-50)', color: 'var(--primary)' }}>
                  {v.icon}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '10px', fontSize: '1rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Our Experts</div>
            <h2 className="heading-lg">Meet Our Pharmacist Team</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
              All our pharmacists are registered with the Nepal Pharmacy Council
            </p>
          </div>
          <div className="grid-4">
            {team.map((member, i) => (
              <div key={i} className="team-card">
                <div className="team-avatar">{member.emoji}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{member.name}</h3>
                <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>{member.role}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '4px' }}>{member.exp}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', padding: '2px 8px', display: 'inline-block' }}>{member.deg}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Trust & Safety</div>
            <h2 className="heading-lg">Our Certifications & Standards</h2>
          </div>
          <div className="grid-4">
            {certifications.map((cert, i) => (
              <div key={i} style={{ padding: '28px', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', textAlign: 'center', transition: 'var(--transition-slow)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-200)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{cert.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--gray-900)' }}>{cert.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{cert.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '16px', color: 'white' }}>
            Have Questions? We're Here to Help.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '32px', fontSize: '1.05rem' }}>
            Our team of licensed pharmacists is available to answer your health queries.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ padding: '14px 28px', background: 'white', color: 'var(--primary)', borderRadius: 'var(--radius-xl)', fontWeight: 700, display: 'inline-block' }}>
              Contact Us
            </Link>
            <Link to="/medicines" style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 'var(--radius-xl)', fontWeight: 700, display: 'inline-block' }}>
              Shop Medicines
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
