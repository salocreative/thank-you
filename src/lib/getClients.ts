import { createClient } from '@supabase/supabase-js';
import { clients as fallbackClients, type Client } from '../data/clients';

interface DbRow {
  slug: string;
  client_name: string;
  recipient_names: string;
  project_description: string;
  personal_message: string | string[];
  team_video_presenters: string | null;
  team_video_url: string | null;
  team_video_placeholder_text: string | null;
  show_upsell: boolean;
  referral_action_description: string | null;
  upsell_heading: string | null;
  upsell_description: string | null;
  upsell_button_text: string | null;
}

function mapRow(row: DbRow): Client {
  return {
    slug: row.slug,
    clientName: row.client_name,
    recipientNames: row.recipient_names,
    projectDescription: row.project_description,
    personalMessage: row.personal_message,
    teamVideoPresenters: row.team_video_presenters,
    teamVideoUrl: row.team_video_url,
    teamVideoPlaceholderText: row.team_video_placeholder_text ?? undefined,
    showUpsell: row.show_upsell,
    referralActionDescription: row.referral_action_description ?? undefined,
    upsellHeading: row.upsell_heading ?? undefined,
    upsellDescription: row.upsell_description ?? undefined,
    upsellButtonText: row.upsell_button_text ?? undefined,
  };
}

export async function getClients(): Promise<Record<string, Client>> {
  const url = import.meta.env.SUPABASE_URL;
  const key =
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? import.meta.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn(
      '[thank-you] Supabase not configured — using local clients.ts fallback',
    );
    return fallbackClients;
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('thank_you_clients')
    .select('*')
    .eq('published', true)
    .order('client_name');

  if (error) {
    throw new Error(`Failed to fetch thank you clients: ${error.message}`);
  }

  if (!data?.length) {
    console.warn(
      '[thank-you] No published clients in Supabase — using local fallback',
    );
    return fallbackClients;
  }

  const slugs = data.map((row) => row.slug);
  console.log(`[thank-you] Building ${slugs.length} published page(s): ${slugs.join(', ')}`);

  return Object.fromEntries(
    data.map((row) => [row.slug, mapRow(row as DbRow)]),
  );
}
