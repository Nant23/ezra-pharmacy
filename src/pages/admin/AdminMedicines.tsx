import { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { medicines as initialMedicines } from '../../data/medicines';
import type { Medicine } from '../../types';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';

export default function AdminMedicines() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [meds, setMeds] = useState<Medicine[]>(initialMedicines);
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);

  const filtered = meds.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.brand.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (med: Medicine) => {
    setMeds(prev => prev.filter(m => m.id !== med.id));
    setDeleteTarget(null);
    showToast(`${med.name} removed from catalog.`, 'success');
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Medicines Catalog</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>{meds.length} products total</p>
          </div>
          <button className="btn btn-primary" onClick={() => showToast('Add product form coming soon!', 'info')}>
            <Plus size={16} /> Add Medicine
          </button>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '20px', position: 'relative', maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: '42px' }}
            placeholder="Search medicines..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Availability</th>
                  <th>Rx Required</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(med => (
                  <tr key={med.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={med.image} alt={med.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{med.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{med.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{med.category}</span></td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Rs. {med.price}</div>
                      {med.originalPrice && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>Rs. {med.originalPrice}</div>}
                    </td>
                    <td style={{ fontWeight: 600 }}>{med.stock}</td>
                    <td>
                      <span className={`badge ${med.availability === 'in-stock' ? 'badge-green' : med.availability === 'limited' ? 'badge-amber' : 'badge-red'}`}>
                        {med.availability}
                      </span>
                    </td>
                    <td>
                      {med.requiresPrescription
                        ? <span className="badge badge-amber">Rx</span>
                        : <span className="badge badge-gray">OTC</span>}
                    </td>
                    <td>⭐ {med.rating}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => showToast('Edit form coming soon!', 'info')}
                          style={{ padding: '6px 8px' }}
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ padding: '6px 8px', background: 'var(--red-50)', color: 'var(--red-600)', border: '1px solid var(--red-100)' }}
                          onClick={() => setDeleteTarget(med)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">💊</div>
              <div className="empty-title">No medicines found</div>
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        <Modal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Remove Medicine"
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => deleteTarget && handleDelete(deleteTarget)}>
                Yes, Remove
              </button>
            </>
          }
        >
          <p style={{ color: 'var(--gray-700)' }}>
            Are you sure you want to remove <strong>{deleteTarget?.name}</strong> from the catalog? This action cannot be undone.
          </p>
        </Modal>
      </main>
    </div>
  );
}
