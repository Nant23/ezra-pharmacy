import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, RefreshCw } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getMedicines, addMedicine, deleteMedicine } from '../../services/api';
import type { Medicine } from '../../types';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const categories = [
  'Pain Relief', 'Cold & Flu', 'Vitamins & Supplements',
  'Digestive Health', 'Skin Care', 'Baby Care',
  'Personal Care', 'Diabetes Care', 'First Aid', 'Prescription Medicines'
];

export default function AdminMedicines() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [meds, setMeds] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Medicine Form State
  const [newMed, setNewMed] = useState({
    name: '',
    brand: '',
    category: 'Pain Relief',
    price: 100,
    stock: 100,
    requiresPrescription: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    description: '',
    dosage: '',
    availability: 'in-stock' as const
  });

  const fetchMeds = () => {
    setLoading(true);
    getMedicines().then(data => {
      setMeds(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  const filtered = meds.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.brand.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (med: Medicine) => {
    const ok = await deleteMedicine(med.id);
    if (ok) {
      setMeds(prev => prev.filter(m => m.id !== med.id));
      setDeleteTarget(null);
      showToast(`${med.name} removed from catalog and database.`, 'success');
    } else {
      showToast(`Failed to remove ${med.name}.`, 'error');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name.trim() || !newMed.brand.trim() || newMed.price <= 0) {
      showToast('Please fill all required fields correctly.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await addMedicine({
      name: newMed.name.trim(),
      brand: newMed.brand.trim(),
      category: newMed.category,
      price: Number(newMed.price),
      stock: Number(newMed.stock),
      requiresPrescription: newMed.requiresPrescription,
      image: newMed.image.trim(),
      description: newMed.description.trim(),
      dosage: newMed.dosage.trim(),
      availability: newMed.availability,
      uses: [],
      sideEffects: [],
      tags: [newMed.category.toLowerCase(), newMed.brand.toLowerCase()]
    });
    setIsSubmitting(false);

    if (res.success) {
      showToast(`${newMed.name} added to catalog!`, 'success');
      setShowAddModal(false);
      setNewMed({
        name: '',
        brand: '',
        category: 'Pain Relief',
        price: 100,
        stock: 100,
        requiresPrescription: false,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
        description: '',
        dosage: '',
        availability: 'in-stock'
      });
      fetchMeds();
    } else {
      showToast(res.error || 'Failed to add medicine.', 'error');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Medicines Catalog</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
              {loading ? 'Fetching medicines from Supabase...' : `${meds.length} products in database`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={fetchMeds}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Add Medicine
            </button>
          </div>
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
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <LoadingSpinner />
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Type</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(med => (
                    <tr key={med.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={med.image}
                            alt={med.name}
                            style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{med.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{med.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-gray">{med.category}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>Rs. {med.price}</td>
                      <td>
                        <span className={`badge ${med.stock > 50 ? 'badge-green' : med.stock > 0 ? 'badge-amber' : 'badge-red'}`}>
                          {med.stock} in stock
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
                            className="btn btn-sm"
                            style={{ padding: '6px 8px', background: 'var(--red-50)', color: 'var(--red-600)', border: '1px solid var(--red-100)' }}
                            onClick={() => setDeleteTarget(med)}
                            title="Delete medicine"
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
          )}
          {!loading && filtered.length === 0 && (
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-icon">💊</div>
              <div className="empty-title">No medicines found</div>
            </div>
          )}
        </div>

        {/* Add Medicine Modal */}
        <Modal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Medicine to Catalog"
        >
          <form onSubmit={handleAddSubmit}>
            <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Medicine Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Paracetamol 500mg"
                  value={newMed.name}
                  onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Brand / Manufacturer *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Panadol"
                  value={newMed.brand}
                  onChange={e => setNewMed({ ...newMed, brand: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-input"
                  value={newMed.category}
                  onChange={e => setNewMed({ ...newMed, category: e.target.value })}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Price (Rs.) *</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={newMed.price}
                  onChange={e => setNewMed({ ...newMed, price: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  value={newMed.stock}
                  onChange={e => setNewMed({ ...newMed, stock: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Availability</label>
                <select
                  className="form-input"
                  value={newMed.availability}
                  onChange={e => setNewMed({ ...newMed, availability: e.target.value as any })}
                >
                  <option value="in-stock">In Stock</option>
                  <option value="limited">Limited</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Image URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={newMed.image}
                onChange={e => setNewMed({ ...newMed, image: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Short therapeutic description..."
                value={newMed.description}
                onChange={e => setNewMed({ ...newMed, description: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="req-rx"
                checked={newMed.requiresPrescription}
                onChange={e => setNewMed({ ...newMed, requiresPrescription: e.target.checked })}
              />
              <label htmlFor="req-rx" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                Requires Doctor's Prescription (Rx)
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving to Supabase...' : 'Save Medicine'}
              </button>
            </div>
          </form>
        </Modal>

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
            Are you sure you want to remove <strong>{deleteTarget?.name}</strong> from the catalog? This will delete it from Supabase.
          </p>
        </Modal>
      </main>
    </div>
  );
}
