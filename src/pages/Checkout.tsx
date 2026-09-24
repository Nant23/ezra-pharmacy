import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

type PaymentMethod = 'cod' | 'esewa' | 'khalti' | 'online';

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

export default function Checkout() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [orderId] = useState(`ORD-${Date.now().toString().slice(-6)}`);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [form, setForm] = useState<FormData>({
    name: '', phone: '', email: '', address: '', city: 'Kathmandu', paymentMethod: 'cod', notes: ''
  });

  const effectiveDeliveryFee = subtotal >= 500 ? 0 : deliveryFee;
  const effectiveTotal = subtotal + effectiveDeliveryFee;

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.match(/^98\d{8}$|^97\d{8}$|^01\d{7}$/)) e.phone = 'Enter a valid Nepal phone number';
    if (form.email && !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Invalid email address';
    if (!form.address.trim()) e.address = 'Delivery address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { showToast('Please fix the errors in the form.', 'error'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setOrdered(true);
    clearCart();
    showToast('Order placed successfully!', 'success');
  };

  const set = (key: keyof FormData, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  if (ordered) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '80px' }}>
          <div style={{ width: 100, height: 100, background: 'var(--green-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', color: 'var(--primary)' }}>
            <CheckCircle size={52} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '12px', color: 'var(--gray-900)' }}>
            Order Placed Successfully!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '8px' }}>
            Thank you for ordering from Ezra Pharmacy.
          </p>
          <p style={{ color: 'var(--gray-700)', fontWeight: 600, marginBottom: '32px' }}>
            Order ID: <span style={{ color: 'var(--primary)' }}>{orderId}</span>
          </p>
          <div style={{ background: 'var(--green-50)', border: '1px solid var(--green-100)', borderRadius: 'var(--radius-xl)', padding: '20px', maxWidth: 400, margin: '0 auto 32px', fontSize: '0.9rem', color: 'var(--green-800)', lineHeight: 1.7 }}>
            📦 Your order will be delivered within <strong>2-4 hours</strong>.<br />
            Our team will call you at <strong>{form.phone}</strong> to confirm.
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
              View My Orders
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/medicines')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const paymentOptions = [
    { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive your order' },
    { id: 'esewa', label: 'eSewa', icon: '🟢', desc: 'Pay via eSewa digital wallet (coming soon)' },
    { id: 'khalti', label: 'Khalti', icon: '🟣', desc: 'Pay via Khalti digital wallet (coming soon)' },
    { id: 'online', label: 'Online Banking', icon: '🏦', desc: 'Pay via internet banking (coming soon)' },
  ];

  return (
    <div className="page-wrapper">
      <div style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--border)', padding: '32px 0' }}>
        <div className="container">
          <h1 className="heading-md">Checkout</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Cart</span>
            <span>›</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Checkout</span>
            <span>›</span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      <div className="container section-sm">
        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Delivery Info */}
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '24px' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px', color: 'var(--gray-900)' }}>
                  📍 Delivery Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label" htmlFor="checkout-name">Full Name *</label>
                    <input id="checkout-name" className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Aarav Sharma" />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-phone">Phone Number *</label>
                    <input id="checkout-phone" className={`form-input ${errors.phone ? 'error' : ''}`} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="98XXXXXXXX" />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-email">Email (Optional)</label>
                    <input id="checkout-email" type="email" className={`form-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label" htmlFor="checkout-address">Delivery Address *</label>
                    <input id="checkout-address" className={`form-input ${errors.address ? 'error' : ''}`} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street, locality, landmark..." />
                    {errors.address && <span className="form-error">{errors.address}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-city">City</label>
                    <select id="checkout-city" className="form-input" value={form.city} onChange={e => set('city', e.target.value)}>
                      <option>Kathmandu</option>
                      <option>Lalitpur</option>
                      <option>Bhaktapur</option>
                      <option>Pokhara</option>
                      <option>Biratnagar</option>
                      <option>Birgunj</option>
                      <option>Butwal</option>
                      <option>Dharan</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-notes">Order Notes (Optional)</label>
                    <input id="checkout-notes" className="form-input" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Special instructions..." />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '24px' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px', color: 'var(--gray-900)' }}>
                  💳 Payment Method
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {paymentOptions.map(opt => (
                    <label
                      key={opt.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px', padding: '16px',
                        borderRadius: 'var(--radius-lg)', border: `2px solid ${form.paymentMethod === opt.id ? 'var(--primary)' : 'var(--border)'}`,
                        background: form.paymentMethod === opt.id ? 'var(--green-50)' : 'white',
                        cursor: 'pointer', transition: 'var(--transition)'
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.id}
                        checked={form.paymentMethod === opt.id}
                        onChange={() => set('paymentMethod', opt.id)}
                        style={{ accentColor: 'var(--primary)', width: 18, height: 18 }}
                      />
                      <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-900)' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Order Summary */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '24px', position: 'sticky', top: 'calc(var(--nav-height) + 16px)' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px' }}>Order Summary</h3>

              <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: '16px' }}>
                {items.map(item => (
                  <div key={item.medicine.id} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
                    <img src={item.medicine.image} alt={item.medicine.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.medicine.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>×{item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)', flexShrink: 0 }}>Rs. {item.medicine.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: 'var(--border)', marginBottom: '16px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                  <span>Subtotal</span><span>Rs. {subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                  <span>Delivery</span>
                  <span style={{ color: effectiveDeliveryFee === 0 ? 'var(--green-600)' : 'inherit', fontWeight: effectiveDeliveryFee === 0 ? 700 : 400 }}>
                    {effectiveDeliveryFee === 0 ? 'FREE' : `Rs. ${effectiveDeliveryFee}`}
                  </span>
                </div>
                <div style={{ height: 1, background: 'var(--border)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>Rs. {effectiveTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Placing Order...
                  </span>
                ) : (
                  `Place Order — Rs. ${effectiveTotal}`
                )}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
                🔒 Secured by SSL encryption
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
