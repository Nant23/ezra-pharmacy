import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, ClipboardList,
  Archive, Tag, FileText, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={17} />, exact: true },
  { to: '/admin/medicines', label: 'Medicines', icon: <Package size={17} /> },
  { to: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={17} /> },
  { to: '/admin/customers', label: 'Customers', icon: <Users size={17} /> },
  { to: '/admin/prescriptions', label: 'Prescriptions', icon: <ClipboardList size={17} /> },
  { to: '/admin/inventory', label: 'Inventory', icon: <Archive size={17} /> },
  { to: '/admin/discounts', label: 'Discounts', icon: <Tag size={17} /> },
  { to: '/admin/articles', label: 'Health Articles', icon: <FileText size={17} /> },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to) && to !== '/admin';
  };

  const handleLogout = () => {
    logout();
    showToast('Signed out.', 'info');
    navigate('/');
  };

  return (
    <aside className="admin-sidebar">
      <div style={{ padding: '8px 12px 20px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--green-600), var(--green-500))', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem' }}>⚕</div>
          Admin Panel
        </Link>
      </div>

      <div className="admin-sidebar-title">Main Menu</div>
      {menuItems.map(item => (
        <Link
          key={item.to}
          to={item.to}
          className={`admin-sidebar-link ${isActive(item.to, item.exact) || (item.exact && location.pathname === '/admin') ? 'active' : ''}`}
        >
          {item.icon}
          <span style={{ flex: 1 }}>{item.label}</span>
          {(isActive(item.to, item.exact) || (item.exact && location.pathname === '/admin')) && <ChevronRight size={14} />}
        </Link>
      ))}

      <div className="admin-sidebar-title" style={{ marginTop: 'var(--space-6)' }}>Quick Actions</div>
      <Link to="/medicines" className="admin-sidebar-link" target="_blank" rel="noopener">
        <Package size={17} /> View Store
      </Link>
      <button
        onClick={handleLogout}
        className="admin-sidebar-link"
        style={{ background: 'none', border: 'none', width: '100%', color: 'var(--red-600)', cursor: 'pointer', textAlign: 'left' }}
      >
        <LogOut size={17} /> Sign Out
      </button>
    </aside>
  );
}
