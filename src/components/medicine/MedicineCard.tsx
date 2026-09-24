import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import type { Medicine } from '../../types';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface MedicineCardProps {
  medicine: Medicine;
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [wishlisted, setWishlisted] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (medicine.availability === 'out-of-stock') {
      showToast('This medicine is currently out of stock.', 'error');
      return;
    }
    addToCart(medicine);
    showToast(`${medicine.name} added to cart!`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlisted(!wishlisted);
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', 'info');
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
          <button className={`medicine-wishlist ${wishlisted ? 'active' : ''}`} onClick={handleWishlist} aria-label="Wishlist">
            <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
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
