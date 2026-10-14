// Matches gateway/product_identity.json on gateway main; all site naming uses this constant.
export const PRODUCT_NAME = 'Azizam';
export const SITE_URL = 'https://azizam.dev';
export const DESCRIPTION =
  'Azizam is a self-hosted AI gateway. Put the engines you run, and any paid providers you choose, behind one OpenAI-compatible address, with its own key, access plan and spend cap for each person and app.';

// The gateway repository is private. The site does not show a clone command.
// UNVERIFIED: PRODUCT.md names no contact. Replace this placeholder before merge.
export const CONTACT_EMAIL = 'contact-unverified@azizam.dev';
export const CONTACT_VERIFIED = false;

export const NAV = [
  { key: 'examples', label: 'Examples', href: '/examples/' },
  { key: 'docs', label: 'Docs', href: '/docs/' },
  { key: 'api', label: 'API', href: '/docs/api/' },
] as const;
export const GET_STARTED = '/docs/start/install/';
