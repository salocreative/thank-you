export interface Client {
  slug: string;
  clientName: string;
  recipientNames: string;
  projectDescription: string;
  personalMessage: string | string[];
  /** Who the team video is from, e.g. "Carl & Toby". Section hidden when null/empty. */
  teamVideoPresenters: string | null;
  /** Vimeo video ID. Shows placeholder when presenters set but URL is null. */
  teamVideoUrl: string | null;
  /** Placeholder subtext when video is not ready yet */
  teamVideoPlaceholderText?: string | null;
  showUpsell: boolean;
  /** Optional override for the referral action card description */
  referralActionDescription?: string;
  /** Optional upsell copy overrides for personalised pages */
  upsellHeading?: string;
  upsellDescription?: string;
  upsellButtonText?: string;
}

export function hasTeamVideo(client: Client): boolean {
  return Boolean(client.teamVideoPresenters?.trim() || client.teamVideoUrl?.trim());
}

export const clients: Record<string, Client> = {};

export function getClientSlugs(): string[] {
  return Object.keys(clients);
}

export function getClient(slug: string): Client | undefined {
  return clients[slug];
}
