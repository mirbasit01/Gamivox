import type { CreateGame } from "./_shared";

/**
 * Lazy loaders — each entry dynamically imports a Phaser game module.
 * Phaser only loads in the browser (these are called from a client component).
 */
export const gameLoaders: Record<string, () => Promise<{ createGame: CreateGame }>> = {
  "neon-snake": () => import("./neon-snake"),
  "flappy-orb": () => import("./flappy-orb"),
  "brick-blaster": () => import("./brick-blaster"),
  "star-fighter": () => import("./star-fighter"),
  twenty48: () => import("./twenty48"),
  "color-memory": () => import("./color-memory"),
};

export function hasGame(slug: string): boolean {
  return slug in gameLoaders;
}
