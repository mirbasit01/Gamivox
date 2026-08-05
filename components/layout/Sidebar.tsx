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
    <aside className="hidden w-56 shrink-0 border-r border-border bg-bg-elev md:block">
      <div className="sticky top-0 flex flex-col gap-1 p-4">
        <Link
          href="/"
          className="mb-4 flex items-center gap-2 px-2 text-lg font-black tracking-tight"
        >
          <span className="text-2xl">🎮</span>
          <span>
            Gami<span className="text-accent">vox</span>
          </span>
        </Link>

        <SidebarLink href="/" icon="🏠" label="Home" />
        <SidebarLink href="/#new" icon="✨" label="New Games" />
        <SidebarLink href="/#all" icon="🔥" label="All Games" />

        <div className="my-3 h-px bg-border" />
        <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-text-dim">
          Categories
        </p>
        {CATEGORIES.map((c) => (
          <SidebarLink
            key={c}
            href={`/#cat-${c.toLowerCase()}`}
            icon={CATEGORY_ICONS[c]}
            label={`${c} Games`}
          />
        ))}
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-dim transition-colors hover:bg-bg-card hover:text-text"
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
}
