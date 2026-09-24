import PrescriptionUploader from '../components/prescription/PrescriptionUploader';
import { ShieldCheck, Clock, Phone } from 'lucide-react';

const steps = [
  { step: '1', icon: '📷', title: 'Upload Prescription', desc: 'Take a clear photo or scan of your prescription and upload it.' },
  { step: '2', icon: '🔍', title: 'Pharmacist Review', desc: 'Our licensed pharmacist reviews and verifies your prescription within 2 hours.' },
  { step: '3', icon: '📞', title: 'Order Confirmation', desc: 'We call you to confirm the order details and delivery address.' },
  { step: '4', icon: '🚚', title: 'Fast Delivery', desc: 'Your medicines are delivered to your doorstep, same day.' },
];

export default function PrescriptionUpload() {
  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--green-50), white)', borderBottom: '1px solid var(--border)', padding: '60px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ marginBottom: '16px' }}>📋 Prescription Service</div>
          <h1 className="heading-lg" style={{ marginBottom: '12px' }}>Upload Your Prescription</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto' }}>
            Get prescription medicines delivered to your home after pharmacist verification. Safe, legal, and convenient.
          </p>
        </div>
      </div>

      <div className="container section">
        {/* Trust Badges */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '52px' }}>
          {[
            { icon: <ShieldCheck size={16} />, text: 'DDA Compliant' },
            { icon: <Clock size={16} />, text: '2-Hour Verification' },
            { icon: <Phone size={16} />, text: 'Pharmacist Calls You' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--green-50)', border: '1px solid var(--green-100)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--green-700)' }}>
              {item.icon} {item.text}
            </div>
          ))}
        </div>

        {/* Steps */}
        <div style={{ marginBottom: '52px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem', textAlign: 'center', marginBottom: '32px', color: 'var(--gray-900)' }}>
            How It Works
          </h2>
          <div className="grid-4">
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', top: '28px', left: 'calc(50% + 36px)', right: 'calc(-50% + 36px)', height: '2px', background: 'var(--green-200)', zIndex: 0 }} />
                )}
                <div style={{ width: 56, height: 56, background: 'var(--green-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.5rem', position: 'relative', zIndex: 1, border: '3px solid var(--green-200)' }}>
                  {step.icon}
                </div>
                <div style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '6px' }}>{step.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Uploader */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'start' }}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', padding: '36px' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '8px' }}>Upload Your Prescription</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '28px' }}>
              Upload a clear image or PDF of your prescription from a licensed doctor.
            </p>
            <PrescriptionUploader />
          </div>

          {/* Sidebar info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '20px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '14px', color: 'var(--gray-900)' }}>📋 Tips for a Valid Prescription</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Must be from a licensed medical practitioner',
                  'Should include doctor\'s name, signature, and date',
                  'Must show patient name, age, and medicine details',
                  'Should not be older than 6 months',
                  'Image must be clear and readable',
                ].map((tip, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>✓</span> {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-100)', borderRadius: 'var(--radius-xl)', padding: '20px' }}>
              <div style={{ fontWeight: 700, color: 'var(--amber-700)', marginBottom: '8px' }}>⚠️ Important Notice</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--amber-700)', lineHeight: 1.6 }}>
                Prescription medicines will only be dispensed after verification by our licensed pharmacist. Providing false prescriptions is illegal and dangerous.
              </p>
            </div>

            <div style={{ background: 'var(--green-50)', border: '1px solid var(--green-100)', borderRadius: 'var(--radius-xl)', padding: '20px' }}>
              <div style={{ fontWeight: 700, color: 'var(--green-800)', marginBottom: '8px' }}>💬 Need Help?</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--green-800)', lineHeight: 1.6, marginBottom: '12px' }}>
                Having trouble with your prescription? Call our pharmacist directly.
              </p>
              <a href="tel:+97714567890" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                <Phone size={15} /> 01-4567890
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
