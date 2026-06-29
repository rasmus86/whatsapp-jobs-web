# WhatsApp Jobs — whatsappjobs.com.au

Marketing site for **WhatsApp Jobs** (powered by Yakka).

Layout cloned from [sowieso.wero-wallet.eu](https://sowieso.wero-wallet.eu/nl/consument) with **Lenis** smooth scroll, **GSAP ScrollTrigger** (pin + scrub), and **Lottie** (hero hands, planes, puzzle, phase icons, FAQ illos). Replace Dutch placeholder copy in `src/pages/index.astro` and `src/data/wero-faq.ts`.

### Dev assets (Wero reference)

```bash
npm run assets:wero      # PNG/SVG from wero-wallet.eu → public/media/
npm run lottie:extract   # Lottie JSON from Nuxt bundle → public/lottie/
```

For **production**, use your own illustrations/Lottie — do not ship Wero-owned assets on whatsappjobs.com.au.

## Local dev

```bash
cd whatsapp-jobs-web
npm install
npm run dev
```

Open http://localhost:4321

## Build

```bash
npm run build
npm run preview
```

Output: `dist/`

## Before launch checklist

- [ ] Add `public/og-image.png` (1200×630) for social previews
- [ ] Add `public/apple-touch-icon.png` (180×180)
- [ ] Create GitHub repo and push this folder (or repo root = this folder)
- [ ] Deploy (Cloudflare Pages / Vercel / Netlify)
- [ ] Point Hostinger DNS to deploy host
- [ ] Submit sitemap in Google Search Console

## Deploy on Cloudflare Pages (recommended)

1. Push to GitHub `main`.
2. Cloudflare Dashboard → Pages → Create project → Connect GitHub.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Root directory: `/` (if repo is only this site) or `whatsapp-jobs-web` if monorepo.
6. Custom domain: `whatsappjobs.com.au` and `www.whatsappjobs.com.au` (redirect www → apex).

## Hostinger DNS (apex + www)

| Type  | Name | Value |
|-------|------|--------|
| CNAME | www  | `<your-pages>.pages.dev` |
| A or CNAME @ | @ | Per Cloudflare/Vercel docs |

If using Cloudflare proxy, set nameservers at Hostinger to Cloudflare.

## SEO

- `en-AU` language, geo meta, JSON-LD (WebSite, Organization, Service, FAQPage)
- Sitemap auto-generated on build
- Edit copy in `src/data/faq.ts` and page components

## Contact CTA

WhatsApp: [+61 416 184 624](https://wa.me/61416184624)

Config: `src/site.ts`
