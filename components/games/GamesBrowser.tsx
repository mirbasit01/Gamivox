"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, GAMES, type Category } from "@/lib/games";
import GameCard from "./GameCard";

type Filter = "All" | Category;

export default function GamesBrowser() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GAMES.filter((g) => {
      const matchCat = filter === "All" || g.category === filter;
      const matchQuery =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.tags.some((t) => t.includes(q)) ||
        g.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, filter]);

  const tabs: Filter[] = ["All", ...CATEGORIES];

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative mx-auto max-w-xl">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">
            🔍
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games…"
            className="w-full rounded-full border border-border bg-bg-elev py-3 pl-11 pr-4 text-sm text-text outline-none transition-colors focus:border-accent"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              filter === t
                ? "bg-accent text-white"
                : "border border-border bg-bg-elev text-text-dim hover:text-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      {results.length === 0 ? (
        <p className="py-16 text-center text-text-dim">No games match “{query}”.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((g) => (
            <GameCard key={g.slug} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}
