"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { gameLoaders } from "@/games/registry";
import { getGame } from "@/lib/games";
import { gameSize } from "@/lib/gameSizes";
import GameArt from "./GameArt";

/** Minimal shape of the Phaser.Game bits we touch. */
type GameLike = {
  destroy: (removeCanvas: boolean) => void;
  scale: { refresh: () => void };
};

/**
 * A game stage sized to the game's own aspect ratio, so the start screen,
 * loading state and the running canvas all occupy the exact same box (no jump).
 * The Phaser game is only created after the user presses Play.
 */
export default function PhaserGame({ slug }: { slug: string }) {
  const meta = getGame(slug);
  const { w, h } = gameSize(slug);
  const landscape = w / h > 1.1;

  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<GameLike | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [isFs, setIsFs] = useState(false);

  // Create the Phaser game only AFTER the user presses Play
  useEffect(() => {
    if (!started) return;
    let cancelled = false;
    const loader = gameLoaders[slug];
    if (!loader) {
      setError(`Unknown game: ${slug}`);
      return;
    }
    setLoading(true);
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
  }, [slug, started]);

  // Track browser fullscreen state
  useEffect(() => {
    const onChange = () => setIsFs(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Refit the canvas when entering/leaving fullscreen
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

  // The stage box keeps the game's aspect ratio so nothing resizes on start.
  const boxStyle: React.CSSProperties = isFs
    ? { width: "100%", height: "100%" }
    : {
        aspectRatio: `${w} / ${h}`,
        maxWidth: landscape ? 760 : 460,
        maxHeight: "74vh",
        width: "100%",
        margin: "0 auto",
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
      <div className="relative overflow-hidden rounded-xl" style={boxStyle}>
        {/* Phaser canvas host (fills the box) */}
        <div
          ref={hostRef}
          className="absolute inset-0 z-0 flex touch-none select-none items-center justify-center [&_canvas]:[margin:0_!important] [&_canvas]:max-h-full [&_canvas]:max-w-full [&_canvas]:touch-none"
        />

        {/* START SCREEN — game does not run until this is clicked */}
        {!started && (
          <button
            onClick={() => setStarted(true)}
            aria-label={`Play ${meta?.title ?? "game"}`}
            className="group absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 overflow-hidden"
            style={{ background: meta?.gradient ?? "#12121c" }}
          >
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/60" />
            <span className="pointer-events-none absolute -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
            <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
              {meta && (
                <GameArt
                  slug={meta.slug}
                  emoji={meta.emoji}
                  className="w-24 drop-shadow-xl transition-transform duration-300 group-hover:scale-105 sm:w-32"
                />
              )}
              <h2 className="text-2xl font-black uppercase tracking-wide text-white drop-shadow-lg sm:text-3xl">
                {meta?.title ?? "Play"}
              </h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-2.5 text-base font-black text-black shadow-xl transition-transform duration-200 group-hover:scale-110">
                <Play className="h-5 w-5 fill-black" /> Play
              </span>
            </div>
          </button>
        )}

        {/* Loading / error (same box → no jump) */}
        {started && loading && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 text-text-dim">
            Loading game…
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 text-accent-2">
            {error}
          </div>
        )}

        {/* Fullscreen toggle (only once the game is running) */}
        {started && !loading && !error && (
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="absolute right-3 top-3 z-20 rounded-lg border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur transition-colors hover:bg-black/75"
          >
            {isFs ? "✕ Exit" : "⛶ Fullscreen"}
          </button>
        )}
      </div>
    </div>
  );
}
