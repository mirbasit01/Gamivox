import type { MetadataRoute } from "next";
import { CATEGORIES, GAMES } from "@/lib/games";
import { absUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absUrl("/guide"), changeFrequency: "monthly", priority: 0.7 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: absUrl(`/category/${c.toLowerCase()}`),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const gamePages: MetadataRoute.Sitemap = GAMES.map((g) => ({
    url: absUrl(`/play/${g.slug}`),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages, ...gamePages];
}
