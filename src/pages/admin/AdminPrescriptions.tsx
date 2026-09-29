import { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, Eye, RefreshCw, Phone, User,
  Stethoscope, Search, ExternalLink, Calendar, FileText
} from 'lucide-react';
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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [zoomed, setZoomed] = useState(false);

  const fetchPrescriptions = () => {
    setLoading(true);
    getAllPrescriptions().then(data => {
      setPrescriptions(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPrescriptions();

    // Listen to real-time prescription events from uploads
    const handleUpdate = () => {
      getAllPrescriptions().then(data => setPrescriptions(data));
    };

    window.addEventListener('ezra_prescriptions_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ezra_prescriptions_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleUpdate = async (id: string, status: Prescription['status']) => {
    const ok = await updatePrescriptionStatus(id, status);
    if (ok) {
      setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      if (selected && selected.id === id) {
        setSelected(prev => prev ? { ...prev, status } : null);
      }
      showToast(`Prescription ${id} marked as ${status}.`, 'success');
    } else {
      showToast(`Failed to update prescription ${id}.`, 'error');
    }
  };

  const statusBadge = (s: Prescription['status']) => {
    const map = { pending: 'badge-amber', verified: 'badge-green', rejected: 'badge-red' };
    return <span className={`badge ${map[s]}`} style={{ textTransform: 'capitalize' }}>{s}</span>;
  };

  const filtered = prescriptions.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const q = search.toLowerCase().trim();
    if (!q) return matchesStatus;

    const matchesSearch =
      p.id.toLowerCase().includes(q) ||
      p.userName.toLowerCase().includes(q) ||
      (p.userPhone && p.userPhone.includes(q)) ||
      (p.doctorName && p.doctorName.toLowerCase().includes(q)) ||
      (p.notes && p.notes.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const pendingCount = prescriptions.filter(p => p.status === 'pending').length;
  const verifiedCount = prescriptions.filter(p => p.status === 'verified').length;
  const rejectedCount = prescriptions.filter(p => p.status === 'rejected').length;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>
              Prescriptions Verification Portal
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
              Review customer-uploaded doctor's prescriptions, verify medication dosage, and approve for dispensing.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchPrescriptions} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> Refresh List
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '16px 20px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Uploaded</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gray-900)', marginTop: 4 }}>{prescriptions.length}</div>
          </div>
          <div style={{ background: 'var(--amber-50)', borderRadius: 'var(--radius-xl)', padding: '16px 20px', border: '1px solid var(--amber-200)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--amber-800)', fontWeight: 600 }}>Pending Review</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--amber-800)', marginTop: 4 }}>{pendingCount}</div>
          </div>
          <div style={{ background: 'var(--green-50)', borderRadius: 'var(--radius-xl)', padding: '16px 20px', border: '1px solid var(--green-200)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--green-800)', fontWeight: 600 }}>Verified & Approved</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--green-800)', marginTop: 4 }}>{verifiedCount}</div>
          </div>
          <div style={{ background: 'var(--red-50)', borderRadius: 'var(--radius-xl)', padding: '16px 20px', border: '1px solid var(--red-200)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--red-700)', fontWeight: 600 }}>Rejected</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--red-700)', marginTop: 4 }}>{rejectedCount}</div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setStatusFilter('all')}
              className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              All ({prescriptions.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`btn btn-sm ${statusFilter === 'pending' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`btn btn-sm ${statusFilter === 'verified' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              Verified ({verifiedCount})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`btn btn-sm ${statusFilter === 'rejected' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: 280, maxWidth: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search Rx ID, patient, doctor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 36, height: 38, fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Main Table */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <LoadingSpinner />
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Slip</th>
                  <th>Rx ID</th>
                  <th>Patient Details</th>
                  <th>Prescribing Doctor</th>
                  <th>Patient Notes</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Pharmacist Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(rx => (
                  <tr key={rx.id} style={{ verticalAlign: 'middle' }}>
                    {/* Thumbnail */}
                    <td>
                      <div
                        onClick={() => setSelected(rx)}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                          background: 'var(--gray-100)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.2s'
                        }}
                        title="Click to view prescription image"
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        {rx.image && (rx.image.startsWith('data:') || rx.image.startsWith('http')) ? (
                          <img
                            src={rx.image}
                            alt="Doctor's prescription slip"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <FileText size={20} color="var(--primary)" />
                        )}
                      </div>
                    </td>

                    {/* Rx ID */}
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                        {rx.id}
                      </div>
                    </td>

                    {/* Patient */}
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <User size={14} color="var(--gray-500)" />
                        {rx.userName}
                      </div>
                      {rx.userPhone && (
                        <a
                          href={`tel:${rx.userPhone}`}
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--primary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            marginTop: 2,
                            textDecoration: 'none'
                          }}
                        >
                          <Phone size={12} /> {rx.userPhone}
                        </a>
                      )}
                    </td>

                    {/* Doctor */}
                    <td>
                      {rx.doctorName ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--gray-800)', fontWeight: 600 }}>
                          <Stethoscope size={14} color="var(--blue-600)" />
                          {rx.doctorName}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Unspecified doctor</span>
                      )}
                    </td>

                    {/* Notes */}
                    <td style={{ fontSize: '0.85rem', maxWidth: 180 }}>
                      {rx.notes ? (
                        <span style={{ color: 'var(--gray-700)' }}>{rx.notes}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>No extra instructions</span>
                      )}
                    </td>

                    {/* Submitted */}
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={13} />
                        {rx.createdAt
                          ? new Date(rx.createdAt).toLocaleString('en-NP', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Recent'}
                      </div>
                    </td>

                    {/* Status */}
                    <td>{statusBadge(rx.status)}</td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelected(rx)}
                          style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5 }}
                          title="Inspect Prescription"
                        >
                          <Eye size={14} /> Review
                        </button>
                        {rx.status !== 'verified' && (
                          <button
                            className="btn btn-sm"
                            style={{
                              background: 'var(--green-50)',
                              color: 'var(--green-700)',
                              border: '1px solid var(--green-200)',
                              padding: '6px 10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            onClick={() => handleUpdate(rx.id, 'verified')}
                            title="Verify & Approve"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                        )}
                        {rx.status !== 'rejected' && (
                          <button
                            className="btn btn-sm"
                            style={{
                              background: 'var(--red-50)',
                              color: 'var(--red-700)',
                              border: '1px solid var(--red-200)',
                              padding: '6px 10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}
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

          {!loading && filtered.length === 0 && (
            <div className="empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div className="empty-icon" style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
              <div className="empty-title" style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 6 }}>
                {search ? 'No prescriptions match your search' : 'No prescriptions submitted yet'}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto' }}>
                When customers upload their doctor's prescription via the website, it will immediately appear here for your pharmacist review.
              </p>
            </div>
          )}
        </div>

        {/* Prescription Inspection Modal */}
        {selected && (
          <Modal open={!!selected} onClose={() => { setSelected(null); setZoomed(false); }} title={`Doctor's Prescription #${selected.id}`}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                maxHeight: zoomed ? 650 : 420,
                overflow: 'auto',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                background: 'var(--gray-900)',
                padding: 12,
                position: 'relative'
              }}>
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt="Doctor's Prescription Full Preview"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'contain',
                      cursor: 'zoom-in',
                      transform: zoomed ? 'scale(1.4)' : 'scale(1)',
                      transformOrigin: 'top center',
                      transition: 'transform 0.25s ease'
                    }}
                    onClick={() => setZoomed(!zoomed)}
                  />
                ) : (
                  <div style={{ padding: '40px', color: 'white' }}>No image file attached</div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, padding: '0 4px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Click image to {zoomed ? 'zoom out' : 'zoom in'}
                </span>
                {selected.image && (
                  <a
                    href={selected.image}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    Open in New Window <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>

            {/* Information Grid */}
            <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '20px', fontSize: '0.875rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Patient Name</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-900)', marginTop: 2 }}>{selected.userName}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Contact Phone</div>
                  <div style={{ marginTop: 2 }}>
                    {selected.userPhone ? (
                      <a href={`tel:${selected.userPhone}`} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Phone size={14} /> {selected.userPhone}
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Not provided</span>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Prescribing Doctor / Hospital</div>
                  <div style={{ fontWeight: 600, color: 'var(--gray-900)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Stethoscope size={14} color="var(--blue-600)" />
                    {selected.doctorName || 'Not specified on upload'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Current Status</div>
                  <div style={{ marginTop: 4 }}>{statusBadge(selected.status)}</div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Customer Notes / Instructions</div>
                  <div style={{ color: 'var(--gray-800)', marginTop: 2, fontStyle: selected.notes ? 'italic' : 'normal' }}>
                    {selected.notes ? `"${selected.notes}"` : 'None provided by customer.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => { setSelected(null); setZoomed(false); }}>
                Close
              </button>
              <button
                className="btn"
                style={{ background: 'var(--red-600)', color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => handleUpdate(selected.id, 'rejected')}
              >
                <XCircle size={15} /> Reject Prescription
              </button>
              <button
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => handleUpdate(selected.id, 'verified')}
              >
                <CheckCircle size={15} /> Verify & Approve Prescription
              </button>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
}
