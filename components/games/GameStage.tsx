"use client";

import { useRef, useState } from "react";
import PhaserGame from "./PhaserGame";

/** Wraps the Phaser canvas with a fullscreen toggle + framed stage. */
export default function GameStage({ slug, accent }: { slug: string; accent: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(false);

  const toggleFullscreen = async () => {
    const el = wrapRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setFs(true);
      } else {
        await document.exitFullscreen();
        setFs(false);
      }
    } catch {
      /* fullscreen not supported — ignore */
    }
  };

  return (
    <div
      ref={wrapRef}
      className="relative rounded-2xl bg-black/50 p-2 sm:p-4"
      style={{ boxShadow: `inset 0 0 60px -30px ${accent}` }}
    >
      <button
        onClick={toggleFullscreen}
        aria-label="Toggle fullscreen"
        className="absolute right-3 top-3 z-20 rounded-lg border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur transition-colors hover:bg-black/70"
      >
        {fs ? "✕ Exit" : "⛶ Fullscreen"}
      </button>
      <PhaserGame slug={slug} />
    </div>
  );
}
