import React from 'react';

interface RunwayBottleSvgProps {
  productIndex: number;
}

interface CardProductSvgProps {
  cardIndex: number;
}

const BOTTLE_PALETTES = [
  {
    id: 'argan-elixir',
    code: 'N° 01',
    title: 'ARGAN ELIXIR',
    subtitle: '24K GOLD HAIR OIL',
    volume: '100 ML · 3.4 FL.OZ',
    bodyDark: '#2c1606',
    bodyMid: '#85460e',
    bodyBright: '#d98a2b',
    liquidGlow: '#f5b942',
    capMetal1: '#8f6b29',
    capMetal2: '#f7df94',
    capMetal3: '#c59b43',
    labelBg: '#0e0d0b',
    labelText: '#f7df94',
    shape: 'pump-tall',
  },
  {
    id: 'keratin-silk',
    code: 'N° 02',
    title: 'KERATIN SILK',
    subtitle: 'PEPTIDE REPAIR MASQUE',
    volume: '200 ML · 6.7 FL.OZ',
    bodyDark: '#0e1015',
    bodyMid: '#1f2430',
    bodyBright: '#3d4559',
    liquidGlow: '#c9a66b',
    capMetal1: '#8f6b29',
    capMetal2: '#fae4a3',
    capMetal3: '#b88c38',
    labelBg: '#f6f3ec',
    labelText: '#121318',
    shape: 'cylinder-gold',
  },
  {
    id: 'matte-clay',
    code: 'N° 03',
    title: 'VOLCANIC CLAY',
    subtitle: 'MATTE TEXTURE POMADE',
    volume: '120 ML · 4.0 FL.OZ',
    bodyDark: '#141312',
    bodyMid: '#2b2826',
    bodyBright: '#524c48',
    liquidGlow: '#d4a373',
    capMetal1: '#7a5c28',
    capMetal2: '#ebd089',
    capMetal3: '#ad853b',
    labelBg: '#181615',
    labelText: '#ebd089',
    shape: 'apothecary-column',
  },
  {
    id: 'glow-serum',
    code: 'N° 04',
    title: 'HYDRA GLASS',
    subtitle: '24K GOLD FACE SERUM',
    volume: '50 ML · 1.7 FL.OZ',
    bodyDark: '#47211c',
    bodyMid: '#9e4d3f',
    bodyBright: '#e89984',
    liquidGlow: '#ffd4b8',
    capMetal1: '#8c584c',
    capMetal2: '#f7cfc4',
    capMetal3: '#c48676',
    labelBg: '#120e0e',
    labelText: '#f7cfc4',
    shape: 'dropper-pipette',
  },
  {
    id: 'bond-shampoo',
    code: 'N° 05',
    title: 'BOND REPAIR',
    subtitle: 'VIOLET PLEX SHAMPOO',
    volume: '250 ML · 8.4 FL.OZ',
    bodyDark: '#1c162e',
    bodyMid: '#3f3266',
    bodyBright: '#7b68b5',
    liquidGlow: '#bdaef0',
    capMetal1: '#757a8a',
    capMetal2: '#e4e8f2',
    capMetal3: '#9da4b8',
    labelBg: '#0f0d17',
    labelText: '#e4e8f2',
    shape: 'pump-tall',
  },
  {
    id: 'hair-parfum',
    code: 'N° 06',
    title: 'SOIE DE ROSE',
    subtitle: 'BOTANICAL HAIR MIST',
    volume: '90 ML · 3.0 FL.OZ',
    bodyDark: '#3d1e28',
    bodyMid: '#8a495c',
    bodyBright: '#d98da1',
    liquidGlow: '#ffc4d4',
    capMetal1: '#8f6b29',
    capMetal2: '#f7df94',
    capMetal3: '#c59b43',
    labelBg: '#faf5f6',
    labelText: '#2b141c',
    shape: 'atomizer-flacon',
  },
  {
    id: 'oud-beard-oil',
    code: 'N° 07',
    title: 'ROYAL OUD',
    subtitle: 'BEARD & SKIN ELIXIR',
    volume: '60 ML · 2.0 FL.OZ',
    bodyDark: '#0b211a',
    bodyMid: '#194d3b',
    bodyBright: '#368f6e',
    liquidGlow: '#7be0b8',
    capMetal1: '#8f6b29',
    capMetal2: '#f7df94',
    capMetal3: '#c59b43',
    labelBg: '#0b1411',
    labelText: '#f7df94',
    shape: 'dropper-pipette',
  },
  {
    id: 'scalp-tonic',
    code: 'N° 08',
    title: 'BHRINGRAJ',
    subtitle: 'AYURVEDIC SCALP TONIC',
    volume: '150 ML · 5.0 FL.OZ',
    bodyDark: '#26170c',
    bodyMid: '#633b1d',
    bodyBright: '#b5713e',
    liquidGlow: '#f0a868',
    capMetal1: '#754829',
    capMetal2: '#f0be95',
    capMetal3: '#b07446',
    labelBg: '#140e09',
    labelText: '#f0be95',
    shape: 'cylinder-gold',
  },
] as const;

export const RunwayBottleSvg: React.FC<RunwayBottleSvgProps> = ({ productIndex }) => {
  const idx = ((productIndex % BOTTLE_PALETTES.length) + BOTTLE_PALETTES.length) % BOTTLE_PALETTES.length;
  const p = BOTTLE_PALETTES[idx];
  const uid = `runway-bottle-${idx}`;

  return (
    <svg viewBox="0 0 220 520" aria-hidden="true">
      <defs>
        {/* 3D Cylindrical Glass / Flacon Body Gradient */}
        <linearGradient id={`${uid}-body`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={p.bodyDark} />
          <stop offset="18%" stopColor={p.bodyMid} />
          <stop offset="36%" stopColor={p.bodyBright} />
          <stop offset="52%" stopColor={p.bodyMid} />
          <stop offset="82%" stopColor={p.bodyDark} />
          <stop offset="94%" stopColor={p.bodyMid} />
          <stop offset="100%" stopColor={p.bodyDark} />
        </linearGradient>

        {/* Internal Glowing Liquid Core */}
        <radialGradient id={`${uid}-glow`} cx="45%" cy="62%" r="48%">
          <stop offset="0%" stopColor={p.liquidGlow} stopOpacity="0.82" />
          <stop offset="55%" stopColor={p.bodyBright} stopOpacity="0.35" />
          <stop offset="100%" stopColor={p.bodyDark} stopOpacity="0" />
        </radialGradient>

        {/* Metallic 24K Gold / Rose Gold / Platinum Hardware Gradient */}
        <linearGradient id={`${uid}-metal`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={p.capMetal1} />
          <stop offset="28%" stopColor={p.capMetal2} />
          <stop offset="50%" stopColor={p.capMetal3} />
          <stop offset="76%" stopColor={p.capMetal2} />
          <stop offset="100%" stopColor={p.capMetal1} />
        </linearGradient>

        {/* Specular Vertical Glass Highlight */}
        <linearGradient id={`${uid}-spec`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Top Dispenser Hardware per Shape */}
      {p.shape === 'pump-tall' && (
        <g>
          {/* Pump nozzle spout */}
          <path
            d="M95 36 H162 C168 36 172 40 172 45 L156 49 H95 Z"
            fill={`url(#${uid}-metal)`}
          />
          {/* Pump stem */}
          <rect x="101" y="34" width="18" height="32" rx="3" fill={`url(#${uid}-metal)`} />
          {/* Ribbed metallic collar */}
          <rect x="82" y="64" width="56" height="42" rx="5" fill={`url(#${uid}-metal)`} />
          <line x1="82" y1="76" x2="138" y2="76" stroke={p.bodyDark} strokeOpacity="0.35" strokeWidth="1.5" />
          <line x1="82" y1="94" x2="138" y2="94" stroke={p.bodyDark} strokeOpacity="0.35" strokeWidth="1.5" />
          {/* Glass neck */}
          <path d="M86 106 H134 L148 134 H72 Z" fill={`url(#${uid}-body)`} />
        </g>
      )}

      {p.shape === 'dropper-pipette' && (
        <g>
          {/* Rubber Squeeze Bulb */}
          <path
            d="M92 28 C92 12 128 12 128 28 L131 66 H89 Z"
            fill="#141417"
          />
          <path
            d="M98 22 C98 16 110 16 110 22 L108 62 H96 Z"
            fill="#ffffff"
            fillOpacity="0.16"
          />
          {/* Wide Metallic Pipette Collar */}
          <rect x="78" y="64" width="64" height="40" rx="4" fill={`url(#${uid}-metal)`} />
          <line x1="78" y1="74" x2="142" y2="74" stroke="#000" strokeOpacity="0.3" strokeWidth="1.5" />
          <line x1="78" y1="94" x2="142" y2="94" stroke="#000" strokeOpacity="0.3" strokeWidth="1.5" />
          {/* Neck */}
          <path d="M84 104 H136 L150 134 H70 Z" fill={`url(#${uid}-body)`} />
        </g>
      )}

      {p.shape === 'cylinder-gold' && (
        <g>
          {/* Tall Luxury Brushed Gold Overcap */}
          <rect x="76" y="28" width="68" height="78" rx="6" fill={`url(#${uid}-metal)`} />
          <rect x="82" y="32" width="10" height="70" fill="#ffffff" fillOpacity="0.28" />
          <line x1="76" y1="92" x2="144" y2="92" stroke="#111" strokeOpacity="0.4" strokeWidth="2" />
          {/* Stepped Collar */}
          <rect x="84" y="106" width="52" height="26" fill="#15161a" />
        </g>
      )}

      {p.shape === 'apothecary-column' && (
        <g>
          {/* Wide Beveled Disc Cap */}
          <rect x="64" y="42" width="92" height="48" rx="8" fill={`url(#${uid}-metal)`} />
          <rect x="74" y="90" width="72" height="22" fill="#161514" />
          <path d="M68 112 H152 L162 134 H58 Z" fill={`url(#${uid}-body)`} />
        </g>
      )}

      {p.shape === 'atomizer-flacon' && (
        <g>
          {/* Couture Atomizer Crown */}
          <rect x="88" y="34" width="44" height="36" rx="4" fill={`url(#${uid}-metal)`} />
          <circle cx="110" cy="52" r="6" fill="#1a1215" />
          {/* Atomizer Side Bulb & Cord */}
          <path
            d="M132 50 Q164 52 168 82"
            fill="none"
            stroke={`url(#${uid}-metal)`}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <ellipse cx="170" cy="96" rx="14" ry="20" fill="#2b141c" stroke={`url(#${uid}-metal)`} strokeWidth="2" />
          {/* Neck */}
          <rect x="80" y="70" width="60" height="34" rx="3" fill={`url(#${uid}-metal)`} />
          <path d="M84 104 H136 L154 134 H66 Z" fill={`url(#${uid}-body)`} />
        </g>
      )}

      {/* Main Bottle / Flacon Body */}
      <rect
        x="48"
        y="128"
        width="124"
        height="364"
        rx="22"
        fill={`url(#${uid}-body)`}
      />

      {/* Internal Liquid Glow & Meniscus Line */}
      <rect
        x="54"
        y="146"
        width="112"
        height="332"
        rx="16"
        fill={`url(#${uid}-glow)`}
      />
      <ellipse
        cx="110"
        cy="154"
        rx="54"
        ry="5"
        fill="#ffffff"
        fillOpacity="0.22"
      />

      {/* Internal Glass Pipette Tube (for dropper bottles) */}
      {p.shape === 'dropper-pipette' && (
        <g opacity="0.45">
          <rect x="106" y="134" width="8" height="305" rx="4" fill="#ffffff" fillOpacity="0.5" />
          <circle cx="110" cy="446" r="5" fill={p.liquidGlow} />
        </g>
      )}

      {/* Specular Left-Edge Studio Softbox Reflection */}
      <rect
        x="58"
        y="138"
        width="14"
        height="340"
        rx="7"
        fill={`url(#${uid}-spec)`}
      />
      <rect
        x="154"
        y="144"
        width="5"
        height="328"
        rx="2.5"
        fill="#ffffff"
        fillOpacity="0.18"
      />

      {/* Thick Crystal Base Refraction */}
      <path
        d="M50 468 H170 C170 482 162 492 148 492 H72 C58 492 50 482 50 468 Z"
        fill="#ffffff"
        fillOpacity="0.16"
      />
      <ellipse cx="110" cy="484" rx="48" ry="4" fill={p.liquidGlow} fillOpacity="0.45" />

      {/* Architectural Luxury Label (`Z'ACK ATELIER`) */}
      <g>
        <rect
          x="56"
          y="210"
          width="108"
          height="194"
          rx="4"
          fill={p.labelBg}
          stroke={`url(#${uid}-metal)`}
          strokeWidth="1.6"
        />
        {/* Inner thin gold border */}
        <rect
          x="61"
          y="215"
          width="98"
          height="184"
          rx="2"
          fill="none"
          stroke={p.labelText}
          strokeOpacity="0.28"
          strokeWidth="0.8"
        />

        {/* Brand Crest */}
        <text
          x="110"
          y="242"
          textAnchor="middle"
          fill={p.labelText}
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontWeight="700"
          fontSize="13.5"
          letterSpacing="2.8"
        >
          BLOSSOM
        </text>
        <text
          x="110"
          y="256"
          textAnchor="middle"
          fill={p.labelText}
          fillOpacity="0.68"
          fontFamily="'Manrope', sans-serif"
          fontWeight="500"
          fontSize="6.2"
          letterSpacing="2.4"
        >
          UNISEX SALON
        </text>

        <line
          x1="74"
          y1="268"
          x2="146"
          y2="268"
          stroke={p.labelText}
          strokeOpacity="0.3"
          strokeWidth="0.9"
        />

        {/* Formulation Code */}
        <text
          x="110"
          y="289"
          textAnchor="middle"
          fill={p.labelText}
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontStyle="italic"
          fontWeight="600"
          fontSize="13.5"
          letterSpacing="1.8"
        >
          {p.code}
        </text>

        {/* Product Title */}
        <text
          x="110"
          y="313"
          textAnchor="middle"
          fill={p.labelText}
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontWeight="700"
          fontSize="10.5"
          letterSpacing="1.5"
        >
          {`CARE CONCEPT ${String(productIndex + 1).padStart(2, '0')}`}
        </text>
        <text
          x="110"
          y="328"
          textAnchor="middle"
          fill={p.labelText}
          fillOpacity="0.72"
          fontFamily="'Manrope', sans-serif"
          fontSize="6"
          letterSpacing="1.2"
        >
          ILLUSTRATIVE ONLY
        </text>

        {/* Gold Emblem Seal */}
        <circle
          cx="110"
          cy="355"
          r="11"
          fill="none"
          stroke={`url(#${uid}-metal)`}
          strokeWidth="1.2"
        />
        <circle cx="110" cy="355" r="4" fill={`url(#${uid}-metal)`} />

        {/* Volume */}
        <text
          x="110"
          y="386"
          textAnchor="middle"
          fill={p.labelText}
          fillOpacity="0.68"
          fontFamily="'Manrope', sans-serif"
          fontSize="6"
          letterSpacing="1.3"
        >
          DESIGN MOCKUP
        </text>
      </g>
    </svg>
  );
};

export const CardProductSvg: React.FC<CardProductSvgProps> = ({ cardIndex }) => {
  const paletteIdx = Math.floor(cardIndex / 2) % BOTTLE_PALETTES.length;
  const isSecondaryVariant = cardIndex % 2 === 1;
  const p = BOTTLE_PALETTES[paletteIdx];
  const uid = `card-prod-${cardIndex}`;

  return (
    <svg viewBox="0 0 240 220" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-body`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={p.bodyDark} />
          <stop offset="28%" stopColor={p.bodyBright} />
          <stop offset="65%" stopColor={p.bodyMid} />
          <stop offset="100%" stopColor={p.bodyDark} />
        </linearGradient>
        <linearGradient id={`${uid}-metal`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={p.capMetal1} />
          <stop offset="35%" stopColor={p.capMetal2} />
          <stop offset="70%" stopColor={p.capMetal3} />
          <stop offset="100%" stopColor={p.capMetal1} />
        </linearGradient>
        <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Studio Floor Contact Shadow */}
      <ellipse cx="120" cy="198" rx="64" ry="10" fill={`url(#${uid}-shadow)`} />

      {!isSecondaryVariant ? (
        /* Primary Product Variant: Luxury Flacon / Dropper / Pump Bottle */
        <g>
          {/* Gold Cap & Pump/Dropper */}
          <rect x="98" y="20" width="44" height="28" rx="4" fill={`url(#${uid}-metal)`} />
          <path d="M120 24 H152 C156 24 158 27 158 30 L144 32 H120 Z" fill={`url(#${uid}-metal)`} />
          <rect x="104" y="48" width="32" height="14" fill="#141519" />
          {/* Bottle Body */}
          <rect x="74" y="58" width="92" height="136" rx="16" fill={`url(#${uid}-body)`} />
          {/* Specular Highlight */}
          <rect x="82" y="66" width="10" height="120" rx="5" fill="#ffffff" fillOpacity="0.32" />
          {/* Front Label */}
          <rect
            x="82"
            y="88"
            width="76"
            height="82"
            rx="3"
            fill={p.labelBg}
            stroke={`url(#${uid}-metal)`}
            strokeWidth="1.2"
          />
          <text
            x="120"
            y="108"
            textAnchor="middle"
            fill={p.labelText}
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontWeight="700"
            fontSize="9.5"
            letterSpacing="1.8"
          >
            BLOSSOM
          </text>
          <text
            x="120"
            y="124"
            textAnchor="middle"
            fill={p.labelText}
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontWeight="600"
            fontSize="7.8"
            letterSpacing="1.2"
          >
            CONCEPT ONLY
          </text>
          <circle cx="120" cy="142" r="6" fill="none" stroke={`url(#${uid}-metal)`} strokeWidth="1" />
          <text
            x="120"
            y="160"
            textAnchor="middle"
            fill={p.labelText}
            fillOpacity="0.68"
            fontFamily="'Manrope', sans-serif"
            fontSize="5.2"
            letterSpacing="1"
          >
            DESIGN MOCKUP
          </text>
        </g>
      ) : (
        /* Secondary Product Variant: Wide Luxury Apothecary Masque Jar + Gold Spatula */
        <g>
          {/* Wide Brushed Gold Lid */}
          <rect x="58" y="64" width="124" height="28" rx="6" fill={`url(#${uid}-metal)`} />
          <rect x="66" y="68" width="24" height="20" fill="#ffffff" fillOpacity="0.28" />
          {/* Wide Heavy-Wall Glass Jar Body */}
          <rect x="54" y="90" width="132" height="104" rx="18" fill={`url(#${uid}-body)`} />
          <rect x="64" y="98" width="14" height="86" rx="7" fill="#ffffff" fillOpacity="0.26" />
          {/* Jar Label */}
          <rect
            x="68"
            y="108"
            width="104"
            height="66"
            rx="4"
            fill={p.labelBg}
            stroke={`url(#${uid}-metal)`}
            strokeWidth="1.2"
          />
          <text
            x="120"
            y="128"
            textAnchor="middle"
            fill={p.labelText}
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontWeight="700"
            fontSize="10"
            letterSpacing="2"
          >
            BLOSSOM
          </text>
          <text
            x="120"
            y="144"
            textAnchor="middle"
            fill={p.labelText}
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontWeight="600"
            fontSize="8"
            letterSpacing="1.4"
          >
            CONCEPT ONLY
          </text>
          <text
            x="120"
            y="160"
            textAnchor="middle"
            fill={p.labelText}
            fillOpacity="0.7"
            fontFamily="'Manrope', sans-serif"
            fontSize="5.5"
            letterSpacing="1.2"
          >
            SALON CARE · {p.code}
          </text>
        </g>
      )}
    </svg>
  );
};
