-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Profiles: one row per user, auto-created on sign-up via trigger
create table if not exists public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  email                text,
  full_name            text,
  vault_address        text unique,
  bank_name            text,
  bank_code            text,
  account_number       text,
  account_name         text,
  telegram_chat_id     text,
  conversion_mode      text not null default 'immediate', -- 'immediate' | 'target'
  target_rate          numeric,
  total_received_usdc  numeric not null default 0,
  total_converted_ngn  numeric not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Transactions
create table if not exists public.transactions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  from_address     text not null,
  usdc_amount      numeric not null,
  ngn_amount       numeric,
  rate             numeric,
  tx_hash          text unique,
  network          text not null default 'polygon',
  status           text not null default 'received',
  -- status values: received | converted | processing_bank_transfer | complete | failed
  bank_reference   text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- FX Rates log
create table if not exists public.fx_rates (
  id            uuid primary key default gen_random_uuid(),
  rate          numeric not null,
  currency_pair text not null default 'USD/NGN',
  source        text,
  created_at    timestamptz not null default now()
);

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at auto-refresh helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_transactions_updated_at
  before update on public.transactions
  for each row execute procedure public.set_updated_at();

-- Row Level Security (service role bypasses these, frontend uses anon key)
alter table public.profiles    enable row level security;
alter table public.transactions enable row level security;
alter table public.fx_rates    enable row level security;

-- Users can read/update their own profile
create policy "own profile" on public.profiles
  for all using (auth.uid() = id);

-- Users can read their own transactions
create policy "own transactions" on public.transactions
  for select using (auth.uid() = user_id);

-- Anyone can read fx_rates
create policy "public fx_rates" on public.fx_rates
  for select using (true);
