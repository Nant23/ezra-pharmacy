import AdminSidebar from '../../components/admin/AdminSidebar';
import { mockUsers } from '../../data/users';
import { mockOrders } from '../../data/users';
import { Mail, Phone } from 'lucide-react';

export default function AdminCustomers() {
  const customers = mockUsers.filter(u => u.role === 'user');

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Customers</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>{customers.length} registered customers</p>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Member Since</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => {
                  const userOrders = mockOrders.filter(o => o.userId === customer.id);
                  const totalSpent = userOrders.reduce((s, o) => s + o.total + o.deliveryFee, 0);
                  return (
                    <tr key={customer.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{customer.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {customer.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--gray-700)' }}>
                            <Mail size={12} /> {customer.email}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--gray-700)' }}>
                            <Phone size={12} /> {customer.phone || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>{userOrders.length}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>Rs. {totalSpent}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {new Date(customer.joinedDate).toLocaleDateString('en-NP', { year: 'numeric', month: 'short' })}
                      </td>
                      <td><span className="badge badge-green">Active</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {customers.length === 0 && (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">👥</div>
              <div className="empty-title">No customers yet</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
