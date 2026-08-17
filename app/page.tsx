import Link from "next/link";
import type { Metadata } from "next";
import { Flame, Gamepad2 } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import GamesBrowser from "@/components/games/GamesBrowser";
import GameCard from "@/components/games/GameCard";
import FeaturedGame from "@/components/games/FeaturedGame";
import JsonLd from "@/components/seo/JsonLd";
import { CATEGORIES, GAMES, gamesByCategory } from "@/lib/games";
import { SITE, absUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name} · ${SITE.tagline}`,
  description: SITE.description,
  keywords: [...SITE.keywords],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} · ${SITE.tagline}`,
    description: SITE.description,
    url: absUrl("/"),
    type: "website",
  },
};

export default function Home() {
  const spotlight = GAMES.slice(1, 4);
  const trending = [GAMES[0], GAMES[3], GAMES[12], GAMES[20], GAMES[28]];

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.name} — Free Online Games`,
    itemListElement: GAMES.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absUrl(`/play/${g.slug}`),
      name: g.title,
    })),
  };

  return (
    <div className="flex min-h-screen">
      <JsonLd data={itemListLd} />
      <Sidebar />

      <main className="flex-1">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border-soft bg-bg/80 px-5 py-4 backdrop-blur md:hidden">
          <Link href="/" className="flex items-center gap-1.5 text-lg font-black">
            <Gamepad2 className="h-5 w-5 text-accent" />
            <span className="gradient-text">Gamivox</span>
          </Link>
          <Link href="/guide" className="text-sm text-text-dim">
            How to Play
          </Link>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          {/* Hero */}
          <section className="mb-12 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <FeaturedGame games={GAMES} />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {spotlight.map((g) => (
                <GameCard key={g.slug} game={g} large />
              ))}
            </div>
          </section>

          <section className="mb-14">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent-3"><Flame className="h-4 w-4 fill-current" /> Fresh picks</p>
                <h2 className="text-2xl font-black">Trending <span className="gradient-text">Now</span></h2>
              </div>
              <Link href="#all-games" className="text-sm font-semibold text-accent hover:underline">Browse all →</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {trending.map((g) => <GameCard key={g.slug} game={g} />)}
            </div>
          </section>

          {/* All games with search + filters */}
          <section id="all-games" className="mb-14 scroll-mt-6">
            <div className="mb-5 text-center">
              <h2 className="text-2xl font-black">
                All <span className="gradient-text">Games</span>
              </h2>
              <p className="mt-1 text-sm text-text-dim">
                {GAMES.length} free games to play instantly — pick one and go.
              </p>
            </div>
            <GamesBrowser />
          </section>

          {/* Category rows (server-rendered → SEO) */}
          {CATEGORIES.map((cat) => {
            const list = gamesByCategory(cat);
            if (!list.length) return null;
            return (
              <section key={cat} className="mb-10">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-black">{cat} Games</h2>
                  <Link
                    href={`/category/${cat.toLowerCase()}`}
                    className="text-sm font-semibold text-accent hover:underline"
                  >
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {list.map((g) => (
                    <GameCard key={g.slug} game={g} />
                  ))}
                </div>
              </section>
            );
          })}

          {/* SEO intro copy (server-rendered) */}
          <section className="mt-14 rounded-3xl border border-border bg-bg-elev/60 p-6 sm:p-8">
            <h2 className="mb-3 text-xl font-black">Play Free Online Games at Gamivox</h2>
            <p className="text-sm leading-relaxed text-text-dim">
              {SITE.name} is a free online games portal where you can play browser
              games instantly — no downloads, no installs and no sign-up. Our
              collection spans <strong className="text-text">arcade</strong>,{" "}
              <strong className="text-text">action</strong>,{" "}
              <strong className="text-text">puzzle</strong> and{" "}
              <strong className="text-text">classic</strong> games that run
              smoothly on desktop, tablet and mobile. Whether you want a quick
              five-minute break or a high-score
              challenge, there&apos;s something here for you. New to a game? Check out
              our <Link href="/guide" className="text-accent hover:underline">how-to-play guide</Link>{" "}
              for controls and tips.
            </p>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
