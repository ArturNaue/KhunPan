// v1.1.0 | 2026-06-09 MEZ
// Carved-wood SVG icons – dark engraved lines on warm wood background

const CARVE = '#3E1F00';   // engraved line color
const SNOW  = '#EEF2F7';  // snow / highlight

// ─── Hiker (2×2) ─────────────────────────────────────────────────────────────
export function HikerIcon({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 160 160" fill="none">
      {/* Head */}
      <circle cx="78" cy="32" r="18" fill={CARVE} opacity=".85"/>
      <circle cx="78" cy="30" r="16" fill="#F5CBA7"/>
      {/* Hat */}
      <ellipse cx="78" cy="18" rx="20" ry="7" fill={CARVE}/>
      <rect x="60" y="10" width="36" height="11" rx="5" fill={CARVE}/>
      {/* Brim */}
      <ellipse cx="78" cy="20" rx="24" ry="5" fill={CARVE}/>
      {/* Body / jacket */}
      <path d="M58 50 Q78 44 98 50 L104 100 H52 Z" fill={CARVE} opacity=".8"/>
      <path d="M60 52 Q78 46 96 52 L101 97 H55 Z" fill="#5D8A4A"/>
      {/* Backpack */}
      <rect x="88" y="48" width="22" height="30" rx="5" fill={CARVE} opacity=".8"/>
      <rect x="90" y="50" width="18" height="26" rx="4" fill="#C0773C"/>
      <rect x="93" y="54" width="12" height="4" rx="2" fill={CARVE} opacity=".5"/>
      {/* Left arm + pole */}
      <line x1="58" y1="58" x2="38" y2="80" stroke={CARVE} strokeWidth="9" strokeLinecap="round"/>
      <line x1="38" y1="80" x2="32" y2="145" stroke={CARVE} strokeWidth="5" strokeLinecap="round"/>
      <ellipse cx="32" cy="146" rx="5" ry="3" fill={CARVE}/>
      {/* Right arm */}
      <line x1="98" y1="58" x2="112" y2="76" stroke={CARVE} strokeWidth="9" strokeLinecap="round"/>
      {/* Legs */}
      <path d="M64 100 L55 138 L46 138" stroke={CARVE} strokeWidth="9" strokeLinecap="round" fill="none"/>
      <path d="M92 100 L100 136 L112 128" stroke={CARVE} strokeWidth="9" strokeLinecap="round" fill="none"/>
      {/* Boots */}
      <ellipse cx="44" cy="139" rx="10" ry="5" fill={CARVE}/>
      <ellipse cx="113" cy="127" rx="10" ry="5" fill={CARVE}/>
      {/* Face */}
      <circle cx="71" cy="30" r="3" fill={CARVE}/>
      <circle cx="85" cy="30" r="3" fill={CARVE}/>
      <path d="M72 38 Q78 43 84 38" stroke={CARVE} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ─── River / Stream (2×1 horizontal) ──────────────────────────────────────────
export function RiverIcon({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 160 80" fill="none">
      {/* Wavy water lines */}
      {[14, 30, 46, 62].map((y, i) => (
        <path key={i}
          d={`M8 ${y} Q28 ${y-9} 48 ${y} Q68 ${y+9} 88 ${y} Q108 ${y-9} 128 ${y} Q148 ${y+9} 158 ${y}`}
          stroke={CARVE} strokeWidth="3.5" strokeLinecap="round" fill="none" opacity={0.7 + i * 0.08}
        />
      ))}
      {/* Stones */}
      <ellipse cx="42" cy="54" rx="8" ry="5" fill={CARVE} opacity=".6"/>
      <ellipse cx="100" cy="40" rx="7" ry="4" fill={CARVE} opacity=".5"/>
      <ellipse cx="130" cy="58" rx="6" ry="4" fill={CARVE} opacity=".55"/>
    </svg>
  );
}

// ─── Bare Winter Tree (1×2 vertical) ─────────────────────────────────────────
export function BareTreeIcon({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 80 160" fill="none">
      {/* Trunk */}
      <rect x="34" y="100" width="12" height="56" rx="5" fill={CARVE}/>
      {/* Main branches */}
      <line x1="40" y1="110" x2="12" y2="72" stroke={CARVE} strokeWidth="7" strokeLinecap="round"/>
      <line x1="40" y1="110" x2="68" y2="72" stroke={CARVE} strokeWidth="7" strokeLinecap="round"/>
      <line x1="40" y1="90"  x2="16" y2="60" stroke={CARVE} strokeWidth="5.5" strokeLinecap="round"/>
      <line x1="40" y1="90"  x2="64" y2="60" stroke={CARVE} strokeWidth="5.5" strokeLinecap="round"/>
      {/* Sub-branches left */}
      <line x1="18" y1="62" x2="8"  y2="44" stroke={CARVE} strokeWidth="4" strokeLinecap="round"/>
      <line x1="18" y1="62" x2="30" y2="46" stroke={CARVE} strokeWidth="4" strokeLinecap="round"/>
      <line x1="14" y1="74" x2="4"  y2="58" stroke={CARVE} strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="14" y1="74" x2="24" y2="56" stroke={CARVE} strokeWidth="3.5" strokeLinecap="round"/>
      {/* Sub-branches right */}
      <line x1="62" y1="62" x2="72" y2="44" stroke={CARVE} strokeWidth="4" strokeLinecap="round"/>
      <line x1="62" y1="62" x2="50" y2="46" stroke={CARVE} strokeWidth="4" strokeLinecap="round"/>
      <line x1="66" y1="74" x2="76" y2="58" stroke={CARVE} strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="66" y1="74" x2="56" y2="56" stroke={CARVE} strokeWidth="3.5" strokeLinecap="round"/>
      {/* Twigs */}
      <line x1="40" y1="70" x2="40" y2="32" stroke={CARVE} strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="40" y1="46" x2="28" y2="32" stroke={CARVE} strokeWidth="3" strokeLinecap="round"/>
      <line x1="40" y1="46" x2="52" y2="32" stroke={CARVE} strokeWidth="3" strokeLinecap="round"/>
      <line x1="40" y1="34" x2="32" y2="20" stroke={CARVE} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="40" y1="34" x2="48" y2="20" stroke={CARVE} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Pine Forest (1×2 vertical) ──────────────────────────────────────────────
export function PineForestIcon({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 80 160" fill="none">
      {/* Left tree */}
      <rect x="15" y="118" width="8" height="38" rx="3" fill={CARVE}/>
      <polygon points="19,18 36,70 2,70" fill={CARVE} opacity=".85"/>
      <polygon points="19,36 38,82 0,82" fill={CARVE} opacity=".9"/>
      <polygon points="19,54 40,98 -2,98" fill={CARVE}/>
      {/* Right tree */}
      <rect x="57" y="130" width="8" height="28" rx="3" fill={CARVE}/>
      <polygon points="61,40 75,84 47,84" fill={CARVE} opacity=".8"/>
      <polygon points="61,56 77,100 45,100" fill={CARVE} opacity=".9"/>
      <polygon points="61,72 78,116 44,116" fill={CARVE}/>
      {/* Snow caps */}
      <polygon points="19,18 28,42 10,42" fill={SNOW} opacity=".7"/>
      <polygon points="61,40 69,62 53,62" fill={SNOW} opacity=".65"/>
    </svg>
  );
}

// ─── Small Forest (1×1) ───────────────────────────────────────────────────────
export function SmallForestIcon({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 80 80" fill="none">
      {/* Left tree */}
      <rect x="13" y="58" width="6" height="18" rx="2" fill={CARVE}/>
      <polygon points="16,6 28,38 4,38" fill={CARVE} opacity=".85"/>
      <polygon points="16,20 30,50 2,50" fill={CARVE}/>
      {/* Right tree */}
      <rect x="55" y="62" width="6" height="14" rx="2" fill={CARVE}/>
      <polygon points="58,16 70,46 46,46" fill={CARVE} opacity=".8"/>
      <polygon points="58,28 72,58 44,58" fill={CARVE}/>
      {/* Center tree */}
      <rect x="35" y="52" width="6" height="24" rx="2" fill={CARVE}/>
      <polygon points="38,2 52,34 24,34" fill={CARVE} opacity=".9"/>
      <polygon points="38,18 54,48 22,48" fill={CARVE}/>
      {/* Snow */}
      <polygon points="38,2 44,20 32,20" fill={SNOW} opacity=".65"/>
    </svg>
  );
}

// ─── Edelweiss Flower (1×1) ───────────────────────────────────────────────────
export function EdelweissIcon({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 80 80" fill="none">
      {/* Stem */}
      <line x1="40" y1="78" x2="40" y2="52" stroke={CARVE} strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="40" y1="66" x2="28" y2="56" stroke={CARVE} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Petals – 8 around center */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 - 90) * Math.PI / 180;
        const cx = 40 + Math.cos(angle) * 18;
        const cy = 38 + Math.sin(angle) * 18;
        return (
          <ellipse key={i}
            cx={cx} cy={cy}
            rx="9" ry="5"
            transform={`rotate(${i * 45}, ${cx}, ${cy})`}
            fill={CARVE} opacity=".82"
          />
        );
      })}
      {/* Center disc */}
      <circle cx="40" cy="38" r="10" fill={CARVE}/>
      <circle cx="40" cy="38" r="7" fill="#F0C040" opacity=".9"/>
      {/* Fuzzy center dots */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = i * 60 * Math.PI / 180;
        return <circle key={i} cx={40 + Math.cos(a)*4} cy={38 + Math.sin(a)*4} r="1.5" fill={CARVE} opacity=".7"/>;
      })}
    </svg>
  );
}

// ─── Rock Cliff (1×2 vertical) ───────────────────────────────────────────────
export function RockCliffIcon({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 80 160" fill="none">
      {/* Main cliff face */}
      <path d="M10 155 L8 80 L20 40 L40 20 L60 36 L72 78 L70 155 Z" fill={CARVE} opacity=".75"/>
      <path d="M12 155 L10 82 L22 44 L40 24 L58 40 L68 80 L68 155 Z" fill="#8B7355" opacity=".6"/>
      {/* Crack lines */}
      <path d="M35 28 L28 60 L38 90 L30 130" stroke={CARVE} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".8"/>
      <path d="M50 38 L55 72 L48 110 L52 145" stroke={CARVE} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".7"/>
      <line x1="20" y1="90" x2="45" y2="85" stroke={CARVE} strokeWidth="1.5" opacity=".6"/>
      <line x1="22" y1="110" x2="50" y2="105" stroke={CARVE} strokeWidth="1.5" opacity=".6"/>
      <line x1="18" y1="128" x2="52" y2="122" stroke={CARVE} strokeWidth="1.5" opacity=".6"/>
      {/* Snow on top */}
      <path d="M22 44 Q40 22 58 40 Q50 32 40 28 Q30 32 22 44 Z" fill={SNOW} opacity=".7"/>
      {/* Small rocks at base */}
      <ellipse cx="25" cy="152" rx="10" ry="5" fill={CARVE} opacity=".7"/>
      <ellipse cx="55" cy="150" rx="8" ry="4" fill={CARVE} opacity=".6"/>
    </svg>
  );
}

// ─── Bush / Shrub (1×1) ───────────────────────────────────────────────────────
export function ShrubIcon({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 80 80" fill="none">
      {/* Stems */}
      <line x1="40" y1="78" x2="40" y2="56" stroke={CARVE} strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="40" y1="68" x2="24" y2="58" stroke={CARVE} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="40" y1="68" x2="56" y2="58" stroke={CARVE} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Leaf clusters */}
      <circle cx="40" cy="38" r="18" fill={CARVE} opacity=".8"/>
      <circle cx="22" cy="44" r="13" fill={CARVE} opacity=".75"/>
      <circle cx="58" cy="44" r="13" fill={CARVE} opacity=".75"/>
      <circle cx="32" cy="26" r="12" fill={CARVE} opacity=".72"/>
      <circle cx="50" cy="26" r="12" fill={CARVE} opacity=".72"/>
      {/* Highlights (lighter inner circles) */}
      <circle cx="40" cy="36" r="12" fill="#6B8A3A" opacity=".5"/>
      <circle cx="22" cy="43" r="8" fill="#6B8A3A" opacity=".45"/>
      <circle cx="58" cy="43" r="8" fill="#6B8A3A" opacity=".45"/>
    </svg>
  );
}

// ─── Mountain peak (decorative exit area) ─────────────────────────────────────
export function MountainIcon({ width, height }: { width: number; height: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 160 80" fill="none">
      {/* Sky background */}
      <rect width="160" height="80" fill="#B5C8D8" opacity=".3" rx="6"/>
      {/* Background peaks */}
      <polygon points="120,72 148,18 172,72" fill="#7A9AAA" opacity=".5"/>
      <polygon points="20,72 -8,18 44,72" fill="#7A9AAA" opacity=".5"/>
      {/* Main peak */}
      <polygon points="80,4 148,72 12,72" fill={CARVE} opacity=".8"/>
      <polygon points="80,4 140,72 20,72" fill="#6B7F8A"/>
      {/* Snow cap */}
      <polygon points="80,4 104,32 56,32" fill={SNOW}/>
      <polygon points="80,4 98,28 62,28" fill="white" opacity=".9"/>
      {/* Ridge lines */}
      <line x1="80" y1="10" x2="52" y2="56" stroke={CARVE} strokeWidth="1.5" opacity=".4"/>
      <line x1="80" y1="10" x2="108" y2="56" stroke={CARVE} strokeWidth="1.5" opacity=".4"/>
    </svg>
  );
}

// ─── Icon-Zuweisung zur fachlichen Start-Konstellation ───────────────────────
// fachlich 1: id1                  Hauptblock → Hiker
// fachlich 2: id6                  horizontaler 2er → Fluss
// fachlich 3: id4, id5, id9, id10  vertikale 1×2-Blöcke → Fels/Baum/Wald
// fachlich 4: id2, id3, id7, id8   1×1-Blöcke → Edelweiss/Strauch
export function BlockIcon({ id, w, h }: { id: number; w: number; h: number }) {
  if (id === 1)  return <HikerIcon w={w} h={h} />;
  if (id === 2)  return <EdelweissIcon w={w} h={h} />;
  if (id === 3)  return <EdelweissIcon w={w} h={h} />;
  if (id === 4)  return <RockCliffIcon w={w} h={h} />;
  if (id === 5)  return <BareTreeIcon w={w} h={h} />;
  if (id === 6)  return <RiverIcon w={w} h={h} />;
  if (id === 7)  return <ShrubIcon w={w} h={h} />;
  if (id === 8)  return <ShrubIcon w={w} h={h} />;
  if (id === 9)  return <PineForestIcon w={w} h={h} />;
  if (id === 10) return <PineForestIcon w={w} h={h} />;
  return null;
}
