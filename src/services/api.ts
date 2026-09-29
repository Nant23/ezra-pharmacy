import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { medicines as mockMedicines } from '../data/medicines';
import { categories as mockCategories } from '../data/categories';
import { articles as mockArticles } from '../data/articles';
import { mockOrders } from '../data/users';
import type { Medicine, Category, Article, Order, Prescription } from '../types';

// ============================================================
// MEDICINES API
// ============================================================

export async function getMedicines(): Promise<Medicine[]> {
  if (!isSupabaseConfigured) {
    return mockMedicines;
  }

  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    console.warn('Falling back to local medicines data:', error?.message);
    return mockMedicines;
  }

  return data.map(m => ({
    id: m.id,
    name: m.name,
    brand: m.brand,
    category: m.category,
    price: Number(m.price),
    originalPrice: m.original_price ? Number(m.original_price) : undefined,
    discount: m.discount,
    image: m.image,
    description: m.description,
    uses: m.uses || [],
    sideEffects: m.side_effects || [],
    dosage: m.dosage,
    availability: m.availability,
    stock: m.stock,
    requiresPrescription: m.requires_prescription,
    rating: Number(m.rating),
    reviewCount: m.review_count,
    tags: m.tags || []
  }));
}

export async function getMedicineById(id: string): Promise<Medicine | null> {
  if (!isSupabaseConfigured) {
    return mockMedicines.find(m => m.id === id) || null;
  }

  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return mockMedicines.find(m => m.id === id) || null;
  }

  return {
    id: data.id,
    name: data.name,
    brand: data.brand,
    category: data.category,
    price: Number(data.price),
    originalPrice: data.original_price ? Number(data.original_price) : undefined,
    discount: data.discount,
    image: data.image,
    description: data.description,
    uses: data.uses || [],
    sideEffects: data.side_effects || [],
    dosage: data.dosage,
    availability: data.availability,
    stock: data.stock,
    requiresPrescription: data.requires_prescription,
    rating: Number(data.rating),
    reviewCount: data.review_count,
    tags: data.tags || []
  };
}

// ============================================================
// CATEGORIES API
// ============================================================

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) {
    return mockCategories;
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error || !data || data.length === 0) {
    return mockCategories;
  }

  return data;
}

// ============================================================
// ARTICLES API
// ============================================================

export async function getArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured) {
    return mockArticles;
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('date', { ascending: false });

  if (error || !data || data.length === 0) {
    return mockArticles;
  }

  return data.map(a => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    image: a.image,
    category: a.category,
    author: a.author,
    date: a.date,
    readTime: a.read_time,
    tags: a.tags || []
  }));
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (!isSupabaseConfigured) {
    return mockArticles.find(a => a.id === id) || null;
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return mockArticles.find(a => a.id === id) || null;
  }

  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    image: data.image,
    category: data.category,
    author: data.author,
    date: data.date,
    readTime: data.read_time,
    tags: data.tags || []
  };
}

// ============================================================
// ORDERS API
// ============================================================

function isValidUUID(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

// Convert File to base64 Data URL as reliable fallback
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; orderId: string; error?: string }> {
  const generatedId = `ORD-${Date.now().toString().slice(-6)}`;

  if (!isSupabaseConfigured) {
    return { success: true, orderId: generatedId };
  }

  const { error } = await supabase
    .from('orders')
    .insert({
      id: generatedId,
      user_id: isValidUUID(order.userId) ? order.userId : null,
      items: order.items,
      status: order.status,
      total: order.total,
      delivery_fee: order.deliveryFee,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      address: order.address,
      prescription_id: order.prescriptionId || null
    });

  if (error) {
    console.error('Failed to create order in Supabase:', error);
    return { success: false, orderId: generatedId, error: error.message };
  }

  return { success: true, orderId: generatedId };
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured) {
    return mockOrders.filter(o => o.userId === userId);
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return mockOrders.filter(o => o.userId === userId);
  }

  return data.map(o => ({
    id: o.id,
    userId: o.user_id,
    items: o.items,
    status: o.status,
    total: Number(o.total),
    deliveryFee: Number(o.delivery_fee),
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    address: o.address,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
    prescriptionId: o.prescription_id
  }));
}

// ============================================================
// PRESCRIPTION UPLOAD & STORAGE API
// ============================================================

const PRESCRIPTIONS_STORAGE_KEY = 'ezra_prescriptions';

const INITIAL_MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX-841920',
    userId: 'user-001',
    userName: 'Aarav Sharma',
    userPhone: '9841234567',
    doctorName: 'Dr. Ramesh Adhikari (Bir Hospital)',
    notes: 'Need 1 month refill for blood pressure medications. Please deliver in the evening.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    medicines: ['Amlodipine 5mg', 'Telmisartan 40mg']
  },
  {
    id: 'RX-712044',
    userId: 'user-002',
    userName: 'Sunita Maharjan',
    userPhone: '9813456789',
    doctorName: 'Dr. Sunita Karki (Teaching Hospital)',
    notes: 'Prescribed for seasonal flu and throat irritation. Doctor advised 5 days course.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop',
    status: 'verified',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    medicines: ['Azithromycin 500mg', 'Montelukast 10mg']
  }
];

export function getStoredPrescriptions(): Prescription[] {
  try {
    const raw = localStorage.getItem(PRESCRIPTIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRESCRIPTIONS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_PRESCRIPTIONS));
      return INITIAL_MOCK_PRESCRIPTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_PRESCRIPTIONS;
  }
}

export function saveStoredPrescriptions(prescriptions: Prescription[]): void {
  try {
    localStorage.setItem(PRESCRIPTIONS_STORAGE_KEY, JSON.stringify(prescriptions));
    window.dispatchEvent(new CustomEvent('ezra_prescriptions_updated', { detail: prescriptions }));
  } catch (err) {
    console.error('Failed to save prescriptions to localStorage:', err);
  }
}

export async function uploadPrescription(
  file: File,
  userId?: string | null,
  userName: string = 'Customer',
  userPhone: string = '',
  notes: string = '',
  doctorName: string = ''
): Promise<{ success: boolean; prescriptionId?: string; error?: string }> {
  const prescriptionId = `RX-${Date.now().toString().slice(-6)}`;

  try {
    // 1. Read file as Base64 Data URL for immediate reliability
    const dataUrl = await fileToDataUrl(file);
    let imageUrl = dataUrl;

    // 2. Try Supabase cloud sync if configured
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const folder = isValidUUID(userId) ? userId : 'guests';
        const filePath = `${folder}/${prescriptionId}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('prescriptions')
          .upload(filePath, file, { upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('prescriptions')
            .getPublicUrl(filePath);
          imageUrl = urlData.publicUrl;
        }

        await supabase
          .from('prescriptions')
          .insert({
            id: prescriptionId,
            user_id: isValidUUID(userId) ? userId : null,
            user_name: userName || 'Customer',
            user_phone: userPhone,
            doctor_name: doctorName || '',
            image_url: imageUrl,
            notes: notes || '',
            status: 'pending'
          });
      } catch (cloudErr) {
        console.warn('Supabase prescription sync warning, saving locally:', cloudErr);
      }
    }

    // 3. Always save to local store so Admin can instantly access it
    const newPrescription: Prescription = {
      id: prescriptionId,
      userId: userId || undefined,
      userName: userName || 'Customer',
      userPhone: userPhone || '',
      doctorName: doctorName || '',
      notes: notes || '',
      image: imageUrl,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const current = getStoredPrescriptions();
    saveStoredPrescriptions([newPrescription, ...current]);

    return { success: true, prescriptionId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown upload error';
    console.error('Prescription upload failed:', message);
    return { success: false, error: message };
  }
}

export async function getUserPrescriptions(userId: string): Promise<Prescription[]> {
  const all = await getAllPrescriptions();
  return all.filter(p => p.userId === userId);
}

// ============================================================
// ADMIN API
// ============================================================

export async function getAllOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured) {
    return mockOrders;
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.warn('Failed to load orders, falling back to mock:', error?.message);
    return mockOrders;
  }

  return data.map(o => ({
    id: o.id,
    userId: o.user_id,
    items: Array.isArray(o.items) ? o.items : [],
    status: o.status,
    total: Number(o.total),
    deliveryFee: Number(o.delivery_fee || 0),
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    address: o.address || {},
    notes: o.notes,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
    prescriptionId: o.prescription_id
  }));
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return true;
  }

  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    console.error('Failed to update order status:', error.message);
    return false;
  }
  return true;
}

export async function getAllPrescriptions(): Promise<Prescription[]> {
  const localList = getStoredPrescriptions();

  if (!isSupabaseConfigured) {
    return localList;
  }

  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return localList;
    }

    const cloudPrescriptions: Prescription[] = data.map(p => ({
      id: p.id,
      userId: p.user_id,
      userName: p.user_name || 'Customer',
      userPhone: p.user_phone || '',
      doctorName: p.doctor_name || '',
      image: p.image_url,
      notes: p.notes || '',
      status: p.status,
      createdAt: p.created_at,
      medicines: p.medicines || []
    }));

    // Merge cloud and local so no items are lost, prioritizing latest status
    const mergedMap = new Map<string, Prescription>();
    cloudPrescriptions.forEach(p => mergedMap.set(p.id, p));
    localList.forEach(p => {
      if (!mergedMap.has(p.id)) {
        mergedMap.set(p.id, p);
      }
    });

    return Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.warn('Error fetching prescriptions from Supabase, using local:', err);
    return localList;
  }
}

export async function updatePrescriptionStatus(id: string, status: Prescription['status']): Promise<boolean> {
  const current = getStoredPrescriptions();
  const updated = current.map(p => p.id === id ? { ...p, status } : p);
  saveStoredPrescriptions(updated);

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('prescriptions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch (err) {
      console.warn('Failed to update Supabase prescription status:', err);
    }
  }

  return true;
}

export async function addMedicine(med: Omit<Medicine, 'id' | 'rating' | 'reviewCount'>): Promise<{ success: boolean; error?: string }> {
  const generatedId = `med-${Date.now().toString().slice(-5)}`;

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  const { error } = await supabase
    .from('medicines')
    .insert({
      id: generatedId,
      name: med.name,
      brand: med.brand,
      category: med.category,
      price: med.price,
      original_price: med.originalPrice || null,
      discount: med.discount || 0,
      image: med.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
      description: med.description || '',
      uses: med.uses || [],
      side_effects: med.sideEffects || [],
      dosage: med.dosage || '',
      availability: med.availability || 'in-stock',
      stock: med.stock || 50,
      requires_prescription: med.requiresPrescription || false,
      rating: 5.0,
      review_count: 0,
      tags: med.tags || []
    });

  if (error) {
    console.error('Failed to add medicine to Supabase:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteMedicine(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return true;
  }

  const { error } = await supabase
    .from('medicines')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete medicine:', error.message);
    return false;
  }
  return true;
}

