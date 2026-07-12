import { useReducedMotion } from 'framer-motion'

/**
 * Animated "system" node graph (orza-style).
 * Service nodes feed into the BlackWater mark in the center; lime dots travel
 * along each connector into the center on a continuous loop, then down into the
 * result box. Pure inline SVG + SMIL <animateMotion> so it keeps looping even
 * inside the GSAP-pinned FlowGroup (scroll-triggered anims are unreliable there).
 * viewBox 1044x460 — scales fluidly to the container width.
 */

const LIME = '#C8D746'
const INK = '#080808'
const LINE = 'rgba(8,8,8,0.16)'

// cx/cy = node center; w = card width; path = connector drawn FROM node TO center
// (so dots animate node -> center). Center card: x462 y155 120x120.
const NODES = [
  { label: 'META ADS',        cx: 150, cy: 60,  w: 104, path: 'M150,82 L150,188 Q150,205 167,205 L462,205' },
  { label: 'CREATIVE TESTING', cx: 522, cy: 45, w: 172, path: 'M522,67 L522,155' },
  { label: 'SCALING',         cx: 895, cy: 60,  w: 100, path: 'M895,82 L895,188 Q895,205 878,205 L582,205' },
  { label: 'TRACKING',        cx: 150, cy: 215, w: 104, path: 'M202,215 L462,215' },
  { label: 'LANDING PAGES',   cx: 895, cy: 215, w: 150, path: 'M820,215 L582,215' },
]

const DOWN_PATH = 'M522,275 L522,372'

function Dot({ pathId, dur, begin, color = LIME }) {
  return (
    <circle r="4" fill={color}>
      <animateMotion dur={dur} begin={begin} repeatCount="indefinite" rotate="auto">
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  )
}

export function NodeGraph({ result = '$1M+ GENERATED' }) {
  const reduce = useReducedMotion()

  return (
    <svg
      viewBox="0 0 1044 460"
      role="img"
      aria-label="How BlackWater's services feed into client results"
      style={{ width: '100%', height: 'auto', maxWidth: '1044px', display: 'block' }}
    >
      <defs>
        <radialGradient id="ng-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={LIME} stopOpacity="0.35" />
          <stop offset="100%" stopColor={LIME} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ng-center" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef0d8" />
        </linearGradient>
        {/* recolor the white logo PNG to solid black while keeping its exact shape/alpha */}
        <filter id="ng-blacken">
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
        </filter>
      </defs>

      {/* soft lime glow behind center */}
      <circle cx="522" cy="215" r="150" fill="url(#ng-glow)" />

      {/* connector lines (drawn first, sit under the cards) */}
      {NODES.map((n, i) => (
        <path key={`line-${i}`} id={`ng-path-${i}`} d={n.path} fill="none" stroke={LINE} strokeWidth="1.5" />
      ))}
      {/* down line to result (lime) */}
      <path id="ng-down" d={DOWN_PATH} fill="none" stroke={LIME} strokeWidth="2" strokeOpacity="0.55" />

      {/* travelling dots (skipped when user prefers reduced motion) */}
      {!reduce && (
        <>
          {NODES.map((n, i) => (
            <g key={`dots-${i}`}>
              <Dot pathId={`ng-path-${i}`} dur="2.8s" begin="0s" />
              <Dot pathId={`ng-path-${i}`} dur="2.8s" begin="-1.4s" />
            </g>
          ))}
          <Dot pathId="ng-down" dur="1.5s" begin="0s" />
          <Dot pathId="ng-down" dur="1.5s" begin="-0.75s" />
        </>
      )}

      {/* service nodes */}
      {NODES.map((n, i) => (
        <g key={`node-${i}`}>
          <rect
            x={n.cx - n.w / 2} y={n.cy - 20} width={n.w} height="40" rx="10"
            fill="#ffffff" stroke="rgba(8,8,8,0.12)" strokeWidth="1"
          />
          <text
            x={n.cx} y={n.cy} textAnchor="middle" dominantBaseline="central"
            fontFamily="'Space Grotesk', monospace" fontSize="13" fontWeight="600"
            letterSpacing="0.06em" fill={INK}
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* center BlackWater mark */}
      <rect x="462" y="155" width="120" height="120" rx="26" fill="url(#ng-center)" stroke={LIME} strokeWidth="1.5" />
      {/* Real BlackWater mark — the actual logo PNG, recolored black via filter.
          512x512 source; drawn into a ~104px box centered on the card at (522,215). */}
      <image
        href="/logo-transparent.png"
        x="470" y="163" width="104" height="104"
        filter="url(#ng-blacken)"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* result box */}
      <rect x="422" y="376" width="200" height="48" rx="12" fill={INK} />
      <circle cx="452" cy="400" r="4" fill={LIME} />
      <text
        x="536" y="400" textAnchor="middle" dominantBaseline="central"
        fontFamily="'Space Grotesk', monospace" fontSize="15" fontWeight="700"
        letterSpacing="0.04em" fill="#ffffff"
      >
        {result}
      </text>
    </svg>
  )
}
