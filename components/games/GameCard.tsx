import Link from "next/link";
import type { Game } from "@/lib/games";

export default function GameCard({ game, large = false }: { game: Game; large?: boolean }) {
  return (
    <Link
      href={`/play/${game.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-bg-card transition-transform duration-200 hover:-translate-y-1 hover:border-accent/60"
    >
      <div
        className={`relative flex items-center justify-center ${large ? "aspect-[4/3]" : "aspect-square"}`}
        style={{ background: game.gradient }}
      >
        <span
          className={`${large ? "text-7xl" : "text-5xl"} drop-shadow-lg transition-transform duration-300 group-hover:scale-110`}
          style={{ animation: "floaty 3.5s ease-in-out infinite" }}
        >
          {game.emoji}
        </span>
        <span className="absolute left-2 top-2 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur">
          {game.category}
        </span>
        <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black">
            ▶ Play
          </span>
        </span>
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-bold text-text">{game.title}</h3>
        <p className="truncate text-xs text-text-dim">{game.tags.join(" · ")}</p>
      </div>
    </Link>
  );
}
