import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Medicine } from '../types';
import { addWishlistItem, getWishlist, removeWishlistItem, type WishlistWriteResult } from '../services/api';
import { useAuth } from './AuthContext';

interface WishlistContextValue {
  items: Medicine[];
  isLoading: boolean;
  isWishlisted: (medicineId: string) => boolean;
  toggleWishlist: (medicine: Medicine) => Promise<WishlistWriteResult>;
  removeFromWishlist: (medicineId: string) => Promise<WishlistWriteResult>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const [items, setItems] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    getWishlist(userId).then(wishlist => {
      if (isActive) {
        setItems(wishlist);
        setIsLoading(false);
      }
    });

    const syncWishlist = () => {
      getWishlist(userId).then(wishlist => {
        if (isActive) setItems(wishlist);
      });
    };
    window.addEventListener('storage', syncWishlist);

    return () => {
      isActive = false;
      window.removeEventListener('storage', syncWishlist);
    };
  }, [userId]);

  const toggleWishlist = async (medicine: Medicine) => {
    const alreadySaved = items.some(item => item.id === medicine.id);
    const nextItems = alreadySaved
      ? items.filter(item => item.id !== medicine.id)
      : [...items, medicine];
    setItems(nextItems);

    const result = alreadySaved
      ? await removeWishlistItem(userId, medicine.id)
      : await addWishlistItem(userId, medicine);
    if (result === 'failed') {
      setItems(await getWishlist(userId));
    }
    return result;
  };

  const removeFromWishlist = async (medicineId: string) => {
    setItems(current => current.filter(item => item.id !== medicineId));
    const result = await removeWishlistItem(userId, medicineId);
    if (result === 'failed') setItems(await getWishlist(userId));
    return result;
  };

  return (
    <WishlistContext.Provider value={{
      items,
      isLoading,
      isWishlisted: medicineId => items.some(item => item.id === medicineId),
      toggleWishlist,
      removeFromWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}