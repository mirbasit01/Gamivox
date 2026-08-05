/**
 * Base canvas size (w × h) of each Phaser game — used to give the game stage
 * (start screen, loading box and the canvas) a matching aspect ratio so the
 * layout never jumps between them.
 */
export const GAME_SIZES: Record<string, { w: number; h: number }> = {
  "neon-snake": { w: 480, h: 528 },
  "flappy-orb": { w: 480, h: 640 },
  "brick-blaster": { w: 520, h: 640 },
  "star-fighter": { w: 480, h: 640 },
  twenty48: { w: 460, h: 520 },
  "color-memory": { w: 460, h: 560 },
  "tic-tac-toe": { w: 480, h: 560 },
  "pong-duel": { w: 640, h: 420 },
  "connect-four": { w: 480, h: 560 },
  "memory-match": { w: 480, h: 560 },
  minesweeper: { w: 480, h: 560 },
  "sliding-puzzle": { w: 480, h: 560 },
  "block-drop": { w: 400, h: 640 },
  "dino-dash": { w: 640, h: 300 },
  "sky-jumper": { w: 420, h: 640 },
  "whack-a-mole": { w: 480, h: 520 },
  "road-crossing": { w: 480, h: 560 },
  "asteroid-field": { w: 480, h: 640 },
  "turret-gunner": { w: 520, h: 560 },
  "maze-escape": { w: 520, h: 560 },
};

export function gameSize(slug: string): { w: number; h: number } {
  return GAME_SIZES[slug] ?? { w: 480, h: 600 };
}
