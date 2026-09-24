import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import CartItemComponent from '../components/cart/CartItem';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, clearCart, subtotal, deliveryFee, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: '80px' }}>
            <div className="empty-icon"><ShoppingCart size={64} strokeWidth={1} /></div>
            <div className="empty-title">Your cart is empty</div>
            <div className="empty-desc">Browse our medicines and add some items to your cart.</div>
            <Link to="/medicines" className="btn btn-primary btn-lg">
              Browse Medicines
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasPrescription = items.some(i => i.medicine.requiresPrescription);

  return (
    <div className="page-wrapper">
      <div style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--border)', padding: '32px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="heading-md">Shopping Cart</h1>
            <span className="badge badge-green">{items.reduce((s, i) => s + i.quantity, 0)} items</span>
          </div>
        </div>
      </div>

      <div className="container section-sm">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }}>
          {/* Items */}
          <div>
            {hasPrescription && (
              <div style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-100)', borderLeft: '4px solid var(--amber-500)', borderRadius: 'var(--radius-lg)', padding: '14px 16px', marginBottom: '20px', display: 'flex', gap: '10px', fontSize: '0.875rem', color: 'var(--amber-700)' }}>
                <span>⚠️</span>
                <div>
                  <strong>Prescription Required:</strong> Your cart contains prescription medicines.
                  Please <Link to="/prescription" style={{ color: 'var(--amber-700)', fontWeight: 700 }}>upload your prescription</Link> before checkout.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {items.map(item => (
                <CartItemComponent key={item.medicine.id} item={item} />
              ))}
            </div>

            <button
              onClick={() => { if (confirm('Clear all items from cart?')) clearCart(); }}
              className="btn btn-ghost"
              style={{ marginTop: '20px', color: 'var(--red-600)', borderColor: 'var(--red-100)' }}
            >
              <Trash2 size={15} /> Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '24px', position: 'sticky', top: 'calc(var(--nav-height) + 16px)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px', color: 'var(--gray-900)' }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                <span>Delivery Fee</span>
                <span style={{ color: subtotal >= 500 ? 'var(--green-600)' : 'inherit' }}>
                  {subtotal >= 500 ? 'FREE' : `Rs. ${deliveryFee}`}
                </span>
              </div>
              {subtotal >= 500 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--green-600)', fontWeight: 600, textAlign: 'right' }}>
                  🎉 You qualify for free delivery!
                </div>
              )}
              {subtotal < 500 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '8px', background: 'var(--green-50)', borderRadius: 'var(--radius-md)' }}>
                  Add Rs. {500 - subtotal} more for free delivery!
                </div>
              )}
              <div style={{ height: 1, background: 'var(--border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem', color: 'var(--gray-900)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>Rs. {subtotal >= 500 ? subtotal : total}</span>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" onClick={() => navigate('/checkout')} style={{ width: '100%', marginBottom: '12px' }}>
              Proceed to Checkout →
            </button>
            <Link to="/medicines" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
              Continue Shopping
            </Link>

            <div style={{ marginTop: '20px', padding: '14px', background: 'var(--green-50)', borderRadius: 'var(--radius-lg)', fontSize: '0.8rem', color: 'var(--green-700)' }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>🔒 Secure Checkout</div>
              <div>Your payment information is protected with 256-bit SSL encryption.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
