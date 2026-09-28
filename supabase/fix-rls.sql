-- ============================================================
-- EZRA PHARMACY — PERMISSION FIX (Run in Supabase SQL Editor)
-- Allows customers and guests to insert orders and upload prescriptions
-- ============================================================

-- 1. ORDERS POLICIES
-- Allow any customer or guest to place an order
drop policy if exists "Anyone or auth users can insert orders" on public.orders;
drop policy if exists "Allow guest and auth order inserts" on public.orders;
create policy "Allow guest and auth order inserts" on public.orders
  for insert with check (true);

-- Allow reading orders
drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Allow select orders" on public.orders;
create policy "Allow select orders" on public.orders
  for select using (true);

-- 2. PRESCRIPTIONS POLICIES
-- Allow any patient or guest to upload prescriptions
drop policy if exists "Auth users can upload prescriptions" on public.prescriptions;
drop policy if exists "Anyone can upload prescriptions" on public.prescriptions;
create policy "Anyone can upload prescriptions" on public.prescriptions
  for insert with check (true);

-- Allow reading prescriptions
drop policy if exists "Users can view own prescriptions" on public.prescriptions;
drop policy if exists "Allow select prescriptions" on public.prescriptions;
create policy "Allow select prescriptions" on public.prescriptions
  for select using (true);

-- 3. STORAGE POLICIES
-- Allow anyone to upload prescription files to the storage bucket
drop policy if exists "Authenticated users can upload prescription files" on storage.objects;
drop policy if exists "Anyone can upload prescription files" on storage.objects;
create policy "Anyone can upload prescription files" on storage.objects
  for insert with check (bucket_id = 'prescriptions');

drop policy if exists "Users can read own uploaded prescriptions, or admins" on storage.objects;
drop policy if exists "Anyone can read prescription files" on storage.objects;
create policy "Anyone can read prescription files" on storage.objects
  for select using (bucket_id = 'prescriptions');
