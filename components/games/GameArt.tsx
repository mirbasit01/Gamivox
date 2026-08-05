import type { ReactElement } from "react";
import { setA } from "./art/set-a";
import { setB } from "./art/set-b";
import { setC } from "./art/set-c";
import { setD } from "./art/set-d";

/**
 * Per-game vector illustration drawn on top of the card's gradient.
 * Self-contained SVG (no external images) so it's crisp at any size and
 * loads instantly. The individual scenes live in ./art/set-*.tsx.
 */
const ART: Record<string, ReactElement> = {
  ...setA,
  ...setB,
  ...setC,
  ...setD,
};

export default function GameArt({
  slug,
  emoji,
  className = "",
}: {
  slug: string;
  emoji: string;
  className?: string;
}) {
  const art = ART[slug];
  if (!art) {
    return <span className={`text-5xl ${className}`}>{emoji}</span>;
  }
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-hidden="true">
      {art}
    </svg>
  );
}
