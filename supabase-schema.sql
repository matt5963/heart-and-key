create table if not exists public.kv_store (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default now()
);

alter table public.kv_store disable row level security;
