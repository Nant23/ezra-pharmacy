import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      showToast('Welcome back to Ezra Pharmacy!', 'success');
      navigate('/dashboard');
    } else {
      showToast('No account found with that email. Try admin@ezrapharmacy.com or aarav@example.com.', 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--green-600), var(--green-500))', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>⚕</div>
            Ezra Pharmacy
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to your account to continue</p>
        </div>

        {/* Demo Credentials */}
        <div style={{ background: 'var(--blue-50)', border: '1px solid var(--blue-100)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: '24px', fontSize: '0.82rem', color: 'var(--blue-600)' }}>
          <strong>Demo credentials:</strong><br />
          User: aarav@example.com / any password<br />
          Admin: admin@ezrapharmacy.com / any password
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(er => ({ ...er, email: undefined })); }}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="password-input-wrap">
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(er => ({ ...er, password: undefined })); }}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPw(!showPw)} aria-label="Toggle password visibility">
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
}
