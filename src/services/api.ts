import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { medicines as mockMedicines } from '../data/medicines';
import { categories as mockCategories } from '../data/categories';
import { articles as mockArticles } from '../data/articles';
import { mockOrders } from '../data/users';
import type { Medicine, Category, Article, Order, Prescription } from '../types';

export interface AdminWishlistEntry {
  userId: string;
  userName: string;
  userEmail: string;
  medicine: Medicine;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: string;
}

export type WishlistWriteResult = 'synced' | 'local' | 'failed';

const getLocalWishlistKey = (userId: string) => `ezra_wishlist_${userId}`;

function getLocalWishlist(userId: string): Medicine[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(getLocalWishlistKey(userId)) || '[]');
    return Array.isArray(stored) ? stored as Medicine[] : [];
  } catch {
    return [];
  }
}

function setLocalWishlist(userId: string, medicines: Medicine[]): boolean {
  try {
    localStorage.setItem(getLocalWishlistKey(userId), JSON.stringify(medicines));
    return true;
  } catch {
    return false;
  }
}

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

export async function getAdminArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(article => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    image: article.image,
    category: article.category,
    author: article.author,
    date: article.date,
    readTime: article.read_time,
    tags: article.tags || []
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

export async function addArticle(article: Omit<Article, 'id'>, imageFile?: File): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase must be configured to publish health tips.' };
  }

  const articleId = `art-${Date.now()}`;
  let imageUrl = article.image;
  let uploadedImagePath: string | null = null;
  let uploadedImageBucket: string | null = null;

  if (imageFile) {
    try {
      const optimizedImage = await fileToDataUrl(imageFile);
      const imageBlob = base64ToBlob(optimizedImage, imageFile.type);
      const extension = imageBlob.type === 'image/png' ? 'png' : imageBlob.type === 'image/webp' ? 'webp' : 'jpg';
      const filePath = `health-tips/${articleId}-${Date.now()}.${extension}`;
      const uploadOptions = { cacheControl: '3600', contentType: imageBlob.type || 'image/jpeg' };
      let bucket = 'articles';
      let { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, imageBlob, uploadOptions);

      if (uploadError?.message.toLowerCase().includes('bucket not found')) {
        bucket = 'medicines';
        ({ error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, imageBlob, uploadOptions));
      }

      if (uploadError) return { success: false, error: `Image upload failed: ${uploadError.message}` };

      uploadedImagePath = filePath;
      uploadedImageBucket = bucket;
      imageUrl = supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? `Image upload failed: ${error.message}` : 'Image upload failed.'
      };
    }
  }

  const { error } = await supabase
    .from('articles')
    .insert({
      id: articleId,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      image: imageUrl,
      category: article.category,
      author: article.author,
      date: article.date,
      read_time: article.readTime,
      tags: article.tags
    });

  if (error) {
    if (uploadedImagePath && uploadedImageBucket) await supabase.storage.from(uploadedImageBucket).remove([uploadedImagePath]);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateArticle(id: string, article: Omit<Article, 'id'>, imageFile?: File): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase must be configured to edit health tips.' };
  }

  let imageUrl = article.image;
  let uploadedImagePath: string | null = null;
  let uploadedImageBucket: string | null = null;

  if (imageFile) {
    try {
      const optimizedImage = await fileToDataUrl(imageFile);
      const imageBlob = base64ToBlob(optimizedImage, imageFile.type);
      const extension = imageBlob.type === 'image/png' ? 'png' : imageBlob.type === 'image/webp' ? 'webp' : 'jpg';
      const filePath = `health-tips/${id}-${Date.now()}.${extension}`;
      const uploadOptions = { cacheControl: '3600', contentType: imageBlob.type || 'image/jpeg' };
      let bucket = 'articles';
      let { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, imageBlob, uploadOptions);

      if (uploadError?.message.toLowerCase().includes('bucket not found')) {
        bucket = 'medicines';
        ({ error: uploadError } = await supabase.storage.from(bucket).upload(filePath, imageBlob, uploadOptions));
      }
      if (uploadError) return { success: false, error: `Image upload failed: ${uploadError.message}` };

      uploadedImagePath = filePath;
      uploadedImageBucket = bucket;
      imageUrl = supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? `Image upload failed: ${error.message}` : 'Image upload failed.'
      };
    }
  }

  const { data, error } = await supabase
    .from('articles')
    .update({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      image: imageUrl,
      category: article.category,
      author: article.author,
      date: article.date,
      read_time: article.readTime,
      tags: article.tags
    })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error || !data) {
    if (uploadedImagePath && uploadedImageBucket) {
      await supabase.storage.from(uploadedImageBucket).remove([uploadedImagePath]);
    }
    return { success: false, error: error?.message || 'Article was not found in the database.' };
  }

  return { success: true };
}

export async function deleteArticle(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase must be configured to delete health tips.' };
  }

  const { data, error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error || !data) {
    return { success: false, error: error?.message || 'Article was not found in the database.' };
  }

  return { success: true };
}

export async function submitContactMessage(message: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Contact messages are temporarily unavailable.' };

  const { error } = await supabase.from('contact_messages').insert({
    name: message.name.trim(),
    email: message.email.trim().toLowerCase(),
    phone: message.phone.trim(),
    subject: message.subject.trim(),
    message: message.message.trim()
  });

  return error ? { success: false, error: error.message } : { success: true };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, name, email, phone, subject, message, status, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.created_at
  }));
}

export async function updateContactMessageStatus(id: string, status: ContactMessage['status']): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', id);
  return !error;
}

// ============================================================
// ORDERS API
// ============================================================

function isValidUUID(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

// Helper to determine if a URL/data string is a PDF
export function isPdfFile(urlOrData?: string | null): boolean {
  if (!urlOrData) return false;
  if (urlOrData.includes('application/pdf') || urlOrData.includes('application/x-pdf')) return true;
  if (urlOrData.toLowerCase().includes('.pdf')) return true;
  // Check PDF Magic Bytes in base64 (%PDF- in base64 is JVBERi)
  if (urlOrData.startsWith('data:') && urlOrData.includes('JVBERi')) return true;
  return false;
}

// Convert base64 Data URL to a native binary Blob
export function base64ToBlob(dataUrl: string, defaultMime = 'application/pdf'): Blob {
  try {
    const parts = dataUrl.split(',');
    const header = parts[0] || '';
    const base64Content = parts[1] || parts[0];
    const mimeMatch = header.match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : defaultMime;

    const cleanBase64 = base64Content.replace(/[\r\n\s]/g, '');
    const binaryString = atob(cleanBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: mimeType });
  } catch (err) {
    console.error('base64ToBlob decode failed:', err);
    return new Blob([], { type: defaultMime });
  }
}

// Convert File to base64 Data URL, optimizing image dimensions to fit reliably into browser storage
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const isPdf = file.type === 'application/pdf' || 
                  file.type === 'application/x-pdf' || 
                  file.name.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      const reader = new FileReader();
      reader.onload = () => {
        let result = reader.result as string;
        // Ensure proper application/pdf MIME type prefix in Data URL
        if (!result.startsWith('data:application/pdf;base64,')) {
          const parts = result.split(',');
          result = `data:application/pdf;base64,${parts[1] || parts[0]}`;
        }
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1600;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
            return;
          }
        } catch {
          // fallback
        }
        resolve(rawUrl);
      };
      img.onerror = () => resolve(rawUrl);
      img.src = rawUrl;
    };
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

let memoryPrescriptions: Prescription[] | null = null;

// IndexedDB integration for large PDF documents & images
const DB_NAME = 'EzraPharmacyDB';
const DB_STORE = 'prescriptions';

function openRxDB(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(DB_STORE)) {
          db.createObjectStore(DB_STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function persistToIndexedDB(prescriptions: Prescription[]): Promise<void> {
  const db = await openRxDB();
  if (!db) return;
  try {
    const tx = db.transaction(DB_STORE, 'readwrite');
    const store = tx.objectStore(DB_STORE);
    for (const rx of prescriptions) {
      store.put(rx);
    }
  } catch (err) {
    console.warn('IndexedDB write warning:', err);
  }
}

async function loadFromIndexedDB(): Promise<Prescription[]> {
  const db = await openRxDB();
  if (!db) return [];
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(DB_STORE, 'readonly');
      const store = tx.objectStore(DB_STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        resolve(Array.isArray(req.result) ? req.result : []);
      };
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

// Background sync from IndexedDB on startup
if (typeof window !== 'undefined') {
  loadFromIndexedDB().then(idbItems => {
    if (idbItems && idbItems.length > 0) {
      const current = memoryPrescriptions || getStoredPrescriptions();
      const map = new Map<string, Prescription>();
      // Current in-memory items
      current.forEach(p => map.set(p.id, p));
      // Overwrite/enrich with IndexedDB items (which have complete uncompressed data)
      idbItems.forEach(p => map.set(p.id, p));

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      memoryPrescriptions = merged;
      window.dispatchEvent(new CustomEvent('ezra_prescriptions_updated', { detail: merged }));
    }
  }).catch(() => {});
}

export function getStoredPrescriptions(): Prescription[] {
  if (memoryPrescriptions && memoryPrescriptions.length > 0) {
    return memoryPrescriptions;
  }
  try {
    const raw = localStorage.getItem(PRESCRIPTIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRESCRIPTIONS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_PRESCRIPTIONS));
      memoryPrescriptions = [...INITIAL_MOCK_PRESCRIPTIONS];
      return memoryPrescriptions;
    }
    const parsed = JSON.parse(raw);
    memoryPrescriptions = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_MOCK_PRESCRIPTIONS];
    return memoryPrescriptions;
  } catch {
    memoryPrescriptions = [...INITIAL_MOCK_PRESCRIPTIONS];
    return memoryPrescriptions;
  }
}

export function saveStoredPrescriptions(prescriptions: Prescription[]): void {
  memoryPrescriptions = prescriptions;
  // Always persist all items to IndexedDB
  persistToIndexedDB(prescriptions);

  try {
    localStorage.setItem(PRESCRIPTIONS_STORAGE_KEY, JSON.stringify(prescriptions));
  } catch (err) {
    console.warn('localStorage quota reached, keeping top items in localStorage and full data in IndexedDB:', err);
    try {
      const trimmed = prescriptions.slice(0, 5);
      localStorage.setItem(PRESCRIPTIONS_STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // Memory cache and IndexedDB will keep it
    }
  }
  window.dispatchEvent(new CustomEvent('ezra_prescriptions_updated', { detail: prescriptions }));
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
    const isPdf = file.type === 'application/pdf' || 
                  file.type === 'application/x-pdf' || 
                  file.name.toLowerCase().endsWith('.pdf');

    // 1. Read file as Base64 Data URL for immediate reliability
    const dataUrl = await fileToDataUrl(file);
    let imageUrl = dataUrl;

    // 2. Try Supabase cloud sync if configured
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop() || (isPdf ? 'pdf' : 'jpg');
        const folder = isValidUUID(userId) ? userId : 'guests';
        const filePath = `${folder}/${prescriptionId}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('prescriptions')
          .upload(filePath, file, { upsert: true });

        if (!uploadError) {
          // Generate a signed URL for private bucket access (valid for 1 year)
          const { data: signedData } = await supabase.storage
            .from('prescriptions')
            .createSignedUrl(filePath, 60 * 60 * 24 * 365);
          if (signedData?.signedUrl) {
            imageUrl = signedData.signedUrl;
          }
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

    // 3. Always save to local store with complete original file metadata
    const newPrescription: Prescription = {
      id: prescriptionId,
      userId: userId || undefined,
      userName: userName || 'Customer',
      userPhone: userPhone || '',
      doctorName: doctorName || '',
      notes: notes || '',
      image: imageUrl,
      fileData: dataUrl,
      fileName: file.name,
      fileType: isPdf ? 'application/pdf' : (file.type || 'image/jpeg'),
      fileSize: file.size,
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

    const cloudPrescriptions: Prescription[] = await Promise.all(data.map(async p => {
      let finalImage = p.image_url;
      // If image_url is a private bucket public URL, convert to signed URL automatically
      if (finalImage && finalImage.includes('/object/public/prescriptions/')) {
        const path = finalImage.split('/prescriptions/')[1]?.split('?')[0];
        if (path) {
          try {
            const { data: sData } = await supabase.storage
              .from('prescriptions')
              .createSignedUrl(path, 60 * 60 * 24 * 30);
            if (sData?.signedUrl) {
              finalImage = sData.signedUrl;
            }
          } catch {}
        }
      }

      return {
        id: p.id,
        userId: p.user_id,
        userName: p.user_name || 'Customer',
        userPhone: p.user_phone || '',
        doctorName: p.doctor_name || '',
        image: finalImage,
        notes: p.notes || '',
        status: p.status,
        createdAt: p.created_at,
        medicines: p.medicines || []
      };
    }));

    // Merge cloud and local so no items are lost, preserving local fileData & image data
    const localMap = new Map<string, Prescription>();
    localList.forEach(p => localMap.set(p.id, p));

    const mergedMap = new Map<string, Prescription>();
    cloudPrescriptions.forEach(cloudP => {
      const localP = localMap.get(cloudP.id);
      if (localP) {
        // If local has real base64 data, keep it!
        const image = localP.image?.startsWith('data:') ? localP.image : cloudP.image;
        mergedMap.set(cloudP.id, {
          ...cloudP,
          ...localP,
          status: cloudP.status || localP.status,
          image,
          fileData: localP.fileData || (localP.image?.startsWith('data:') ? localP.image : undefined),
          fileName: localP.fileName || cloudP.fileName,
          fileType: localP.fileType || cloudP.fileType,
          fileSize: localP.fileSize || cloudP.fileSize,
        });
      } else {
        mergedMap.set(cloudP.id, cloudP);
      }
    });

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

// Download/read prescription file as a true binary Blob (never downloads 404 JSON errors)
export async function getPrescriptionBlob(rx: Prescription): Promise<{ blob: Blob; fileName: string }> {
  const isPdf = rx.fileType === 'application/pdf' || 
                (rx.fileName && rx.fileName.toLowerCase().endsWith('.pdf')) ||
                (rx.image && (rx.image.includes('application/pdf') || rx.image.includes('.pdf') || rx.image.includes('JVBERi')));
  
  const cleanPatient = (rx.userName || 'Patient').replace(/[^a-zA-Z0-9_-]/g, '_');
  const ext = isPdf ? 'pdf' : (rx.image?.includes('image/png') ? 'png' : 'jpg');
  const defaultFileName = `Prescription-${rx.id}-${cleanPatient}.${ext}`;
  const fileName = rx.fileName || defaultFileName;

  // 1. Try base64 dataUrl (from fileData or image)
  const sourceData = rx.fileData || rx.image;
  if (sourceData && sourceData.startsWith('data:')) {
    const mime = isPdf ? 'application/pdf' : (ext === 'png' ? 'image/png' : 'image/jpeg');
    const blob = base64ToBlob(sourceData, mime);
    if (blob && blob.size > 200) {
      return { blob, fileName };
    }
  }

  // 2. Try Supabase storage direct download if configured
  if (isSupabaseConfigured && sourceData) {
    let storagePath = '';
    if (sourceData.includes('/prescriptions/')) {
      storagePath = sourceData.split('/prescriptions/')[1].split('?')[0];
    } else if (!sourceData.startsWith('http')) {
      storagePath = sourceData;
    }

    if (storagePath) {
      try {
        const { data: storageBlob, error } = await supabase.storage.from('prescriptions').download(storagePath);
        if (!error && storageBlob && storageBlob.size > 200) {
          return { blob: storageBlob, fileName };
        }
      } catch (err) {
        console.warn('Direct supabase download warning:', err);
      }
    }
  }

  // 3. Try fetching URL with strict verification
  if (sourceData && (sourceData.startsWith('http://') || sourceData.startsWith('https://'))) {
    const response = await fetch(sourceData);
    if (!response.ok) {
      throw new Error(`Storage server returned error ${response.status}: ${response.statusText}`);
    }
    const blob = await response.blob();
    // Validate that it's not a JSON error response
    if (blob.type.includes('json') || blob.size < 200) {
      const text = await blob.text();
      if (text.includes('error') || text.includes('Bucket not found') || text.includes('NoSuchBucket')) {
        throw new Error('Supabase storage file not found or inaccessible.');
      }
      return { blob: new Blob([text], { type: isPdf ? 'application/pdf' : 'image/jpeg' }), fileName };
    }
    return { blob, fileName };
  }

  throw new Error('No valid prescription file data found.');
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

export async function addMedicine(med: Omit<Medicine, 'id' | 'rating' | 'reviewCount'>, imageFile?: File): Promise<{ success: boolean; error?: string }> {
  const generatedId = `med-${Date.now().toString().slice(-5)}`;

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  let imageUrl = med.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop';
  let uploadedImagePath: string | null = null;

  if (imageFile) {
    try {
      const optimizedImage = await fileToDataUrl(imageFile);
      const imageBlob = base64ToBlob(optimizedImage, imageFile.type);
      const extension = imageBlob.type === 'image/png' ? 'png' : imageBlob.type === 'image/webp' ? 'webp' : 'jpg';
      const filePath = `catalog/${generatedId}-${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from('medicines')
        .upload(filePath, imageBlob, { cacheControl: '3600', contentType: imageBlob.type || 'image/jpeg' });

      if (uploadError) return { success: false, error: `Image upload failed: ${uploadError.message}` };

      uploadedImagePath = filePath;
      imageUrl = supabase.storage.from('medicines').getPublicUrl(filePath).data.publicUrl;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? `Image upload failed: ${error.message}` : 'Image upload failed.'
      };
    }
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
      image: imageUrl,
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
    if (uploadedImagePath) {
      await supabase.storage.from('medicines').remove([uploadedImagePath]);
    }
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

export async function getWishlist(userId: string): Promise<Medicine[]> {
  if (!isSupabaseConfigured || userId === 'guest') return getLocalWishlist(userId);

  const { data, error } = await supabase
    .from('wishlists')
    .select('medicine_id')
    .eq('user_id', userId);

  if (error || !data) return getLocalWishlist(userId);
  const medicineIds = data.map(entry => entry.medicine_id);
  const medicines = await getMedicines();
  const wishlist = medicineIds
    .map(id => medicines.find(medicine => medicine.id === id))
    .filter((medicine): medicine is Medicine => Boolean(medicine));
  setLocalWishlist(userId, wishlist);
  return wishlist;
}

export async function addWishlistItem(userId: string, medicine: Medicine): Promise<WishlistWriteResult> {
  const current = getLocalWishlist(userId);
  if (!current.some(item => item.id === medicine.id) && !setLocalWishlist(userId, [...current, medicine])) return 'failed';

  if (!isSupabaseConfigured || userId === 'guest') return 'local';

  const { error } = await supabase
    .from('wishlists')
    .upsert({ user_id: userId, medicine_id: medicine.id }, { onConflict: 'user_id,medicine_id', ignoreDuplicates: true });
  return error ? 'local' : 'synced';
}

export async function removeWishlistItem(userId: string, medicineId: string): Promise<WishlistWriteResult> {
  if (!setLocalWishlist(userId, getLocalWishlist(userId).filter(medicine => medicine.id !== medicineId))) return 'failed';

  if (!isSupabaseConfigured || userId === 'guest') return 'local';

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('medicine_id', medicineId);
  return error ? 'local' : 'synced';
}

export async function getAllWishlistEntries(): Promise<AdminWishlistEntry[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('wishlists')
    .select('user_id, medicine_id, created_at');
  if (error || !data?.length) return [];

  const [medicines, profilesResult] = await Promise.all([
    getMedicines(),
    supabase.from('profiles').select('id, name, email').in('id', [...new Set(data.map(entry => entry.user_id))])
  ]);
  const profiles = profilesResult.data || [];

  return data.flatMap(entry => {
    const medicine = medicines.find(item => item.id === entry.medicine_id);
    if (!medicine) return [];
    const profile = profiles.find(item => item.id === entry.user_id);
    return [{
      userId: entry.user_id,
      userName: profile?.name || 'Customer',
      userEmail: profile?.email || '',
      medicine,
      createdAt: entry.created_at
    }];
  });
}

