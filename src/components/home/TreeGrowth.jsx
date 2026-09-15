import React, { useRef } from 'react'
import { useScrollProgress } from '../../animations/hooks'

/**
 * Signature Lotosphere Tree Growth Scroll Animation.
 * Displays a fixed/floating background SVG botanical tree growth visualization
 * that grows gradually as the user scrolls from 0% to 100%:
 * 0-20%: Seed sprouting & stem
 * 20-40%: Trunk & first branch branches
 * 40-60%: Secondary branches expand
 * 60-80%: Leaves unfold
 * 80-100%: Full canopy & glowing botanical bloom
 */
export default function TreeGrowth() {
  const svgRef = useRef(null)
  const pathStemRef = useRef(null)
  const pathLeftBranchRef = useRef(null)
  const pathRightBranchRef = useRef(null)
  const pathTopBranchRef = useRef(null)
  const leavesRef = useRef(null)
  const bloomRef = useRef(null)
  const progressTextRef = useRef(null)

  // Use high-performance RAF-gated scroll progress hook
  useScrollProgress((progress) => {
    if (!svgRef.current) return

    // Stem path length
    const stemLength = 300
    const branchLength = 200

    // Stem growth (0 - 30% progress)
    const stemProg = Math.min(1, Math.max(0, progress / 0.3))
    if (pathStemRef.current) {
      pathStemRef.current.style.strokeDashoffset = `${stemLength * (1 - stemProg)}`
    }

    // Left branch growth (20% - 50% progress)
    const leftProg = Math.min(1, Math.max(0, (progress - 0.2) / 0.3))
    if (pathLeftBranchRef.current) {
      pathLeftBranchRef.current.style.strokeDashoffset = `${branchLength * (1 - leftProg)}`
    }

    // Right branch growth (35% - 65% progress)
    const rightProg = Math.min(1, Math.max(0, (progress - 0.35) / 0.3))
    if (pathRightBranchRef.current) {
      pathRightBranchRef.current.style.strokeDashoffset = `${branchLength * (1 - rightProg)}`
    }

    // Top branch growth (50% - 80% progress)
    const topProg = Math.min(1, Math.max(0, (progress - 0.5) / 0.3))
    if (pathTopBranchRef.current) {
      pathTopBranchRef.current.style.strokeDashoffset = `${branchLength * (1 - topProg)}`
    }

    // Leaves opacity & scale (60% - 90% progress)
    const leafProg = Math.min(1, Math.max(0, (progress - 0.6) / 0.3))
    if (leavesRef.current) {
      leavesRef.current.style.opacity = `${leafProg}`
      leavesRef.current.style.transform = `scale(${0.5 + leafProg * 0.5})`
    }

    // Bloom/Canopy aura (80% - 100% progress)
    const bloomProg = Math.min(1, Math.max(0, (progress - 0.8) / 0.2))
    if (bloomRef.current) {
      bloomRef.current.style.opacity = `${bloomProg * 0.8}`
      bloomRef.current.style.transform = `scale(${0.8 + bloomProg * 0.4})`
    }

    // Text indicator
    if (progressTextRef.current) {
      const stage =
        progress < 0.25
          ? 'SEED & ROOT'
          : progress < 0.5
          ? 'EMERGING STEM'
          : progress < 0.75
          ? 'BRANCHING FOLIAGE'
          : 'FULL CANOPY'
      progressTextRef.current.textContent = `${Math.round(progress * 100)}% • ${stage}`
    }
  })

  return (
    <div className="fixed right-4 bottom-24 z-30 pointer-events-none hidden lg:flex flex-col items-center group">
      <div className="relative w-28 h-40 p-2 bg-emerald-950/40 backdrop-blur-md rounded-2xl border border-emerald-800/30 shadow-2xl flex flex-col items-center justify-between transition-all duration-300 group-hover:border-emerald-500/40">
        {/* Glow behind container */}
        <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl blur-xl" />

        {/* Tree SVG */}
        <svg
          ref={svgRef}
          viewBox="0 0 100 140"
          className="w-full h-28 overflow-visible"
        >
          <defs>
            <linearGradient id="treeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="60%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Seed Base */}
          <circle cx="50" cy="130" r="4" fill="#d97706" className="animate-pulse" />
          <circle cx="50" cy="130" r="8" fill="#d97706" opacity="0.2" />

          {/* Main Stem */}
          <path
            ref={pathStemRef}
            d="M 50 130 C 50 110, 48 90, 50 50"
            fill="none"
            stroke="url(#treeGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ strokeDasharray: 300, strokeDashoffset: 300, transition: 'stroke-dashoffset 0.1s linear' }}
          />

          {/* Left Branch */}
          <path
            ref={pathLeftBranchRef}
            d="M 50 90 C 40 80, 25 75, 20 65"
            fill="none"
            stroke="url(#treeGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ strokeDasharray: 200, strokeDashoffset: 200, transition: 'stroke-dashoffset 0.1s linear' }}
          />

          {/* Right Branch */}
          <path
            ref={pathRightBranchRef}
            d="M 50 75 C 60 65, 75 60, 80 50"
            fill="none"
            stroke="url(#treeGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ strokeDasharray: 200, strokeDashoffset: 200, transition: 'stroke-dashoffset 0.1s linear' }}
          />

          {/* Top Branch split */}
          <path
            ref={pathTopBranchRef}
            d="M 50 50 C 40 35, 30 30, 25 20 M 50 50 C 60 35, 70 30, 75 20"
            fill="none"
            stroke="url(#treeGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ strokeDasharray: 200, strokeDashoffset: 200, transition: 'stroke-dashoffset 0.1s linear' }}
          />

          {/* Leaves Group */}
          <g ref={leavesRef} style={{ opacity: 0, transition: 'opacity 0.2s ease, transform 0.2s ease', transformOrigin: '50px 70px' }}>
            {/* Left branch leaves */}
            <path d="M 20 65 C 15 60, 12 65, 20 65 Z" fill="#22c55e" />
            <path d="M 20 65 C 22 55, 28 58, 20 65 Z" fill="#4ade80" />

            {/* Right branch leaves */}
            <path d="M 80 50 C 85 45, 88 50, 80 50 Z" fill="#22c55e" />
            <path d="M 80 50 C 78 40, 72 43, 80 50 Z" fill="#4ade80" />

            {/* Top leaves */}
            <path d="M 25 20 C 20 12, 15 18, 25 20 Z" fill="#86efac" />
            <path d="M 75 20 C 80 12, 85 18, 75 20 Z" fill="#86efac" />
            <path d="M 50 40 C 45 30, 55 25, 50 40 Z" fill="#22c55e" />
          </g>

          {/* Canopy Bloom */}
          <circle
            ref={bloomRef}
            cx="50"
            cy="35"
            r="24"
            fill="url(#treeGrad)"
            opacity="0"
            filter="url(#glow)"
            style={{ transition: 'opacity 0.3s ease, transform 0.3s ease', transformOrigin: '50px 35px' }}
          />
        </svg>

        {/* Live progress indicator label */}
        <span
          ref={progressTextRef}
          className="font-mono text-[9px] uppercase tracking-wider text-amber-300/80 font-medium"
        >
          0% • SEED & ROOT
        </span>
      </div>
    </div>
  )
}
