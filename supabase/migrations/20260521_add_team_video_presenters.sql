-- Add team video presenter fields to existing thank_you_clients table.
-- Run in Supabase SQL editor after the initial schema.

alter table public.thank_you_clients
  add column if not exists team_video_presenters text,
  add column if not exists team_video_placeholder_text text;

comment on column public.thank_you_clients.team_video_presenters is
  'Names shown in the team video section, e.g. "Carl & Toby". Leave null to hide the section.';

comment on column public.thank_you_clients.team_video_url is
  'Vimeo video ID. When null but presenters is set, shows the placeholder state.';

comment on column public.thank_you_clients.team_video_placeholder_text is
  'Subtext under presenter names when video is not ready. Defaults to "Message coming shortly".';

-- Provenant: enable team video placeholder with Carl & Toby
update public.thank_you_clients
set
  team_video_presenters = 'Carl & Toby',
  team_video_placeholder_text = 'Message coming shortly'
where slug = 'provenant';
