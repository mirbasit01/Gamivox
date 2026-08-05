"use client";

import { useEffect, useRef, useState } from "react";
import { gameLoaders } from "@/games/registry";

/**
 * Mounts a Phaser game by slug into a div. Phaser is imported only in the
 * browser via the lazy loaders, so it never runs during SSR.
 */
export default function PhaserGame({ slug }: { slug: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let game: { destroy: (removeCanvas: boolean) => void } | null = null;
    let cancelled = false;

    const loader = gameLoaders[slug];
    if (!loader) {
      setError(`Unknown game: ${slug}`);
      setLoading(false);
      return;
    }

    loader()
      .then((mod) => {
        if (cancelled || !hostRef.current) return;
        game = mod.createGame(hostRef.current);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        if (!cancelled) {
          setError("Failed to load game.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      game?.destroy(true);
    };
  }, [slug]);

  return (
    <div className="relative w-full">
      {loading && !error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-text-dim">
          Loading game…
        </div>
      )}
      {error && (
        <div className="flex h-64 items-center justify-center text-accent-2">{error}</div>
      )}
      <div
        ref={hostRef}
        className="mx-auto flex w-full max-w-[560px] touch-none select-none justify-center [&_canvas]:h-auto [&_canvas]:max-w-full [&_canvas]:touch-none [&_canvas]:rounded-xl [&_canvas]:shadow-2xl"
      />
    </div>
  );
}
