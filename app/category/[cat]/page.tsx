import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Gamepad2 } from "lucide-react";
import { CATEGORIES, gamesByCategory, type Category } from "@/lib/games";
import { SITE, absUrl } from "@/lib/site";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import GameCard from "@/components/games/GameCard";
import JsonLd from "@/components/seo/JsonLd";

const CAT_INTRO: Record<Category, string> = {
  Arcade: "Fast, pick-up-and-play arcade games with simple controls and high replay value.",
  Action: "Reflex-testing action and shooting games packed with movement and intensity.",
  Puzzle: "Brain-teasing puzzle games that reward logic, planning and memory.",
  Classic: "Timeless classics reborn with a modern neon coat of paint.",
};

function toCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.toLowerCase() === slug.toLowerCase());
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ cat: c.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cat: string }>;
}): Promise<Metadata> {
  const { cat } = await params;
  const category = toCategory(cat);
  if (!category) return { title: SITE.name };
  const title = `${category} Games — Play Free Online | ${SITE.name}`;
  return {
    title,
    description: `Play free ${category.toLowerCase()} games online at ${SITE.name}. ${CAT_INTRO[category]} No download required.`,
    alternates: { canonical: `/category/${category.toLowerCase()}` },
    openGraph: { title, url: absUrl(`/category/${category.toLowerCase()}`), type: "website" },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  const category = toCategory(cat);
  if (!category) notFound();
  const list = gamesByCategory(category);

  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category} Games`,
    url: absUrl(`/category/${category.toLowerCase()}`),
    description: CAT_INTRO[category],
  };

  return (
    <div className="flex min-h-screen">
      <JsonLd data={ld} />
      <Sidebar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-dim">
            <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-text hover:text-accent">
              <Gamepad2 className="h-4 w-4 text-accent" /> {SITE.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-text">{category} Games</span>
          </nav>

          <h1 className="text-3xl font-black sm:text-4xl">
            <span className="gradient-text">{category}</span> Games
          </h1>
          <p className="mt-2 max-w-2xl text-text-dim">{CAT_INTRO[category]}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {list.map((g) => (
              <GameCard key={g.slug} game={g} />
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => c !== category).map((c) => (
              <Link
                key={c}
                href={`/category/${c.toLowerCase()}`}
                className="rounded-full border border-border bg-bg-elev px-4 py-1.5 text-sm font-semibold text-text-dim hover:text-text"
              >
                {c} Games
              </Link>
            ))}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
