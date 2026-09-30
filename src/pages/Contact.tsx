import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { submitContactMessage } from '../services/api';

const contactInfo = [
  {
    icon: <MapPin size={20} />,
    title: 'Visit Us',
    lines: ['Golphutar, Budhanilkantha-08', 'Budhanilkantha Municipality, Kathmandu 44622, Nepal'],
  },
  {
    icon: <Phone size={20} />,
    title: 'Call Us',
    lines: ['9843116918'],
  },
  {
    icon: <Mail size={20} />,
    title: 'Email Us',
    lines: ['ezrameds@gmail.com'],
  },
  {
    icon: <Clock size={20} />,
    title: 'Opening Hours',
    lines: ['Sunday – Friday: 7:00 AM – 9:00 PM', 'Saturday: 8:00 AM – 6:00 PM', 'Public Holidays: 9:00 AM – 5:00 PM'],
  },
];

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const set = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!isSupabaseConfigured) {
      showToast('Contact messages are temporarily unavailable. Please try again later.', 'error');
      return false;
    }
    if (form.name.trim().length < 2) e.name = 'Please enter your name';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (!/^[+()\d\s-]{7,40}$/.test(form.phone.trim())) e.phone = 'Enter a valid contact phone number';
    if (!form.subject.trim()) e.subject = 'Please enter a subject';
    if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await submitContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message
      });
      if (!result.success) throw new Error(result.error || 'Could not save your message. Please try again.');

      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      showToast('Message sent to Ezra Pharmacy. We\'ll get back to you within 24 hours.', 'success');
    } catch (error) {
      console.error('Contact message save failed:', error);
      showToast(error instanceof Error ? error.message : 'Could not save your message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--green-50), white)', borderBottom: '1px solid var(--border)', padding: '60px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ marginBottom: '16px' }}>Get in Touch</div>
          <h1 className="heading-lg" style={{ marginBottom: '12px' }}>Contact Ezra Pharmacy</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>
            Have a question, need a prescription review, or want to know about our services? We're here to help.
          </p>
        </div>
      </div>

      <div className="container section">
        {/* Emergency Alert */}
        <div style={{ background: 'var(--red-50)', border: '1px solid var(--red-100)', borderLeft: '4px solid var(--red-500)', borderRadius: 'var(--radius-xl)', padding: '20px 24px', marginBottom: '48px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <AlertTriangle size={22} color="var(--red-500)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--red-700)', fontSize: '1rem', marginBottom: '4px' }}>
              🚨 Medical Emergency?
            </div>
            <div style={{ color: 'var(--red-700)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              For life-threatening emergencies, call <strong>102 (Ambulance)</strong> or <strong>100 (Police)</strong> immediately.
              For urgent medicine delivery, call our emergency line: <strong>9843116918</strong> (24/7).
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '48px', alignItems: 'start' }}>
          {/* Contact Info */}
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '24px', color: 'var(--gray-900)' }}>
              Contact Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {contactInfo.map((info, i) => {
                const cardContent = (
                  <>
                    <div className="contact-info-icon">{info.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-900)', marginBottom: '4px' }}>{info.title}</div>
                      {info.lines.map((line, j) => (
                        <div key={j} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{line}</div>
                      ))}
                    </div>
                  </>
                );

                return info.title === 'Visit Us' ? (
                  <a
                    key={i}
                    href="https://www.google.com/maps?q=27.7469722,85.3561389"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-info-card"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {cardContent}
                  </a>
                ) : (
                  <div key={i} className="contact-info-card">
                    {cardContent}
                  </div>
                );
              })}
            </div>

            {/* Map Placeholder */}
            <div className="map-placeholder">
              <div style={{ fontSize: '2.5rem' }}>🗺️</div>
              <div style={{ fontWeight: 600, color: 'var(--gray-600)' }}>Ezra Pharmacy Location</div>
              <div>Golphutar, Budhanilkantha-08, Kathmandu</div>
              <a
                href="https://www.google.com/maps?q=27.7469722,85.3561389"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
                style={{ marginTop: '8px' }}
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', padding: '36px' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '8px', color: 'var(--gray-900)' }}>
              Send Us a Message
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '28px' }}>
              We'll get back to you within 24 hours.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Full Name *</label>
                  <input id="contact-name" className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-phone">Phone Number *</label>
                  <input id="contact-phone" type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="98XXXXXXXX" required />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email Address *</label>
                <input id="contact-email" type="email" className={`form-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subject *</label>
                <select id="contact-subject" className={`form-input ${errors.subject ? 'error' : ''}`} value={form.subject} onChange={e => set('subject', e.target.value)}>
                  <option value="">Select a subject...</option>
                  <option>General Inquiry</option>
                  <option>Medicine Availability</option>
                  <option>Prescription Upload Help</option>
                  <option>Order Issue</option>
                  <option>Delivery Query</option>
                  <option>Refund / Return</option>
                  <option>Health Consultation</option>
                  <option>Other</option>
                </select>
                {errors.subject && <span className="form-error">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Your Message *</label>
                <textarea
                  id="contact-message"
                  className={`form-input ${errors.message ? 'error' : ''}`}
                  rows={5}
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="Describe your question or concern in detail..."
                  style={{ resize: 'vertical', minHeight: '120px' }}
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Sending...
                  </span>
                ) : '📨 Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
