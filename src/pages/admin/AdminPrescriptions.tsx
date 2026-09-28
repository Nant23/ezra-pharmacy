import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, RefreshCw } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import type { Prescription } from '../../types';
import { useToast } from '../../context/ToastContext';
import { getAllPrescriptions, updatePrescriptionStatus } from '../../services/api';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminPrescriptions() {
  const { showToast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Prescription | null>(null);

  const fetchPrescriptions = () => {
    setLoading(true);
    getAllPrescriptions().then(data => {
      setPrescriptions(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleUpdate = async (id: string, status: Prescription['status']) => {
    const ok = await updatePrescriptionStatus(id, status);
    if (ok) {
      setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      setSelected(null);
      showToast(`Prescription ${id} marked as ${status} in database.`, 'success');
    } else {
      showToast(`Failed to update prescription ${id}.`, 'error');
    }
  };

  const statusBadge = (s: Prescription['status']) => {
    const map = { pending: 'badge-amber', verified: 'badge-green', rejected: 'badge-red' };
    return <span className={`badge ${map[s]}`}>{s}</span>;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Prescriptions Verification</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
              {prescriptions.filter(p => p.status === 'pending').length} pending pharmacist review
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchPrescriptions}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <LoadingSpinner />
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rx ID</th>
                  <th>Patient / Customer</th>
                  <th>Notes</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map(rx => (
                  <tr key={rx.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem' }}>{rx.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{rx.userName}</div>
                    </td>
                    <td style={{ fontSize: '0.875rem', maxWidth: 200 }}>
                      {rx.notes || <span style={{ color: 'var(--text-muted)' }}>No notes</span>}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {rx.createdAt ? new Date(rx.createdAt).toLocaleString('en-NP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </td>
                    <td>{statusBadge(rx.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelected(rx)} style={{ padding: '6px 8px' }} title="View Prescription">
                          <Eye size={15} />
                        </button>
                        {rx.status !== 'verified' && (
                          <button
                            className="btn btn-sm"
                            style={{ background: 'var(--green-50)', color: 'var(--green-700)', border: '1px solid var(--green-200)', padding: '6px 10px' }}
                            onClick={() => handleUpdate(rx.id, 'verified')}
                            title="Verify Prescription"
                          >
                            <CheckCircle size={14} /> Verify
                          </button>
                        )}
                        {rx.status !== 'rejected' && (
                          <button
                            className="btn btn-sm"
                            style={{ background: 'var(--red-50)', color: 'var(--red-700)', border: '1px solid var(--red-200)', padding: '6px 10px' }}
                            onClick={() => handleUpdate(rx.id, 'rejected')}
                            title="Reject Prescription"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && prescriptions.length === 0 && (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">📋</div>
              <div className="empty-title">No prescriptions submitted yet</div>
            </div>
          )}
        </div>

        {/* Prescription Modal */}
        {selected && (
          <Modal open={!!selected} onClose={() => setSelected(null)} title={`Prescription #${selected.id}`}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ maxHeight: 420, overflow: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--gray-50)', padding: 12 }}>
                {selected.image ? (
                  <img src={selected.image} alt="Prescription Full Preview" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', objectFit: 'contain' }} />
                ) : (
                  <div style={{ padding: '40px' }}>No image file attached</div>
                )}
              </div>
            </div>
            <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '20px', fontSize: '0.875rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><strong>Patient Name:</strong> {selected.userName}</div>
                <div><strong>Submitted:</strong> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : 'Recent'}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>Notes:</strong> {selected.notes || 'None'}</div>
                <div><strong>Status:</strong> {statusBadge(selected.status)}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
              <button
                className="btn"
                style={{ background: 'var(--red-600)', color: 'white' }}
                onClick={() => handleUpdate(selected.id, 'rejected')}
              >
                <XCircle size={15} /> Reject
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleUpdate(selected.id, 'verified')}
              >
                <CheckCircle size={15} /> Verify & Approve
              </button>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
}
