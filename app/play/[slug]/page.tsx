import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GAMES, getGame } from "@/lib/games";
import { SITE, absUrl } from "@/lib/site";
import GameCard from "@/components/games/GameCard";
import GameStage from "@/components/games/GameStage";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return { title: SITE.name };
  const title = `${game.title} — Play Free Online | ${SITE.name}`;
  return {
    title,
    description: game.description,
    keywords: game.keywords,
    alternates: { canonical: `/play/${game.slug}` },
    openGraph: {
      title,
      description: game.description,
      url: absUrl(`/play/${game.slug}`),
      type: "website",
    },
  };
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  const more = GAMES.filter((g) => g.slug !== game.slug).slice(0, 5);

  const gameLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.about,
    url: absUrl(`/play/${game.slug}`),
    genre: game.category,
    keywords: game.keywords.join(", "),
    playMode: "SinglePlayer",
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    gamePlatform: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: game.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absUrl("/") },
      { "@type": "ListItem", position: 2, name: `${game.category} Games`, item: absUrl(`/category/${game.category.toLowerCase()}`) },
      { "@type": "ListItem", position: 3, name: game.title, item: absUrl(`/play/${game.slug}`) },
    ],
  };

  return (
    <div>
      <JsonLd data={gameLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8">
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-text-dim">
          <Link href="/" className="font-bold text-text hover:text-accent">🎮 {SITE.name}</Link>
          <span>/</span>
          <Link href={`/category/${game.category.toLowerCase()}`} className="hover:text-accent">
            {game.category}
          </Link>
          <span>/</span>
          <span className="text-text">{game.title}</span>
        </nav>

        {/* game stage */}
        <div
          className="glass rounded-3xl p-4 sm:p-6"
          style={{ boxShadow: `0 0 80px -30px ${game.accent}` }}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{game.emoji}</span>
              <div>
                <h1 className="text-xl font-black leading-tight sm:text-2xl">{game.title}</h1>
                <p className="text-xs text-text-dim">🎮 {game.controls}</p>
              </div>
            </div>
            <Link
              href="/"
              className="shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-semibold text-text-dim hover:text-text"
            >
              ← Back
            </Link>
          </div>

          <GameStage slug={game.slug} accent={game.accent} />

          <div className="mt-3 flex flex-wrap gap-2">
            {game.tags.map((t) => (
              <Link
                key={t}
                href={`/?tag=${t}`}
                className="rounded-full bg-bg-card px-3 py-1 text-xs font-semibold text-text-dim hover:text-text"
              >
                #{t}
              </Link>
            ))}
          </div>
        </div>

        {/* SEO content grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            {/* About */}
            <section>
              <h2 className="mb-2 text-lg font-black">About {game.title}</h2>
              <p className="text-sm leading-relaxed text-text-dim">{game.about}</p>
            </section>

            {/* How to play */}
            <section>
              <h2 className="mb-3 text-lg font-black">How to Play</h2>
              <ol className="space-y-2">
                {game.howToPlay.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-text-dim">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: game.accent }}
                    >
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Tips */}
            <section>
              <h2 className="mb-3 text-lg font-black">Tips &amp; Tricks</h2>
              <ul className="space-y-2">
                {game.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-text-dim">
                    <span>💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="mb-3 text-lg font-black">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {game.faq.map((f, i) => (
                  <details
                    key={i}
                    className="rounded-xl border border-border bg-bg-elev/60 p-4"
                  >
                    <summary className="cursor-pointer text-sm font-bold text-text">
                      {f.q}
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-text-dim">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Info sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-bg-elev/60 p-5">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-text-dim">
                Game Info
              </h2>
              <dl className="space-y-2 text-sm">
                <InfoRow label="Category" value={game.category} />
                <InfoRow label="Players" value={game.players} />
                <InfoRow label="Controls" value={game.controls} />
                <InfoRow label="Price" value="Free" />
                <InfoRow label="Platform" value="Browser" />
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-bg-elev/60 p-5">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-text-dim">
                Features
              </h2>
              <ul className="space-y-2 text-sm text-text-dim">
                {game.features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span style={{ color: game.accent }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* more games */}
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-black">More Games You'll Like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {more.map((g) => (
              <GameCard key={g.slug} game={g} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-text-dim">{label}</dt>
      <dd className="text-right font-semibold text-text">{value}</dd>
    </div>
  );
}
