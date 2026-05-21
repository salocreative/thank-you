-- Salo thank-you pages — Supabase schema
-- Run in the Supabase SQL editor for your admin portal database.

create table if not exists public.thank_you_clients (
  id uuid primary key default gen_random_uuid(),

  -- URL slug, e.g. /provenant
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),

  client_name text not null,
  recipient_names text not null,
  project_description text not null,

  -- Single string or JSON array of paragraph strings
  personal_message jsonb not null
    check (
      jsonb_typeof(personal_message) = 'string'
      or (
        jsonb_typeof(personal_message) = 'array'
        and jsonb_array_length(personal_message) > 0
      )
    ),

  -- Vimeo video ID only (not full URL); null shows the team video placeholder
  team_video_url text,

  show_upsell boolean not null default true,

  -- Optional personalised copy overrides
  referral_action_description text,
  upsell_heading text,
  upsell_description text,
  upsell_button_text text,

  published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists thank_you_clients_published_idx
  on public.thank_you_clients (published, slug);

create or replace function public.set_thank_you_clients_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists thank_you_clients_updated_at on public.thank_you_clients;

create trigger thank_you_clients_updated_at
  before update on public.thank_you_clients
  for each row
  execute function public.set_thank_you_clients_updated_at();

-- Seed: Provenant
insert into public.thank_you_clients (
  slug,
  client_name,
  recipient_names,
  project_description,
  personal_message,
  team_video_url,
  show_upsell,
  referral_action_description,
  upsell_heading,
  upsell_description,
  upsell_button_text,
  published
) values (
  'provenant',
  'Provenant',
  'Kai, Kate',
  'Provenant brand and website',
  jsonb_build_array(
    'Working on Provenant''s brand and website has been one of those projects we genuinely look forward to showing people. You came in with a clear sense of what Provenant stands for, and that made it possible to do something worth being proud of.',
    'Thank you for trusting us with it, for being great to work with, and for giving us the room to do our best work. That combination is rarer than it should be.',
    'We''ve put together a short message below. And if you have a few minutes, there are a couple of ways you can help us reach more clients like you.'
  ),
  null,
  true,
  'If you know a brand or business that needs proper design thinking applied, we would love an introduction. Even a LinkedIn message is enough to get a conversation started.',
  'Need ongoing design support? Flexi-Design has you covered.',
  'Whether it is campaign assets, social content, or the next thing on the list — our credit-based model gives you instant access to the full Salo team whenever you need it. No retainer, no overhead.',
  'Find out more',
  true
)
on conflict (slug) do nothing;

-- Row Level Security (adjust policies to match your admin portal auth model)
alter table public.thank_you_clients enable row level security;

-- Example: authenticated admin users can manage all rows
-- create policy "Admins can manage thank you clients"
--   on public.thank_you_clients
--   for all
--   to authenticated
--   using (true)
--   with check (true);

-- Example: public read access for published pages only (if fetching at build time via anon key)
-- create policy "Public can read published thank you clients"
--   on public.thank_you_clients
--   for select
--   to anon
--   using (published = true);
