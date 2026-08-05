import type { ReactElement } from "react";

export const setA: Record<string, ReactElement> = {
  "neon-snake": (
    <g>
      <defs>
        <linearGradient id="snk-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5cffce" />
          <stop offset="100%" stopColor="#00a6ff" />
        </linearGradient>
        <radialGradient id="snk-food" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffd1e6" />
          <stop offset="100%" stopColor="#ff2e83" />
        </radialGradient>
      </defs>
      <rect
        x="9"
        y="9"
        width="82"
        height="82"
        rx="14"
        fill="rgba(3,7,18,0.4)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
      {[26, 42, 58, 74].map((v) => (
        <g key={v} stroke="rgba(255,255,255,0.05)" strokeWidth="1">
          <line x1={v} y1="12" x2={v} y2="88" />
          <line x1="12" y1={v} x2="88" y2={v} />
        </g>
      ))}
      {[
        [30, 60],
        [42, 60],
        [54, 60],
        [54, 48],
        [54, 36],
      ].map(([x, y], i) => (
        <rect key={"s" + i} x={x + 1.5} y={y + 2} width="11" height="11" rx="3.5" fill="rgba(0,0,0,0.25)" />
      ))}
      {[
        [30, 60],
        [42, 60],
        [54, 60],
        [54, 48],
        [54, 36],
      ].map(([x, y], i) => (
        <rect key={"b" + i} x={x} y={y} width="11" height="11" rx="3.5" fill="url(#snk-body)" opacity={0.7 + i * 0.06} />
      ))}
      <rect x="54" y="24" width="11" height="11" rx="3.5" fill="url(#snk-body)" />
      <circle cx="61" cy="28" r="1.4" fill="#04121a" />
      <circle cx="32" cy="34" r="8" fill="url(#snk-food)" opacity="0.25" />
      <circle cx="32" cy="34" r="5" fill="url(#snk-food)" />
      <circle cx="30.5" cy="32.5" r="1.6" fill="#fff" opacity="0.8" />
    </g>
  ),

  "flappy-orb": (
    <g>
      <defs>
        <linearGradient id="orb-pillar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7cf6a8" />
          <stop offset="100%" stopColor="#12b36b" />
        </linearGradient>
        <radialGradient id="orb-ball" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff4c2" />
          <stop offset="55%" stopColor="#ffd15c" />
          <stop offset="100%" stopColor="#ff8a1e" />
        </radialGradient>
        <radialGradient id="orb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd15c" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffd15c" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* soft clouds for sky feel */}
      <ellipse cx="24" cy="20" rx="12" ry="4.5" fill="rgba(255,255,255,0.12)" />
      <ellipse cx="72" cy="82" rx="14" ry="5" fill="rgba(255,255,255,0.1)" />
      {/* top pillar */}
      <rect x="63" y="6" width="20" height="30" rx="6" fill="rgba(0,0,0,0.25)" transform="translate(1.5,2)" />
      <rect x="63" y="6" width="20" height="30" rx="6" fill="url(#orb-pillar)" />
      <rect x="60" y="30" width="26" height="9" rx="4" fill="url(#orb-pillar)" />
      <rect x="66" y="9" width="4" height="24" rx="2" fill="rgba(255,255,255,0.35)" />
      {/* bottom pillar */}
      <rect x="63" y="62" width="20" height="32" rx="6" fill="rgba(0,0,0,0.25)" transform="translate(1.5,2)" />
      <rect x="63" y="62" width="20" height="32" rx="6" fill="url(#orb-pillar)" />
      <rect x="60" y="60" width="26" height="9" rx="4" fill="url(#orb-pillar)" />
      <rect x="66" y="66" width="4" height="24" rx="2" fill="rgba(255,255,255,0.35)" />
      {/* orb glow */}
      <circle cx="35" cy="50" r="18" fill="url(#orb-glow)" />
      {/* little wing */}
      <ellipse cx="28" cy="52" rx="7" ry="4.5" fill="#ff8a1e" transform="rotate(-24 28 52)" />
      <ellipse cx="28" cy="52" rx="4" ry="2.4" fill="#ffd98a" transform="rotate(-24 28 52)" />
      {/* orb body */}
      <circle cx="36.5" cy="51.5" r="10.5" fill="rgba(0,0,0,0.22)" />
      <circle cx="35" cy="50" r="10.5" fill="url(#orb-ball)" />
      {/* eye */}
      <circle cx="39" cy="47" r="2.6" fill="#fff" />
      <circle cx="39.8" cy="47.4" r="1.3" fill="#1a1205" />
      {/* beak */}
      <path d="M45 50 L50 49 L45 53 Z" fill="#ff7a1e" />
      {/* shine highlight */}
      <circle cx="31" cy="45.5" r="2.6" fill="#fff" opacity="0.85" />
    </g>
  ),

  "brick-blaster": (
    <g>
      <defs>
        <linearGradient id="brk-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff8a8a" />
          <stop offset="100%" stopColor="#ff2e5f" />
        </linearGradient>
        <linearGradient id="brk-o" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd48a" />
          <stop offset="100%" stopColor="#ff9a1e" />
        </linearGradient>
        <linearGradient id="brk-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8ffca" />
          <stop offset="100%" stopColor="#22c07a" />
        </linearGradient>
        <linearGradient id="brk-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8d8ff" />
          <stop offset="100%" stopColor="#2f8bff" />
        </linearGradient>
        <radialGradient id="brk-ball" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#d8f0ff" />
          <stop offset="100%" stopColor="#79b8ff" />
        </radialGradient>
        <radialGradient id="brk-ballglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bfe4ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#bfe4ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="brk-pad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c4d3e6" />
        </linearGradient>
      </defs>
      {/* brick rows */}
      {[
        { y: 16, fill: "url(#brk-r)" },
        { y: 27, fill: "url(#brk-o)" },
        { y: 38, fill: "url(#brk-g)" },
      ].map((row, ri) =>
        [14, 33, 52, 71].map((x, ci) => (
          <g key={"row" + ri + "c" + ci}>
            <rect x={x + 1} y={row.y + 1.5} width="15" height="8" rx="2.5" fill="rgba(0,0,0,0.22)" />
            <rect x={x} y={row.y} width="15" height="8" rx="2.5" fill={row.fill} />
            <rect x={x + 1.5} y={row.y + 1.4} width="12" height="2.2" rx="1.1" fill="rgba(255,255,255,0.35)" />
          </g>
        ))
      )}
      {/* one extra blue brick highlight */}
      <rect x="33" y="49" width="15" height="8" rx="2.5" fill="url(#brk-b)" />
      <rect x="34.5" y="50.4" width="12" height="2.2" rx="1.1" fill="rgba(255,255,255,0.35)" />
      {/* ball */}
      <circle cx="60" cy="66" r="9" fill="url(#brk-ballglow)" />
      <circle cx="60.5" cy="66.5" r="4.4" fill="rgba(0,0,0,0.25)" />
      <circle cx="59" cy="65" r="4.4" fill="url(#brk-ball)" />
      <circle cx="57.6" cy="63.6" r="1.2" fill="#fff" opacity="0.9" />
      {/* paddle */}
      <rect x="34" y="82.5" width="34" height="7" rx="3.5" fill="rgba(0,0,0,0.28)" />
      <rect x="33" y="81" width="34" height="7" rx="3.5" fill="url(#brk-pad)" />
      <rect x="35" y="82.2" width="30" height="1.8" rx="0.9" fill="rgba(255,255,255,0.7)" />
    </g>
  ),

  "star-fighter": (
    <g>
      <defs>
        <linearGradient id="star-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8f4ff" />
          <stop offset="100%" stopColor="#5b8bff" />
        </linearGradient>
        <linearGradient id="star-fin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8ecbff" />
          <stop offset="100%" stopColor="#2f5bd0" />
        </linearGradient>
        <linearGradient id="star-laser" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfffe0" stopOpacity="0" />
          <stop offset="60%" stopColor="#5cffce" />
          <stop offset="100%" stopColor="#eafff6" />
        </linearGradient>
        <radialGradient id="star-thrust" cx="50%" cy="20%" r="90%">
          <stop offset="0%" stopColor="#fff2b0" />
          <stop offset="45%" stopColor="#ff9a2e" />
          <stop offset="100%" stopColor="#ff2e5f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="star-canopy" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#d7fff6" />
          <stop offset="100%" stopColor="#12b0a6" />
        </radialGradient>
      </defs>
      {/* stars */}
      {[
        [16, 20, 1.4],
        [82, 30, 1.1],
        [24, 66, 1],
        [74, 72, 1.3],
        [50, 12, 0.9],
      ].map(([x, y, r], i) => (
        <circle key={"st" + i} cx={x} cy={y} r={r} fill="#fff" opacity="0.85" />
      ))}
      {/* enemy invaders */}
      {[
        [30, 26],
        [55, 22],
        [70, 34],
      ].map(([x, y], i) => (
        <g key={"en" + i}>
          <rect x={x - 4.5} y={y - 3.5} width="9" height="7" rx="3" fill="rgba(0,0,0,0.25)" transform="translate(1,1.5)" />
          <rect x={x - 4.5} y={y - 3.5} width="9" height="7" rx="3" fill="#b06bff" />
          <rect x={x - 6} y={y + 2.5} width="3" height="2.5" rx="1" fill="#7d3cff" />
          <rect x={x + 3} y={y + 2.5} width="3" height="2.5" rx="1" fill="#7d3cff" />
          <circle cx={x - 1.8} cy={y - 0.5} r="1.1" fill="#fff" />
          <circle cx={x + 1.8} cy={y - 0.5} r="1.1" fill="#fff" />
        </g>
      ))}
      {/* laser beam */}
      <rect x="47.6" y="30" width="4.8" height="30" rx="2.4" fill="url(#star-laser)" opacity="0.5" />
      <rect x="48.7" y="32" width="2.6" height="26" rx="1.3" fill="url(#star-laser)" />
      {/* thruster glow */}
      <ellipse cx="50" cy="82" rx="6" ry="12" fill="url(#star-thrust)" />
      {/* ship fins */}
      <path d="M50 74 L36 82 L42 66 Z" fill="url(#star-fin)" />
      <path d="M50 74 L64 82 L58 66 Z" fill="url(#star-fin)" />
      {/* ship body shadow + body */}
      <path d="M51.5 60 L61 79 L41 79 Z" fill="rgba(0,0,0,0.28)" />
      <path d="M50 58 L59 78 L41 78 Z" fill="url(#star-body)" />
      {/* canopy */}
      <ellipse cx="50" cy="70" rx="3.4" ry="4.6" fill="url(#star-canopy)" />
      <circle cx="48.8" cy="68" r="1.1" fill="#fff" opacity="0.85" />
      {/* nose highlight */}
      <path d="M50 59.5 L52.4 64 L47.6 64 Z" fill="rgba(255,255,255,0.55)" />
    </g>
  ),
};
