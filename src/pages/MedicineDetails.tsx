import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Minus, Plus, ArrowLeft, AlertTriangle, CheckCircle, Heart, Share2 } from 'lucide-react';
import { medicines } from '../data/medicines';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import MedicineCard from '../components/medicine/MedicineCard';

export default function MedicineDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'uses' | 'dosage'>('description');

  const medicine = medicines.find(m => m.id === id);
  const related = medicines.filter(m => m.category === medicine?.category && m.id !== id).slice(0, 4);

  if (!medicine) {
    return (
      <div className="page-wrapper">
        <div className="container section" style={{ textAlign: 'center' }}>
          <div className="empty-icon">💊</div>
          <div className="empty-title">Medicine not found</div>
          <Link to="/medicines" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Medicines</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (medicine.availability === 'out-of-stock') { showToast('This medicine is out of stock.', 'error'); return; }
    addToCart(medicine, qty);
    showToast(`${medicine.name} × ${qty} added to cart!`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(medicine, qty);
    navigate('/cart');
  };

  const tabs = [
    { key: 'description', label: 'Description' },
    { key: 'uses', label: 'Uses' },
    { key: 'dosage', label: 'Dosage & Storage' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <Link to="/medicines" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 600 }}>
            <ArrowLeft size={14} /> Medicines
          </Link>
          <span>›</span>
          <span>{medicine.category}</span>
          <span>›</span>
          <span style={{ color: 'var(--gray-900)' }}>{medicine.name}</span>
        </div>

        <div className="medicine-detail-grid">
          {/* Image */}
          <div>
            <div className="medicine-detail-img">
              <img src={medicine.image} alt={medicine.name} />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              {medicine.discount && <span className="badge badge-red">-{medicine.discount}% OFF</span>}
              {medicine.requiresPrescription && <span className="badge badge-amber">⚕ Prescription Required</span>}
              <span className={`medicine-availability ${medicine.availability}`}>
                <span className="availability-dot"></span>
                {medicine.availability === 'in-stock' ? 'In Stock' : medicine.availability === 'out-of-stock' ? 'Out of Stock' : 'Limited Stock'}
              </span>
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              {medicine.category}
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.875rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '6px', lineHeight: 1.2 }}>
              {medicine.name}
            </h1>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              by <strong style={{ color: 'var(--gray-700)' }}>{medicine.brand}</strong>
            </div>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--amber-500)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.round(medicine.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{medicine.rating}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>({medicine.reviewCount.toLocaleString()} reviews)</span>
            </div>

            {/* Prescription Alert */}
            {medicine.requiresPrescription && (
              <div className="prescription-alert">
                <AlertTriangle size={20} color="var(--amber-500)" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--amber-700)', marginBottom: 3 }}>Prescription Required</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--amber-700)' }}>
                    This medicine requires a valid prescription from a licensed medical practitioner.
                    Please upload your prescription before purchasing. Our pharmacist will verify it before processing your order.
                  </div>
                  <Link to="/prescription" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--amber-700)' }}>
                    Upload Prescription →
                  </Link>
                </div>
              </div>
            )}

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                Rs. {medicine.price}
              </div>
              {medicine.originalPrice && (
                <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  Rs. {medicine.originalPrice}
                </div>
              )}
              {medicine.discount && (
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--red-600)', background: 'var(--red-50)', padding: '2px 10px', borderRadius: 'var(--radius-full)' }}>
                  Save {medicine.discount}%
                </div>
              )}
            </div>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '12px 16px', background: 'var(--green-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--green-100)' }}>
              <CheckCircle size={16} color="var(--green-600)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--green-700)', fontWeight: 600 }}>
                {medicine.stock} units available
              </span>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '10px' }}>Quantity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="quantity-control" style={{ border: '2px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease">
                    <Minus size={16} />
                  </button>
                  <span className="qty-value" style={{ width: 52, fontSize: '1rem' }}>{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(medicine.stock, q + 1))} aria-label="Increase">
                    <Plus size={16} />
                  </button>
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Total: <strong style={{ color: 'var(--primary)' }}>Rs. {medicine.price * qty}</strong>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={medicine.availability === 'out-of-stock'}
                style={{ flex: 1, minWidth: '140px' }}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={handleBuyNow}
                disabled={medicine.availability === 'out-of-stock'}
                style={{ flex: 1, minWidth: '140px' }}
              >
                Buy Now
              </button>
              <button
                onClick={() => { setWishlisted(!wishlisted); showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', 'info'); }}
                style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', border: '2px solid var(--border)', background: wishlisted ? 'var(--red-50)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: wishlisted ? 'var(--red-500)' : 'var(--gray-400)', transition: 'var(--transition)' }}
                aria-label="Add to wishlist"
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast('Link copied!', 'info'); }}
                style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', border: '2px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--gray-400)', transition: 'var(--transition)' }}
                aria-label="Share"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['✅ Genuine Medicine', '🚚 Fast Delivery', '🔄 Easy Returns'].map(badge => (
                <span key={badge} style={{ fontSize: '0.8rem', color: 'var(--green-700)', background: 'var(--green-50)', border: '1px solid var(--green-200)', borderRadius: 'var(--radius-full)', padding: '4px 12px', fontWeight: 600 }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: '48px' }}>
          <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid var(--border)', marginBottom: '28px' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                style={{
                  padding: '12px 24px',
                  background: 'none',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  color: activeTab === tab.key ? 'var(--primary)' : 'var(--gray-500)',
                  borderBottom: `3px solid ${activeTab === tab.key ? 'var(--primary)' : 'transparent'}`,
                  marginBottom: '-2px',
                  transition: 'var(--transition)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div style={{ color: 'var(--gray-700)', lineHeight: 1.8, fontSize: '0.95rem', maxWidth: 750 }}>
              {medicine.description}
            </div>
          )}
          {activeTab === 'uses' && (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: 600 }}>
              {medicine.uses.map((use, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
                  <span style={{ color: 'var(--green-500)', fontSize: '1rem' }}>✓</span> {use}
                </li>
              ))}
              {medicine.sideEffects && (
                <>
                  <li style={{ marginTop: '16px', fontWeight: 700, color: 'var(--gray-900)' }}>Possible Side Effects:</li>
                  {medicine.sideEffects.map((se, i) => (
                    <li key={`se-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
                      <span style={{ color: 'var(--amber-500)' }}>⚠</span> {se}
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
          {activeTab === 'dosage' && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ padding: '20px', background: 'var(--amber-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--amber-100)', marginBottom: '20px' }}>
                <div style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--amber-700)' }}>⚠ Important Notice</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--amber-700)', lineHeight: 1.6 }}>
                  Always follow your doctor's instructions. Do not self-medicate or adjust doses without medical advice.
                </div>
              </div>
              <div style={{ color: 'var(--gray-700)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                <strong>Recommended Dosage:</strong><br />
                {medicine.dosage || 'Consult your pharmacist or doctor for dosage instructions.'}
              </div>
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: '60px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '28px' }}>
              Related Products
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {related.map(m => <MedicineCard key={m.id} medicine={m} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
