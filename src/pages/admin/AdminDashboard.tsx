import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Users, Package, TrendingUp, AlertTriangle,
  ClipboardList, ArrowUp, Loader2, RefreshCw
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { getAllOrders, getMedicines, getAllPrescriptions } from '../../services/api';
import type { Order, Medicine, Prescription } from '../../types';
import { mockUsers } from '../../data/users';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [medicinesList, setMedicinesList] = useState<Medicine[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
    }
  }, [user, isAdmin, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [fetchedOrders, fetchedMedicines, fetchedPrescriptions] = await Promise.all([
        getAllOrders(),
        getMedicines(),
        getAllPrescriptions()
      ]);
      setOrders(fetchedOrders);
      setMedicinesList(fetchedMedicines);
      setPrescriptions(fetchedPrescriptions);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      loadDashboardData();
    }
  }, [user, isAdmin]);

  if (!user || !isAdmin) {
    return null;
  }

  // Calculate live statistics
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0) + (o.deliveryFee || 0), 0);

  // Extract unique customers across orders and mockUsers
  const customerIdsOrPhones = new Set<string>();
  mockUsers.filter(u => u.role === 'user').forEach(u => customerIdsOrPhones.add(u.id));
  orders.forEach(o => {
    if (o.userId) customerIdsOrPhones.add(o.userId);
    const phone = (o.address as { phone?: string })?.phone;
    if (phone) customerIdsOrPhones.add(phone);
  });
  const totalCustomersCount = customerIdsOrPhones.size;

  const lowStockMeds = medicinesList.filter(m => m.stock < 60).sort((a, b) => a.stock - b.stock);
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending');
  const recentOrders = orders.slice(0, 5);

  // Today's summary calculations
  const isToday = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    return d.getDate() === now.getDate() &&
           d.getMonth() === now.getMonth() &&
           d.getFullYear() === now.getFullYear();
  };

  const todayOrders = orders.filter(o => isToday(o.createdAt));
  const todayRevenue = todayOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0) + (o.deliveryFee || 0), 0);
  const completedDeliveries = orders.filter(o => o.status === 'delivered').length;
  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length;

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length.toString(),
      change: `+${orders.length}`,
      up: true,
      icon: <ShoppingBag size={22} />,
      color: '#dbeafe',
      iconColor: '#3b82f6'
    },
    {
      label: 'Total Revenue',
      value: `Rs. ${totalRevenue.toLocaleString('en-IN')}`,
      change: '+14%',
      up: true,
      icon: <TrendingUp size={22} />,
      color: '#dcfce7',
      iconColor: '#16a34a'
    },
    {
      label: 'Total Customers',
      value: totalCustomersCount.toString(),
      change: `+${totalCustomersCount}`,
      up: true,
      icon: <Users size={22} />,
      color: '#e0e7ff',
      iconColor: '#4338ca'
    },
    {
      label: 'Total Medicines',
      value: medicinesList.length.toString(),
      change: 'Live',
      up: true,
      icon: <Package size={22} />,
      color: '#fef9c3',
      iconColor: '#d97706'
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '6px' }}>
              Welcome back, {user.name.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Here's what's happening at Ezra Pharmacy today with live database sync.
            </p>
          </div>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={loadDashboardData}
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
            <Loader2 size={36} className="spin" color="var(--primary)" style={{ margin: '0 auto 16px' }} />
            <div style={{ fontWeight: 600, color: 'var(--gray-700)' }}>Syncing with Supabase database...</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Loading orders, catalog, and prescriptions</div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: '32px' }}>
              {stats.map((stat, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon" style={{ background: stat.color, color: stat.iconColor }}>
                    {stat.icon}
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className={`stat-change ${stat.up ? 'up' : 'down'}`}>
                    <ArrowUp size={13} />
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
              {/* Recent Orders */}
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>Recent Orders</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Latest orders placed across the store</p>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/orders')}>View All ({orders.length})</button>
                </div>
                {recentOrders.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No orders recorded yet.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Payment</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map(order => {
                          const customerName = (order.address as { name?: string; label?: string })?.name ||
                            (order.address as { name?: string; label?: string })?.label ||
                            mockUsers.find(u => u.id === order.userId)?.name ||
                            'Guest Customer';
                          const location = order.address?.city || order.address?.street || 'Kathmandu';

                          return (
                            <tr key={order.id}>
                              <td style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--primary)' }}>{order.id}</td>
                              <td>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{customerName}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{location}</div>
                              </td>
                              <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                                Rs. {((order.total || 0) + (order.deliveryFee || 0)).toLocaleString('en-IN')}
                              </td>
                              <td>
                                <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-green' : 'badge-amber'}`}>
                                  {(order.paymentMethod || 'COD').toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <span className={`order-status status-${order.status}`}>{order.status}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Right column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Low Stock Alert */}
                <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={17} color="var(--amber-500)" />
                      <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-900)' }}>Low Stock Alert</h2>
                    </div>
                    <span className="badge badge-amber">{lowStockMeds.length}</span>
                  </div>
                  <div style={{ padding: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                    {lowStockMeds.length === 0 ? (
                      <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        All items have healthy stock levels.
                      </div>
                    ) : (
                      lowStockMeds.slice(0, 5).map(med => (
                        <div key={med.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 'var(--radius-lg)', transition: 'background 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-50)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-900)' }}>{med.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{med.brand}</div>
                          </div>
                          <span className={`badge ${med.stock < 30 ? 'badge-red' : 'badge-amber'}`}>{med.stock} left</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', background: 'var(--gray-50)' }}>
                    <button className="btn btn-ghost btn-sm" style={{ width: '100%', fontSize: '0.8rem' }} onClick={() => navigate('/admin/medicines')}>
                      Manage Inventory →
                    </button>
                  </div>
                </div>

                {/* Pending Prescriptions */}
                <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ClipboardList size={17} color="var(--blue-500)" />
                      <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-900)' }}>Prescriptions</h2>
                    </div>
                    <span className={`badge ${pendingPrescriptions.length > 0 ? 'badge-amber' : 'badge-green'}`}>
                      {pendingPrescriptions.length} pending
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    {pendingPrescriptions.length > 0
                      ? `${pendingPrescriptions.length} prescription(s) awaiting verification.`
                      : 'All uploaded prescriptions have been reviewed.'}
                  </p>
                  <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => navigate('/admin/prescriptions')}>
                    Review Prescriptions ({prescriptions.length})
                  </button>
                </div>

                {/* Quick Stats */}
                <div style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-700))', borderRadius: 'var(--radius-xl)', padding: '20px', color: 'white' }}>
                  <div style={{ fontWeight: 700, marginBottom: '16px' }}>📈 Store Summary</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { label: "Today's Orders", value: todayOrders.length.toString() },
                      { label: "Today's Revenue", value: `Rs. ${todayRevenue.toLocaleString('en-IN')}` },
                      { label: 'Active Processing', value: activeOrders.toString() },
                      { label: 'Completed Deliveries', value: completedDeliveries.toString() },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ opacity: 0.85 }}>{item.label}</span>
                        <span style={{ fontWeight: 700 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
