/**
 * Central site configuration. Update SITE_URL to your real domain so that
 * canonical URLs, sitemap, robots and Open Graph tags point to the right place.
 */
export const SITE = {
  name: "Gamivox",
  // ⚠️ Change this to your production domain (used for SEO / sitemap / OG tags).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gamivox.example.com",
  tagline: "Play Free Online Games — No Download, No Install",
  description:
    "Gamivox is a free online games portal. Play browser games instantly — arcade, action, puzzle and classic games built with modern web tech. No downloads, no sign-up.",
  locale: "en_US",
  twitter: "@gamivox",
  keywords: [
    "free online games",
    "browser games",
    "play games online",
    "no download games",
    "html5 games",
    "arcade games",
    "puzzle games",
    "action games",
  ],
} as const;

export function absUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}
