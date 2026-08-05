"use client";

import { useEffect, useRef, useState } from "react";
import { gameLoaders } from "@/games/registry";

/** Minimal shape of the Phaser.Game bits we touch. */
type GameLike = {
  destroy: (removeCanvas: boolean) => void;
  scale: { refresh: () => void };
};

/**
 * Mounts a Phaser game by slug into a div. Phaser is imported only in the
 * browser via the lazy loaders, so it never runs during SSR.
 *
 * Fullscreen: we put the stage wrapper into HTML fullscreen and, once the
 * layout has settled, call Phaser's scale.refresh() so the FIT scale mode
 * recomputes against the full-screen size and the canvas fills the display.
 */
export default function PhaserGame({ slug }: { slug: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<GameLike | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFs, setIsFs] = useState(false);

  // Load + mount the Phaser game
  useEffect(() => {
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
        gameRef.current = mod.createGame(hostRef.current) as unknown as GameLike;
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
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [slug]);

  // Track browser fullscreen state
  useEffect(() => {
    const onChange = () => setIsFs(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // When entering/leaving fullscreen, refit the canvas after the DOM commits
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      gameRef.current?.scale.refresh();
      window.dispatchEvent(new Event("resize"));
    });
    const t = setTimeout(() => gameRef.current?.scale.refresh(), 120);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [isFs]);

  const toggleFullscreen = async () => {
    const el = stageRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      /* fullscreen unsupported — ignore */
    }
  };

  return (
    <div
      ref={stageRef}
      className={
        isFs
          ? "relative flex h-screen w-screen items-center justify-center bg-black"
          : "relative w-full"
      }
    >
      {loading && !error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-text-dim">
          Loading game…
        </div>
      )}
      {error && (
        <div className="flex h-64 items-center justify-center text-accent-2">{error}</div>
      )}

      {!loading && !error && (
        <button
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
          className="absolute right-3 top-3 z-20 rounded-lg border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur transition-colors hover:bg-black/75"
        >
          {isFs ? "✕ Exit" : "⛶ Fullscreen"}
        </button>
      )}

      <div
        ref={hostRef}
        className={
          isFs
            ? "flex h-full w-full touch-none select-none items-center justify-center [&_canvas]:[margin:0_!important] [&_canvas]:max-h-full [&_canvas]:max-w-full [&_canvas]:touch-none"
            : "mx-auto flex w-full max-w-[560px] touch-none select-none justify-center [&_canvas]:h-auto [&_canvas]:max-w-full [&_canvas]:touch-none [&_canvas]:rounded-xl [&_canvas]:shadow-2xl"
        }
      />
    </div>
  );
}
