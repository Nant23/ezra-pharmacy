import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut, ChevronRight, Edit, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUserOrders, getUserPrescriptions } from '../services/api';
import { getUnreadOrderUpdateCount, markOrderUpdatesRead } from '../services/orderNotifications';
import { useWishlist } from '../context/WishlistContext';
import MedicineCard from '../components/medicine/MedicineCard';
import type { Order, Prescription } from '../types';
import OrderCard from '../components/order/OrderCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type Tab = 'profile' | 'orders' | 'prescriptions' | 'addresses' | 'wishlist';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { items: wishlistItems, isLoading: wishlistLoading, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [unreadOrderUpdates, setUnreadOrderUpdates] = useState(0);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = () => {
      Promise.all([
        getUserOrders(user.id),
        getUserPrescriptions(user.id)
      ]).then(([ords, prescs]) => {
        setOrders(ords);
        setUnreadOrderUpdates(getUnreadOrderUpdateCount(user.id, ords));
        setPrescriptions(prescs);
        setLoading(false);
      });
    };

    setLoading(true);
    fetchDashboardData();
    const intervalId = window.setInterval(fetchDashboardData, 30000);

    window.addEventListener('ezra_prescriptions_updated', fetchDashboardData);
    window.addEventListener('storage', fetchDashboardData);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('ezra_prescriptions_updated', fetchDashboardData);
      window.removeEventListener('storage', fetchDashboardData);
    };
  }, [user, navigate]);

  useEffect(() => {
    if (!user || loading || activeTab !== 'orders') return;
    markOrderUpdatesRead(user.id, orders);
    setUnreadOrderUpdates(0);
  }, [activeTab, loading, orders, user]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully.', 'info');
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User size={17} /> },
    { id: 'orders', label: 'My Orders', icon: <Package size={17} /> },
    { id: 'prescriptions', label: 'My Prescriptions', icon: <FileText size={17} /> },
    { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={17} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={17} /> },
  ];

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
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'orders' && unreadOrderUpdates > 0 && (
                  <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: '0.72rem' }}>
                    {unreadOrderUpdates}
                  </span>
                )}
                {tab.id === 'prescriptions' && prescriptions.length > 0 && (
                  <span className="badge badge-blue" style={{ marginLeft: 'auto', fontSize: '0.72rem' }}>
                    {prescriptions.length}
                  </span>
                )}
              </div>
            ))}

            <button
              onClick={handleLogout}
              className="dashboard-nav-link"
              style={{ color: 'var(--red-500)', marginTop: '20px', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <LogOut size={17} />
              <span>Log Out</span>
            </button>
          </div>

          {/* Content */}
          <div className="dashboard-content">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Personal Information</h2>
                      <button className="btn btn-ghost btn-sm" onClick={() => showToast('Profile edit coming soon!', 'info')}>
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

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>My Orders</h2>
                      <span className="badge badge-green">{orders.length} orders</span>
                    </div>
                    {orders.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <div className="empty-title">No orders yet</div>
                        <div className="empty-desc">Your orders placed on Ezra Pharmacy will show up here.</div>
                        <button className="btn btn-primary" onClick={() => navigate('/medicines')}>Browse Medicines</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {orders.map(order => <OrderCard key={order.id} order={order} />)}
                      </div>
                    )}
                  </div>
                )}

                {/* Prescriptions Tab */}
                {activeTab === 'prescriptions' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Uploaded Prescriptions</h2>
                      <button className="btn btn-primary btn-sm" onClick={() => navigate('/prescription')}>
                        + Upload New
                      </button>
                    </div>
                    {prescriptions.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <div className="empty-title">No prescriptions uploaded</div>
                        <div className="empty-desc">Upload your doctor's prescription for home delivery.</div>
                        <button className="btn btn-primary" onClick={() => navigate('/prescription')}>Upload Prescription</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {prescriptions.map(p => (
                          <div key={p.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {p.image.startsWith('http') || p.image.startsWith('data:') ? (
                                  <img src={p.image} alt="Prescription" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <FileText size={24} color="var(--primary)" />
                                )}
                              </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '0.95rem' }}>
                                    Prescription #{p.id}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                    Submitted on {new Date(p.createdAt).toLocaleDateString()}
                                  </div>
                                  {p.doctorName && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--blue-600)', fontWeight: 600, marginTop: '2px' }}>
                                      🩺 {p.doctorName}
                                    </div>
                                  )}
                                  {p.notes && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: '4px' }}>
                                      <em>"{p.notes}"</em>
                                    </div>
                                  )}
                                </div>
                            </div>
                            <div>
                              <span className={`badge ${p.status === 'verified' ? 'badge-green' : p.status === 'rejected' ? 'badge-red' : 'badge-amber'}`} style={{ textTransform: 'capitalize' }}>
                                {p.status === 'verified' ? <CheckCircle size={13} style={{ marginRight: 4 }} /> : p.status === 'pending' ? <Clock size={13} style={{ marginRight: 4 }} /> : <AlertCircle size={13} style={{ marginRight: 4 }} />}
                                {p.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Addresses Tab */}
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

                {/* Wishlist Tab */}
                {activeTab === 'wishlist' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>My Wishlist</h2>
                      <span className="badge badge-red">{wishlistItems.length} saved</span>
                    </div>
                    {wishlistLoading ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}><LoadingSpinner /></div>
                    ) : wishlistItems.length ? (
                      <div className="grid-4">
                        {wishlistItems.map(medicine => (
                          <div key={medicine.id} style={{ position: 'relative' }}>
                            <MedicineCard medicine={medicine} />
                            <button className="btn btn-ghost btn-sm" onClick={() => removeFromWishlist(medicine.id)} style={{ marginTop: 8, width: '100%' }}>Remove</button>
                          </div>
                        ))}
                      </div>
                    ) : (
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
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
