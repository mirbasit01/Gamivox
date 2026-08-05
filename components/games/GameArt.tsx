import type { JSX } from "react";

/**
 * Per-game vector illustration drawn on top of the card's gradient.
 * Self-contained SVG (no external images) so it's crisp at any size and
 * loads instantly. Coordinate space is 0..100.
 */

const W = "#ffffff";
const WD = "rgba(255,255,255,0.85)";
const WF = "rgba(255,255,255,0.35)";
const DK = "rgba(10,10,24,0.45)";
const PANEL = "rgba(8,8,20,0.28)";

function panel() {
  return <rect x="8" y="8" width="84" height="84" rx="10" fill={PANEL} />;
}

const ART: Record<string, JSX.Element> = {
  "neon-snake": (
    <g>
      {panel()}
      {[[30, 58], [42, 58], [54, 58], [54, 46], [54, 34]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="11" height="11" rx="3" fill="#00ffa3" opacity={0.55 + i * 0.09} />
      ))}
      <rect x="54" y="22" width="11" height="11" rx="3" fill="#eafff6" />
      <circle cx="32" cy="34" r="5.5" fill="#ff5c9d" />
    </g>
  ),
  "flappy-orb": (
    <g>
      <rect x="22" y="8" width="16" height="30" rx="4" fill="#ff8a5c" />
      <rect x="22" y="66" width="16" height="26" rx="4" fill="#ff8a5c" />
      <rect x="62" y="8" width="16" height="20" rx="4" fill="#ff8a5c" />
      <rect x="62" y="56" width="16" height="36" rx="4" fill="#ff8a5c" />
      <circle cx="50" cy="52" r="10" fill="#ffd15c" />
      <circle cx="46" cy="48" r="3.2" fill={W} />
    </g>
  ),
  "brick-blaster": (
    <g>
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}-${c}`} x={16 + c * 18} y={16 + r * 11} width="15" height="8" rx="2"
            fill={["#7c5cff", "#00d4ff", "#00ffa3"][r]} />
        ))
      )}
      <circle cx="50" cy="66" r="4.5" fill={W} />
      <rect x="38" y="80" width="26" height="7" rx="3.5" fill={W} />
    </g>
  ),
  "star-fighter": (
    <g>
      <circle cx="24" cy="22" r="1.6" fill={WF} />
      <circle cx="72" cy="30" r="1.6" fill={WF} />
      <circle cx="46" cy="16" r="1.4" fill={WF} />
      {[[32, 30], [58, 26], [46, 40]].map(([x, y], i) => (
        <polygon key={i} points={`${x - 8},${y - 5} ${x + 8},${y - 5} ${x},${y + 7}`} fill="#ff2e97" />
      ))}
      <rect x="49" y="58" width="3" height="10" rx="1.5" fill="#ff2e97" />
      <polygon points="50,66 38,90 62,90" fill={W} />
    </g>
  ),
  twenty48: (
    <g>
      {panel()}
      {[["2", "#3a3a5a"], ["4", "#ff9f5c"], ["8", "#ff5c6e"], ["16", "#7c5cff"]].map(([n, c], i) => {
        const x = 18 + (i % 2) * 34;
        const y = 18 + Math.floor(i / 2) * 34;
        return (
          <g key={i}>
            <rect x={x} y={y} width="30" height="30" rx="6" fill={c as string} />
            <text x={x + 15} y={y + 20} textAnchor="middle" fontSize="14" fontWeight="800" fill={W}>{n}</text>
          </g>
        );
      })}
    </g>
  ),
  "color-memory": (
    <g>
      <path d="M50 12 A38 38 0 0 0 12 50 L48 50 L48 12 Z" fill="#00d4ff" />
      <path d="M50 12 A38 38 0 0 1 88 50 L52 50 L52 12 Z" fill="#ff5c9d" />
      <path d="M50 88 A38 38 0 0 1 12 50 L48 50 L48 88 Z" fill="#ffd15c" />
      <path d="M50 88 A38 38 0 0 0 88 50 L52 50 L52 88 Z" fill="#00ffa3" />
      <circle cx="50" cy="50" r="9" fill={DK} />
    </g>
  ),
  "tic-tac-toe": (
    <g stroke={W} strokeWidth="3" strokeLinecap="round">
      <line x1="42" y1="16" x2="42" y2="84" />
      <line x1="62" y1="16" x2="62" y2="84" />
      <line x1="18" y1="40" x2="86" y2="40" />
      <line x1="18" y1="62" x2="86" y2="62" />
      <g stroke="#ff5c9d">
        <line x1="24" y1="22" x2="36" y2="34" />
        <line x1="36" y1="22" x2="24" y2="34" />
      </g>
      <circle cx="52" cy="51" r="6.5" fill="none" stroke="#00d4ff" />
      <g stroke="#ff5c9d">
        <line x1="68" y1="70" x2="80" y2="80" />
        <line x1="80" y1="70" x2="68" y2="80" />
      </g>
    </g>
  ),
  "pong-duel": (
    <g>
      <rect x="16" y="34" width="6" height="26" rx="3" fill={W} />
      <rect x="78" y="44" width="6" height="26" rx="3" fill={W} />
      <g stroke={WF} strokeWidth="2" strokeDasharray="4 5">
        <line x1="50" y1="14" x2="50" y2="86" />
      </g>
      <circle cx="58" cy="52" r="4.5" fill={W} />
    </g>
  ),
  "connect-four": (
    <g>
      <rect x="18" y="20" width="64" height="60" rx="8" fill="#3a5bd0" />
      {[0, 1, 2, 3].map((c) =>
        [0, 1, 2].map((r) => {
          const filled = (c + r) % 3 === 0 ? "#ff5c6e" : (c + r) % 3 === 1 ? "#ffd15c" : DK;
          return <circle key={`${c}-${r}`} cx={28 + c * 15} cy={31 + r * 19} r="6" fill={filled} />;
        })
      )}
    </g>
  ),
  "memory-match": (
    <g>
      <rect x="16" y="24" width="24" height="32" rx="4" fill={WF} />
      <rect x="60" y="44" width="24" height="32" rx="4" fill={WF} />
      <rect x="40" y="38" width="24" height="32" rx="4" fill={W} />
      <text x="52" y="60" textAnchor="middle" fontSize="16">❤️</text>
    </g>
  ),
  minesweeper: (
    <g>
      {panel()}
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}-${c}`} x={18 + c * 22} y={18 + r * 22} width="20" height="20" rx="3"
            fill="rgba(255,255,255,0.14)" stroke={WF} strokeWidth="1" />
        ))
      )}
      <circle cx="28" cy="28" r="6" fill="#12121c" />
      <g stroke="#12121c" strokeWidth="2">
        <line x1="28" y1="19" x2="28" y2="37" />
        <line x1="19" y1="28" x2="37" y2="28" />
      </g>
      <text x="72" y="76" textAnchor="middle" fontSize="14" fontWeight="800" fill="#00d4ff">2</text>
    </g>
  ),
  "sliding-puzzle": (
    <g>
      {panel()}
      {["1", "2", "3", "4", "5", "6", "7", "8"].map((n, i) => {
        const idx = i;
        const x = 16 + (idx % 3) * 24;
        const y = 16 + Math.floor(idx / 3) * 24;
        return (
          <g key={i}>
            <rect x={x} y={y} width="21" height="21" rx="4" fill="#00d4a3" />
            <text x={x + 10.5} y={y + 15} textAnchor="middle" fontSize="12" fontWeight="800" fill="#062">{n}</text>
          </g>
        );
      })}
    </g>
  ),
  "block-drop": (
    <g>
      {[[42, 20], [30, 32], [42, 32], [54, 32]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="12" height="12" rx="2" fill="#8b5cff" />
      ))}
      {[[18, 70], [30, 70], [54, 70], [66, 70], [18, 82], [30, 82], [42, 82], [66, 82]].map(([x, y], i) => (
        <rect key={`b${i}`} x={x} y={y} width="12" height="12" rx="2" fill="#00d4ff" opacity="0.8" />
      ))}
    </g>
  ),
  "dino-dash": (
    <g>
      <line x1="12" y1="74" x2="88" y2="74" stroke={WD} strokeWidth="2.5" />
      <g fill="#1b3a2a">
        <rect x="26" y="52" width="16" height="20" rx="3" />
        <rect x="38" y="46" width="12" height="12" rx="2" />
        <rect x="22" y="70" width="5" height="8" />
        <rect x="38" y="70" width="5" height="8" />
      </g>
      <circle cx="46" cy="50" r="1.4" fill={W} />
      <g fill="#0a5c3a">
        <rect x="68" y="56" width="7" height="18" rx="2" />
        <rect x="62" y="60" width="5" height="9" rx="2" />
        <rect x="76" y="60" width="5" height="9" rx="2" />
      </g>
    </g>
  ),
  "sky-jumper": (
    <g>
      {[[20, 74], [56, 60], [30, 44], [60, 30]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="24" height="7" rx="3.5" fill="#00ffa3" opacity={0.6 + i * 0.1} />
      ))}
      <circle cx="70" cy="22" r="7" fill="#ffd15c" />
      <circle cx="67" cy="20" r="1.4" fill="#333" />
      <circle cx="73" cy="20" r="1.4" fill="#333" />
    </g>
  ),
  "whack-a-mole": (
    <g>
      {[[28, 66], [50, 66], [72, 66]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="13" ry="7" fill={DK} />
      ))}
      <ellipse cx="50" cy="60" rx="11" ry="12" fill="#8a5a34" />
      <circle cx="46" cy="58" r="1.8" fill="#1a1a1a" />
      <circle cx="54" cy="58" r="1.8" fill="#1a1a1a" />
      <ellipse cx="50" cy="64" rx="3.5" ry="2.5" fill="#c98" />
      <g transform="rotate(30 74 34)">
        <rect x="72" y="20" width="5" height="26" rx="2" fill="#c9a06a" />
        <rect x="64" y="16" width="20" height="10" rx="3" fill="#d8d8e0" />
      </g>
    </g>
  ),
  "road-crossing": (
    <g>
      {[30, 48, 66].map((y, i) => (
        <line key={i} x1="12" y1={y} x2="88" y2={y} stroke={WF} strokeWidth="1.5" strokeDasharray="6 6" />
      ))}
      <rect x="30" y="24" width="20" height="11" rx="3" fill="#ff5c6e" />
      <rect x="58" y="60" width="20" height="11" rx="3" fill="#5c8bff" />
      <circle cx="50" cy="82" r="8" fill="#00ffa3" />
      <circle cx="47" cy="80" r="1.5" fill="#0a3" />
      <circle cx="53" cy="80" r="1.5" fill="#0a3" />
    </g>
  ),
  "asteroid-field": (
    <g>
      <circle cx="26" cy="20" r="1.5" fill={WF} />
      <circle cx="70" cy="16" r="1.5" fill={WF} />
      {[[30, 34], [62, 42], [46, 24]].map(([x, y], i) => (
        <polygon key={i} points={`${x},${y - 8} ${x + 8},${y - 3} ${x + 6},${y + 7} ${x - 5},${y + 7} ${x - 8},${y - 2}`}
          fill="#9aa0b0" />
      ))}
      <polygon points="50,64 40,88 60,88" fill={W} />
      <polygon points="50,72 46,86 54,86" fill="#00d4ff" />
    </g>
  ),
  "turret-gunner": (
    <g>
      <circle cx="52" cy="24" r="8" fill="none" stroke="#ff2e97" strokeWidth="2.5" />
      <circle cx="52" cy="24" r="3" fill="#ff2e97" />
      <path d="M30 84 A20 20 0 0 1 70 84 Z" fill={W} />
      <rect x="47" y="46" width="8" height="26" rx="3" fill={W} transform="rotate(-28 51 60)" />
    </g>
  ),
  "maze-escape": (
    <g>
      <rect x="14" y="14" width="72" height="72" rx="6" fill="none" stroke={WF} strokeWidth="2" />
      <g stroke={WD} strokeWidth="3" strokeLinecap="round">
        <line x1="14" y1="38" x2="50" y2="38" />
        <line x1="62" y1="14" x2="62" y2="50" />
        <line x1="38" y1="50" x2="38" y2="86" />
        <line x1="50" y1="62" x2="86" y2="62" />
        <line x1="50" y1="62" x2="50" y2="50" />
      </g>
      <circle cx="24" cy="24" r="4.5" fill="#00ffa3" />
      <rect x="72" y="72" width="10" height="10" rx="2" fill="#ffd15c" />
    </g>
  ),
};

export default function GameArt({
  slug,
  emoji,
  className = "",
}: {
  slug: string;
  emoji: string;
  className?: string;
}) {
  const art = ART[slug];
  if (!art) {
    return <span className={`text-5xl ${className}`}>{emoji}</span>;
  }
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-hidden="true">
      {art}
    </svg>
  );
}
