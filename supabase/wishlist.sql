-- Run in the Supabase SQL Editor to enable customer and admin wishlists.
create table if not exists public.wishlists (
  user_id uuid references public.profiles(id) on delete cascade not null,
  medicine_id text references public.medicines(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, medicine_id)
);

alter table public.wishlists enable row level security;

drop policy if exists "Users can view own wishlist" on public.wishlists;
create policy "Users can view own wishlist" on public.wishlists
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can add to own wishlist" on public.wishlists;
create policy "Users can add to own wishlist" on public.wishlists
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can remove from own wishlist" on public.wishlists;
create policy "Users can remove from own wishlist" on public.wishlists
  for delete using (auth.uid() = user_id or public.is_admin());