import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import type { Medicine } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

interface MedicineCardProps {
  medicine: Medicine;
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState('1');
  const navigate = useNavigate();
  const maxQuantity = Math.max(1, medicine.stock);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (medicine.availability === 'out-of-stock') {
      showToast('This medicine is currently out of stock.', 'error');
      return;
    }
    addToCart(medicine, quantity);
    showToast(`${medicine.name} × ${quantity} added to cart!`, 'success');
  };

  const handleQuantityInput = (value: string) => {
    setQuantityInput(value);
    const parsedQuantity = Number(value);
    if (value && Number.isInteger(parsedQuantity) && parsedQuantity > 0) {
      const nextQuantity = Math.min(parsedQuantity, maxQuantity);
      setQuantity(nextQuantity);
      setQuantityInput(String(nextQuantity));
    }
  };

  const commitQuantityInput = () => {
    const parsedQuantity = Number(quantityInput);
    const nextQuantity = Number.isInteger(parsedQuantity) && parsedQuantity > 0
      ? Math.min(parsedQuantity, maxQuantity)
      : quantity;
    setQuantity(nextQuantity);
    setQuantityInput(String(nextQuantity));
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasWishlisted = isWishlisted(medicine.id);
    const result = await toggleWishlist(medicine);
    const action = wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist!';
    showToast(
      result === 'synced' ? action : result === 'local' ? `${action} Saved on this device; cloud sync is unavailable.` : 'Could not update wishlist. Please try again.',
      result === 'failed' ? 'error' : 'success'
    );
  };

  const availabilityClass = medicine.availability.replace('-', '-');

  return (
    <Link to={`/medicines/${medicine.id}`} style={{ textDecoration: 'none' }}>
      <div className="medicine-card">
        {/* Image */}
        <div className="medicine-card-img">
          <img src={medicine.image} alt={medicine.name} loading="lazy" />
          <div className="medicine-card-badges">
            {medicine.discount && (
              <span className="badge badge-red">-{medicine.discount}%</span>
            )}
            {medicine.requiresPrescription && (
              <span className="badge badge-amber">Rx</span>
            )}
            {medicine.availability === 'limited' && (
              <span className="badge badge-amber">Limited</span>
            )}
          </div>
          <button className={`medicine-wishlist ${isWishlisted(medicine.id) ? 'active' : ''}`} onClick={handleWishlist} aria-label={isWishlisted(medicine.id) ? 'Remove from wishlist' : 'Add to wishlist'}>
            <Heart size={14} fill={isWishlisted(medicine.id) ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Body */}
        <div className="medicine-card-body">
          <div className="medicine-category">{medicine.category}</div>
          <div className="medicine-name">{medicine.name}</div>
          <div className="medicine-brand">{medicine.brand}</div>

          <div className="medicine-rating">
            <Star size={12} fill="currentColor" />
            <strong style={{ color: 'var(--gray-800)', fontSize: '0.82rem' }}>{medicine.rating}</strong>
            <span>({medicine.reviewCount.toLocaleString()})</span>
          </div>

          <div className={`medicine-availability ${availabilityClass}`}>
            <span className="availability-dot"></span>
            {medicine.availability === 'in-stock' ? 'In Stock' :
             medicine.availability === 'out-of-stock' ? 'Out of Stock' : 'Limited Stock'}
          </div>

          <div className="medicine-price-row">
            <span className="medicine-price">Rs. {medicine.price}</span>
            {medicine.originalPrice && (
              <span className="medicine-original-price">Rs. {medicine.originalPrice}</span>
            )}
          </div>

          <div className="medicine-card-quantity">
            <label htmlFor={`medicine-quantity-${medicine.id}`}>Qty</label>
            <input
              id={`medicine-quantity-${medicine.id}`}
              type="number"
              min={1}
              max={maxQuantity}
              step={1}
              inputMode="numeric"
              aria-label={`Quantity to add for ${medicine.name}`}
              value={quantityInput}
              onChange={e => handleQuantityInput(e.target.value)}
              onBlur={commitQuantityInput}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.focus();
              }}
              disabled={medicine.availability === 'out-of-stock'}
            />
          </div>

          <div className="medicine-card-actions">
            <button
              className={`btn ${medicine.availability === 'out-of-stock' ? 'btn-ghost' : 'btn-primary'}`}
              onClick={handleAddToCart}
              disabled={medicine.availability === 'out-of-stock'}
            >
              <ShoppingCart size={13} />
              {medicine.availability === 'out-of-stock' ? 'Unavailable' : 'Add to Cart'}
            </button>
            <button
              className="btn btn-ghost"
              onClick={(e) => { e.preventDefault(); navigate(`/medicines/${medicine.id}`); }}
            >
              <Eye size={13} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
