import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import GamesBrowser from "@/components/games/GamesBrowser";
import GameCard from "@/components/games/GameCard";
import { GAMES } from "@/lib/games";

export default function Home() {
  const featured = GAMES[0];
  const spotlight = GAMES.slice(1, 4);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-border bg-bg/80 px-6 py-4 backdrop-blur md:hidden">
          <Link href="/" className="text-lg font-black">
            Gami<span className="text-accent">vox</span> 🎮
          </Link>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Hero */}
          <section className="mb-10 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <Link
              href={`/play/${featured.slug}`}
              className="group relative flex min-h-[240px] items-end overflow-hidden rounded-3xl p-8"
              style={{ background: featured.gradient }}
            >
              <span
                className="absolute right-8 top-6 text-8xl opacity-90"
                style={{ animation: "floaty 4s ease-in-out infinite" }}
              >
                {featured.emoji}
              </span>
              <div className="relative z-10 max-w-md">
                <span className="mb-2 inline-block rounded-md bg-black/30 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Featured
                </span>
                <h1 className="text-3xl font-black text-white drop-shadow md:text-4xl">
                  {featured.title}
                </h1>
                <p className="mt-2 text-sm text-white/90">{featured.description}</p>
                <span className="mt-4 inline-block rounded-full bg-white px-6 py-2 text-sm font-bold text-black transition-transform group-hover:scale-105">
                  ▶ Play now
                </span>
              </div>
            </Link>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {spotlight.map((g) => (
                <GameCard key={g.slug} game={g} large />
              ))}
            </div>
          </section>

          {/* Browser with search + filters */}
          <section id="all">
            <h2 className="mb-4 text-xl font-black">All Games</h2>
            <GamesBrowser />
          </section>
        </div>

        <footer className="border-t border-border px-6 py-8 text-center text-sm text-text-dim">
          Built with Next.js + Phaser · Gamivox 🎮
        </footer>
      </main>
    </div>
  );
}
