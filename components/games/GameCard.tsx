import Link from "next/link";
import { Play } from "lucide-react";
import type { Game } from "@/lib/games";
import GameArt from "./GameArt";

export default function GameCard({ game, large = false }: { game: Game; large?: boolean }) {
  return (
    <Link
      href={`/play/${game.slug}`}
      aria-label={`Play ${game.title}`}
      className="group card-hover relative block overflow-hidden rounded-2xl border border-border bg-bg-card before:pointer-events-none before:absolute before:inset-0 before:z-10 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-0 before:transition-opacity hover:border-white/25 hover:before:opacity-100"
    >
      <div
        className={`relative flex items-center justify-center overflow-hidden ${large ? "aspect-video" : "aspect-square"}`}
        style={{ background: game.gradient }}
      >
        {/* sheen */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
        <GameArt
          slug={game.slug}
          emoji={game.emoji}
          className={`${large ? "w-[64%]" : "w-[72%]"} drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2`}
        />
        <span className="absolute left-2 top-2 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/90 backdrop-blur">
          {game.category}
        </span>
        <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-bold text-black shadow-lg">
            <Play className="h-4 w-4 fill-black" /> Play
          </span>
        </span>
      </div>
      <div className="relative z-20 p-3">
        <h3 className="truncate text-sm font-bold text-text">{game.title}</h3>
        <p className="truncate text-xs text-text-dim">{game.tags.slice(0, 3).join(" · ")}</p>
      </div>
    </Link>
  );
}
