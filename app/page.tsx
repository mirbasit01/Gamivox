import Link from "next/link";
import type { Metadata } from "next";
import { Gamepad2, Star, Play } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import GamesBrowser from "@/components/games/GamesBrowser";
import GameCard from "@/components/games/GameCard";
import GameArt from "@/components/games/GameArt";
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
  const featured = GAMES[0];
  const spotlight = GAMES.slice(1, 4);

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
            <Link
              href={`/play/${featured.slug}`}
              className="group relative flex min-h-[320px] items-center overflow-hidden rounded-3xl p-8"
              style={{ background: featured.gradient }}
            >
              {/* darkening + sheen */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/60 via-black/10 to-white/10" />
              {/* soft glow blobs */}
              <span className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
              <span className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-black/25 blur-3xl" />
              {/* faded art for mobile background */}
              <GameArt
                slug={featured.slug}
                emoji={featured.emoji}
                className="pointer-events-none absolute -right-4 bottom-0 w-44 opacity-25 sm:hidden"
              />

              {/* text */}
              <div className="relative z-10 max-w-sm">
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-black/40 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  <Star className="h-3.5 w-3.5 fill-white" /> Featured Game
                </span>
                <h1 className="text-4xl font-black leading-none text-white drop-shadow-lg md:text-5xl">
                  {featured.title}
                </h1>
                <p className="mt-3 max-w-xs text-sm text-white/90">{featured.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black shadow-xl transition-transform group-hover:scale-105">
                  <Play className="h-4 w-4 fill-black" /> Play now
                </span>
              </div>

              {/* framed game preview */}
              <div
                className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 sm:block"
                style={{ animation: "floaty 4.5s ease-in-out infinite" }}
              >
                <div className="rotate-3 rounded-3xl bg-black/25 p-3 shadow-2xl ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:rotate-0">
                  <div
                    className="flex items-center justify-center rounded-2xl p-4"
                    style={{ background: featured.gradient }}
                  >
                    <GameArt
                      slug={featured.slug}
                      emoji={featured.emoji}
                      className="w-40 drop-shadow-xl lg:w-52"
                    />
                  </div>
                </div>
              </div>
            </Link>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {spotlight.map((g) => (
                <GameCard key={g.slug} game={g} large />
              ))}
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
              <strong className="text-text">classic</strong> games, all built with
              modern HTML5 technology so they run smoothly on desktop, tablet and
              mobile. Whether you want a quick five-minute break or a high-score
              challenge, there's something here for you. New to a game? Check out
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
