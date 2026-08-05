import type { CreateGame } from "./_shared";

/**
 * Lazy loaders — each entry dynamically imports a Phaser game module.
 * Phaser only loads in the browser (these are called from a client component).
 */
export const gameLoaders: Record<string, () => Promise<{ createGame: CreateGame }>> = {
  // Original six
  "neon-snake": () => import("./neon-snake"),
  "flappy-orb": () => import("./flappy-orb"),
  "brick-blaster": () => import("./brick-blaster"),
  "star-fighter": () => import("./star-fighter"),
  twenty48: () => import("./twenty48"),
  "color-memory": () => import("./color-memory"),
  // Classic
  "tic-tac-toe": () => import("./tic-tac-toe"),
  "pong-duel": () => import("./pong-duel"),
  "connect-four": () => import("./connect-four"),
  // Puzzle
  "memory-match": () => import("./memory-match"),
  minesweeper: () => import("./minesweeper"),
  "sliding-puzzle": () => import("./sliding-puzzle"),
  "block-drop": () => import("./block-drop"),
  // Arcade
  "dino-dash": () => import("./dino-dash"),
  "sky-jumper": () => import("./sky-jumper"),
  "whack-a-mole": () => import("./whack-a-mole"),
  "road-crossing": () => import("./road-crossing"),
  // Action
  "asteroid-field": () => import("./asteroid-field"),
  "turret-gunner": () => import("./turret-gunner"),
  "maze-escape": () => import("./maze-escape"),
};

export function hasGame(slug: string): boolean {
  return slug in gameLoaders;
}
