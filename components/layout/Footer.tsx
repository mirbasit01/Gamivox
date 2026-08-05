import Link from "next/link";
import { CATEGORIES } from "@/lib/games";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-border-soft px-6 py-10 text-center text-sm text-text-dim">
      <div className="mb-3 flex flex-wrap justify-center gap-4">
        <Link href="/" className="hover:text-text">Home</Link>
        <Link href="/guide" className="hover:text-text">How to Play</Link>
        {CATEGORIES.map((c) => (
          <Link key={c} href={`/category/${c.toLowerCase()}`} className="hover:text-text">
            {c}
          </Link>
        ))}
      </div>
      <p>© {SITE.name} · Free online games built with Next.js + Phaser 🎮</p>
    </footer>
  );
}
