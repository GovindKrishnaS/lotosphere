import React, { useRef, useEffect } from 'react'

/**
 * Signature Lotosphere Side Branch Animation component.
 * Extends organically from left or right edge to frame section headings.
 * 
 * Props:
 * - direction: 'left' | 'right' (default 'left')
 * - className: custom positioning classes
 */
export default function SideBranch({ direction = 'left', className = '' }) {
  const branchPathRef = useRef(null)
  const leavesRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const ratio = entry.intersectionRatio
          if (branchPathRef.current) {
            const length = 400
            branchPathRef.current.style.strokeDashoffset = `${length * (1 - Math.min(1, ratio * 1.5))}`
          }
          if (leavesRef.current) {
            leavesRef.current.style.opacity = `${Math.min(1, Math.max(0, (ratio - 0.3) * 2))}`
            leavesRef.current.style.transform = `scale(${Math.min(1, Math.max(0.2, ratio))})`
          }
        }
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0] }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const isLeft = direction === 'left'

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none select-none absolute z-0 overflow-visible opacity-75 ${
        isLeft ? 'left-0' : 'right-0'
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox={isLeft ? '0 0 350 120' : '0 0 350 120'}
        className={`w-40 sm:w-64 md:w-80 lg:w-96 h-auto overflow-visible ${
          !isLeft ? 'scale-x-[-1]' : ''
        }`}
      >
        <defs>
          <linearGradient id={`branchGrad-${direction}`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#14532d" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#16a34a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#86efac" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Main curved branch path */}
        <path
          ref={branchPathRef}
          d="M 0 60 Q 120 40, 220 55 T 340 30"
          fill="none"
          stroke={`url(#branchGrad-${direction})`}
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: 400,
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Sub-branch twig */}
        <path
          d="M 160 48 Q 200 25, 240 18"
          fill="none"
          stroke={`url(#branchGrad-${direction})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Leaves collection */}
        <g
          ref={leavesRef}
          style={{
            opacity: 0,
            transformOrigin: '150px 50px',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* Leaf 1 */}
          <path
            d="M 220 55 C 228 42, 245 46, 240 58 C 235 60, 224 58, 220 55 Z"
            fill="#22c55e"
            opacity="0.85"
          />
          {/* Leaf 2 */}
          <path
            d="M 180 44 C 185 30, 202 32, 195 45 C 190 48, 182 46, 180 44 Z"
            fill="#4ade80"
            opacity="0.9"
          />
          {/* Leaf 3 */}
          <path
            d="M 240 18 C 248 10, 260 14, 252 24 C 246 26, 242 22, 240 18 Z"
            fill="#86efac"
            opacity="0.9"
          />
          {/* Leaf 4 at tip */}
          <path
            d="M 340 30 C 352 24, 360 28, 350 36 C 344 38, 342 33, 340 30 Z"
            fill="#bbf7d0"
          />
          {/* Botanical glow bud at tip */}
          <circle cx="340" cy="30" r="2.5" fill="#fef08a" className="animate-pulse" />
        </g>
      </svg>
    </div>
  )
}
