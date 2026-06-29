/** Central config for SEO, CTAs, and structured data. */
export const YAKKA = {
  url: 'https://yakkalabour.com.au/',
  name: 'Yakka',
} as const;

export const SITE = {
  name: 'WhatsApp Jobs',
  tagline: 'Find labour hire and construction jobs through WhatsApp groups in Australia',
  poweredBy: YAKKA.name,
  url: 'https://whatsappjobs.com.au',
  locale: 'en-AU',
  country: 'AU',
  region: 'Australia',
  email: 'hello@whatsappjobs.com.au',
} as const;

export const WHATSAPP = {
  e164: '+61416184624',
  /** wa.me format: country code + number, no + or spaces */
  waMe: '61416184624',
  display: '+61 416 184 624',
  defaultMessage:
    'Hi, I want to learn how WhatsApp Jobs works for posting work in our group.',
} as const;

export function whatsAppUrl(message = WHATSAPP.defaultMessage): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP.waMe}?text=${text}`;
}

export const whatsAppLinkAttrs = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;

export const yakkaLinkAttrs = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;

/** Primary keywords for copy + meta (natural use in body text). */
export const SEO_KEYWORDS = [
  'whatsapp jobs',
  'whatsapp jobs australia',
  'find jobs on whatsapp',
  'whatsapp group for work',
  'whatsapp job groups australia',
  'post jobs on whatsapp',
  'labour hire whatsapp',
  'construction jobs whatsapp',
  'hire workers whatsapp group',
  'tradies jobs whatsapp',
  'whatsapp work groups australia',
  'jobs in whatsapp group',
] as const;

/** Publisher for schema.org (do not invent social URLs). */
export const PUBLISHER = {
  name: 'Yakka Web Services',
} as const;
