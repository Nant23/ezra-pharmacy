import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Menu, X, Search, User, Heart,
  Phone, ChevronDown, LogOut, LayoutDashboard, Shield
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/medicines', label: 'Medicines' },
    { to: '/categories', label: 'Categories' },
    { to: '/articles', label: 'Health Tips' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">
              <span style={{ fontSize: '1.1rem' }}>⚕</span>
            </div>
            <span>Ezra <span style={{ color: 'var(--gray-700)' }}>Pharmacy</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="navbar-nav">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="navbar-actions">
            <a href="tel:+97714567890" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <Phone size={14} />
              <span style={{ display: 'none' }} className="phone-label">01-4567890</span>
            </a>

            <Link to="/cart" className="cart-btn">
              <ShoppingCart size={18} />
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </Link>

            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '0.4rem 0.8rem',
                    background: 'var(--green-50)', border: '1.5px solid var(--green-200)',
                    borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                    fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)',
                    transition: 'var(--transition)'
                  }}
                >
                  <User size={16} />
                  {user?.name.split(' ')[0]}
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: 'white', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)',
                    minWidth: 200, zIndex: 100, overflow: 'hidden'
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--green-50)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '0.9rem' }}>{user?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600, borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--green-50)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: '0.875rem', color: 'var(--gray-700)', transition: 'background 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-50)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <LayoutDashboard size={15} /> My Account
                    </Link>
                    <Link to="/wishlist" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: '0.875rem', color: 'var(--gray-700)', transition: 'background 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-50)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <Heart size={15} /> Wishlist
                    </Link>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: '0.875rem', color: 'var(--red-600)', width: '100%', background: 'none', border: 'none', cursor: 'pointer', borderTop: '1px solid var(--border)', transition: 'background 0.2s', textAlign: 'left' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--red-50)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                <User size={14} /> Login
              </Link>
            )}

            {/* Hamburger */}
            <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="mobile-nav-link"><LayoutDashboard size={18} /> My Account</Link>
              {isAdmin && <Link to="/admin" className="mobile-nav-link"><Shield size={18} /> Admin Panel</Link>}
              <button onClick={handleLogout} className="mobile-nav-link" style={{ background: 'none', border: 'none', color: 'var(--red-600)', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link"><User size={18} /> Login</Link>
              <Link to="/register" className="mobile-nav-link">Register</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
