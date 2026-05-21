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

export const clients: Record<string, Client> = {
  provenant: {
    slug: 'provenant',
    clientName: 'Provenant',
    recipientNames: 'Kai, Kate',
    projectDescription: 'Provenant brand and website',
    personalMessage: [
      "Working on Provenant's brand and website has been one of those projects we genuinely look forward to showing people. You came in with a clear sense of what Provenant stands for, and that made it possible to do something worth being proud of.",
      'Thank you for trusting us with it, for being great to work with, and for giving us the room to do our best work. That combination is rarer than it should be.',
      "We've put together a short message below. And if you have a few minutes, there are a couple of ways you can help us reach more clients like you.",
    ],
    teamVideoPresenters: 'Carl & Toby',
    teamVideoUrl: null,
    showUpsell: true,
    referralActionDescription:
      'If you know a brand or business that needs proper design thinking applied, we would love an introduction. Even a LinkedIn message is enough to get a conversation started.',
    upsellHeading: 'Need ongoing design support? Flexi-Design has you covered.',
    upsellDescription:
      'Whether it is campaign assets, social content, or the next thing on the list — our credit-based model gives you instant access to the full Salo team whenever you need it. No retainer, no overhead.',
    upsellButtonText: 'Find out more',
  },
};

export function getClientSlugs(): string[] {
  return Object.keys(clients);
}

export function getClient(slug: string): Client | undefined {
  return clients[slug];
}
