import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Users, Package, TrendingUp, AlertTriangle,
  ClipboardList, ArrowUp, ArrowDown
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { medicines } from '../../data/medicines';
import { mockOrders, mockUsers } from '../../data/users';

const stats = [
  { label: 'Total Orders', value: '1,284', change: '+12%', up: true, icon: <ShoppingBag size={22} />, color: '#dbeafe', iconColor: '#3b82f6' },
  { label: 'Total Revenue', value: 'Rs. 4,82,500', change: '+8.5%', up: true, icon: <TrendingUp size={22} />, color: '#dcfce7', iconColor: '#16a34a' },
  { label: 'Total Customers', value: '3,421', change: '+22%', up: true, icon: <Users size={22} />, color: '#e0e7ff', iconColor: '#4338ca' },
  { label: 'Total Medicines', value: medicines.length.toString(), change: '+5', up: true, icon: <Package size={22} />, color: '#fef9c3', iconColor: '#d97706' },
];

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    navigate('/login');
    return null;
  }

  const lowStockMeds = medicines.filter(m => m.stock < 60);
  const pendingOrders = mockOrders.filter(o => o.status === 'pending' || o.status === 'confirmed');
  const recentOrders = [...mockOrders].reverse().slice(0, 5);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '6px' }}>
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Here's what's happening at Ezra Pharmacy today.
          </p>
        </div>

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
                {stat.up ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
                {stat.change} vs last month
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          {/* Recent Orders */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>Recent Orders</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/orders')}>View All</button>
            </div>
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
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600, fontSize: '0.82rem' }}>{order.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {mockUsers.find(u => u.id === order.userId)?.name || 'Customer'}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>Rs. {order.total + order.deliveryFee}</td>
                    <td>
                      <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-green' : 'badge-amber'}`}>
                        {order.paymentMethod.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`order-status status-${order.status}`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Low Stock Alert */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={17} color="var(--amber-500)" />
                <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-900)' }}>Low Stock Alert</h2>
                <span className="badge badge-amber">{lowStockMeds.length}</span>
              </div>
              <div style={{ padding: '8px' }}>
                {lowStockMeds.slice(0, 5).map(med => (
                  <div key={med.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 'var(--radius-lg)', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-50)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-900)' }}>{med.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{med.brand}</div>
                    </div>
                    <span className="badge badge-amber">{med.stock} left</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Prescriptions */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <ClipboardList size={17} color="var(--blue-500)" />
                <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-900)' }}>Pending Prescriptions</h2>
                <span className="badge badge-blue">3</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                3 prescriptions awaiting pharmacist review.
              </p>
              <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => navigate('/admin/prescriptions')}>
                Review Prescriptions
              </button>
            </div>

            {/* Quick Stats */}
            <div style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-700))', borderRadius: 'var(--radius-xl)', padding: '20px', color: 'white' }}>
              <div style={{ fontWeight: 700, marginBottom: '16px' }}>📈 Today's Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'New Orders', value: '24' },
                  { label: 'Revenue Today', value: 'Rs. 18,400' },
                  { label: 'Deliveries Completed', value: '21' },
                  { label: 'Pending Deliveries', value: '3' },
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
      </main>
    </div>
  );
}
