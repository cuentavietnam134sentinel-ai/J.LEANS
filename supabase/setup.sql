-- 1. Create photos table
create table if not exists public.photos (
  id uuid default gen_random_uuid() primary key,
  title text,
  storage_path text not null,
  public_url text not null,
  display_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security
alter table public.photos enable row level security;

-- 3. Policies for photos table
create policy "Allow public read access on photos"
  on public.photos for select
  using (true);

create policy "Allow authenticated insert on photos"
  on public.photos for insert
  to authenticated
  with check (true);

create policy "Allow authenticated delete on photos"
  on public.photos for delete
  to authenticated
  using (true);

-- 4. Storage Bucket Setup
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- 5. Storage policies
create policy "Allow public read access on photos storage"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "Allow authenticated upload on photos storage"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'photos');

create policy "Allow authenticated delete on photos storage"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'photos');
