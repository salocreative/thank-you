-- Run after thank_you_clients.sql if using SUPABASE_ANON_KEY at build time.
-- Not required when using SUPABASE_SERVICE_ROLE_KEY in CI (recommended).

create policy "Public can read published thank you clients"
  on public.thank_you_clients
  for select
  to anon
  using (published = true);
