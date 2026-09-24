import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const set = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (form.name.trim().length < 3) e.name = 'Full name must be at least 3 characters';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address';
    if (!form.phone.match(/^(98|97)\d{8}$/)) e.phone = 'Enter a valid Nepal mobile number (98XXXXXXXX)';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    setLoading(false);
    showToast('Account created! Welcome to Ezra Pharmacy.', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--green-600), var(--green-500))', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>⚕</div>
            Ezra Pharmacy
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join Ezra Pharmacy for fast medicine delivery</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name *</label>
            <input id="reg-name" className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Aarav Sharma" />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address *</label>
            <input id="reg-email" type="email" className={`form-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-phone">Phone Number *</label>
            <input id="reg-phone" className={`form-input ${errors.phone ? 'error' : ''}`} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="98XXXXXXXX" />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password *</label>
            <div className="password-input-wrap">
              <input id="reg-password" type={showPw ? 'text' : 'password'} className={`form-input ${errors.password ? 'error' : ''}`} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 8 characters" />
              <button type="button" className="password-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirm Password *</label>
            <div className="password-input-wrap">
              <input id="reg-confirm" type={showConfirm ? 'text' : 'password'} className={`form-input ${errors.confirm ? 'error' : ''}`} value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Re-enter your password" />
              <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
            {errors.confirm && <span className="form-error">{errors.confirm}</span>}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            By creating an account, you agree to our{' '}
            <Link to="/about" style={{ color: 'var(--primary)' }}>Terms of Service</Link> and{' '}
            <Link to="/about" style={{ color: 'var(--primary)' }}>Privacy Policy</Link>.
          </p>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating Account...
              </span>
            ) : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
