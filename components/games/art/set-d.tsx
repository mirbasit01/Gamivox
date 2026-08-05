import type { ReactElement } from "react";

export const setD: Record<string, ReactElement> = {
  "sky-jumper": (
    <g>
      <defs>
        <linearGradient id="sky-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe27a" />
          <stop offset="100%" stopColor="#ff9d3c" />
        </linearGradient>
        <linearGradient id="sky-p1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5cffce" />
          <stop offset="100%" stopColor="#00b894" />
        </linearGradient>
        <linearGradient id="sky-p2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3ff" />
          <stop offset="100%" stopColor="#2e86ff" />
        </linearGradient>
        <linearGradient id="sky-p3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9ecb" />
          <stop offset="100%" stopColor="#ff2e83" />
        </linearGradient>
      </defs>
      <rect x="9" y="9" width="82" height="82" rx="14" fill="rgba(3,7,18,0.4)" stroke="rgba(255,255,255,0.12)" />
      {/* motion arc */}
      <path d="M22 58 Q40 20 66 40" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.6" strokeDasharray="3 3" strokeLinecap="round" />
      {/* platforms */}
      <ellipse cx="70" cy="66" rx="15" ry="4" fill="rgba(0,0,0,0.28)" />
      <rect x="55" y="60" width="30" height="8" rx="4" fill="url(#sky-p2)" />
      <rect x="16" y="72" width="26" height="8" rx="4" fill="url(#sky-p3)" />
      <rect x="60" y="80" width="24" height="8" rx="4" fill="url(#sky-p1)" />
      {/* character soft shadow */}
      <ellipse cx="41" cy="55" rx="10" ry="3" fill="rgba(0,0,0,0.25)" />
      {/* character body */}
      <circle cx="41" cy="41" r="11" fill="url(#sky-body)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
      {/* feet */}
      <ellipse cx="36" cy="51" rx="3" ry="2.2" fill="#ff7b2e" />
      <ellipse cx="46" cy="51" rx="3" ry="2.2" fill="#ff7b2e" />
      {/* eyes */}
      <circle cx="37.5" cy="39" r="2.6" fill="#fff" />
      <circle cx="45" cy="39" r="2.6" fill="#fff" />
      <circle cx="38" cy="39.5" r="1.2" fill="#1a1a2e" />
      <circle cx="45.5" cy="39.5" r="1.2" fill="#1a1a2e" />
      {/* cheeks + smile */}
      <circle cx="34" cy="43.5" r="1.4" fill="#ff6b9d" opacity="0.7" />
      <circle cx="48.5" cy="43.5" r="1.4" fill="#ff6b9d" opacity="0.7" />
      <path d="M39 44 Q41.5 46.5 44 44" fill="none" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" />
      {/* highlight */}
      <circle cx="37" cy="35.5" r="2" fill="#fff" opacity="0.7" />
    </g>
  ),
  "whack-a-mole": (
    <g>
      <defs>
        <radialGradient id="mole-hole" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#2a1a0e" />
          <stop offset="100%" stopColor="#6b4423" />
        </radialGradient>
        <linearGradient id="mole-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a98467" />
          <stop offset="100%" stopColor="#6f4e37" />
        </linearGradient>
        <linearGradient id="mole-mallet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#c0392b" />
        </linearGradient>
      </defs>
      <rect x="9" y="9" width="82" height="82" rx="14" fill="rgba(3,7,18,0.4)" stroke="rgba(255,255,255,0.12)" />
      {/* ground */}
      <ellipse cx="50" cy="70" rx="40" ry="18" fill="rgba(120,180,90,0.15)" />
      {/* hole shadows */}
      <ellipse cx="28" cy="74" rx="12" ry="5" fill="rgba(0,0,0,0.3)" />
      <ellipse cx="72" cy="74" rx="12" ry="5" fill="rgba(0,0,0,0.3)" />
      <ellipse cx="50" cy="66" rx="14" ry="6" fill="rgba(0,0,0,0.35)" />
      {/* holes */}
      <ellipse cx="28" cy="72" rx="11" ry="4.5" fill="url(#mole-hole)" />
      <ellipse cx="72" cy="72" rx="11" ry="4.5" fill="url(#mole-hole)" />
      <ellipse cx="50" cy="64" rx="13" ry="5.5" fill="url(#mole-hole)" />
      {/* mole body popping from middle */}
      <ellipse cx="50" cy="56" rx="10" ry="11" fill="url(#mole-body)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
      {/* belly */}
      <ellipse cx="50" cy="59" rx="5.5" ry="6" fill="#e8c9a8" opacity="0.8" />
      {/* eyes */}
      <circle cx="46.5" cy="52" r="2.4" fill="#fff" />
      <circle cx="53.5" cy="52" r="2.4" fill="#fff" />
      <circle cx="47" cy="52.3" r="1.1" fill="#1a1a1a" />
      <circle cx="54" cy="52.3" r="1.1" fill="#1a1a1a" />
      {/* nose */}
      <circle cx="50" cy="56" r="1.8" fill="#ff8fab" />
      <circle cx="49.4" cy="55.4" r="0.6" fill="#fff" opacity="0.8" />
      {/* whiskers */}
      <path d="M50 56 L43 55.5 M50 57 L43 58" stroke="rgba(0,0,0,0.35)" strokeWidth="0.5" strokeLinecap="round" />
      <path d="M50 56 L57 55.5 M50 57 L57 58" stroke="rgba(0,0,0,0.35)" strokeWidth="0.5" strokeLinecap="round" />
      {/* highlight */}
      <circle cx="46" cy="50" r="1.6" fill="#fff" opacity="0.5" />
      {/* mallet */}
      <g transform="rotate(-28 72 30)">
        <rect x="69" y="30" width="4" height="30" rx="2" fill="#8b5a2b" />
        <rect x="60" y="20" width="22" height="14" rx="4" fill="url(#mole-mallet)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
        <rect x="63" y="23" width="6" height="8" rx="2" fill="#fff" opacity="0.35" />
      </g>
    </g>
  ),
  "road-crossing": (
    <g>
      <defs>
        <linearGradient id="road-frog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fe36a" />
          <stop offset="100%" stopColor="#4caf50" />
        </linearGradient>
        <linearGradient id="road-car1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#e63946" />
        </linearGradient>
        <linearGradient id="road-car2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffd93d" />
          <stop offset="100%" stopColor="#f9a825" />
        </linearGradient>
        <linearGradient id="road-car3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5cb3ff" />
          <stop offset="100%" stopColor="#2e86ff" />
        </linearGradient>
      </defs>
      <rect x="9" y="9" width="82" height="82" rx="14" fill="rgba(3,7,18,0.4)" stroke="rgba(255,255,255,0.12)" />
      {/* road */}
      <rect x="9" y="26" width="82" height="52" fill="rgba(40,44,52,0.55)" />
      {/* lane dashes */}
      <line x1="14" y1="43" x2="86" y2="43" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeDasharray="6 5" strokeLinecap="round" />
      <line x1="14" y1="61" x2="86" y2="61" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeDasharray="6 5" strokeLinecap="round" />
      {/* car shadows */}
      <ellipse cx="30" cy="39" rx="12" ry="3" fill="rgba(0,0,0,0.35)" />
      <ellipse cx="66" cy="57" rx="12" ry="3" fill="rgba(0,0,0,0.35)" />
      {/* car 1 top lane */}
      <rect x="19" y="30" width="24" height="9" rx="3" fill="url(#road-car1)" />
      <rect x="24" y="31.5" width="10" height="4" rx="1.5" fill="#fff" opacity="0.55" />
      <circle cx="24" cy="39" r="2" fill="#222" />
      <circle cx="38" cy="39" r="2" fill="#222" />
      <circle cx="42.5" cy="34" r="1.2" fill="#fff9c4" />
      {/* car 2 mid lane */}
      <rect x="56" y="48" width="24" height="9" rx="3" fill="url(#road-car2)" />
      <rect x="65" y="49.5" width="10" height="4" rx="1.5" fill="#fff" opacity="0.55" />
      <circle cx="61" cy="57" r="2" fill="#222" />
      <circle cx="75" cy="57" r="2" fill="#222" />
      <circle cx="56.5" cy="52" r="1.2" fill="#fff9c4" />
      {/* frog shadow */}
      <ellipse cx="50" cy="74" rx="9" ry="2.6" fill="rgba(0,0,0,0.3)" />
      {/* frog body */}
      <ellipse cx="50" cy="70" rx="9" ry="7" fill="url(#road-frog)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
      {/* legs */}
      <ellipse cx="42" cy="73" rx="3.5" ry="2" fill="#3d9142" transform="rotate(30 42 73)" />
      <ellipse cx="58" cy="73" rx="3.5" ry="2" fill="#3d9142" transform="rotate(-30 58 73)" />
      {/* eyes */}
      <circle cx="46" cy="63.5" r="3" fill="#8fe36a" />
      <circle cx="54" cy="63.5" r="3" fill="#8fe36a" />
      <circle cx="46" cy="63" r="1.8" fill="#fff" />
      <circle cx="54" cy="63" r="1.8" fill="#fff" />
      <circle cx="46.4" cy="63.3" r="1" fill="#1a1a1a" />
      <circle cx="54.4" cy="63.3" r="1" fill="#1a1a1a" />
      {/* smile */}
      <path d="M46 70 Q50 73 54 70" fill="none" stroke="#2e6b32" strokeWidth="1" strokeLinecap="round" />
      <circle cx="47" cy="68" r="1.4" fill="#c8f2a8" opacity="0.6" />
    </g>
  ),
  "asteroid-field": (
    <g>
      <defs>
        <linearGradient id="ast-ship" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f7ff" />
          <stop offset="100%" stopColor="#7aa8d8" />
        </linearGradient>
        <linearGradient id="ast-rock1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b0a89c" />
          <stop offset="100%" stopColor="#6b6355" />
        </linearGradient>
        <linearGradient id="ast-rock2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9c8f80" />
          <stop offset="100%" stopColor="#5a4f43" />
        </linearGradient>
        <radialGradient id="ast-thrust" cx="0.5" cy="0.2" r="0.8">
          <stop offset="0%" stopColor="#fff6a0" />
          <stop offset="50%" stopColor="#ff8c42" />
          <stop offset="100%" stopColor="rgba(255,60,0,0)" />
        </radialGradient>
      </defs>
      <rect x="9" y="9" width="82" height="82" rx="14" fill="rgba(3,7,18,0.4)" stroke="rgba(255,255,255,0.12)" />
      {/* stars */}
      {[
        [20, 20], [35, 15], [70, 18], [82, 30], [15, 40], [60, 12], [78, 55], [24, 60],
      ].map(([cx, cy], i) => (
        <circle key={`ast-star-${i}`} cx={cx} cy={cy} r={i % 3 === 0 ? 1.2 : 0.7} fill="#fff" opacity={0.8} />
      ))}
      {/* asteroid 1 */}
      <polygon points="30,24 37,22 41,28 39,36 32,39 26,34 25,28" fill="url(#ast-rock1)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.6" />
      <circle cx="32" cy="30" r="2" fill="rgba(0,0,0,0.25)" />
      <circle cx="36" cy="26" r="1.2" fill="rgba(0,0,0,0.2)" />
      <circle cx="30" cy="34" r="1" fill="rgba(0,0,0,0.2)" />
      <circle cx="29" cy="25" r="1" fill="#fff" opacity="0.3" />
      {/* asteroid 2 */}
      <polygon points="66,32 73,30 78,36 76,44 69,47 62,42 62,36" fill="url(#ast-rock2)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.6" />
      <circle cx="69" cy="38" r="2.2" fill="rgba(0,0,0,0.25)" />
      <circle cx="73" cy="41" r="1.2" fill="rgba(0,0,0,0.2)" />
      <circle cx="65" cy="37" r="1" fill="#fff" opacity="0.3" />
      {/* asteroid 3 small */}
      <polygon points="48,46 53,45 55,50 52,54 47,53 45,49" fill="url(#ast-rock1)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
      <circle cx="50" cy="49" r="1.3" fill="rgba(0,0,0,0.25)" />
      {/* thruster glow */}
      <ellipse cx="50" cy="82" rx="5" ry="9" fill="url(#ast-thrust)" />
      {/* ship shadow */}
      <ellipse cx="51" cy="76" rx="9" ry="3" fill="rgba(0,0,0,0.3)" />
      {/* ship body */}
      <path d="M50 60 L58 76 L50 72 L42 76 Z" fill="url(#ast-ship)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      {/* cockpit */}
      <circle cx="50" cy="68" r="2.6" fill="#2e86ff" />
      <circle cx="49.2" cy="67" r="1" fill="#bfe4ff" opacity="0.9" />
      {/* wing accents */}
      <path d="M42 76 L45 71 L47 74 Z" fill="#e63946" />
      <path d="M58 76 L55 71 L53 74 Z" fill="#e63946" />
    </g>
  ),
  "turret-gunner": (
    <g>
      <defs>
        <linearGradient id="turr-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6c7a89" />
          <stop offset="100%" stopColor="#2c3e50" />
        </linearGradient>
        <linearGradient id="turr-barrel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9aa7b3" />
          <stop offset="100%" stopColor="#4a5866" />
        </linearGradient>
        <linearGradient id="turr-drone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9ecb" />
          <stop offset="100%" stopColor="#ff2e83" />
        </linearGradient>
        <radialGradient id="turr-muzzle" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fffbe0" />
          <stop offset="50%" stopColor="#ffd93d" />
          <stop offset="100%" stopColor="rgba(255,140,0,0)" />
        </radialGradient>
      </defs>
      <rect x="9" y="9" width="82" height="82" rx="14" fill="rgba(3,7,18,0.4)" stroke="rgba(255,255,255,0.12)" />
      {/* target reticle glow */}
      <circle cx="66" cy="28" r="11" fill="#ff2e83" opacity="0.18" />
      <circle cx="66" cy="28" r="8" fill="none" stroke="#ff5e9a" strokeWidth="1.4" />
      <circle cx="66" cy="28" r="3.5" fill="none" stroke="#ff5e9a" strokeWidth="1.2" />
      <line x1="66" y1="16" x2="66" y2="21" stroke="#ff5e9a" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="66" y1="35" x2="66" y2="40" stroke="#ff5e9a" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="54" y1="28" x2="59" y2="28" stroke="#ff5e9a" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="73" y1="28" x2="78" y2="28" stroke="#ff5e9a" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="66" cy="28" r="1.2" fill="#ff5e9a" />
      {/* drone 1 */}
      <g>
        <ellipse cx="26" cy="30" rx="7" ry="4.5" fill="url(#turr-drone)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.6" />
        <circle cx="26" cy="30" r="2" fill="#2c0a1e" />
        <circle cx="25.4" cy="29.4" r="0.7" fill="#fff" opacity="0.8" />
        <line x1="19" y1="27" x2="14" y2="25" stroke="#c0c0c0" strokeWidth="1" strokeLinecap="round" />
        <line x1="33" y1="27" x2="38" y2="25" stroke="#c0c0c0" strokeWidth="1" strokeLinecap="round" />
        <circle cx="14" cy="25" r="1.4" fill="rgba(200,220,255,0.5)" />
        <circle cx="38" cy="25" r="1.4" fill="rgba(200,220,255,0.5)" />
      </g>
      {/* drone 2 small */}
      <ellipse cx="44" cy="18" rx="5" ry="3.2" fill="url(#turr-drone)" opacity="0.9" />
      <circle cx="44" cy="18" r="1.4" fill="#2c0a1e" />
      {/* muzzle glow */}
      <circle cx="58" cy="43" r="5" fill="url(#turr-muzzle)" />
      {/* barrel */}
      <g transform="rotate(-42 46 62)">
        <rect x="43" y="34" width="6" height="30" rx="3" fill="url(#turr-barrel)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.6" />
        <rect x="44.5" y="36" width="1.5" height="24" rx="0.7" fill="#fff" opacity="0.3" />
      </g>
      {/* turret base shadow */}
      <ellipse cx="46" cy="80" rx="18" ry="4" fill="rgba(0,0,0,0.35)" />
      {/* turret dome */}
      <path d="M32 74 Q46 58 60 74 Z" fill="url(#turr-base)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
      {/* base */}
      <rect x="30" y="73" width="32" height="8" rx="3" fill="#233140" />
      <circle cx="46" cy="66" r="3" fill="#7f8c9a" />
      <circle cx="45" cy="65" r="1" fill="#fff" opacity="0.5" />
    </g>
  ),
  "maze-escape": (
    <g>
      <defs>
        <linearGradient id="maze-wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c5cff" />
          <stop offset="100%" stopColor="#4a2eff" />
        </linearGradient>
        <radialGradient id="maze-player" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#fff6a0" />
          <stop offset="100%" stopColor="#ffb703" />
        </radialGradient>
        <radialGradient id="maze-exit" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#8fffb0" />
          <stop offset="100%" stopColor="#00c853" />
        </radialGradient>
      </defs>
      <rect x="9" y="9" width="82" height="82" rx="14" fill="rgba(3,7,18,0.4)" stroke="rgba(255,255,255,0.12)" />
      {/* maze frame */}
      <rect x="20" y="20" width="60" height="60" rx="6" fill="none" stroke="url(#maze-wall)" strokeWidth="3.5" strokeLinecap="round" />
      {/* inner walls */}
      <g fill="none" stroke="url(#maze-wall)" strokeWidth="3.2" strokeLinecap="round">
        <path d="M20 38 L44 38" />
        <path d="M56 20 L56 44" />
        <path d="M32 32 L32 56" />
        <path d="M44 50 L68 50" />
        <path d="M56 56 L56 80" />
        <path d="M20 62 L44 62" />
        <path d="M68 32 L80 32" />
        <path d="M44 68 L44 80" />
      </g>
      {/* path hint */}
      <path d="M28 28 L28 50 L38 50 L38 44 L50 44 L50 62 L64 62 L64 72" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.4" strokeDasharray="2 3" strokeLinecap="round" />
      {/* exit glow marker */}
      <circle cx="64" cy="72" r="7" fill="#00c853" opacity="0.25" />
      <circle cx="64" cy="72" r="4" fill="url(#maze-exit)" />
      <path d="M62 72 L63.5 74 L66.5 70.5" fill="none" stroke="#0a3d1a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* player glow */}
      <circle cx="28" cy="28" r="6.5" fill="#ffb703" opacity="0.28" />
      <circle cx="28" cy="28" r="3.6" fill="url(#maze-player)" />
      <circle cx="26.8" cy="26.8" r="1.2" fill="#fff" opacity="0.8" />
    </g>
  ),
};
