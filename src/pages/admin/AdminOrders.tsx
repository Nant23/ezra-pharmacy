import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/ui/Modal';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { markAdminOrdersRead } from '../../services/orderNotifications';
import type { Order } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const statusOptions = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
type StatusFilter = typeof statusOptions[number];

export default function AdminOrders() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const userId = user?.id;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const refreshOrders = async () => {
      const data = await getAllOrders();
      if (!isActive) return;
      setOrders(data);
      setLoading(false);
      if (userId) markAdminOrdersRead(userId, data);
    };

    void refreshOrders();
    const intervalId = window.setInterval(() => void refreshOrders(), 30000);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [userId]);

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    const ok = await updateOrderStatus(orderId, newStatus);
    if (ok) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order ${orderId} status updated to "${newStatus}" in database.`, 'success');
    } else {
      showToast(`Failed to update order status for ${orderId}.`, 'error');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Orders Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            {loading ? 'Fetching orders from Supabase...' : `${orders.length} total orders`}
          </p>
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
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <LoadingSpinner />
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Delivery Area</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <tr key={order.id}>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          style={{ background: 'none', border: 0, padding: 0, color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {order.id}
                        </button>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          {(order.address as { name?: string; label?: string })?.name || (order.address as { name?: string; label?: string })?.label || 'Customer'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {order.address?.street ? `${order.address.street}, ` : ''}{order.address?.city || 'Kathmandu'}
                          {(order.address as { phone?: string })?.phone ? ` • ${(order.address as { phone?: string }).phone}` : ''}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {order.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0} items
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {order.items?.map((item, itemIndex) => {
                            const itemWithLegacyName = item as typeof item & { id?: string; name?: string };
                            const medicine = item.medicine;
                            return (
                              <div key={medicine?.id || itemWithLegacyName.id || `${order.id}-${itemIndex}`}>
                                {medicine?.name || itemWithLegacyName.name || 'Medicine details unavailable'} × {item.quantity || 1}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>Rs. {order.total}</td>
                      <td>
                        <div>
                          <span className="badge badge-gray" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>{order.paymentMethod}</span>
                          <div style={{ fontSize: '0.72rem', marginTop: 3 }}>
                            <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-green' : 'badge-amber'}`}>{order.paymentStatus}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-NP', { month: 'short', day: 'numeric' }) : 'Recent'}
                      </td>
                      <td><span className={`order-status status-${order.status}`}>{order.status}</span></td>
                      <td>
                        <select
                          className="form-input"
                          style={{ fontSize: '0.8rem', padding: '4px 8px', width: '130px' }}
                          value={order.status}
                          onChange={e => handleUpdateStatus(order.id, e.target.value as Order['status'])}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">📦</div>
              <div className="empty-title">No orders found</div>
            </div>
          )}
        </div>
        <Modal
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={selectedOrder ? `Order ${selectedOrder.id}` : undefined}
        >
          {selectedOrder && (
            <div>
              <h4 style={{ margin: '0 0 12px', fontWeight: 700, color: 'var(--gray-900)' }}>Ordered Items</h4>
              <div style={{ borderTop: '1px solid var(--border)' }}>
                {selectedOrder.items?.map((item, itemIndex) => {
                  const itemWithLegacyName = item as typeof item & { id?: string; name?: string };
                  const medicine = item.medicine;
                  const quantity = item.quantity || 1;
                  return (
                    <div
                      key={medicine?.id || itemWithLegacyName.id || `${selectedOrder.id}-${itemIndex}`}
                      style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border)' }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                          {medicine?.name || itemWithLegacyName.name || 'Medicine details unavailable'}
                        </div>
                        {medicine?.brand && <div style={{ marginTop: 3, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{medicine.brand}</div>}
                      </div>
                      <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div>Qty: {quantity}</div>
                        {medicine?.price != null && <div style={{ marginTop: 3, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rs. {(medicine.price * quantity).toFixed(2)}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 16, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Payment: {selectedOrder.paymentMethod.toUpperCase()}</span>
                <strong style={{ color: 'var(--primary)' }}>Total: Rs. {selectedOrder.total}</strong>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
