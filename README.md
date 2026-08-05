# 🎮 Gamivox — Play 20 Free Online Games

**Gamivox** is a free online games portal built with **Next.js 16 + Phaser 3 + Tailwind CSS 4**.
Play **20 different browser games** — arcade, action, puzzle and classic — instantly, with **no download and no sign-up**.

🌐 **Live:** [https://gamivox-green.vercel.app](https://gamivox-green.vercel.app)

---

## 📸 Screenshots

> Save the three screenshots into `docs/screenshots/` with these exact names for them to show here.

### Home
![Gamivox home page](docs/screenshots/home.png)

### All Games
![All games grid](docs/screenshots/all-games.png)

### How to Play
![How to play guide](docs/screenshots/how-to-play.png)

---

## ✨ Features

- **20 unique games** across 4 categories — each a self-contained Phaser scene
- **Play instantly** in the browser — no download, no install, no account
- **Fully responsive** — works on desktop, tablet and mobile (touch + swipe controls)
- **Fullscreen mode** for every game
- **Custom illustrated thumbnails** (hand-crafted SVG art, no image assets)
- **SEO-ready** — server-rendered content, per-game metadata, JSON-LD structured data, sitemap & robots
- **Clean icon set** via `lucide-react`
- **Neon arcade theme** with a consistent design system

---

## 🕹️ The Games

### Arcade Games

| Game | Tags | Controls | Links |
|------|------|----------|-------|
| 🔮 **Flappy Orb** | arcade, flappy, one-button | Click / Space / ↑ to flap | [Docs](docs/games/flappy-orb.md) · [Play](https://gamivox-green.vercel.app/play/flappy-orb) |
| 🧱 **Brick Blaster** | arcade, breakout, balls | Mouse / ← → to move the paddle | [Docs](docs/games/brick-blaster.md) · [Play](https://gamivox-green.vercel.app/play/brick-blaster) |
| 🦖 **Dino Dash** | arcade, runner, endless | Space / ↑ / tap to jump | [Docs](docs/games/dino-dash.md) · [Play](https://gamivox-green.vercel.app/play/dino-dash) |
| 🦘 **Sky Jumper** | arcade, jumping, vertical | ← → / A D or drag to move · auto-jump | [Docs](docs/games/sky-jumper.md) · [Play](https://gamivox-green.vercel.app/play/sky-jumper) |
| 🔨 **Whack-a-Mole** | arcade, reflex, tapping | Click / tap the moles as they appear | [Docs](docs/games/whack-a-mole.md) · [Play](https://gamivox-green.vercel.app/play/whack-a-mole) |
| 🐸 **Road Crossing** | arcade, frogger, dodge | Arrow keys / swipe / tap to hop | [Docs](docs/games/road-crossing.md) · [Play](https://gamivox-green.vercel.app/play/road-crossing) |

### Action Games

| Game | Tags | Controls | Links |
|------|------|----------|-------|
| 🚀 **Star Fighter** | shooting, space, action | ← → / A D to move · Space to shoot | [Docs](docs/games/star-fighter.md) · [Play](https://gamivox-green.vercel.app/play/star-fighter) |
| ☄️ **Asteroid Field** | action, space, dodge | ← → / A D or drag to steer | [Docs](docs/games/asteroid-field.md) · [Play](https://gamivox-green.vercel.app/play/asteroid-field) |
| 🎯 **Turret Gunner** | action, shooting, aim | Aim with pointer · click / tap to fire | [Docs](docs/games/turret-gunner.md) · [Play](https://gamivox-green.vercel.app/play/turret-gunner) |
| 🌀 **Maze Escape** | action, maze, adventure | Arrow keys / WASD / swipe to move | [Docs](docs/games/maze-escape.md) · [Play](https://gamivox-green.vercel.app/play/maze-escape) |

### Puzzle Games

| Game | Tags | Controls | Links |
|------|------|----------|-------|
| 🔢 **2048 Fusion** | puzzle, 2048, numbers | Arrow keys / WASD · swipe on mobile | [Docs](docs/games/twenty48.md) · [Play](https://gamivox-green.vercel.app/play/twenty48) |
| 🧠 **Color Memory** | puzzle, memory, simon | Click / tap the glowing pads | [Docs](docs/games/color-memory.md) · [Play](https://gamivox-green.vercel.app/play/color-memory) |
| 🃏 **Memory Match** | puzzle, memory, cards | Click / tap cards to flip them | [Docs](docs/games/memory-match.md) · [Play](https://gamivox-green.vercel.app/play/memory-match) |
| 💣 **Minesweeper** | puzzle, logic, classic | Tap to reveal · toggle flag mode to mark mines | [Docs](docs/games/minesweeper.md) · [Play](https://gamivox-green.vercel.app/play/minesweeper) |
| 🧩 **Sliding Puzzle** | puzzle, 15-puzzle, logic | Click / tap a tile next to the gap to slide it | [Docs](docs/games/sliding-puzzle.md) · [Play](https://gamivox-green.vercel.app/play/sliding-puzzle) |
| 🟦 **Block Drop** | puzzle, blocks, tetris | ← → move · ↑ rotate · ↓ drop · swipe on mobile | [Docs](docs/games/block-drop.md) · [Play](https://gamivox-green.vercel.app/play/block-drop) |

### Classic Games

| Game | Tags | Controls | Links |
|------|------|----------|-------|
| 🐍 **Neon Snake** | classic, arcade, retro | Arrow keys / WASD · swipe on mobile | [Docs](docs/games/neon-snake.md) · [Play](https://gamivox-green.vercel.app/play/neon-snake) |
| ❌ **Tic-Tac-Toe** | classic, strategy, board | Click / tap a square to place your mark | [Docs](docs/games/tic-tac-toe.md) · [Play](https://gamivox-green.vercel.app/play/tic-tac-toe) |
| 🏓 **Pong Duel** | classic, sport, paddle | Drag / W–S / ↑ ↓ to move your paddle | [Docs](docs/games/pong-duel.md) · [Play](https://gamivox-green.vercel.app/play/pong-duel) |
| 🔴 **Connect Four** | classic, strategy, board | Click / tap a column to drop your disc | [Docs](docs/games/connect-four.md) · [Play](https://gamivox-green.vercel.app/play/connect-four) |

📖 Full how-to-play guide: [https://gamivox-green.vercel.app/guide](https://gamivox-green.vercel.app/guide)

---

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Game engine | Phaser 3 |
| Styling | Tailwind CSS 4 |
| Icons | lucide-react |
| Language | TypeScript |
| Hosting | Vercel |

---

## 📂 Project Structure

```
Gamivox/
├── app/
│   ├── page.tsx               # Home (hero + game grid)
│   ├── play/[slug]/page.tsx   # Game player + SEO content
│   ├── category/[cat]/page.tsx# Category pages
│   ├── guide/page.tsx         # How-to-play guide
│   ├── sitemap.ts · robots.ts # SEO
│   └── layout.tsx · globals.css
├── components/
│   ├── games/                 # GameCard, GameArt, GameStage, PhaserGame, GamesBrowser
│   │   └── art/               # set-a…d.tsx  (SVG illustrations)
│   ├── layout/                # Sidebar, Footer
│   └── seo/JsonLd.tsx
├── games/                     # 20 Phaser games — one folder each
│   ├── _shared.ts             # shared config + helpers
│   ├── registry.ts            # slug → game loader
│   └── <game>/index.ts
├── lib/
│   ├── games.ts               # game catalog + SEO content
│   └── site.ts                # site config (domain, name)
└── docs/
    ├── games/<slug>.md        # per-game documentation
    └── screenshots/
```

---

## 🚀 Getting Started

```bash
# install
npm install

# run dev server
npm run dev            # http://localhost:3000

# production build
npm run build
npm run start
```

### Add a new game
1. Add an entry to `GAMES` in `lib/games.ts`
2. Create `games/<slug>/index.ts` exporting `createGame(parent)`
3. Register it in `games/registry.ts`
4. (Optional) add SVG art in `components/games/art/`

---

## 🔍 SEO

- Production domain is set in `lib/site.ts` (override with `NEXT_PUBLIC_SITE_URL`)
- Every page is statically pre-rendered with rich, server-rendered text
- `VideoGame`, `FAQPage`, `HowTo`, `BreadcrumbList` and `ItemList` JSON-LD
- `sitemap.xml` and `robots.txt` are auto-generated
- To get indexed: submit `https://gamivox-green.vercel.app/sitemap.xml` in [Google Search Console](https://search.google.com/search-console)

---

## 👤 Credits

Developed by **mirbasit01**.
Built with Next.js + Phaser.
