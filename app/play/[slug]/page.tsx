import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GAMES, getGame } from "@/lib/games";
import GameCard from "@/components/games/GameCard";
import PhaserGame from "@/components/games/PhaserGame";

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  return {
    title: game ? `${game.title} · Gamivox` : "Gamivox",
    description: game?.description,
  };
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  const more = GAMES.filter((g) => g.slug !== game.slug).slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      {/* breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-text-dim">
        <Link href="/" className="font-bold text-text hover:text-accent">
          🎮 Gamivox
        </Link>
        <span>/</span>
        <span>{game.category}</span>
        <span>/</span>
        <span className="text-text">{game.title}</span>
      </div>

      {/* game stage */}
      <div
        className="rounded-3xl border border-border p-4 sm:p-6"
        style={{ boxShadow: `0 0 60px -20px ${game.accent}` }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{game.emoji}</span>
            <div>
              <h1 className="text-xl font-black leading-tight">{game.title}</h1>
              <p className="text-xs text-text-dim">{game.controls}</p>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-full border border-border px-4 py-1.5 text-sm font-semibold text-text-dim hover:text-text"
          >
            ← Back
          </Link>
        </div>

        <div className="rounded-2xl bg-black/40 p-2 sm:p-4">
          <PhaserGame slug={game.slug} />
        </div>
      </div>

      {/* about */}
      <div className="mt-6 rounded-2xl border border-border bg-bg-elev p-5">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-text-dim">
          About this game
        </h2>
        <p className="text-sm text-text">{game.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {game.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-bg-card px-3 py-1 text-xs font-semibold text-text-dim"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* more games */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-black">More games</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {more.map((g) => (
            <GameCard key={g.slug} game={g} />
          ))}
        </div>
      </div>
    </div>
  );
}
