import * as React from "react"

export interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * "auto" adapts letterforms to theme (`currentColor`),
   * "obsidian" forces deep plum-black letterforms,
   * "light" forces luminous pearl-white letterforms for dark navbars/surfaces.
   */
  variant?: "auto" | "obsidian" | "light"
}

export default function LogoIcon({
  className = "h-9 w-auto",
  variant = "auto",
  ...props
}: LogoIconProps) {
  const uid = React.useId().replace(/:/g, "")

  const textFill =
    variant === "light"
      ? `url(#${uid}-pearl-text)`
      : variant === "obsidian"
        ? `url(#${uid}-obsidian-text)`
        : "currentColor"

  return (
    <svg
      viewBox="0 0 920 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="BLOSSOM Official Logo"
      className={className}
      {...props}
    >
      <defs>
        {/* Realistic 3D Hot Magenta-Pink Lotus Badge Gradient */}
        <radialGradient
          id={`${uid}-pink-orb`}
          cx="36%"
          cy="28%"
          r="72%"
          fx="32%"
          fy="24%"
        >
          <stop offset="0%" stopColor="#ff4da6" />
          <stop offset="38%" stopColor="#f0127a" />
          <stop offset="78%" stopColor="#d40666" />
          <stop offset="100%" stopColor="#9e024a" />
        </radialGradient>

        {/* Subtle Top Specular Gloss on Pink Badge */}
        <linearGradient id={`${uid}-orb-sheen`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </linearGradient>

        {/* Realistic Soft Pearl White for Lotus Petals */}
        <linearGradient id={`${uid}-petal-white`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#fff8fc" />
          <stop offset="100%" stopColor="#fde6f2" />
        </linearGradient>

        {/* Deep Obsidian Plum-Black Gradient (Official Logo Ink) */}
        <linearGradient id={`${uid}-obsidian-text`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#35124d" />
          <stop offset="50%" stopColor="#240a37" />
          <stop offset="100%" stopColor="#140421" />
        </linearGradient>

        {/* Luminous Pearl-White & Silver-Pink Gradient for Dark Surfaces */}
        <linearGradient id={`${uid}-pearl-text`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#fdf2f8" />
          <stop offset="100%" stopColor="#f5d0e6" />
        </linearGradient>

        {/* Ambient Pink Glow Filter for Lotus Emblem */}
        <filter
          id={`${uid}-lotus-glow`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="5"
            floodColor="#ee1177"
            floodOpacity="0.38"
          />
        </filter>
      </defs>

      {/* ===================================================================
          BOLD FLARED CLASSICAL SERIF WORDMARK: "B L O S S" + [LOTUS O] + "M"
         =================================================================== */}
      <g
        fill={textFill}
        stroke={textFill}
        strokeWidth="6.5"
        strokeLinejoin="round"
        paintOrder="stroke fill"
      >
        {/* === B (x: 24..116, y: 36..166) === */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 36 C30 37 36 37 44 36 H76 C100 36 114 48 114 66 C114 81 103 92 86 96 C107 99 120 112 120 131 C120 152 103 166 74 166 H44 C36 165 30 165 24 166 C27 156 28 144 28 128 V74 C28 58 27 46 24 36 Z M47 46 V92 H70 C86 92 95 83 95 68 C95 54 86 46 69 46 H47 Z M47 102 V155 H72 C90 155 100 145 100 129 C100 112 89 102 69 102 H47 Z"
        />

        {/* === L (x: 138..224, y: 36..166) === */}
        <path d="M138 36 C145 37 153 37 161 36 C158 46 157 58 157 74 V154 H196 C208 154 217 151 224 145 L221 166 H138 C140 156 141 144 141 128 V74 C141 58 140 46 138 36 Z" />

        {/* === O (First O — Classical Calligraphic Oval, cx: 294, cy: 101) === */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M294 33 C332 33 358 61 358 101 C358 141 332 169 294 169 C256 169 230 141 230 101 C230 61 256 33 294 33 Z M294 43 C268 43 251 66 251 101 C251 136 268 159 294 159 C320 159 337 136 337 101 C337 66 320 43 294 43 Z"
        />

        {/* === S (First S — x: 374..450, y: 33..169) === */}
        <path d="M442 63 C436 49 425 43 411 43 C396 43 387 51 387 63 C387 75 397 82 417 91 C440 101 452 112 452 132 C452 154 434 169 407 169 C392 169 379 165 371 159 L376 136 C383 150 395 158 409 158 C425 158 435 149 435 136 C435 122 425 115 404 105 C382 95 371 84 371 66 C371 46 388 33 413 33 C427 33 439 37 447 42 L442 63 Z" />

        {/* === S (Second S — x: 466..542, y: 33..169) === */}
        <path d="M534 63 C528 49 517 43 503 43 C488 43 479 51 479 63 C479 75 489 82 509 91 C532 101 544 112 544 132 C544 154 526 169 499 169 C484 169 471 165 463 159 L468 136 C475 150 487 158 501 158 C517 158 527 149 527 136 C527 122 517 115 496 105 C474 95 463 84 463 66 C463 46 480 33 505 33 C519 33 531 37 539 42 L534 63 Z" />

        {/* === M (Splayed Flared Serif M — x: 716..898, y: 36..166) === */}
        <path d="M716 166 C720 155 723 141 726 120 L735 36 H752 L807 141 L861 36 H878 L888 120 C891 141 894 155 898 166 H875 C874 155 872 140 870 118 L864 64 L811 166 H800 L747 64 L741 118 C739 140 737 155 735 166 H716 Z" />
      </g>

      {/* ===================================================================
          OFFICIAL HOT MAGENTA-PINK LOTUS EMBLEM ("O" — cx: 630, cy: 100)
         =================================================================== */}
      <g filter={`url(#${uid}-lotus-glow)`}>
        {/* Main Dimensional Hot-Pink Oval/Circle Badge */}
        <ellipse
          cx="630"
          cy="100"
          rx="74"
          ry="78"
          fill={`url(#${uid}-pink-orb)`}
        />

        {/* Realistic Specular Sheen Overlay */}
        <ellipse
          cx="630"
          cy="100"
          rx="73"
          ry="77"
          fill={`url(#${uid}-orb-sheen)`}
        />

        {/* Subtle Inner Rim Highlight */}
        <ellipse
          cx="630"
          cy="100"
          rx="72.5"
          ry="76.5"
          fill="none"
          stroke="#ff85c2"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />

        {/* 1. Top Center Lotus Diamond Bud */}
        <path
          d="M630 39 L646 56 L630 73 L614 56 Z"
          fill={`url(#${uid}-petal-white)`}
        />

        {/* 2. Left Sweeping White Lotus Petal */}
        <path
          d="M582 49 C567 84 577 135 625 156 C638 124 635 76 582 49 Z"
          fill={`url(#${uid}-petal-white)`}
        />

        {/* 3. Right Sweeping White Lotus Petal (with curved pink stem separation) */}
        <path
          d="M678 49 C660 56 646 65 634 77 C646 95 648 126 635 155 C683 134 693 84 678 49 Z"
          fill={`url(#${uid}-petal-white)`}
        />
      </g>
    </svg>
  )
}
