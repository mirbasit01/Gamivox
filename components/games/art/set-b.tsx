import type { ReactElement } from "react";

export const setB: Record<string, ReactElement> = {
  "twenty48": (
    <g>
      <defs>
        <linearGradient id="t48-t2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe0a3" />
          <stop offset="100%" stopColor="#ffb347" />
        </linearGradient>
        <linearGradient id="t48-t4" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc36b" />
          <stop offset="100%" stopColor="#ff9838" />
        </linearGradient>
        <linearGradient id="t48-t8" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff9a5a" />
          <stop offset="100%" stopColor="#ff6a2c" />
        </linearGradient>
        <linearGradient id="t48-t16" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff7a5c" />
          <stop offset="100%" stopColor="#f4442e" />
        </linearGradient>
        <linearGradient id="t48-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <rect x="9" y="9" width="82" height="82" rx="14" fill="rgba(3,7,18,0.45)" stroke="rgba(255,255,255,0.12)" />
      <rect x="15" y="15" width="70" height="70" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" />
      {[
        { x: 20, y: 20, fill: "url(#t48-t2)", label: "2" },
        { x: 52, y: 20, fill: "url(#t48-t4)", label: "4" },
        { x: 20, y: 52, fill: "url(#t48-t8)", label: "8" },
        { x: 52, y: 52, fill: "url(#t48-t16)", label: "16" },
      ].map((t) => (
        <g key={t.label}>
          <rect x={t.x + 1} y={t.y + 2} width="28" height="28" rx="7" fill="rgba(0,0,0,0.3)" />
          <rect x={t.x} y={t.y} width="28" height="28" rx="7" fill={t.fill} />
          <rect x={t.x + 3} y={t.y + 3} width="22" height="10" rx="5" fill="url(#t48-shine)" />
          <text
            x={t.x + 14}
            y={t.y + 19}
            textAnchor="middle"
            fontSize={t.label.length > 1 ? 12 : 15}
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
            fill="#fff"
          >
            {t.label}
          </text>
        </g>
      ))}
    </g>
  ),
  "color-memory": (
    <g>
      <defs>
        <radialGradient id="cm-lit" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#aefcff" />
          <stop offset="100%" stopColor="#00d4e6" />
        </radialGradient>
        <linearGradient id="cm-cyan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3fd8e8" />
          <stop offset="100%" stopColor="#0f8fa0" />
        </linearGradient>
        <linearGradient id="cm-pink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff7ac0" />
          <stop offset="100%" stopColor="#c72d7f" />
        </linearGradient>
        <linearGradient id="cm-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe27a" />
          <stop offset="100%" stopColor="#d8a017" />
        </linearGradient>
        <linearGradient id="cm-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8ef07a" />
          <stop offset="100%" stopColor="#2f9e3e" />
        </linearGradient>
        <radialGradient id="cm-hub" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="#2a3350" />
          <stop offset="100%" stopColor="#0c1024" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="52" r="40" fill="rgba(0,0,0,0.28)" />
      <circle cx="50" cy="50" r="40" fill="rgba(3,7,18,0.35)" stroke="rgba(255,255,255,0.12)" />
      {/* lit pad glow (top-left cyan) */}
      <circle cx="34" cy="34" r="26" fill="#00d4e6" opacity="0.3" />
      <path d="M50 50 L50 12 A38 38 0 0 0 12 50 Z" fill="url(#cm-lit)" />
      <path d="M50 50 L50 12 A38 38 0 0 1 88 50 Z" fill="url(#cm-pink)" />
      <path d="M50 50 L12 50 A38 38 0 0 0 50 88 Z" fill="url(#cm-yellow)" />
      <path d="M50 50 L88 50 A38 38 0 0 1 50 88 Z" fill="url(#cm-green)" />
      {/* pad shines */}
      <path d="M46 16 A34 34 0 0 0 18 44" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
      <path d="M54 16 A34 34 0 0 1 82 44" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
      {/* center hub */}
      <circle cx="50" cy="51" r="15" fill="rgba(0,0,0,0.35)" />
      <circle cx="50" cy="50" r="15" fill="url(#cm-hub)" stroke="rgba(255,255,255,0.15)" />
      <circle cx="46" cy="46" r="4" fill="rgba(255,255,255,0.18)" />
    </g>
  ),
  "tic-tac-toe": (
    <g>
      <defs>
        <linearGradient id="ttt-x" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff8ad4" />
          <stop offset="100%" stopColor="#e6338f" />
        </linearGradient>
        <linearGradient id="ttt-o" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7ff0ff" />
          <stop offset="100%" stopColor="#12a7d4" />
        </linearGradient>
      </defs>
      <rect x="9" y="9" width="82" height="82" rx="14" fill="rgba(3,7,18,0.45)" stroke="rgba(255,255,255,0.12)" />
      {/* grid lines */}
      {[
        "M40 18 L40 82",
        "M60 18 L60 82",
        "M18 40 L82 40",
        "M18 60 L82 60",
      ].map((d) => (
        <path key={d} d={d} stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {/* X in top-left cell (~29,29) glow + shadow + mark */}
      <g>
        <circle cx="29" cy="29" r="12" fill="url(#ttt-x)" opacity="0.25" />
        <path d="M23 24 L36 35 M36 24 L23 35" stroke="rgba(0,0,0,0.3)" strokeWidth="4.5" strokeLinecap="round" transform="translate(0.5,1.5)" />
        <path d="M23 24 L36 35 M36 24 L23 35" stroke="url(#ttt-x)" strokeWidth="4.5" strokeLinecap="round" />
      </g>
      {/* O in center cell (~50,50) */}
      <g>
        <circle cx="50" cy="50" r="12" fill="url(#ttt-o)" opacity="0.25" />
        <circle cx="50" cy="51.5" r="7" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="4.5" />
        <circle cx="50" cy="50" r="7" fill="none" stroke="url(#ttt-o)" strokeWidth="4.5" />
      </g>
      {/* small X bottom-right cell (~71,71) */}
      <g>
        <path d="M65 66 L77 77 M77 66 L65 77" stroke="rgba(0,0,0,0.3)" strokeWidth="4" strokeLinecap="round" transform="translate(0.5,1.5)" />
        <path d="M65 66 L77 77 M77 66 L65 77" stroke="url(#ttt-x)" strokeWidth="4" strokeLinecap="round" />
      </g>
    </g>
  ),
  "pong-duel": (
    <g>
      <defs>
        <linearGradient id="pong-pad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#eaf6ff" />
          <stop offset="100%" stopColor="#8fb8d6" />
        </linearGradient>
        <radialGradient id="pong-ball" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#69d6ff" />
        </radialGradient>
        <linearGradient id="pong-streak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(105,214,255,0)" />
          <stop offset="100%" stopColor="rgba(105,214,255,0.7)" />
        </linearGradient>
      </defs>
      <rect x="9" y="9" width="82" height="82" rx="14" fill="rgba(3,7,18,0.5)" stroke="rgba(255,255,255,0.12)" />
      {/* dashed center line */}
      {[18, 30, 42, 54, 66, 78].map((y) => (
        <rect key={y} x="49" y={y} width="2" height="7" rx="1" fill="rgba(255,255,255,0.25)" />
      ))}
      {/* left paddle */}
      <rect x="17" y="34" width="6" height="26" rx="3" fill="rgba(0,0,0,0.3)" transform="translate(1,2)" />
      <rect x="17" y="32" width="6" height="26" rx="3" fill="url(#pong-pad)" />
      <rect x="18.2" y="34" width="1.6" height="18" rx="0.8" fill="rgba(255,255,255,0.6)" />
      {/* right paddle */}
      <rect x="77" y="46" width="6" height="26" rx="3" fill="rgba(0,0,0,0.3)" transform="translate(1,2)" />
      <rect x="77" y="44" width="6" height="26" rx="3" fill="url(#pong-pad)" />
      <rect x="78.2" y="46" width="1.6" height="18" rx="0.8" fill="rgba(255,255,255,0.6)" />
      {/* motion streak */}
      <path d="M36 58 L54 46" stroke="url(#pong-streak)" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      {/* ball glow + ball + shine */}
      <circle cx="57" cy="44" r="10" fill="#69d6ff" opacity="0.3" />
      <circle cx="57" cy="45.5" r="5.5" fill="rgba(0,0,0,0.3)" />
      <circle cx="57" cy="44" r="5.5" fill="url(#pong-ball)" />
      <circle cx="55" cy="42" r="1.6" fill="#fff" opacity="0.9" />
    </g>
  ),
  "connect-four": (
    <g>
      <defs>
        <linearGradient id="c4-board" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2f6bff" />
          <stop offset="100%" stopColor="#173a9c" />
        </linearGradient>
        <radialGradient id="c4-red" cx="0.38" cy="0.32" r="0.75">
          <stop offset="0%" stopColor="#ff8a7a" />
          <stop offset="55%" stopColor="#f0402c" />
          <stop offset="100%" stopColor="#c41f13" />
        </radialGradient>
        <radialGradient id="c4-yellow" cx="0.38" cy="0.32" r="0.75">
          <stop offset="0%" stopColor="#fff0a3" />
          <stop offset="55%" stopColor="#ffcf33" />
          <stop offset="100%" stopColor="#e0a012" />
        </radialGradient>
        <radialGradient id="c4-hole" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#0b1330" />
          <stop offset="100%" stopColor="#1a2f6e" />
        </radialGradient>
      </defs>
      {/* dropping disc above board */}
      <circle cx="34" cy="15" r="7.5" fill="#c41f13" opacity="0.3" />
      <circle cx="34" cy="14" r="6.5" fill="url(#c4-red)" />
      <circle cx="31.5" cy="11.5" r="2" fill="rgba(255,255,255,0.7)" />
      {/* board */}
      <rect x="18" y="26" width="64" height="60" rx="9" fill="rgba(0,0,0,0.3)" transform="translate(1,2)" />
      <rect x="18" y="26" width="64" height="60" rx="9" fill="url(#c4-board)" stroke="rgba(255,255,255,0.15)" />
      {(() => {
        const cols = [28, 42, 56, 70];
        const rows = [37, 51, 65, 79];
        const filled: Record<string, "r" | "y"> = {
          "0-3": "y",
          "1-3": "r",
          "2-3": "y",
          "3-3": "r",
          "3-2": "y",
          "2-2": "r",
          "1-1": "y",
        };
        const cells: ReactElement[] = [];
        cols.forEach((cx, ci) => {
          rows.forEach((cy, ri) => {
            const key = `${ci}-${ri}`;
            const f = filled[key];
            if (f) {
              cells.push(
                <g key={key}>
                  <circle cx={cx} cy={cy} r="5.6" fill={f === "r" ? "url(#c4-red)" : "url(#c4-yellow)"} />
                  <circle cx={cx - 1.6} cy={cy - 1.8} r="1.5" fill="rgba(255,255,255,0.6)" />
                </g>
              );
            } else {
              cells.push(<circle key={key} cx={cx} cy={cy} r="5.6" fill="url(#c4-hole)" />);
            }
          });
        });
        return cells;
      })()}
    </g>
  ),
};
