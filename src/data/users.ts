import type { Order, User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    phone: '9841234567',
    role: 'user',
    joinedDate: '2026-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aarav',
    addresses: [
      {
        id: 'addr-001',
        label: 'Home',
        street: 'Lazimpat, Ward 2',
        city: 'Kathmandu',
        district: 'Kathmandu',
        isDefault: true
      }
    ]
  },
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@ezrapharmacy.com',
    phone: '9800000000',
    role: 'admin',
    joinedDate: '2025-06-01',
    addresses: []
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-2026-001',
    userId: 'user-001',
    items: [
      {
        medicine: {
          id: 'med-001',
          name: 'Paracetamol 500mg',
          brand: 'Panadol',
          category: 'Pain Relief',
          price: 45,
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
          description: '',
          uses: [],
          availability: 'in-stock',
          stock: 200,
          requiresPrescription: false,
          rating: 4.8,
          reviewCount: 1240
        },
        quantity: 2
      }
    ],
    status: 'delivered',
    total: 90,
    deliveryFee: 50,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    address: {
      id: 'addr-001',
      label: 'Home',
      street: 'Lazimpat, Ward 2',
      city: 'Kathmandu',
      district: 'Kathmandu',
      isDefault: true
    },
    createdAt: '2026-09-10T10:30:00Z',
    updatedAt: '2026-09-12T16:00:00Z'
  },
  {
    id: 'ORD-2026-002',
    userId: 'user-001',
    items: [
      {
        medicine: {
          id: 'med-003',
          name: 'Vitamin C 1000mg',
          brand: 'Celin',
          category: 'Vitamins & Supplements',
          price: 120,
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
          description: '',
          uses: [],
          availability: 'in-stock',
          stock: 300,
          requiresPrescription: false,
          rating: 4.7,
          reviewCount: 2100
        },
        quantity: 1
      }
    ],
    status: 'processing',
    total: 120,
    deliveryFee: 50,
    paymentMethod: 'esewa',
    paymentStatus: 'paid',
    address: {
      id: 'addr-001',
      label: 'Home',
      street: 'Lazimpat, Ward 2',
      city: 'Kathmandu',
      district: 'Kathmandu',
      isDefault: true
    },
    createdAt: '2026-09-20T14:00:00Z',
    updatedAt: '2026-09-21T09:00:00Z'
  }
];
