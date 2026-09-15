import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function BotanicalCTA() {
  return (
    <section className="relative py-20 bg-[#030604] overflow-hidden">
      <div className="container mx-auto px-5 sm:px-8 max-w-7xl">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 md:p-16 text-center flex flex-col items-center justify-center border border-emerald-900/50 shadow-2xl">
          {/* Background image with Dark Botanical overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=1600&q=85"
              alt="Botanical sanctuary foliage"
              className="w-full h-full object-cover filter brightness-50 contrast-125"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030604]/90 via-[#06120b]/85 to-[#030604]/95 backdrop-blur-[1px]" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-xl text-[#f5f2eb]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-4 backdrop-blur-md">
              <Sparkles size={12} className="text-amber-400" />
              <span>Transform Your Space</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-3 font-display">
              Bring Nature Indoors
            </h2>

            <p className="text-[#c9c4b7] text-sm sm:text-base mb-6 leading-relaxed font-light">
              Living architectural plants paired with handcrafted mineral planters.
            </p>

            <div className="flex flex-wrap justify-center gap-3.5">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-xs font-mono uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl shadow-emerald-950 border border-emerald-400/30 transition-all duration-300"
                data-cursor="link"
              >
                <span>Shop Catalogue</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/plant-care"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-mono uppercase tracking-wider bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 text-[#f5f2eb] backdrop-blur-md transition-all duration-300"
                data-cursor="link"
              >
                <span>Care Guides</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
