import type { ReactElement } from "react";

export const setC: Record<string, ReactElement> = {
  "memory-match": (
    <g>
      <defs>
        <linearGradient id="mm-back" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6d5cff" />
          <stop offset="100%" stopColor="#3a2bb8" />
        </linearGradient>
        <linearGradient id="mm-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e6ecff" />
        </linearGradient>
        <linearGradient id="mm-heart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff7a9a" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <radialGradient id="mm-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ff9db3" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff9db3" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* face-down card back left */}
      <g transform="rotate(-9 30 52)">
        <rect x="15" y="27" width="30" height="42" rx="5" fill="rgba(0,0,0,0.28)" transform="translate(2 3)" />
        <rect x="15" y="27" width="30" height="42" rx="5" fill="url(#mm-back)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <rect x="19" y="31" width="22" height="34" rx="3" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <circle cx="24" cy="38" r="2" fill="rgba(255,255,255,0.4)" />
        <circle cx="36" cy="38" r="2" fill="rgba(255,255,255,0.4)" />
        <circle cx="30" cy="48" r="2" fill="rgba(255,255,255,0.55)" />
        <circle cx="24" cy="58" r="2" fill="rgba(255,255,255,0.4)" />
        <circle cx="36" cy="58" r="2" fill="rgba(255,255,255,0.4)" />
      </g>
      {/* face-down card back back-right (peeking behind) */}
      <g transform="rotate(7 72 50)">
        <rect x="58" y="26" width="30" height="42" rx="5" fill="rgba(0,0,0,0.28)" transform="translate(2 3)" />
        <rect x="58" y="26" width="30" height="42" rx="5" fill="url(#mm-back)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <rect x="62" y="30" width="22" height="34" rx="3" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <circle cx="67" cy="37" r="2" fill="rgba(255,255,255,0.4)" />
        <circle cx="79" cy="37" r="2" fill="rgba(255,255,255,0.4)" />
        <circle cx="73" cy="47" r="2" fill="rgba(255,255,255,0.55)" />
      </g>
      {/* flipped-open face card center-front */}
      <g transform="rotate(3 50 56)">
        <rect x="35" y="35" width="30" height="42" rx="5" fill="rgba(0,0,0,0.3)" transform="translate(2 3)" />
        <ellipse cx="50" cy="56" rx="18" ry="20" fill="url(#mm-glow)" />
        <rect x="35" y="35" width="30" height="42" rx="5" fill="url(#mm-face)" stroke="rgba(180,190,220,0.6)" strokeWidth="1" />
        <path d="M50 66 C43 60 42 52 47 50 C49 49 50 51 50 52 C50 51 51 49 53 50 C58 52 57 60 50 66 Z" fill="url(#mm-heart)" />
        <ellipse cx="47" cy="53" rx="2" ry="1.4" fill="#ffffff" opacity="0.7" />
      </g>
    </g>
  ),
  "minesweeper": (
    <g>
      <defs>
        <linearGradient id="mine-cell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfd6e6" />
          <stop offset="100%" stopColor="#9aa4bd" />
        </linearGradient>
        <linearGradient id="mine-rev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5268" />
          <stop offset="100%" stopColor="#333a4d" />
        </linearGradient>
        <radialGradient id="mine-bomb" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0%" stopColor="#555a68" />
          <stop offset="100%" stopColor="#0b0e18" />
        </radialGradient>
        <radialGradient id="mine-boom" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ff5a4d" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ff5a4d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="14" y="14" width="72" height="72" rx="8" fill="rgba(3,7,18,0.35)" stroke="rgba(255,255,255,0.12)" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3].map((c) => {
          const x = 18 + c * 17;
          const y = 18 + r * 17;
          const revealed = (r === 0 && c === 1) || (r === 1 && c === 2) || (r === 2 && c === 0) || (r === 3 && c === 3);
          return (
            <g key={`${r}-${c}`}>
              <rect x={x} y={y} width="15" height="15" rx="2.5" fill={revealed ? "url(#mine-rev)" : "url(#mine-cell)"} />
              {!revealed && (
                <>
                  <rect x={x + 1} y={y + 1} width="13" height="2.5" rx="1" fill="rgba(255,255,255,0.45)" />
                  <rect x={x + 1} y={y + 11.5} width="13" height="2.5" rx="1" fill="rgba(0,0,0,0.2)" />
                </>
              )}
            </g>
          );
        }),
      )}
      {/* colored numbers */}
      <text x="38" y="30" fontSize="11" fontWeight="bold" fill="#2f6fff" textAnchor="middle">1</text>
      <text x="72" y="47" fontSize="11" fontWeight="bold" fill="#22a06b" textAnchor="middle">2</text>
      {/* bomb cell */}
      <ellipse cx="25.5" cy="60" rx="12" ry="12" fill="url(#mine-boom)" />
      <circle cx="25.5" cy="60" r="5" fill="url(#mine-bomb)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={25.5 + Math.cos(rad) * 5}
            y1={60 + Math.sin(rad) * 5}
            x2={25.5 + Math.cos(rad) * 7.5}
            y2={60 + Math.sin(rad) * 7.5}
            stroke="#0b0e18"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="23.5" cy="58" r="1.3" fill="#ffffff" opacity="0.8" />
      {/* flag cell */}
      <line x1="72" y1="70" x2="72" y2="82" stroke="#1b2233" strokeWidth="2" strokeLinecap="round" />
      <path d="M72 70 L82 73 L72 76 Z" fill="#e6394a" />
      <path d="M72 70 L77 71.5 L72 73 Z" fill="#ff6b78" opacity="0.7" />
      <ellipse cx="72" cy="82.5" rx="4" ry="1.4" fill="rgba(0,0,0,0.3)" />
    </g>
  ),
  "sliding-puzzle": (
    <g>
      <defs>
        <linearGradient id="slide-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3ad2ff" />
          <stop offset="100%" stopColor="#1668d6" />
        </linearGradient>
        <linearGradient id="slide-board" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#141a2e" />
          <stop offset="100%" stopColor="#0a0e1c" />
        </linearGradient>
      </defs>
      <rect x="15" y="15" width="70" height="70" rx="8" fill="url(#slide-board)" stroke="rgba(255,255,255,0.14)" />
      {(() => {
        const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "", "15"];
        return labels.map((label, i) => {
          const r = Math.floor(i / 4);
          const c = i % 4;
          const x = 19 + c * 16.5;
          const y = 19 + r * 16.5;
          if (label === "") return <g key={i} />;
          return (
            <g key={i}>
              <rect x={x + 0.8} y={y + 1} width="14.5" height="14.5" rx="3" fill="rgba(0,0,0,0.35)" />
              <rect x={x} y={y} width="14.5" height="14.5" rx="3" fill="url(#slide-tile)" />
              <rect x={x + 1.5} y={y + 1.5} width="11.5" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
              <text
                x={x + 7.25}
                y={y + 10.6}
                fontSize="7.5"
                fontWeight="bold"
                fill="#ffffff"
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          );
        });
      })()}
      {/* empty gap recessed look */}
      <rect x="35.5" y="68" width="14.5" height="14.5" rx="3" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.06)" />
    </g>
  ),
  "block-drop": (
    <g>
      <defs>
        <linearGradient id="blk-well" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1326" />
          <stop offset="100%" stopColor="#060912" />
        </linearGradient>
        <linearGradient id="blk-t" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c07bff" />
          <stop offset="100%" stopColor="#7b2fe0" />
        </linearGradient>
        <linearGradient id="blk-cyan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4fe3ff" />
          <stop offset="100%" stopColor="#1c9fd6" />
        </linearGradient>
        <linearGradient id="blk-org" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb64d" />
          <stop offset="100%" stopColor="#e07a12" />
        </linearGradient>
      </defs>
      <rect x="26" y="12" width="48" height="76" rx="6" fill="url(#blk-well)" stroke="rgba(255,255,255,0.16)" />
      {/* falling T tetromino */}
      {(() => {
        const cells = [
          { x: 34, y: 24 },
          { x: 45, y: 24 },
          { x: 56, y: 24 },
          { x: 45, y: 35 },
        ];
        return cells.map((cell, i) => (
          <g key={`t-${i}`}>
            <rect x={cell.x + 1} y={cell.y + 1.5} width="10" height="10" rx="2" fill="rgba(0,0,0,0.3)" />
            <rect x={cell.x} y={cell.y} width="10" height="10" rx="2" fill="url(#blk-t)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
            <rect x={cell.x + 1.5} y={cell.y + 1.5} width="7" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
          </g>
        ));
      })()}
      {/* stacked blocks at bottom */}
      {(() => {
        const stack = [
          { x: 30, y: 76, fill: "url(#blk-cyan)" },
          { x: 41, y: 76, fill: "url(#blk-org)" },
          { x: 52, y: 76, fill: "url(#blk-cyan)" },
          { x: 63, y: 76, fill: "url(#blk-org)" },
          { x: 41, y: 65, fill: "url(#blk-org)" },
          { x: 52, y: 65, fill: "url(#blk-cyan)" },
        ];
        return stack.map((b, i) => (
          <g key={`s-${i}`}>
            <rect x={b.x} y={b.y} width="10" height="10" rx="2" fill={b.fill} stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
            <rect x={b.x + 1.5} y={b.y + 1.5} width="7" height="3" rx="1.5" fill="rgba(255,255,255,0.35)" />
            <rect x={b.x + 1} y={b.y + 7.5} width="8" height="2" rx="1" fill="rgba(0,0,0,0.25)" />
          </g>
        ));
      })()}
    </g>
  ),
  "dino-dash": (
    <g>
      <defs>
        <linearGradient id="dino-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ee787" />
          <stop offset="100%" stopColor="#2ea043" />
        </linearGradient>
        <linearGradient id="dino-cactus" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4bbf6b" />
          <stop offset="100%" stopColor="#1f7a3d" />
        </linearGradient>
        <radialGradient id="dino-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#7ee787" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7ee787" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* ground line */}
      <line x1="10" y1="76" x2="90" y2="76" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
      {[18, 30, 42].map((gx) => (
        <circle key={gx} cx={gx} cy={80} r="1" fill="rgba(255,255,255,0.3)" />
      ))}
      {/* motion lines */}
      <line x1="12" y1="46" x2="24" y2="46" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="54" x2="20" y2="54" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
      {/* soft shadow under dino */}
      <ellipse cx="46" cy="76" rx="15" ry="3" fill="rgba(0,0,0,0.3)" />
      {/* dino */}
      <ellipse cx="46" cy="52" rx="20" ry="18" fill="url(#dino-glow)" />
      {/* tail */}
      <path d="M30 58 L22 54 L30 62 Z" fill="url(#dino-body)" />
      {/* body */}
      <path d="M32 60 Q30 46 42 44 L52 44 Q60 44 60 36 L60 30 Q60 26 64 26 Q68 26 68 30 L68 40 Q68 52 56 54 L52 54 L52 60 Q52 64 48 64 L36 64 Q32 64 32 60 Z" fill="url(#dino-body)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.6" />
      {/* head shine */}
      <ellipse cx="63" cy="30" rx="2.5" ry="2" fill="rgba(255,255,255,0.4)" />
      {/* eye */}
      <circle cx="65" cy="31" r="1.6" fill="#0b1e12" />
      <circle cx="65.5" cy="30.5" r="0.5" fill="#ffffff" />
      {/* little legs mid-run */}
      <rect x="37" y="64" width="4" height="8" rx="1.5" fill="url(#dino-body)" transform="rotate(12 39 68)" />
      <rect x="46" y="64" width="4" height="7" rx="1.5" fill="url(#dino-body)" transform="rotate(-14 48 67)" />
      {/* little arm */}
      <path d="M54 50 L58 52 L55 53 Z" fill="url(#dino-body)" />
      {/* cactus obstacle */}
      <g>
        <rect x="79.5" y="60" width="5" height="16" rx="2.5" fill="url(#dino-cactus)" />
        <rect x="75" y="64" width="4" height="7" rx="2" fill="url(#dino-cactus)" />
        <rect x="75" y="64" width="4" height="3" rx="1.5" fill="url(#dino-cactus)" />
        <path d="M79 64 Q75 64 75 68" fill="none" stroke="url(#dino-cactus)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M84.5 61 Q88 61 88 66" fill="none" stroke="url(#dino-cactus)" strokeWidth="3.5" strokeLinecap="round" />
        <rect x="80.5" y="62" width="1.4" height="12" rx="0.7" fill="rgba(255,255,255,0.25)" />
      </g>
    </g>
  ),
};
