export interface Medicine {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  description: string;
  uses: string[];
  sideEffects?: string[];
  dosage?: string;
  availability: 'in-stock' | 'out-of-stock' | 'limited';
  stock: number;
  requiresPrescription: boolean;
  rating: number;
  reviewCount: number;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  description: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  addresses: Address[];
  avatar?: string;
  joinedDate: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  district: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  deliveryFee: number;
  paymentMethod: 'cod' | 'esewa' | 'khalti' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  address: Address;
  createdAt: string;
  updatedAt: string;
  prescriptionId?: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface Prescription {
  id: string;
  userId: string;
  userName: string;
  image: string;
  notes: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  medicines?: string[];
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  availability: string;
  prescription: string;
}
