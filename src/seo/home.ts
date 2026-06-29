import { SITE } from '../site';

/** Branded SERP title — brand first, value prop, geo (yakkasport pattern). */
export const HOME_SEO_TITLE =
  'WhatsApp Jobs | Find construction & labour hire jobs on WhatsApp in Australia';

/** Primary meta description — 150–160 chars for Google snippets. */
export const HOME_SEO_DESCRIPTION =
  'WhatsApp Jobs connects Australian workers to real shifts in WhatsApp job groups: construction, tradies, hospitality and farms. No extra app. Message us to start.';

/** Primary market / GEO signals (Australia-wide, HQ Sydney area). */
export const PRIMARY_GEO = {
  regionIso: 'AU',
  placename: 'Australia',
  placenameLocal: 'Sydney, New South Wales, Australia',
  locale: 'en-AU',
  openGraphLocale: 'en_AU',
  latitude: -33.8688,
  longitude: 151.2093,
} as const;

export const HOME_PAGE_URL = SITE.url;
