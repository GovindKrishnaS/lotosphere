import React, { useMemo } from 'react'

/**
 * Botanical Leaf SVG Path Shapes:
 * 1. Monstera / Broad Tropical Leaf
 * 2. Slender Willow / Fern Leaflet
 * 3. Ginkgo / Fan Leaf
 * 4. Fiddle / Oval Botanical Leaf
 */
const LEAF_PATHS = [
  // Monstera / Broad Leaf
  'M 12 2 C 7 8, 4 16, 6 24 C 8 30, 16 34, 22 30 C 26 24, 26 14, 22 8 C 19 4, 15 2, 12 2 Z M 12 2 C 12 12, 12 22, 14 30',
  // Slender Leaflet
  'M 10 2 C 5 10, 5 20, 10 32 C 15 20, 15 10, 10 2 Z M 10 2 L 10 32',
  // Fan Leaf
  'M 12 30 C 4 22, 2 12, 6 4 C 12 8, 16 8, 22 4 C 26 12, 24 22, 12 30 Z M 12 30 L 12 10',
  // Curved Botanical Spore Leaf
  'M 8 2 C 3 9, 3 18, 9 26 C 14 22, 16 14, 15 7 C 14 3, 11 2, 8 2 Z M 8 2 Q 10 14, 9 26',
]

const COLORS = [
  '#22c55e', // Emerald
  '#4ade80', // Mint / Light Emerald
  '#86efac', // Soft Sage
  '#d97706', // Botanical Gold / Amber
  '#a3e635', // Lime Spore
]

export default function FallingLeaves() {
  // Generate deterministic leaf configurations with staggered negative delays
  // so leaves are already drifting when the user opens the page
  const leaves = useMemo(() => [
    { id: 1, type: 0, x: 8, duration: 16, delay: -4, size: 22, color: COLORS[0], sway: 'sway-1', opacity: 0.28, mobile: true },
    { id: 2, type: 1, x: 28, duration: 22, delay: -12, size: 18, color: COLORS[1], sway: 'sway-2', opacity: 0.22, mobile: true },
    { id: 3, type: 2, x: 48, duration: 18, delay: -8, size: 20, color: COLORS[3], sway: 'sway-3', opacity: 0.25, mobile: true },
    { id: 4, type: 3, x: 68, duration: 24, delay: -15, size: 24, color: COLORS[2], sway: 'sway-1', opacity: 0.22, mobile: true },
    { id: 5, type: 1, x: 86, duration: 17, delay: -2, size: 16, color: COLORS[4], sway: 'sway-2', opacity: 0.26, mobile: true },
    { id: 6, type: 0, x: 38, duration: 20, delay: -10, size: 19, color: COLORS[0], sway: 'sway-3', opacity: 0.2, mobile: true },
    // Desktop extra leaves
    { id: 7, type: 2, x: 18, duration: 25, delay: -18, size: 26, color: COLORS[3], sway: 'sway-1', opacity: 0.18, mobile: false },
    { id: 8, type: 3, x: 58, duration: 21, delay: -6, size: 22, color: COLORS[1], sway: 'sway-2', opacity: 0.2, mobile: false },
    { id: 9, type: 0, x: 78, duration: 19, delay: -14, size: 20, color: COLORS[0], sway: 'sway-3', opacity: 0.18, mobile: false },
    { id: 10, type: 1, x: 92, duration: 26, delay: -20, size: 17, color: COLORS[2], sway: 'sway-1', opacity: 0.22, mobile: false },
    { id: 11, type: 2, x: 3, duration: 23, delay: -7, size: 21, color: COLORS[3], sway: 'sway-2', opacity: 0.15, mobile: false },
  ], [])

  return (
    <div
      className="falling-leaves-layer fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
      style={{
        width: '100vw',
        height: '100vh',
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    >
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className={`falling-leaf-wrapper ${leaf.mobile ? 'block' : 'hidden md:block'}`}
          style={{
            left: `${leaf.x}%`,
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
          }}
        >
          <div
            className={`falling-leaf-inner ${leaf.sway}`}
            style={{
              animationDuration: `${leaf.duration * 0.45}s`,
              animationDelay: `${leaf.delay * 0.5}s`,
              opacity: leaf.opacity,
            }}
          >
            <svg
              width={leaf.size}
              height={leaf.size * 1.3}
              viewBox="0 0 28 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transform-gpu filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
            >
              <path
                d={LEAF_PATHS[leaf.type]}
                fill={leaf.color}
                fillOpacity="0.4"
                stroke={leaf.color}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}
