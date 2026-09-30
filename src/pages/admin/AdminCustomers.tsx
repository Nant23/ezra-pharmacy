import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getRegisteredAccounts } from '../../context/AuthContext';
import { getAllOrders } from '../../services/api';
import type { Order } from '../../types';
import { Mail, Phone, Search, Loader2 } from 'lucide-react';

interface CustomerView {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
  isRegistered: boolean;
}

export default function AdminCustomers() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState(getRegisteredAccounts());

  useEffect(() => {
    getAllOrders().then(data => {
      setOrders(data);
      setLoading(false);
    });

    const handleUsersUpdate = () => {
      setRegisteredUsers(getRegisteredAccounts());
    };
    window.addEventListener('ezra_users_updated', handleUsersUpdate);
    return () => window.removeEventListener('ezra_users_updated', handleUsersUpdate);
  }, []);

  // Build unified customer list from registered accounts + live orders
  const customerMap = new Map<string, CustomerView>();

  // 1. Registered users
  registeredUsers.filter(u => u.role === 'user').forEach(u => {
    customerMap.set(u.id, {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || 'N/A',
      ordersCount: 0,
      totalSpent: 0,
      joinedDate: u.joinedDate,
      isRegistered: true,
    });
  });

  // 2. Tally and aggregate from live orders
  orders.forEach(order => {
    const addressAny = order.address as { name?: string; phone?: string; email?: string } | undefined;
    const customerKey = order.userId || addressAny?.phone || order.id;
    const customerName = addressAny?.name || (order.userId ? registeredUsers.find(u => u.id === order.userId)?.name : undefined) || 'Customer';
    const customerPhone = addressAny?.phone || (order.userId ? registeredUsers.find(u => u.id === order.userId)?.phone : undefined) || 'N/A';
    const customerEmail = addressAny?.email || (order.userId ? registeredUsers.find(u => u.id === order.userId)?.email : undefined) || 'guest@ezrapharmacy.np';
    const orderCost = (order.total || 0) + (order.deliveryFee || 0);

    if (customerMap.has(customerKey)) {
      const existing = customerMap.get(customerKey)!;
      existing.ordersCount += 1;
      existing.totalSpent += orderCost;
    } else {
      customerMap.set(customerKey, {
        id: customerKey,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        ordersCount: 1,
        totalSpent: orderCost,
        joinedDate: order.createdAt || new Date().toISOString(),
        isRegistered: !!order.userId,
      });
    }
  });

  const customerList = Array.from(customerMap.values()).filter(c => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Customers</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
              {customerMap.size} customer profiles linked with live orders
            </p>
          </div>

          <div style={{ position: 'relative', width: 280 }}>
            <Search size={16} color="var(--gray-400)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              className="form-input"
              style={{ paddingLeft: 36, fontSize: '0.85rem' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Loader2 size={32} className="spin" color="var(--primary)" style={{ margin: '0 auto 12px' }} />
              <div style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>Loading customers...</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Member Since</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {customerList.map(customer => (
                    <tr key={customer.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{customer.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>ID: {customer.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--gray-700)' }}>
                            <Mail size={12} /> {customer.email}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--gray-700)' }}>
                            <Phone size={12} /> {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>{customer.ordersCount}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        Rs. {customer.totalSpent.toLocaleString('en-IN')}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {new Date(customer.joinedDate).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td>
                        <span className={`badge ${customer.isRegistered ? 'badge-green' : 'badge-blue'}`}>
                          {customer.isRegistered ? 'Registered' : 'Order Guest'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && customerList.length === 0 && (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">👥</div>
              <div className="empty-title">No customers found</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
