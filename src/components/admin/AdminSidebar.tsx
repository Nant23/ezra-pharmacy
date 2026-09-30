import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, ClipboardList, Heart, FileText, MessageSquareText,
  LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { getAllOrders } from '../../services/api';
import { getUnreadAdminOrderCount, ORDER_NOTIFICATIONS_READ_EVENT } from '../../services/orderNotifications';
import ezraLogo from '../../assets/ezra-logo.png';

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={17} />, exact: true },
  { to: '/admin/medicines', label: 'Medicines & Inventory', icon: <Package size={17} /> },
  { to: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={17} /> },
  { to: '/admin/customers', label: 'Customers', icon: <Users size={17} /> },
  { to: '/admin/prescriptions', label: 'Prescriptions', icon: <ClipboardList size={17} /> },
  { to: '/admin/wishlist', label: 'Customer Wishlists', icon: <Heart size={17} /> },
  { to: '/admin/articles', label: 'Health Tips', icon: <FileText size={17} /> },
  { to: '/admin/messages', label: 'Messages', icon: <MessageSquareText size={17} /> },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [unreadOrders, setUnreadOrders] = useState(0);

  useEffect(() => {
    if (!user || !isAdmin) {
      setUnreadOrders(0);
      return;
    }

    let isActive = true;
    const refreshUnreadOrders = async () => {
      const orders = await getAllOrders();
      if (isActive) setUnreadOrders(getUnreadAdminOrderCount(user.id, orders));
    };

    void refreshUnreadOrders();
    const intervalId = window.setInterval(() => void refreshUnreadOrders(), 30000);
    window.addEventListener('focus', refreshUnreadOrders);
    window.addEventListener('storage', refreshUnreadOrders);
    window.addEventListener(ORDER_NOTIFICATIONS_READ_EVENT, refreshUnreadOrders);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshUnreadOrders);
      window.removeEventListener('storage', refreshUnreadOrders);
      window.removeEventListener(ORDER_NOTIFICATIONS_READ_EVENT, refreshUnreadOrders);
    };
  }, [user?.id, isAdmin]);

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
        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src={ezraLogo} alt="Ezra Pharmacy" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--green-50)', border: '1px solid var(--green-200)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
            Admin Panel
          </span>
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
          {item.to === '/admin/orders' && unreadOrders > 0 && <span className="badge badge-red">{unreadOrders}</span>}
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
