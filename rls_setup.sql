-- BizFuture.ai row-level security. Run in the Supabase SQL editor AFTER the new code is
-- deployed and SUPABASE_SERVICE_ROLE_KEY is set on the host. Run the whole file once.
-- If it errors on a type mismatch in the inquiries policy, tell me the error text.

create or replace function public.is_admin() returns boolean
language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email','')) in ('ajbock@gmail.com','aj.bock@gmail.com')
$$;

-- businesses: owner id (email stays the public contact address)
alter table public.businesses
  add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete set null;
update public.businesses b set user_id = u.id
  from auth.users u where b.user_id is null and lower(u.email) = lower(b.email);

-- ---------- users ----------
alter table public.users enable row level security;
drop policy if exists users_select_own on public.users;
drop policy if exists users_insert_own on public.users;
drop policy if exists users_update_own on public.users;
create policy users_select_own on public.users for select to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email') or public.is_admin());
create policy users_insert_own on public.users for insert to authenticated
  with check (lower(email) = lower(auth.jwt() ->> 'email') and subscription_tier in ('free','directory'));
create policy users_update_own on public.users for update to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'))
  with check (lower(email) = lower(auth.jwt() ->> 'email'));
-- users can never change their own tier or Stripe ids from the browser
revoke update on public.users from anon, authenticated;
grant update (name, phone, company) on public.users to authenticated;

-- ---------- businesses ----------
alter table public.businesses enable row level security;
drop policy if exists businesses_select on public.businesses;
drop policy if exists businesses_insert on public.businesses;
drop policy if exists businesses_update on public.businesses;
drop policy if exists businesses_delete on public.businesses;
create policy businesses_select on public.businesses for select to anon, authenticated
  using (status in ('active','sold') or user_id = auth.uid() or public.is_admin());
create policy businesses_insert on public.businesses for insert to authenticated
  with check (user_id = auth.uid());
create policy businesses_update on public.businesses for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy businesses_delete on public.businesses for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ---------- inquiries (inserted by the server with the service key) ----------
alter table public.inquiries enable row level security;
drop policy if exists inquiries_select_owner on public.inquiries;
create policy inquiries_select_owner on public.inquiries for select to authenticated
  using (public.is_admin() or exists (
    select 1 from public.businesses b
    where b.id = inquiries.business_id and b.user_id = auth.uid()));

-- ---------- buyers (public sign-up form; only admin can read) ----------
alter table public.buyers enable row level security;
drop policy if exists buyers_insert on public.buyers;
drop policy if exists buyers_select_admin on public.buyers;
create policy buyers_insert on public.buyers for insert to anon, authenticated with check (true);
create policy buyers_select_admin on public.buyers for select to authenticated using (public.is_admin());

-- ---------- brokers: admin can see pending/suspended ----------
drop policy if exists "Admin can view all brokers" on public.brokers;
create policy "Admin can view all brokers" on public.brokers for select to authenticated
  using (public.is_admin());

-- ---------- storage: stop anyone listing every file in listing-images ----------
drop policy if exists "Allow public reads 1i0okip_0" on storage.objects;

-- ---------- verify: every row should say true ----------
select relname, relrowsecurity from pg_class
where relnamespace = 'public'::regnamespace
  and relname in ('users','businesses','inquiries','buyers','brokers');
