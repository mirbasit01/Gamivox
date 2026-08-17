"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Sparkles, Star } from "lucide-react";
import type { Game } from "@/lib/games";
import GameArt from "./GameArt";

export default function FeaturedGame({ games }: { games: Game[] }) {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featured = games[featuredIndex];

  useEffect(() => {
    if (games.length < 2) return;
    const timer = window.setInterval(() => {
      setFeaturedIndex((current) => {
        let next = current;
        while (next === current) next = Math.floor(Math.random() * games.length);
        return next;
      });
    }, 5000);
    return () => window.clearInterval(timer);
  }, [games.length]);

  return (
    <Link
      key={featured.slug}
      href={`/play/${featured.slug}`}
      className="group relative flex min-h-[280px] animate-in fade-in duration-500 items-center overflow-hidden rounded-3xl p-6 sm:p-7"
      style={{ background: featured.gradient }}
    >
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/60 via-black/10 to-white/10" />
      <span className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-black/25 blur-3xl" />
      <GameArt slug={featured.slug} emoji={featured.emoji} className="pointer-events-none absolute -right-4 bottom-0 w-44 opacity-25 sm:hidden" />

      <div className="relative z-10 max-w-sm">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-black/40 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
          <Star className="h-3.5 w-3.5 fill-white" /> Featured Game
        </span>
        <h1 className="text-3xl font-black leading-none text-white drop-shadow-lg md:text-4xl">{featured.title}</h1>
        <p className="mt-3 max-w-xs text-sm text-white/90">{featured.description}</p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black shadow-xl transition-transform group-hover:scale-105">
          <Play className="h-4 w-4 fill-black" /> Play now
        </span>
        <div className="mt-7 flex items-center gap-3 text-xs font-semibold text-white/80">
          <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Rotates every 5 seconds</span>
          <span className="rounded-full bg-black/25 px-2 py-1">{String(featuredIndex + 1).padStart(2, "0")} / {games.length}</span>
        </div>
      </div>

      <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 sm:block" style={{ animation: "floaty 4.5s ease-in-out infinite" }}>
        <div className="rotate-3 rounded-3xl bg-black/25 p-3 shadow-2xl ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:rotate-0">
          <div className="flex items-center justify-center rounded-2xl p-4" style={{ background: featured.gradient }}>
            <GameArt slug={featured.slug} emoji={featured.emoji} className="w-40 drop-shadow-xl lg:w-52" />
          </div>
        </div>
      </div>
      <span key={featured.slug} className="absolute bottom-0 left-0 h-1 w-full origin-left bg-white/85 hero-progress" />
    </Link>
  );
}
