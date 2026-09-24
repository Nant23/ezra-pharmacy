import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut, Settings, Bell, ChevronRight, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { mockOrders } from '../data/users';
import OrderCard from '../components/order/OrderCard';

type Tab = 'profile' | 'orders' | 'addresses' | 'wishlist';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully.', 'info');
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User size={17} /> },
    { id: 'orders', label: 'My Orders', icon: <Package size={17} /> },
    { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={17} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={17} /> },
  ];

  const userOrders = mockOrders.filter(o => o.userId === user.id || user.role === 'admin');

  return (
    <div className="page-wrapper">
      <div className="container section-sm">
        <h1 className="heading-md" style={{ marginBottom: '28px' }}>My Account</h1>
        <div className="dashboard-layout">
          {/* Sidebar */}
          <div className="dashboard-sidebar">
            <div className="dashboard-user">
              <div className="dashboard-avatar">
                {user.name.charAt(0)}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: 2 }}>{user.email}</div>
              <div style={{ fontSize: '0.75rem', marginTop: 4, opacity: 0.7 }}>
                Member since {new Date(user.joinedDate).getFullYear()}
              </div>
            </div>

            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`dashboard-nav-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as Tab)}
                role="button"
                tabIndex={0}
              >
                {tab.icon} {tab.label}
              </div>
            ))}
            <div className="dashboard-nav-link" style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '12px' }}>
              <Bell size={17} /> Notifications
            </div>
            <div className="dashboard-nav-link">
              <Settings size={17} /> Settings
            </div>
            <div
              className="dashboard-nav-link"
              onClick={handleLogout}
              style={{ color: 'var(--red-600)', cursor: 'pointer' }}
              role="button"
              tabIndex={0}
            >
              <LogOut size={17} /> Sign Out
            </div>
          </div>

          {/* Content */}
          <div>
            {activeTab === 'profile' && (
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Profile Information</h2>
                  <button className="btn btn-ghost btn-sm" onClick={() => showToast('Profile editing coming soon!', 'info')}>
                    <Edit size={14} /> Edit Profile
                  </button>
                </div>
                <div style={{ padding: '28px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {[
                      { label: 'Full Name', value: user.name },
                      { label: 'Email Address', value: user.email },
                      { label: 'Phone Number', value: user.phone || 'Not set' },
                      { label: 'Account Type', value: user.role === 'admin' ? 'Administrator' : 'Customer' },
                      { label: 'Member Since', value: new Date(user.joinedDate).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' }) },
                    ].map(field => (
                      <div key={field.label}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                          {field.label}
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{field.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>My Orders</h2>
                  <span className="badge badge-green">{userOrders.length} orders</span>
                </div>
                {userOrders.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <div className="empty-title">No orders yet</div>
                    <div className="empty-desc">Start shopping to see your orders here.</div>
                    <button className="btn btn-primary" onClick={() => navigate('/medicines')}>Browse Medicines</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {userOrders.map(order => <OrderCard key={order.id} order={order} />)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Saved Addresses</h2>
                  <button className="btn btn-primary btn-sm" onClick={() => showToast('Address management coming soon!', 'info')}>+ Add Address</button>
                </div>
                {user.addresses.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📍</div>
                    <div className="empty-title">No saved addresses</div>
                    <div className="empty-desc">Add an address for faster checkout.</div>
                  </div>
                ) : (
                  user.addresses.map(addr => (
                    <div key={addr.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '20px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span className="badge badge-green">{addr.label}</span>
                        {addr.isDefault && <span className="badge badge-blue">Default</span>}
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{addr.street}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{addr.city}, {addr.district}</div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => showToast('Edit address coming soon!', 'info')}><Edit size={12} /> Edit</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="empty-state">
                <div className="empty-icon">❤️</div>
                <div className="empty-title">Your wishlist is empty</div>
                <div className="empty-desc">Save medicines you love by clicking the heart icon.</div>
                <button className="btn btn-primary" onClick={() => navigate('/medicines')}>
                  Browse Medicines <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
