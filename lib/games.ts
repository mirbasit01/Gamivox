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

function makeGame(
  slug: string,
  title: string,
  category: Category,
  emoji: string,
  description: string,
  controls: string,
): Game {
  const styles: Record<Category, { gradient: string; accent: string }> = {
    Arcade: { gradient: "linear-gradient(135deg,#6d5cff 0%,#2186d6 52%,#06b6c8 100%)", accent: "#38bdf8" },
    Action: { gradient: "linear-gradient(135deg,#24124a 0%,#6d3dd1 54%,#e1438a 100%)", accent: "#f472b6" },
    Puzzle: { gradient: "linear-gradient(135deg,#12b6c7 0%,#2563c9 52%,#6d44d4 100%)", accent: "#38bdf8" },
    Classic: { gradient: "linear-gradient(135deg,#f59e59 0%,#e64a66 55%,#843e9d 100%)", accent: "#fb7185" },
  };
  const style = styles[category];
  return {
    slug, title, category, emoji, description, controls,
    tags: [category.toLowerCase(), "browser game", "free game"],
    gradient: style.gradient,
    accent: style.accent,
    about: `${title} is a free ${category.toLowerCase()} game you can play instantly in your browser. ${description}`,
    keywords: [title.toLowerCase(), `${category.toLowerCase()} game`, "free browser game"],
    features: ["Play instantly in your browser", "Designed for desktop and mobile", "Quick, replayable game sessions"],
    howToPlay: ["Start a new round.", controls, "Keep playing to improve your score."],
    tips: ["Take a moment to learn the controls.", "Practice short rounds to improve your score."],
    faq: [{ q: `Is ${title} free to play?`, a: `Yes. ${title} is free to play in your browser with no download required.` }],
    players: "1 player",
  };
}

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
  {
    slug: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    category: "Classic",
    tags: ["classic", "strategy", "board", "vs-ai"],
    emoji: "❌",
    gradient: "linear-gradient(135deg,#00d4ff 0%,#5c8bff 50%,#8b5cff 100%)",
    accent: "#5c8bff",
    description:
      "The classic noughts and crosses. Outsmart the computer and get three in a row.",
    about:
      "Tic-Tac-Toe (also known as noughts and crosses) is the quintessential pen-and-paper strategy game. Play as X against a smart computer opponent that blocks your winning moves and pounces on its own. Line up three of your marks in a row — horizontally, vertically or diagonally — before the AI does. Quick to learn, satisfying to master.",
    controls: "Click / tap a square to place your mark",
    keywords: ["tic tac toe", "noughts and crosses", "tic tac toe vs computer", "3 in a row game", "xo game"],
    features: [
      "Smart computer opponent that blocks and attacks",
      "Instant rounds — perfect for a quick game",
      "Clean, tappable board for mobile and desktop",
      "Free with no download or sign-up",
    ],
    howToPlay: [
      "You are X. Tap any empty square to place your mark.",
      "The computer (O) takes its turn automatically.",
      "Get three of your marks in a row — across, down or diagonally — to win.",
      "Block the computer from making its own line of three.",
      "Tap after the result to play again.",
    ],
    tips: [
      "Take the center square whenever it's open — it's the strongest spot.",
      "Corners are stronger than edges; grab them early.",
      "Always block the opponent's two-in-a-row before building your own.",
    ],
    faq: [
      {
        q: "Can you always win at Tic-Tac-Toe?",
        a: "No — with perfect play from both sides every game ends in a draw. Your best results come when the opponent makes a mistake.",
      },
      {
        q: "Is this Tic-Tac-Toe single player?",
        a: "Yes, you play as X against a computer opponent. It's free and runs instantly in your browser.",
      },
    ],
    players: "1 player vs AI",
  },
  {
    slug: "pong-duel",
    title: "Pong Duel",
    category: "Classic",
    tags: ["classic", "sport", "paddle", "retro"],
    emoji: "🏓",
    gradient: "linear-gradient(135deg,#00ffa3 0%,#00d4ff 50%,#0066ff 100%)",
    accent: "#00d4ff",
    description:
      "The original arcade tennis. Bounce the ball past the computer to reach five points first.",
    about:
      "Pong Duel is a faithful revival of the game that launched the arcade industry. Slide your paddle up and down to return the ball, angle your shots to wrong-foot the computer, and race to five points. The ball speeds up with every rally, turning each point into a test of reflexes. Simple, timeless, endlessly re-playable.",
    controls: "Drag / W–S / ↑ ↓ to move your paddle",
    keywords: ["pong game", "play pong online", "retro tennis game", "paddle ball", "classic arcade pong"],
    features: [
      "Classic 1-vs-computer Pong action",
      "Ball accelerates each rally for rising tension",
      "First to five points wins the match",
      "Drag, mouse or keyboard controls",
    ],
    howToPlay: [
      "Move your paddle with the mouse/drag, W and S, or the arrow keys.",
      "Bounce the ball back past the computer's paddle.",
      "The spot where the ball hits your paddle changes its angle.",
      "Score when the ball gets past your opponent; first to 5 wins.",
      "Tap to start a new match after the game.",
    ],
    tips: [
      "Hit with the edge of the paddle for sharp, hard-to-return angles.",
      "Stay near the center so you can reach shots on either side.",
      "Watch the ball's angle, not the paddle, to anticipate the bounce.",
    ],
    faq: [
      {
        q: "How do you win at Pong Duel?",
        a: "Be the first to score 5 points by getting the ball past the computer's paddle.",
      },
      {
        q: "Can I play Pong on mobile?",
        a: "Yes — just drag your finger up and down to move your paddle.",
      },
    ],
    players: "1 player vs AI",
  },
  {
    slug: "connect-four",
    title: "Connect Four",
    category: "Classic",
    tags: ["classic", "strategy", "board", "vs-ai"],
    emoji: "🔴",
    gradient: "linear-gradient(135deg,#ffd15c 0%,#ff5c6e 50%,#c94b8f 100%)",
    accent: "#ff5c6e",
    description:
      "Drop discs, build a line of four, and block the computer in this strategy classic.",
    about:
      "Connect Four is the beloved vertical strategy game. Drop your coloured discs into a seven-column grid and try to line up four in a row — horizontally, vertically or diagonally — while stopping the computer from doing the same. It's easy to pick up but full of tactical depth as the board fills up and threats stack on both sides.",
    controls: "Click / tap a column to drop your disc",
    keywords: ["connect four", "connect 4 online", "four in a row game", "connect four vs computer", "disc drop strategy"],
    features: [
      "7x6 Connect Four vs a tactical computer",
      "Win with four in a row any direction",
      "Computer blocks your threats and sets its own",
      "One-tap column drops, great on mobile",
    ],
    howToPlay: [
      "Tap a column to drop your red disc into the lowest empty slot.",
      "The computer drops a yellow disc in response.",
      "Connect four of your discs in a row — across, up, or diagonally.",
      "Block the computer when it has three in a row.",
      "Tap after the result to play again.",
    ],
    tips: [
      "Control the center column — it's part of the most winning lines.",
      "Watch for 'double threats' where you create two ways to win at once.",
      "Always block the opponent's three-in-a-row immediately.",
    ],
    faq: [
      {
        q: "How do you win Connect Four?",
        a: "Be the first to line up four of your discs in a row horizontally, vertically or diagonally.",
      },
      {
        q: "Is Connect Four free to play here?",
        a: "Yes, it's free and plays instantly in your browser against a computer opponent.",
      },
    ],
    players: "1 player vs AI",
  },
  {
    slug: "memory-match",
    title: "Memory Match",
    category: "Puzzle",
    tags: ["puzzle", "memory", "cards", "brain"],
    emoji: "🃏",
    gradient: "linear-gradient(135deg,#7c5cff 0%,#c94bff 50%,#ff5cc8 100%)",
    accent: "#c94bff",
    description:
      "Flip the cards, remember their positions, and match every pair in as few moves as possible.",
    about:
      "Memory Match is the classic concentration card game. A grid of cards sits face-down; flip two at a time to find matching pairs. Remember where each symbol is, clear the whole board, and try to finish in the fewest moves. It's a calm, satisfying brain exercise for players of all ages.",
    controls: "Click / tap cards to flip them",
    keywords: ["memory match game", "concentration card game", "matching pairs game", "memory cards online", "brain memory game"],
    features: [
      "Classic flip-and-match pairs gameplay",
      "Move counter to chase your best score",
      "Great short-term memory workout",
      "Simple tap controls for any device",
    ],
    howToPlay: [
      "Tap a card to flip it face-up.",
      "Tap a second card to try to find its match.",
      "If the two cards match they stay revealed; if not, they flip back.",
      "Remember card positions to make matches in fewer moves.",
      "Clear all pairs to win — then tap to shuffle and replay.",
    ],
    tips: [
      "Flip cards in a consistent order so positions are easier to recall.",
      "Focus on remembering just the last few cards you revealed.",
      "Stay calm — rushing leads to forgotten positions.",
    ],
    faq: [
      {
        q: "How do you play Memory Match?",
        a: "Flip two cards per turn to find matching pairs. Match all pairs on the board to win, ideally in as few moves as possible.",
      },
      {
        q: "Does Memory Match improve memory?",
        a: "Matching-pairs games are a fun way to exercise short-term and spatial memory.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "minesweeper",
    title: "Minesweeper",
    category: "Puzzle",
    tags: ["puzzle", "logic", "classic", "brain"],
    emoji: "💣",
    gradient: "linear-gradient(135deg,#9aa0b0 0%,#5c6472 50%,#2a2e3a 100%)",
    accent: "#8b93a5",
    description:
      "Clear the field without hitting a mine. Use the number clues to deduce where the bombs hide.",
    about:
      "Minesweeper is the legendary logic puzzle bundled with generations of computers. Reveal tiles to clear a minefield; each number tells you how many mines touch that tile. Use deduction — and a flag to mark suspected bombs — to uncover every safe square without detonating a single mine. Pure logic, no luck once you get going.",
    controls: "Tap to reveal · toggle flag mode to mark mines",
    keywords: ["minesweeper", "play minesweeper online", "mine sweeper game", "logic puzzle game", "classic minesweeper"],
    features: [
      "Classic 9x9 grid with 10 hidden mines",
      "Number clues for logical deduction",
      "Mobile-friendly flag-mode toggle (no right-click needed)",
      "Flood-fill reveals for fast clearing",
    ],
    howToPlay: [
      "Tap a tile to reveal it — numbers show how many mines are adjacent.",
      "An empty (0) tile clears its neighbours automatically.",
      "Turn on flag mode, then tap tiles you think are mines to flag them.",
      "Reveal every safe tile to win; tap a mine and you lose.",
      "Tap after the game to start a fresh field.",
    ],
    tips: [
      "Start in the middle to open up a large safe area.",
      "A '1' touching only one hidden tile means that tile is a mine.",
      "Flag confirmed mines so you don't tap them by accident.",
    ],
    faq: [
      {
        q: "How do you flag a mine on mobile?",
        a: "Tap the flag-mode button on the board to switch to flagging, then tap tiles to mark or unmark suspected mines.",
      },
      {
        q: "What do the numbers mean in Minesweeper?",
        a: "Each number is how many mines touch that tile (including diagonals), which lets you deduce where the mines are.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "sliding-puzzle",
    title: "Sliding Puzzle",
    category: "Puzzle",
    tags: ["puzzle", "15-puzzle", "logic", "brain"],
    emoji: "🧩",
    gradient: "linear-gradient(135deg,#00d4ff 0%,#00ffa3 50%,#a3ff5c 100%)",
    accent: "#00ffa3",
    description:
      "Slide the numbered tiles into order using the single empty space. A timeless brain teaser.",
    about:
      "The Sliding Puzzle (or 15-puzzle) is a classic tile-sliding brain teaser. Fifteen numbered tiles share a 4x4 board with one empty space. Slide tiles into the gap one at a time to arrange them in order from 1 to 15. It looks simple, but planning the right sequence of moves is a genuinely rewarding challenge.",
    controls: "Click / tap a tile next to the gap to slide it",
    keywords: ["sliding puzzle", "15 puzzle online", "number slide puzzle", "tile puzzle game", "slide puzzle brain teaser"],
    features: [
      "Classic 4x4 fifteen-tile sliding puzzle",
      "Always shuffled to a solvable state",
      "Move counter to optimise your solution",
      "Tap controls that feel great on touch screens",
    ],
    howToPlay: [
      "The board has tiles 1–15 and one empty space.",
      "Tap a tile next to the empty space to slide it in.",
      "Keep sliding to arrange the tiles in order, 1 to 15.",
      "The empty space should end up in the bottom-right corner.",
      "Solve it, then tap to shuffle a new puzzle.",
    ],
    tips: [
      "Solve the top row and left column first, then work down.",
      "Finish the last two tiles of each row together to avoid getting stuck.",
      "Think a few slides ahead before committing.",
    ],
    faq: [
      {
        q: "Is every Sliding Puzzle solvable?",
        a: "Yes — the board is always shuffled from the solved state with valid moves, so a solution always exists.",
      },
      {
        q: "What's the goal of the 15-puzzle?",
        a: "Slide the numbered tiles until they read 1 to 15 in order with the empty space last.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "block-drop",
    title: "Block Drop",
    category: "Puzzle",
    tags: ["puzzle", "blocks", "tetris", "falling"],
    emoji: "🟦",
    gradient: "linear-gradient(135deg,#5c1cff 0%,#00d4ff 50%,#00ffa3 100%)",
    accent: "#5c8bff",
    description:
      "Rotate and stack the falling blocks to clear full lines in this addictive puzzle classic.",
    about:
      "Block Drop is a fast, addictive falling-blocks puzzle in the spirit of Tetris. Seven shapes tumble down a narrow well; move and rotate them to fill complete horizontal lines, which then vanish for points. The blocks fall faster as you go, so quick thinking and tidy stacking are the keys to a high score. Don't let the stack reach the top!",
    controls: "← → move · ↑ rotate · ↓ drop · swipe on mobile",
    keywords: ["block drop game", "tetris online", "falling blocks puzzle", "stacking blocks game", "line clear puzzle"],
    features: [
      "Seven classic tetromino shapes",
      "Clear lines for points; speed ramps up over time",
      "Keyboard and touch/swipe controls",
      "Endless, high-score-chasing gameplay",
    ],
    howToPlay: [
      "Blocks fall one at a time into the well.",
      "Move them left/right with the arrow keys (or tap the left/right side).",
      "Rotate with the Up arrow (or swipe up); drop faster with Down (or swipe down).",
      "Fill an entire horizontal row to clear it and score points.",
      "The game ends if the blocks stack to the top — tap to restart.",
    ],
    tips: [
      "Keep the stack low and flat to give yourself room.",
      "Leave one column open to set up multi-line clears.",
      "Rotate early — don't wait until a block is about to land.",
    ],
    faq: [
      {
        q: "Is Block Drop like Tetris?",
        a: "Yes — it's a free, browser-based falling-block puzzle in the classic Tetris style, with original visuals.",
      },
      {
        q: "How do you score in Block Drop?",
        a: "You score by completing full horizontal lines, which clear from the board. Clearing more lines means a higher score.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "dino-dash",
    title: "Dino Dash",
    category: "Arcade",
    tags: ["arcade", "runner", "endless", "jump"],
    emoji: "🦖",
    gradient: "linear-gradient(135deg,#a3ff5c 0%,#00d4a3 50%,#0a5c4a 100%)",
    accent: "#a3ff5c",
    description:
      "Jump over the obstacles in this fast endless runner. How far can you dash?",
    about:
      "Dino Dash is a one-button endless runner inspired by the famous offline dinosaur game. Your runner sprints forward automatically while obstacles rush toward you — time your jumps to clear them. The pace keeps rising, so the further you run the sharper your reflexes need to be. Simple, snappy, and made for beating your own high score.",
    controls: "Space / ↑ / tap to jump",
    keywords: ["dino game", "dinosaur runner", "endless runner game", "jump game online", "offline dino game"],
    features: [
      "One-button endless-runner action",
      "Speed increases the longer you survive",
      "Distance-based scoring for high-score runs",
      "Plays with a tap, click or the spacebar",
    ],
    howToPlay: [
      "Your runner moves forward on its own.",
      "Press Space, the Up arrow, or tap the screen to jump.",
      "Time each jump to clear the incoming obstacles.",
      "Your score climbs the longer and further you run.",
      "Hit an obstacle and it's game over — tap to run again.",
    ],
    tips: [
      "Jump a moment before you reach an obstacle, not on top of it.",
      "Don't spam jumps — you're vulnerable while landing.",
      "Stay relaxed as the speed rises; panic ruins your timing.",
    ],
    faq: [
      {
        q: "Is Dino Dash like the Chrome dinosaur game?",
        a: "Yes — it's a free endless runner in the same jump-the-obstacles style, playable any time in your browser.",
      },
      {
        q: "How do you get a high score?",
        a: "Survive as long as possible. Your score increases with distance, so precise jumps at high speed are the key.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "sky-jumper",
    title: "Sky Jumper",
    category: "Arcade",
    tags: ["arcade", "jumping", "vertical", "casual"],
    emoji: "🦘",
    gradient: "linear-gradient(135deg,#5cd0ff 0%,#8b5cff 50%,#ff5cc8 100%)",
    accent: "#8b5cff",
    description:
      "Bounce ever higher from platform to platform without falling. The sky is the limit.",
    about:
      "Sky Jumper is a vertical bouncing arcade game in the style of Doodle Jump. Your character auto-bounces off platforms; steer left and right to land on the next one and climb higher and higher. Miss a platform and you plummet. The higher you reach, the bigger your score — how high can you bounce before gravity wins?",
    controls: "← → / A D or drag to move · auto-jump",
    keywords: ["doodle jump online", "sky jumper game", "vertical jumping game", "platform bounce game", "endless jumper"],
    features: [
      "Endless vertical bouncing gameplay",
      "Auto-jump — just steer to the next platform",
      "Screen wraps left/right for extra escapes",
      "Height-based scoring that never stops climbing",
    ],
    howToPlay: [
      "Your character bounces upward automatically off each platform.",
      "Move left and right with the arrow keys, A/D, or by dragging.",
      "Aim to land on the next platform above you.",
      "Go off one side of the screen to reappear on the other.",
      "Fall below the screen and it's game over — tap to restart.",
    ],
    tips: [
      "Make small steering adjustments — over-correcting causes misses.",
      "Line up your landing before you reach the platform.",
      "Use the screen-wrap to reach platforms near the edges.",
    ],
    faq: [
      {
        q: "Is Sky Jumper like Doodle Jump?",
        a: "Yes — it's a free browser game in the same bounce-up-the-platforms style, with original neon visuals.",
      },
      {
        q: "How is the score calculated?",
        a: "Your score is based on how high you climb. The higher you bounce, the bigger your score.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "whack-a-mole",
    title: "Whack-a-Mole",
    category: "Arcade",
    tags: ["arcade", "reflex", "tapping", "casual"],
    emoji: "🔨",
    gradient: "linear-gradient(135deg,#ffd15c 0%,#ff8a5c 50%,#a35c2a 100%)",
    accent: "#ff8a5c",
    description:
      "Bop the moles as they pop up before the timer runs out. A frantic test of reflexes.",
    about:
      "Whack-a-Mole brings the carnival arcade favourite to your browser. Moles pop out of their holes at random — tap them as fast as you can to score before they duck back down. You've got 30 seconds and the moles get quicker as the clock ticks. It's a pure, frantic reflex challenge that's endlessly replayable.",
    controls: "Click / tap the moles as they appear",
    keywords: ["whack a mole", "whack a mole game", "reflex tapping game", "arcade mole game", "reaction speed game"],
    features: [
      "Fast 30-second reflex challenge",
      "Moles speed up as time runs down",
      "One-tap controls, perfect for touch screens",
      "Simple to learn, hard to top your score",
    ],
    howToPlay: [
      "Moles pop up randomly from the 3x3 grid of holes.",
      "Tap or click a mole while it's up to score a point.",
      "Be quick — each mole only stays up briefly.",
      "You have 30 seconds; the moles get faster as time passes.",
      "When time's up, tap to play again.",
    ],
    tips: [
      "Keep your eyes on the whole grid, not one hole.",
      "Move toward where moles have been appearing most.",
      "Don't over-commit to one hole — the next mole could be anywhere.",
    ],
    faq: [
      {
        q: "How long is a game of Whack-a-Mole?",
        a: "Each round lasts 30 seconds. Score as many mole taps as you can before the timer ends.",
      },
      {
        q: "Can I play Whack-a-Mole on my phone?",
        a: "Absolutely — just tap the moles as they pop up. It's built for touch screens.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "road-crossing",
    title: "Road Crossing",
    category: "Arcade",
    tags: ["arcade", "frogger", "dodge", "casual"],
    emoji: "🐸",
    gradient: "linear-gradient(135deg,#00ffa3 0%,#5cd0ff 50%,#5c6cff 100%)",
    accent: "#00ffa3",
    description:
      "Hop across the busy road, dodging traffic to reach the other side again and again.",
    about:
      "Road Crossing is a modern take on the arcade legend Frogger. Guide your character across lanes of fast-moving traffic, timing each hop to slip between the cars. Reach the far side to score, then do it again as the roads get busier. One mistimed step and it's game over — how many crossings can you survive?",
    controls: "Arrow keys / swipe / tap to hop",
    keywords: ["frogger online", "road crossing game", "cross the road game", "traffic dodge game", "hop across road"],
    features: [
      "Frogger-style road-crossing action",
      "Multiple lanes of traffic at varied speeds",
      "Difficulty rises with each successful crossing",
      "Arrow-key, swipe and tap controls",
    ],
    howToPlay: [
      "Start at the bottom and move one step at a time.",
      "Use the arrow keys, swipe, or tap the direction you want to hop.",
      "Time your hops to cross lanes without touching a car.",
      "Reach the top row to score, then start again from the bottom.",
      "Get hit by a car and it's game over — tap to restart.",
    ],
    tips: [
      "Wait for a clear gap rather than rushing into a lane.",
      "Watch the lane ahead, not the one you're in.",
      "Move up whenever there's a safe gap — hesitation kills runs.",
    ],
    faq: [
      {
        q: "Is Road Crossing like Frogger?",
        a: "Yes — it's a free browser game inspired by Frogger, where you cross lanes of traffic to reach the other side.",
      },
      {
        q: "How do you score in Road Crossing?",
        a: "You score each time you safely cross the road to the top. The traffic gets tougher with every crossing.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "asteroid-field",
    title: "Asteroid Field",
    category: "Action",
    tags: ["action", "space", "dodge", "survival"],
    emoji: "☄️",
    gradient: "linear-gradient(135deg,#1b0033 0%,#3a1c6e 50%,#00d4ff 100%)",
    accent: "#00d4ff",
    description:
      "Pilot your ship through a storm of falling asteroids. Survive as long as you can.",
    about:
      "Asteroid Field is a pure test of nerve and reflexes. Fly your ship left and right along the bottom of the screen while asteroids rain down from above — faster and thicker the longer you last. There's no shooting here, only survival: weave through the gaps and rack up seconds. One collision ends the run.",
    controls: "← → / A D or drag to steer",
    keywords: ["asteroid dodge game", "space survival game", "dodge asteroids online", "avoid obstacles game", "space dodger"],
    features: [
      "Reflex-driven survival dodging",
      "Asteroid density and speed ramp up over time",
      "Time-survived scoring for high-score runs",
      "Smooth keyboard or drag steering",
    ],
    howToPlay: [
      "Your ship sits near the bottom of the screen.",
      "Move left and right with the arrow keys, A/D, or by dragging.",
      "Weave between the asteroids falling from the top.",
      "Your score is how many seconds you survive.",
      "Touch an asteroid and it's game over — tap to restart.",
    ],
    tips: [
      "Make small movements and aim for the biggest gaps.",
      "Stay near the center so you can dodge either way.",
      "Look ahead to the top of the screen, not right at your ship.",
    ],
    faq: [
      {
        q: "Do you shoot the asteroids?",
        a: "No — Asteroid Field is a survival dodging game. Your only job is to avoid every asteroid for as long as possible.",
      },
      {
        q: "How is the score measured?",
        a: "Your score is the time you survive. The longer you dodge, the higher you climb.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "turret-gunner",
    title: "Turret Gunner",
    category: "Action",
    tags: ["action", "shooting", "aim", "defense"],
    emoji: "🎯",
    gradient: "linear-gradient(135deg,#ff2e97 0%,#ff5c3a 50%,#ffd15c 100%)",
    accent: "#ff2e97",
    description:
      "Aim, fire, and defend your base from waves of incoming drones. Don't let them through.",
    about:
      "Turret Gunner is a fast aim-and-shoot defense game. You command a turret that rotates to follow your aim; enemy drones stream in from above and you must blast them out of the sky before they slip past. Every drone you miss costs a life. Precise aiming and quick reactions are all that stand between you and being overrun.",
    controls: "Aim with pointer · click / tap to fire",
    keywords: ["turret shooting game", "aim and shoot game", "base defense game", "drone shooter online", "target shooting game"],
    features: [
      "Aim-with-your-cursor turret shooting",
      "Endless waves of incoming drones",
      "Three lives — defend to the last",
      "Precise, satisfying aim-and-fire gameplay",
    ],
    howToPlay: [
      "Move your pointer to aim the turret.",
      "Click or tap to fire a shot in the direction you're aiming.",
      "Destroy the drones before they reach the bottom.",
      "Each drone that gets past you costs one of your three lives.",
      "At zero lives it's game over — tap to restart.",
    ],
    tips: [
      "Lead your shots — aim slightly ahead of moving drones.",
      "Prioritise the drones closest to the bottom.",
      "Don't waste shots; line up the angle before you fire.",
    ],
    faq: [
      {
        q: "How do you aim in Turret Gunner?",
        a: "The turret automatically points toward your mouse or finger. Tap or click to fire in that direction.",
      },
      {
        q: "How many lives do you have?",
        a: "You have three lives. You lose one each time a drone gets past your turret.",
      },
    ],
    players: "1 player",
  },
  {
    slug: "maze-escape",
    title: "Maze Escape",
    category: "Action",
    tags: ["action", "maze", "adventure", "brain"],
    emoji: "🌀",
    gradient: "linear-gradient(135deg,#8b5cff 0%,#5c8bff 50%,#00ffa3 100%)",
    accent: "#8b5cff",
    description:
      "Navigate a randomly generated maze and find the exit as fast as you can.",
    about:
      "Maze Escape drops you into a fresh, randomly generated maze every round. Guide your marker from the entrance to the glowing exit, choosing your path through the twisting corridors while the timer ticks. Every maze is guaranteed solvable — the only question is how quickly you can find your way out. Beat your best time, then take on a brand-new labyrinth.",
    controls: "Arrow keys / WASD / swipe to move",
    keywords: ["maze game online", "maze escape game", "random maze generator game", "labyrinth game", "find the exit game"],
    features: [
      "A new random, always-solvable maze every game",
      "Race-the-clock timer scoring",
      "Arrow-key, WASD and swipe controls",
      "Clean, readable maze visuals",
    ],
    howToPlay: [
      "You start at the entrance of the maze.",
      "Move with the arrow keys, WASD, or by swiping.",
      "Walls block your path — find the route through.",
      "Reach the glowing exit to escape and record your time.",
      "Tap after escaping to generate a fresh maze.",
    ],
    tips: [
      "Follow one wall (left or right) to guarantee you find the exit.",
      "Look ahead for dead ends before committing to a corridor.",
      "Keep moving — hesitation adds seconds to your time.",
    ],
    faq: [
      {
        q: "Is every maze solvable?",
        a: "Yes — each maze is generated so that a path from start to exit always exists.",
      },
      {
        q: "What's the goal of Maze Escape?",
        a: "Get from the start to the exit as fast as possible, then try to beat your time on a new maze.",
      },
    ],
    players: "1 player",
  },
  ...[
    makeGame("bubble-shooter", "Bubble Shooter", "Arcade", "🫧", "Aim coloured bubbles, match groups of three, and clear the board.", "Mouse or touch to aim and shoot"),
    makeGame("coin-dash", "Coin Dash", "Arcade", "🪙", "Collect coins while weaving away from roaming hazards.", "Arrow keys / WASD"),
    makeGame("tap-beat", "Tap Tap Beat", "Arcade", "🎵", "Hit incoming notes on time and build your combo.", "Arrow keys / A S D F"),
    makeGame("balloon-pop", "Balloon Pop", "Arcade", "🎈", "Pop balloons before they float away.", "Click / tap balloons"),
    makeGame("laser-dodge", "Laser Dodge", "Arcade", "🔺", "Survive an accelerating field of neon lasers.", "Arrow keys / WASD"),
    makeGame("penguin-jump", "Penguin Jump", "Arcade", "🐧", "Bounce from icy platform to icy platform and climb higher.", "Arrow keys / A D"),
    makeGame("fruit-slicer", "Fruit Slicer", "Arcade", "🍉", "Slice flying fruit with fast, accurate swipes.", "Mouse drag / touch swipe"),
    makeGame("speed-typer", "Speed Typer", "Arcade", "⌨️", "Type each word accurately before the timer runs out.", "Keyboard"),
    makeGame("tank-battle", "Tank Battle", "Action", "🛡️", "Drive, aim, and blast enemy tanks across the battlefield.", "Arrow keys / WASD · mouse to aim and fire"),
    makeGame("ninja-slash", "Ninja Slash", "Action", "🥷", "Slash incoming enemies before they reach your ninja.", "Mouse drag / touch swipe"),
    makeGame("zombie-wave", "Zombie Wave", "Action", "🧟", "Hold the line against increasingly dangerous zombie waves.", "Arrow keys / WASD · mouse to aim and fire"),
    makeGame("gravity-flip", "Gravity Flip", "Action", "🔄", "Flip gravity at the right moment to clear each obstacle.", "Space / click / tap"),
    makeGame("bullet-hell", "Bullet Hell", "Action", "💥", "Dodge dense patterns of enemy fire for as long as possible.", "Arrow keys / WASD"),
    makeGame("tower-defense", "Tower Defense", "Action", "🏰", "Place turrets and stop enemies before they reach the exit.", "Click / tap to place towers"),
    makeGame("space-miner", "Space Miner", "Action", "⛏️", "Mine ore in deep space while avoiding dangerous asteroids.", "Arrow keys / WASD"),
    makeGame("sudoku-lite", "Sudoku Lite", "Puzzle", "🔢", "Complete a compact number grid using logic alone.", "Click a cell, then press a number key"),
    makeGame("word-scramble", "Word Scramble", "Puzzle", "🔤", "Unscramble as many words as you can before time runs out.", "Keyboard"),
    makeGame("pipe-connect", "Pipe Connect", "Puzzle", "🧩", "Rotate pipes until every section forms one connected network.", "Click / tap pipes"),
    makeGame("light-reflector", "Light Reflector", "Puzzle", "🔦", "Rotate mirrors to direct a beam of light through every target.", "Click / tap mirrors"),
    makeGame("gem-swap", "Gem Swap", "Puzzle", "💎", "Swap adjacent gems to make colourful matches.", "Click / tap two adjacent gems"),
    makeGame("chain-reaction", "Chain Reaction", "Puzzle", "⚛️", "Set off a cascade and catch as many moving cells as possible.", "Click / tap to start"),
    makeGame("number-sort", "Number Sort", "Puzzle", "🔢", "Reorder the numbers in the fewest moves you can.", "Click / tap tiles"),
    makeGame("color-flood", "Color Flood", "Puzzle", "🎨", "Flood the board with one colour before you run out of moves.", "Click / tap a colour"),
    makeGame("checkers", "Checkers", "Classic", "⚫", "Capture opposing pieces in a quick game of checkers.", "Click / tap a piece, then its destination"),
    makeGame("battleship", "Battleship", "Classic", "⚓", "Find and sink the computer fleet on a hidden grid.", "Click / tap grid squares"),
    makeGame("hangman", "Hangman", "Classic", "🪢", "Guess the hidden word before you run out of attempts.", "Keyboard / click letters"),
    makeGame("blackjack", "Blackjack", "Classic", "🃏", "Beat the dealer by getting as close to 21 as possible.", "Click / tap Hit or Stand"),
    makeGame("rock-paper-scissors", "Rock Paper Scissors", "Classic", "✊", "Choose your throw and outsmart the computer.", "Click / tap a choice"),
    makeGame("simon-says", "Simon Says", "Classic", "🟢", "Memorise and repeat the growing colour sequence.", "Click / tap the coloured pads"),
    makeGame("dice-roller", "Dice Roller", "Classic", "🎲", "Roll, hold, and score dice across five rounds.", "Click / tap dice and controls"),
  ],
];

export const CATEGORIES: Category[] = ["Arcade", "Action", "Puzzle", "Classic"];

export function getGame(slug: string): Game | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function gamesByCategory(cat: Category): Game[] {
  return GAMES.filter((g) => g.category === cat);
}
