import Link from "next/link";
import type { Metadata } from "next";
import {
  Gamepad2,
  MousePointerClick,
  Zap,
  Trophy,
  Lightbulb,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { GAMES, CATEGORIES, gamesByCategory } from "@/lib/games";
import { SITE, absUrl } from "@/lib/site";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import GameArt from "@/components/games/GameArt";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: `How to Play Free Online Games — Beginner's Guide | ${SITE.name}`,
  description:
    "New to Gamivox? Learn how to play free online games in your browser — no download needed. Controls for all 20 games, beginner tips, and answers to common questions about our arcade, action, puzzle and classic games.",
  keywords: [
    "how to play online games",
    "free online games guide",
    "play games without download",
    "browser games how to play",
    "game controls",
    "gamivox guide",
    "beginner games guide",
    "best free browser games",
  ],
  alternates: { canonical: "/guide" },
  openGraph: {
    title: `How to Play — Getting Started Guide | ${SITE.name}`,
    description: "Learn how to play free online games on Gamivox — controls, tips and FAQ.",
    url: absUrl("/guide"),
    type: "article",
  },
};

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: MousePointerClick, title: "Pick a game", text: "Browse the home page or a category and click any game card." },
  { icon: Zap, title: "It loads instantly", text: "The game runs right in your browser — no download, install or account needed." },
  { icon: Gamepad2, title: "Read the controls", text: "Each game page shows its controls and a step-by-step 'How to Play' section." },
  { icon: Trophy, title: "Beat your high score", text: "Most games are score-based. Restart anytime and try to do better." },
];

const GENERAL_FAQ = [
  {
    q: "Do I need to download or install anything?",
    a: "No. Every game on Gamivox runs directly in your web browser using HTML5. Just click a game and play.",
  },
  {
    q: "Are the games really free?",
    a: "Yes, all games are completely free to play with no sign-up required.",
  },
  {
    q: "Can I play on my phone or tablet?",
    a: "Yes. The games and site are responsive and work on modern mobile browsers. Touch-based games support tapping and swiping.",
  },
  {
    q: "Do the games save my progress?",
    a: "Games are session-based — your score resets when you refresh. This keeps them light and instant to load.",
  },
  {
    q: "Which browser works best?",
    a: "Any up-to-date browser (Chrome, Edge, Firefox, Safari) works great. For the smoothest experience, keep your browser updated.",
  },
  {
    q: "What are the best free online games on Gamivox?",
    a: "Gamivox has 20 free games across four categories. Popular picks include Neon Snake, 2048 Fusion and Flappy Orb for quick fun, plus classics like Tic-Tac-Toe, Pong Duel and Connect Four you can play against the computer.",
  },
  {
    q: "What types of games can I play?",
    a: "We have Arcade games (fast, casual fun), Action games (shooting and reflex challenges), Puzzle games (2048, Minesweeper, Sliding Puzzle, Memory Match) and Classic games (Snake, Tic-Tac-Toe, Pong, Connect Four).",
  },
  {
    q: "Can I play two-player or against the computer?",
    a: "Several games — Tic-Tac-Toe, Pong Duel and Connect Four — let you play against a built-in computer opponent. The rest are single-player high-score challenges.",
  },
  {
    q: "How do I play games in fullscreen?",
    a: "Open any game and press the Fullscreen button on the game stage. It fills your whole screen on desktop and mobile; press Esc to exit.",
  },
];

export default function GuidePage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GENERAL_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to play games on ${SITE.name}`,
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.text,
    })),
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `All ${GAMES.length} free games on ${SITE.name}`,
    itemListElement: GAMES.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absUrl(`/play/${g.slug}`),
      name: g.title,
    })),
  };

  return (
    <div className="flex min-h-screen">
      <JsonLd data={faqLd} />
      <JsonLd data={howToLd} />
      <JsonLd data={itemListLd} />
      <Sidebar />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
          {/* header */}
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-dim">
            <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-text hover:text-accent">
              <Gamepad2 className="h-4 w-4 text-accent" /> {SITE.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-text">How to Play</span>
          </nav>

          <h1 className="text-3xl font-black sm:text-4xl">
            How to Play on <span className="gradient-text">{SITE.name}</span>
          </h1>
          <p className="mt-3 text-text-dim">
            Welcome! This quick guide gets you playing in seconds. {SITE.name} is a
            free online games portal — everything runs in your browser with no
            downloads and no sign-up.
          </p>

          {/* getting started steps */}
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-black">Getting Started in 4 Steps</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {STEPS.map((s, i) => (
                <div key={i} className="rounded-2xl border border-border bg-bg-elev/60 p-5">
                  <s.icon className="mb-2 h-7 w-7 text-accent" />
                  <h3 className="font-bold">
                    {i + 1}. {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-dim">{s.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* controls per game */}
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-black">Controls for Every Game</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-bg-elev text-text-dim">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Game</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {GAMES.map((g) => (
                    <tr key={g.slug} className="border-t border-border-soft">
                      <td className="px-4 py-3">
                        <Link href={`/play/${g.slug}`} className="inline-flex items-center gap-2 font-semibold text-text hover:text-accent">
                          <span
                            className="inline-flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded"
                            style={{ background: g.gradient }}
                          >
                            <GameArt slug={g.slug} emoji={g.emoji} className="w-5" />
                          </span>
                          {g.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-text-dim">{g.category}</td>
                      <td className="px-4 py-3 text-text-dim">{g.controls}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* beginner tips */}
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-black">Beginner Tips</h2>
            <ul className="space-y-2 text-sm text-text-dim">
              {[
                "Start with easy games like 2048 Fusion or Color Memory to warm up.",
                "Each game page has a dedicated “How to Play” and “Tips & Tricks” section — read it first.",
                "Use the fullscreen button on the game stage for a bigger, more immersive view.",
                "Most games restart instantly after a game over, so don't be afraid to fail fast and learn.",
              ].map((tip, i) => (
                <li key={i} className="flex gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Browse all games by category (internal links for SEO + discovery) */}
          <section className="mt-12">
            <h2 className="mb-2 text-xl font-black">All {GAMES.length} Free Games by Category</h2>
            <p className="mb-4 text-sm text-text-dim">
              Jump straight into any of our free online games — no download, no sign-up.
            </p>
            <div className="space-y-5">
              {CATEGORIES.map((cat) => (
                <div key={cat}>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-accent">
                    <Link href={`/category/${cat.toLowerCase()}`} className="hover:underline">
                      {cat} Games
                    </Link>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {gamesByCategory(cat).map((g) => (
                      <Link
                        key={g.slug}
                        href={`/play/${g.slug}`}
                        className="rounded-full border border-border bg-bg-elev/60 px-3 py-1.5 text-sm font-medium text-text-dim transition-colors hover:border-accent hover:text-text"
                      >
                        {g.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-black">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {GENERAL_FAQ.map((f, i) => (
                <details key={i} className="rounded-xl border border-border bg-bg-elev/60 p-4">
                  <summary className="cursor-pointer text-sm font-bold text-text">{f.q}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-text-dim">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="mt-12 rounded-2xl border border-border bg-bg-elev/60 p-6 text-center">
            <p className="text-lg font-bold">Ready to play?</p>
            <Link
              href="/#all-games"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent/30 hover:brightness-110"
            >
              Browse all games <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
