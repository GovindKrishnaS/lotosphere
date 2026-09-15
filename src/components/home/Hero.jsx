import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Sparkles, ChevronDown, Compass } from 'lucide-react'
import { useMagneticButton } from '../../animations/hooks'

const PARTICLES = [
  { x: '10%', y: '20%', size: 10, duration: 12, delay: 0 },
  { x: '85%', y: '25%', size: 14, duration: 15, delay: 1.2 },
  { x: '78%', y: '70%', size: 8, duration: 10, delay: 0.8 },
  { x: '15%', y: '75%', size: 12, duration: 14, delay: 2 },
  { x: '45%', y: '15%', size: 7, duration: 9, delay: 1.5 },
]

export default function Hero() {
  const containerRef = useRef(null)
  const bgImageRef = useRef(null)
  const textGroupRef = useRef(null)
  const primaryBtnRef = useMagneticButton(0.2)
  const secondaryBtnRef = useMagneticButton(0.2)

  // High-performance RAF scroll parallax (no React state re-renders)
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          if (scrollY < 900) {
            if (bgImageRef.current) {
              bgImageRef.current.style.transform = `scale(${1 + scrollY * 0.0003}) translateY(${scrollY * 0.15}px)`
            }
            if (textGroupRef.current) {
              textGroupRef.current.style.transform = `translateY(${scrollY * -0.1}px)`
              textGroupRef.current.style.opacity = `${Math.max(0, 1 - scrollY / 650)}`
            }
          }
          ticking = false
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] md:min-h-screen flex items-center overflow-hidden bg-[#070d0a] text-[#f5f2eb] pt-24 pb-16"
    >
      {/* Cinematic Deep Atmosphere Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070d0a]/60 via-[#0a1610]/80 to-[#070d0a] pointer-events-none z-10" />

      {/* Atmospheric Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Macro Botanical Visual with GPU Parallax */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 z-0 overflow-hidden will-change-transform"
      >
        <img
          src="https://images.unsplash.com/photo-1545241047-6083a3684587?w=1920&q=85&auto=format&fit=crop"
          alt="Cinematic Botanical Sanctum"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-75 contrast-125 saturate-110"
          loading="eager"
        />
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      </div>

      {/* Floating Botanical Spores / Particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="particle hidden md:block z-20 pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            '--duration': `${p.duration}s`,
            '--delay': `${p.delay}s`,
          }}
        >
          <Leaf size={p.size} className="text-emerald-400/40" />
        </div>
      ))}

      {/* Main Content Area */}
      <div className="container relative z-20 mx-auto px-5 sm:px-8 max-w-7xl">
        <div ref={textGroupRef} className="max-w-3xl will-change-transform">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg shadow-emerald-950/50">
            <Sparkles size={13} className="text-amber-400 animate-spin-slow" />
            <span>Living Biosphere</span>
          </div>

          {/* Signature Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.98] text-[#f5f2eb] mb-6 select-none font-display">
            LET <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-200 to-[#f5f2eb] font-light">
              NATURE TAKE
            </span> <br />
            SPACE.
          </h1>

          {/* Editorial Subtitle - Concise & Impactful */}
          <p className="text-base sm:text-lg text-[#d4cebe]/90 font-light leading-relaxed max-w-xl mb-10">
            Sculptural living botanicals curated for modern sanctuaries.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div ref={primaryBtnRef}>
              <Link
                to="/shop"
                className="btn-botanical-primary group inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-medium tracking-wide bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl shadow-emerald-950/80 border border-emerald-400/30 transition-all duration-300"
                data-cursor="link"
              >
                <span>Explore Collection</span>
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div ref={secondaryBtnRef}>
              <a
                href="#plant-finder"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl text-sm font-medium tracking-wide bg-emerald-950/40 hover:bg-emerald-900/50 text-[#f5f2eb] border border-emerald-700/40 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50"
                data-cursor="link"
              >
                <Compass size={17} className="text-amber-400" />
                <span>Find Your Match</span>
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-14 sm:mt-16 pt-8 border-t border-emerald-900/40 max-w-lg">
            <div>
              <p className="text-2xl sm:text-3xl font-semibold text-amber-200/90 font-display">200+</p>
              <p className="text-xs text-[#a39e8f] font-light mt-1 uppercase tracking-wider">Species</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-semibold text-emerald-300 font-display">100%</p>
              <p className="text-xs text-[#a39e8f] font-light mt-1 uppercase tracking-wider">Organic</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-semibold text-[#f5f2eb] font-display">30-Day</p>
              <p className="text-xs text-[#a39e8f] font-light mt-1 uppercase tracking-wider">Guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Grow Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20 pointer-events-none">
        <span className="text-[10px] font-mono tracking-widest text-[#a39e8f] uppercase flex items-center gap-1.5">
          <Leaf size={11} className="text-amber-400 animate-pulse" />
          Scroll to explore
        </span>
        <ChevronDown size={16} className="text-emerald-400/70 animate-bounce" />
      </div>
    </section>
  )
}
