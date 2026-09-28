-- ============================================================
-- EZRA PHARMACY — SUPABASE DATABASE SCHEMA
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 1. PROFILES (Extends Supabase auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default 'Customer',
  email text not null,
  phone text,
  role text not null default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  addresses jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Automatic trigger to create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 2. CATEGORIES
-- ------------------------------------------------------------
create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text not null,
  color text,
  count integer default 0,
  description text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 3. MEDICINES
-- ------------------------------------------------------------
create table if not exists public.medicines (
  id text primary key,
  name text not null,
  brand text not null,
  category text not null,
  price numeric(10, 2) not null,
  original_price numeric(10, 2),
  discount integer default 0,
  image text not null,
  description text not null default '',
  uses text[] default '{}',
  side_effects text[] default '{}',
  dosage text,
  availability text default 'in-stock' check (availability in ('in-stock', 'out-of-stock', 'limited')),
  stock integer default 0,
  requires_prescription boolean default false,
  rating numeric(2, 1) default 5.0,
  review_count integer default 0,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 4. ORDERS
-- ------------------------------------------------------------
create table if not exists public.orders (
  id text primary key default ('ORD-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 5)),
  user_id uuid references public.profiles(id) on delete set null,
  items jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total numeric(10, 2) not null,
  delivery_fee numeric(10, 2) default 0,
  payment_method text not null check (payment_method in ('cod', 'esewa', 'khalti', 'online')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  address jsonb not null,
  notes text,
  prescription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 5. PRESCRIPTIONS
-- ------------------------------------------------------------
create table if not exists public.prescriptions (
  id text primary key default ('RX-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 5)),
  user_id uuid references public.profiles(id) on delete cascade,
  user_name text not null,
  user_phone text,
  image_url text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  medicines text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 6. HEALTH ARTICLES
-- ------------------------------------------------------------
create table if not exists public.articles (
  id text primary key,
  title text not null,
  excerpt text not null,
  content text not null,
  image text not null,
  category text not null,
  author text not null,
  date date not null default current_date,
  read_time text not null,
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.medicines enable row level security;
alter table public.orders enable row level security;
alter table public.prescriptions enable row level security;
alter table public.articles enable row level security;

-- Helper to check if current authenticated user is an admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- PROFILES
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- CATEGORIES (Public Read, Admin Write)
drop policy if exists "Anyone can read categories" on public.categories;
create policy "Anyone can read categories" on public.categories
  for select using (true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories" on public.categories
  for all using (public.is_admin());

-- MEDICINES (Public Read, Admin Write)
drop policy if exists "Anyone can read medicines" on public.medicines;
create policy "Anyone can read medicines" on public.medicines
  for select using (true);

drop policy if exists "Admins can manage medicines" on public.medicines;
create policy "Admins can manage medicines" on public.medicines
  for all using (public.is_admin());

-- ARTICLES (Public Read, Admin Write)
drop policy if exists "Anyone can read articles" on public.articles;
create policy "Anyone can read articles" on public.articles
  for select using (true);

drop policy if exists "Admins can manage articles" on public.articles;
create policy "Admins can manage articles" on public.articles
  for all using (public.is_admin());

-- ORDERS (User owns order or Admin)
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Anyone or auth users can insert orders" on public.orders;
create policy "Anyone or auth users can insert orders" on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders" on public.orders
  for update using (public.is_admin());

-- PRESCRIPTIONS (User owns prescription or Admin)
drop policy if exists "Users can view own prescriptions" on public.prescriptions;
create policy "Users can view own prescriptions" on public.prescriptions
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Auth users can upload prescriptions" on public.prescriptions;
create policy "Auth users can upload prescriptions" on public.prescriptions
  for insert with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admins can update prescriptions" on public.prescriptions;
create policy "Admins can update prescriptions" on public.prescriptions
  for update using (public.is_admin());

-- ============================================================
-- STORAGE BUCKETS CONFIGURATION
-- ============================================================
-- Run these statements in Supabase to set up storage buckets:
insert into storage.buckets (id, name, public)
values 
  ('prescriptions', 'prescriptions', false),
  ('medicines', 'medicines', true)
on conflict (id) do nothing;

-- Prescriptions bucket policies:
drop policy if exists "Authenticated users can upload prescription files" on storage.objects;
create policy "Authenticated users can upload prescription files" on storage.objects
  for insert with check (bucket_id = 'prescriptions' and auth.role() = 'authenticated');

drop policy if exists "Users can read own uploaded prescriptions, or admins" on storage.objects;
create policy "Users can read own uploaded prescriptions, or admins" on storage.objects
  for select using (
    bucket_id = 'prescriptions' and (
      (storage.foldername(name))[1] = auth.uid()::text or public.is_admin()
    )
  );

-- Medicines bucket policies:
drop policy if exists "Anyone can view medicine images" on storage.objects;
create policy "Anyone can view medicine images" on storage.objects
  for select using (bucket_id = 'medicines');

drop policy if exists "Admins can upload medicine images" on storage.objects;
create policy "Admins can upload medicine images" on storage.objects
  for insert with check (bucket_id = 'medicines' and public.is_admin());
