import Link from "next/link";
import { CATEGORIES } from "@/lib/games";

const CATEGORY_ICONS: Record<string, string> = {
  Arcade: "🕹️",
  Action: "💥",
  Puzzle: "🧩",
  Classic: "👾",
};

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border-soft bg-bg-elev/60 md:block">
      <div className="sticky top-0 flex h-screen flex-col gap-1 overflow-y-auto p-4">
        <Link
          href="/"
          className="mb-5 flex items-center gap-2 px-2 text-xl font-black tracking-tight"
        >
          <span className="text-2xl">🎮</span>
          <span className="gradient-text">Gamivox</span>
        </Link>

        <SidebarLink href="/" icon="🏠" label="Home" />
        <SidebarLink href="/#all-games" icon="🔥" label="All Games" />
        <SidebarLink href="/guide" icon="📖" label="How to Play" />

        <div className="my-3 h-px bg-border-soft" />
        <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text-dim">
          Categories
        </p>
        {CATEGORIES.map((c) => (
          <SidebarLink
            key={c}
            href={`/category/${c.toLowerCase()}`}
            icon={CATEGORY_ICONS[c]}
            label={`${c} Games`}
          />
        ))}

        <div className="my-3 h-px bg-border-soft" />
        <p className="px-3 text-xs leading-relaxed text-text-dim">
          Free browser games — no download, no sign-up. Developed by mirbasit01.
        </p>
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-dim transition-colors hover:bg-bg-card hover:text-text"
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
}
