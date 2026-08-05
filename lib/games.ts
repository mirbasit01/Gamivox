export type Category = "Arcade" | "Action" | "Puzzle" | "Classic";

export type Faq = { q: string; a: string };

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
  /** short one-liner shown on cards & meta description */
  description: string;
  /** longer SEO paragraph shown on the play page (server-rendered) */
  about: string;
  controls: string;
  /** SEO keywords for this game */
  keywords: string[];
  /** bullet feature list (server-rendered, good for SEO) */
  features: string[];
  /** step-by-step how-to-play (server-rendered) */
  howToPlay: string[];
  /** pro tips (server-rendered) */
  tips: string[];
  /** per-game FAQ (rendered as FAQPage JSON-LD too) */
  faq: Faq[];
  /** ~minutes to learn, for the info panel */
  players: string;
};

export const GAMES: Game[] = [
  {
    slug: "neon-snake",
    title: "Neon Snake",
    category: "Classic",
    tags: ["classic", "arcade", "retro", "snake"],
    emoji: "🐍",
    gradient: "linear-gradient(135deg,#00ffa3 0%,#00b3ff 55%,#003b6f 100%)",
    accent: "#00ffa3",
    description:
      "The timeless snake, reborn in glowing neon. Eat orbs, grow longer, and don't bite your own tail.",
    about:
      "Neon Snake is a modern remake of the classic Snake arcade game that defined mobile gaming. Guide a glowing serpent around a neon grid, gobbling up orbs to grow ever longer. Every orb makes you faster and the board more crowded — how long can you survive before you crash into a wall or your own tail? It's simple to pick up, impossible to master, and perfect for a quick brain break.",
    controls: "Arrow keys / WASD · swipe on mobile",
    keywords: ["snake game", "neon snake", "play snake online", "classic snake", "retro arcade"],
    features: [
      "Instant play — no download or sign-up",
      "Smooth neon visuals with a glowing snake trail",
      "Speeds up as you grow for rising difficulty",
      "Works on desktop and mobile browsers",
    ],
    howToPlay: [
      "Use the Arrow keys or WASD — or swipe on a touch screen — to change direction.",
      "Steer into the pink orb to eat it and grow longer.",
      "Each orb adds 10 points and makes the snake a little faster.",
      "Avoid hitting the walls or your own body.",
      "Press Space after a crash to instantly restart.",
    ],
    tips: [
      "Hug the edges to keep the middle open for turns.",
      "Plan two moves ahead — you can't reverse into yourself.",
      "Slow, deliberate loops beat frantic zig-zags at high speed.",
    ],
    faq: [
      {
        q: "Is Neon Snake free to play?",
        a: "Yes. Neon Snake is 100% free and runs instantly in your browser with no download or account required.",
      },
      {
        q: "How do you control the snake?",
        a: "Use the Arrow keys or WASD to steer. On touch devices, swipe in the direction you want to move.",
      },
      {
        q: "How do you win at Snake?",
        a: "There's no final level — the goal is the highest score. Eat as many orbs as possible without crashing into a wall or your own tail.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "flappy-orb",
    title: "Flappy Orb",
    category: "Arcade",
    tags: ["arcade", "flappy", "one-button", "casual"],
    emoji: "🔮",
    gradient: "linear-gradient(135deg,#ffd15c 0%,#ff8a5c 50%,#ff5c9d 100%)",
    accent: "#ff8a5c",
    description:
      "Tap to flap a floating orb through an endless gauntlet of neon pillars. One button, infinite frustration.",
    about:
      "Flappy Orb is a one-button arcade challenge inspired by the flappy-bird craze. Tap, click or press Space to give your glowing orb a little lift and thread it through a never-ending series of neon pillars. The rules are dead simple, but the timing is brutally precise — a single mistimed flap ends the run. Chase that high score one 'just one more try' at a time.",
    controls: "Click / Space / ↑ to flap",
    keywords: ["flappy game", "flappy bird alternative", "one button game", "arcade flappy", "flappy orb"],
    features: [
      "Pure one-button gameplay anyone can learn in seconds",
      "Endless, procedurally spaced pillars",
      "Satisfying neon art style",
      "Great for quick high-score runs",
    ],
    howToPlay: [
      "Click, tap, press Space or the Up arrow to flap upward.",
      "Release to let gravity pull the orb back down.",
      "Guide the orb through the gap between each pair of pillars.",
      "You score a point for every pillar you clear.",
      "Touch a pillar, the ceiling or the floor and it's game over.",
    ],
    tips: [
      "Flap in small, steady taps rather than mashing the button.",
      "Aim for the centre of each gap to give yourself margin.",
      "Find a rhythm — consistent taps keep the orb stable.",
    ],
    faq: [
      {
        q: "Is Flappy Orb like Flappy Bird?",
        a: "Yes — it's a free browser-based game in the same one-button, tap-to-flap style, with an original neon look.",
      },
      {
        q: "Can I play Flappy Orb on mobile?",
        a: "Absolutely. Just tap anywhere on the screen to flap. It works in any modern mobile browser.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "brick-blaster",
    title: "Brick Blaster",
    category: "Arcade",
    tags: ["arcade", "breakout", "balls", "paddle"],
    emoji: "🧱",
    gradient: "linear-gradient(135deg,#7c5cff 0%,#5c8bff 50%,#00d4ff 100%)",
    accent: "#7c5cff",
    description:
      "A modern take on Breakout. Bounce the ball, smash every brick, and keep the ball alive.",
    about:
      "Brick Blaster is a neon reimagining of the arcade legend Breakout. Slide your paddle to bounce a glowing ball into a wall of colourful bricks, clearing the board one hit at a time. Angle your bounces to reach tricky corners, keep the ball in play across three lives, and wipe out every brick to win. It's the perfect blend of reflexes and angles.",
    controls: "Mouse / ← → to move the paddle",
    keywords: ["breakout game", "brick breaker", "arkanoid online", "paddle ball game", "brick blaster"],
    features: [
      "Classic Breakout / brick-breaker gameplay",
      "Angle-based ball physics for skill shots",
      "Three lives and a full board to clear",
      "Colourful neon bricks and glow effects",
    ],
    howToPlay: [
      "Move the paddle with your mouse or the ← → arrow keys.",
      "Click to launch the ball from the paddle.",
      "Bounce the ball into bricks to destroy them (10 points each).",
      "Where the ball hits the paddle changes its angle — use this to aim.",
      "Clear every brick to win; drop the ball three times and it's game over.",
    ],
    tips: [
      "Hit the ball with the paddle's edge for sharp angles into corners.",
      "Keep the ball moving sideways to clear whole rows faster.",
      "Stay centred so you can react to either side.",
    ],
    faq: [
      {
        q: "What kind of game is Brick Blaster?",
        a: "It's a brick-breaker / Breakout-style arcade game where you bounce a ball off a paddle to smash all the bricks.",
      },
      {
        q: "How many lives do you get?",
        a: "You start with three lives. You lose one each time the ball falls past your paddle.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "star-fighter",
    title: "Star Fighter",
    category: "Action",
    tags: ["shooting", "space", "action", "shmup"],
    emoji: "🚀",
    gradient: "linear-gradient(135deg,#1b0033 0%,#5c1cff 50%,#ff2e97 100%)",
    accent: "#ff2e97",
    description:
      "Pilot a lone starfighter against endless waves of invaders. Blast them before they reach the bottom.",
    about:
      "Star Fighter is a fast-paced space shooter (shmup) that drops you into an endless battle against waves of alien invaders. Weave your ship across the bottom of the screen, unleash a stream of laser fire, and destroy enemies before they slip past you. The longer you survive, the faster and thicker the waves become. How high can your score climb before you're overwhelmed?",
    controls: "← → / A D to move · Space to shoot",
    keywords: ["space shooter", "shmup online", "arcade shooter", "space invaders style", "star fighter"],
    features: [
      "Endless wave-based space-shooter action",
      "Ramping difficulty as your score rises",
      "Auto-fire while you focus on dodging",
      "Starfield backdrop with neon enemies",
    ],
    howToPlay: [
      "Move your ship with ← → or the A and D keys (or the mouse).",
      "Hold Space or click to fire your lasers upward.",
      "Destroy each invader for 5 points.",
      "Don't let any enemy reach the bottom or crash into your ship.",
      "Press R or click to restart after a game over.",
    ],
    tips: [
      "Keep firing constantly — there's no ammo limit.",
      "Prioritise enemies closest to the bottom of the screen.",
      "Small, quick movements beat big sweeps for precise dodging.",
    ],
    faq: [
      {
        q: "Is Star Fighter like Space Invaders?",
        a: "It's inspired by classic arcade shooters like Space Invaders and Galaga, with modern neon visuals and endless waves.",
      },
      {
        q: "Does the game ever end?",
        a: "There's no final level — enemies keep coming and get faster. Your goal is the highest score before you're overrun.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "twenty48",
    title: "2048 Fusion",
    category: "Puzzle",
    tags: ["puzzle", "2048", "numbers", "brain"],
    emoji: "🔢",
    gradient: "linear-gradient(135deg,#ffbf5c 0%,#ff7a5c 50%,#c94b4b 100%)",
    accent: "#ff9f5c",
    description:
      "Slide and merge matching tiles to chase the elusive 2048 tile on a slick neon board.",
    about:
      "2048 Fusion is a neon-styled version of the addictive number puzzle 2048. Slide tiles in four directions; when two tiles with the same number touch, they fuse into one worth double. Keep merging to build bigger and bigger numbers and reach the legendary 2048 tile — then push even further. Every move spawns a new tile, so plan carefully or the board fills up and it's game over.",
    controls: "Arrow keys / WASD · swipe on mobile",
    keywords: ["2048 game", "play 2048 online", "number puzzle", "2048 fusion", "merge puzzle"],
    features: [
      "The classic 2048 sliding-tile puzzle",
      "Clean neon board with smooth tile colours",
      "Endless play — chase scores beyond 2048",
      "Pure logic, no timer, no pressure",
    ],
    howToPlay: [
      "Press an Arrow key or WASD — or swipe on a touch screen — to slide all tiles.",
      "When two tiles with the same number collide, they merge into their sum.",
      "Each move adds a new 2 or 4 tile to the board.",
      "Combine tiles to reach 2048 — and keep going for a higher score.",
      "The game ends when the board is full and no moves remain (press R to restart).",
    ],
    tips: [
      "Keep your biggest tile locked in one corner.",
      "Build tiles in one direction so they merge in order.",
      "Avoid moving in the direction of your big tile unless you must.",
    ],
    faq: [
      {
        q: "What is the goal of 2048?",
        a: "Merge matching number tiles to create a tile worth 2048. You can keep playing afterwards to beat your high score.",
      },
      {
        q: "Is 2048 Fusion free?",
        a: "Yes, it's completely free and plays right in your browser with no install.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "color-memory",
    title: "Color Memory",
    category: "Puzzle",
    tags: ["puzzle", "memory", "simon", "brain"],
    emoji: "🧠",
    gradient: "linear-gradient(135deg,#00d4ff 0%,#7c5cff 50%,#ff5cf0 100%)",
    accent: "#00d4ff",
    description:
      "Watch the pattern, then repeat it. Each round adds one more color. How far can your memory stretch?",
    about:
      "Color Memory is a brain-training memory game in the spirit of the classic Simon. Watch a sequence of glowing colour pads light up, then repeat the exact order by clicking them yourself. Every round the pattern grows by one, stretching your short-term memory further and further. It's a quick, satisfying test of focus that anyone can play.",
    controls: "Click / tap the glowing pads",
    keywords: ["memory game", "simon game online", "brain training", "pattern memory", "color memory"],
    features: [
      "Simon-style memory and pattern game",
      "Rounds grow longer to test your recall",
      "Great, quick brain-training exercise",
      "One-click controls — perfect for touch screens",
    ],
    howToPlay: [
      "Click anywhere to start a round.",
      "Watch the sequence of pads that light up.",
      "Repeat the sequence by clicking the pads in the same order.",
      "Each round adds one more step to the pattern.",
      "One wrong pad ends the game — click to try again.",
    ],
    tips: [
      "Say the colours out loud to reinforce the order.",
      "Group the pattern into small chunks of 3–4.",
      "Stay relaxed — panic is the biggest cause of mistakes.",
    ],
    faq: [
      {
        q: "Is Color Memory the same as Simon?",
        a: "It's the same idea as the classic Simon electronic game — memorise and repeat a growing sequence of colours.",
      },
      {
        q: "Does Color Memory help your brain?",
        a: "Memory and pattern games like this are a fun way to exercise short-term memory and concentration.",
      },
    ],
    players: "1 player",
  },
];

export const CATEGORIES: Category[] = ["Arcade", "Action", "Puzzle", "Classic"];

export function getGame(slug: string): Game | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function gamesByCategory(cat: Category): Game[] {
  return GAMES.filter((g) => g.category === cat);
}
