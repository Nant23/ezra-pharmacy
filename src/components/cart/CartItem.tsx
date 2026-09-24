import { Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';
import { useCart } from '../../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { medicine, quantity } = item;

  return (
    <div className="cart-item">
      <img
        src={medicine.image}
        alt={medicine.name}
        className="cart-item-img"
      />
      <div className="cart-item-body">
        <div className="cart-item-name">{medicine.name}</div>
        <div className="cart-item-brand">{medicine.brand} · {medicine.category}</div>

        {medicine.requiresPrescription && (
          <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Rx Required</span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
          <div className="quantity-control">
            <button
              className="qty-btn"
              onClick={() => updateQuantity(medicine.id, quantity - 1)}
              aria-label="Decrease quantity"
            >−</button>
            <span className="qty-value">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => updateQuantity(medicine.id, Math.min(quantity + 1, medicine.stock))}
              aria-label="Increase quantity"
              disabled={quantity >= medicine.stock}
            >+</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>
                Rs. {(medicine.price * quantity).toFixed(0)}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Rs. {medicine.price} each
              </div>
            </div>
            <button
              onClick={() => removeFromCart(medicine.id)}
              style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'var(--red-50)', border: '1px solid var(--red-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--red-500)', transition: 'var(--transition)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--red-100)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--red-50)'; }}
              aria-label="Remove item"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
