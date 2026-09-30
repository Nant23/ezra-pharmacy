import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import MedicineCard from '../components/medicine/MedicineCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Wishlist() {
  const { items, isLoading } = useWishlist();

  return (
    <div className="page-wrapper">
      <div className="container section-sm">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <Heart size={24} color="var(--red-600)" />
          <h1 className="heading-md">Wishlist</h1>
          {!isLoading && <span className="badge badge-red">{items.length}</span>}
        </div>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><LoadingSpinner /></div>
        ) : items.length ? (
          <div className="grid-4">
            {items.map(medicine => <MedicineCard key={medicine.id} medicine={medicine} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">❤️</div>
            <div className="empty-title">Your wishlist is empty</div>
            <div className="empty-desc">Save medicines from the catalog to keep them here.</div>
            <Link to="/medicines" className="btn btn-primary">Browse Medicines</Link>
          </div>
        )}
      </div>
    </div>
  );
}