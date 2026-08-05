export type Category = "Arcade" | "Action" | "Puzzle" | "Classic";

export type Game = {
  slug: string;
  title: string;
  category: Category;
  tags: string[];
  emoji: string;
  /** CSS gradient used for the generated thumbnail */
  gradient: string;
  /** hex accent used for glow / buttons on the play page */
  accent: string;
  description: string;
  controls: string;
};

export const GAMES: Game[] = [
  {
    slug: "neon-snake",
    title: "Neon Snake",
    category: "Classic",
    tags: ["classic", "arcade", "retro"],
    emoji: "🐍",
    gradient: "linear-gradient(135deg,#00ffa3 0%,#00b3ff 55%,#003b6f 100%)",
    accent: "#00ffa3",
    description:
      "The timeless snake, reborn in glowing neon. Eat orbs, grow longer, and don't bite your own tail.",
    controls: "Arrow keys / WASD to steer",
  },
  {
    slug: "flappy-orb",
    title: "Flappy Orb",
    category: "Arcade",
    tags: ["arcade", "flappy", "one-button"],
    emoji: "🔮",
    gradient: "linear-gradient(135deg,#ffd15c 0%,#ff8a5c 50%,#ff5c9d 100%)",
    accent: "#ff8a5c",
    description:
      "Tap to flap a floating orb through an endless gauntlet of neon pillars. One button, infinite frustration.",
    controls: "Click / Space / ↑ to flap",
  },
  {
    slug: "brick-blaster",
    title: "Brick Blaster",
    category: "Arcade",
    tags: ["arcade", "breakout", "balls"],
    emoji: "🧱",
    gradient: "linear-gradient(135deg,#7c5cff 0%,#5c8bff 50%,#00d4ff 100%)",
    accent: "#7c5cff",
    description:
      "A modern take on Breakout. Bounce the ball, smash every brick, and keep the ball alive.",
    controls: "Mouse / ← → to move the paddle",
  },
  {
    slug: "star-fighter",
    title: "Star Fighter",
    category: "Action",
    tags: ["shooting", "space", "action"],
    emoji: "🚀",
    gradient: "linear-gradient(135deg,#1b0033 0%,#5c1cff 50%,#ff2e97 100%)",
    accent: "#ff2e97",
    description:
      "Pilot a lone starfighter against endless waves of invaders. Blast them before they reach the bottom.",
    controls: "← → / A D to move · Space to shoot",
  },
  {
    slug: "twenty48",
    title: "2048 Fusion",
    category: "Puzzle",
    tags: ["puzzle", "2048", "numbers"],
    emoji: "🔢",
    gradient: "linear-gradient(135deg,#ffbf5c 0%,#ff7a5c 50%,#c94b4b 100%)",
    accent: "#ff9f5c",
    description:
      "Slide and merge matching tiles to chase the elusive 2048 tile on a slick neon board.",
    controls: "Arrow keys / WASD to slide tiles",
  },
  {
    slug: "color-memory",
    title: "Color Memory",
    category: "Puzzle",
    tags: ["puzzle", "memory", "simon"],
    emoji: "🧠",
    gradient: "linear-gradient(135deg,#00d4ff 0%,#7c5cff 50%,#ff5cf0 100%)",
    accent: "#00d4ff",
    description:
      "Watch the pattern, then repeat it. Each round adds one more color. How far can your memory stretch?",
    controls: "Click / tap the glowing pads",
  },
];

export const CATEGORIES: Category[] = ["Arcade", "Action", "Puzzle", "Classic"];

export function getGame(slug: string): Game | undefined {
  return GAMES.find((g) => g.slug === slug);
}
