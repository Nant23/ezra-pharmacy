import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { getAllWishlistEntries, type AdminWishlistEntry } from '../../services/api';

export default function AdminWishlist() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<AdminWishlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }

    let isActive = true;
    const loadWishlist = async () => {
      const data = await getAllWishlistEntries();
      if (isActive) {
        setEntries(data);
        setLoading(false);
      }
    };

    void loadWishlist();
    const intervalId = window.setInterval(() => void loadWishlist(), 30000);
    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) return null;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Customer Wishlists</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            {loading ? 'Loading saved medicines...' : `${entries.length} saved medicine${entries.length === 1 ? '' : 's'}`}
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><LoadingSpinner /></div>
          ) : entries.length ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr><th>Customer</th><th>Medicine</th><th>Category</th><th>Price</th><th>Saved</th></tr>
                </thead>
                <tbody>
                  {entries.map(entry => (
                    <tr key={`${entry.userId}-${entry.medicine.id}`}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{entry.userName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{entry.userEmail}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={entry.medicine.image} alt="" style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{entry.medicine.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{entry.medicine.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td>{entry.medicine.category}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>Rs. {entry.medicine.price}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{new Date(entry.createdAt).toLocaleDateString('en-NP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 40 }}>
              <div className="empty-icon">❤️</div>
              <div className="empty-title">No customer wishlists yet</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}