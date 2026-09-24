import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setError('Enter a valid email address.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--green-600), var(--green-500))', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>⚕</div>
            Ezra Pharmacy
          </Link>
          {!sent ? (
            <>
              <div style={{ width: 64, height: 64, background: 'var(--green-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary)' }}>
                <Mail size={30} />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Forgot Password?</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Enter your email and we'll send you a reset link.
              </p>
            </>
          ) : (
            <>
              <div style={{ width: 64, height: 64, background: 'var(--green-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary)' }}>
                <CheckCircle size={30} />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Email Sent!</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                If an account with <strong>{email}</strong> exists, a password reset link has been sent.
              </p>
            </>
          )}
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">Email Address</label>
              <input
                id="forgot-email"
                type="email"
                className={`form-input ${error ? 'error' : ''}`}
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
              />
              {error && <span className="form-error">{error}</span>}
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            Back to Sign In
          </Link>
        )}

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Remember your password?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
