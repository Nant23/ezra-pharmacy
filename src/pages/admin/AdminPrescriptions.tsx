import { useState } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import type { Prescription } from '../../types';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';

const mockPrescriptions: Prescription[] = [
  { id: 'RX-001', userId: 'user-001', userName: 'Aarav Sharma', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop', notes: 'Please check for Metformin 500mg', status: 'pending', createdAt: '2026-09-22T10:30:00Z' },
  { id: 'RX-002', userId: 'user-002', userName: 'Sita Thapa', image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=300&fit=crop', notes: 'BP medicines for monthly refill', status: 'pending', createdAt: '2026-09-22T14:00:00Z' },
  { id: 'RX-003', userId: 'user-003', userName: 'Ramesh KC', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop', notes: '', status: 'verified', createdAt: '2026-09-21T08:00:00Z' },
];

export default function AdminPrescriptions() {
  const { showToast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [selected, setSelected] = useState<Prescription | null>(null);

  const update = (id: string, status: Prescription['status']) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    setSelected(null);
    showToast(`Prescription ${id} marked as ${status}.`, 'success');
  };

  const statusBadge = (s: Prescription['status']) => {
    const map = { pending: 'badge-amber', verified: 'badge-green', rejected: 'badge-red' };
    return <span className={`badge ${map[s]}`}>{s}</span>;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Prescriptions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            {prescriptions.filter(p => p.status === 'pending').length} pending review
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Rx ID</th>
                <th>Customer</th>
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
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{rx.userId}</div>
                  </td>
                  <td style={{ fontSize: '0.875rem', maxWidth: 200 }}>
                    {rx.notes || <span style={{ color: 'var(--text-muted)' }}>No notes</span>}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {new Date(rx.createdAt).toLocaleString('en-NP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>{statusBadge(rx.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelected(rx)} style={{ padding: '6px 8px' }}>
                        <Eye size={13} />
                      </button>
                      {rx.status === 'pending' && (
                        <>
                          <button className="btn btn-sm" style={{ padding: '6px 10px', background: 'var(--green-50)', color: 'var(--green-700)', border: '1px solid var(--green-200)' }} onClick={() => update(rx.id, 'verified')}>
                            <CheckCircle size={13} /> Verify
                          </button>
                          <button className="btn btn-sm" style={{ padding: '6px 10px', background: 'var(--red-50)', color: 'var(--red-600)', border: '1px solid var(--red-100)' }} onClick={() => update(rx.id, 'rejected')}>
                            <XCircle size={13} /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Modal */}
        <Modal open={!!selected} onClose={() => setSelected(null)} title={`Prescription ${selected?.id}`}
          footer={
            selected?.status === 'pending' ? (
              <>
                <button className="btn btn-danger" onClick={() => update(selected!.id, 'rejected')}>Reject</button>
                <button className="btn btn-primary" onClick={() => update(selected!.id, 'verified')}>✓ Verify & Approve</button>
              </>
            ) : (
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
            )
          }
        >
          {selected && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-700)', marginBottom: '4px' }}>Patient</div>
                <div style={{ fontWeight: 700 }}>{selected.userName}</div>
              </div>
              <img src={selected.image} alt="Prescription" style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '16px', objectFit: 'cover', maxHeight: 280 }} />
              {selected.notes && (
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-700)', marginBottom: '4px' }}>Patient Notes</div>
                  <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: 'var(--radius-lg)', fontSize: '0.875rem', color: 'var(--gray-700)' }}>{selected.notes}</div>
                </div>
              )}
              <div style={{ marginTop: '12px' }}>{statusBadge(selected.status)}</div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
