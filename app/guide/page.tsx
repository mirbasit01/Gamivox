import Link from "next/link";
import type { Metadata } from "next";
import { GAMES } from "@/lib/games";
import { SITE, absUrl } from "@/lib/site";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: `How to Play — Getting Started Guide | ${SITE.name}`,
  description:
    "New to Gamivox? Learn how to play our free online games, understand the controls for every game, and get beginner tips in this quick getting-started guide.",
  keywords: ["how to play", "gamivox guide", "game controls", "getting started", "beginner guide"],
  alternates: { canonical: "/guide" },
  openGraph: {
    title: `How to Play — Getting Started Guide | ${SITE.name}`,
    description: "Learn how to play free online games on Gamivox — controls, tips and FAQ.",
    url: absUrl("/guide"),
    type: "article",
  },
};

const STEPS = [
  { icon: "🕹️", title: "Pick a game", text: "Browse the home page or a category and click any game card." },
  { icon: "⚡", title: "It loads instantly", text: "The game runs right in your browser — no download, install or account needed." },
  { icon: "🎮", title: "Read the controls", text: "Each game page shows its controls and a step-by-step 'How to Play' section." },
  { icon: "🏆", title: "Beat your high score", text: "Most games are score-based. Restart anytime and try to do better." },
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

  return (
    <div className="flex min-h-screen">
      <JsonLd data={faqLd} />
      <JsonLd data={howToLd} />
      <Sidebar />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
          {/* header */}
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-dim">
            <Link href="/" className="font-bold text-text hover:text-accent">🎮 {SITE.name}</Link>
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
                  <div className="mb-2 text-2xl">{s.icon}</div>
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
                        <Link href={`/play/${g.slug}`} className="font-semibold text-text hover:text-accent">
                          {g.emoji} {g.title}
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
              <li className="flex gap-2"><span>💡</span> Start with easy games like 2048 Fusion or Color Memory to warm up.</li>
              <li className="flex gap-2"><span>💡</span> Each game page has a dedicated “How to Play” and “Tips &amp; Tricks” section — read it first.</li>
              <li className="flex gap-2"><span>💡</span> Use the fullscreen button on the game stage for a bigger, more immersive view.</li>
              <li className="flex gap-2"><span>💡</span> Most games restart instantly after a game over, so don't be afraid to fail fast and learn.</li>
            </ul>
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
              className="mt-3 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent/30 hover:brightness-110"
            >
              Browse all games →
            </Link>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
