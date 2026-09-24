import { useState } from 'react';
import { Search } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { mockOrders, mockUsers } from '../../data/users';
import { useToast } from '../../context/ToastContext';
import type { Order } from '../../types';

const statusOptions = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
type StatusFilter = typeof statusOptions[number];

export default function AdminOrders() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const updateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order ${orderId} status updated to "${newStatus}".`, 'success');
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Orders</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>{orders.length} total orders</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" style={{ paddingLeft: '42px' }} placeholder="Search by order ID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {statusOptions.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', border: `2px solid ${statusFilter === s ? 'var(--primary)' : 'var(--border)'}`, background: statusFilter === s ? 'var(--primary)' : 'white', color: statusFilter === s ? 'white' : 'var(--gray-700)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'var(--transition)', textTransform: 'capitalize' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const customer = mockUsers.find(u => u.id === order.userId);
                  return (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--primary)' }}>{order.id}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{customer?.name || 'Customer'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{customer?.phone}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{order.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>Rs. {order.total + order.deliveryFee}</td>
                      <td>
                        <div>
                          <span className="badge badge-gray" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>{order.paymentMethod}</span>
                          <div style={{ fontSize: '0.72rem', marginTop: 3 }}>
                            <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-green' : 'badge-amber'}`}>{order.paymentStatus}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-NP', { month: 'short', day: 'numeric' })}
                      </td>
                      <td><span className={`order-status status-${order.status}`}>{order.status}</span></td>
                      <td>
                        <select
                          className="form-input"
                          style={{ fontSize: '0.8rem', padding: '4px 8px', width: '130px' }}
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value as Order['status'])}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">📦</div>
              <div className="empty-title">No orders found</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
