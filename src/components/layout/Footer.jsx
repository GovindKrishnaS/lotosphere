import { Link } from 'react-router-dom'
import { Leaf, Mail, MapPin, Globe, Sparkles } from 'lucide-react'

const footerLinks = {
  Botanicals: [
    { label: 'All Plants', to: '/shop' },
    { label: 'Indoor Sanctuaries', to: '/shop?category=indoor-plants' },
    { label: 'Architectural Specimens', to: '/shop?category=statement-plants' },
    { label: 'Air Purifying Varieties', to: '/shop?category=air-purifying' },
    { label: 'Pet-Friendly Species', to: '/shop?category=pet-friendly' },
  ],
  Knowledge: [
    { label: 'Plant Care Guide', to: '/plant-care' },
    { label: 'Species Diagnostic', to: '/#plant-finder' },
    { label: 'Botanical Heritage', to: '/about' },
  ],
  Account: [
    { label: 'Member Profile', to: '/account' },
    { label: 'Order Tracking', to: '/account' },
    { label: 'Care Consultations', to: '/about' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative bg-[#020503] text-[#f5f2eb] border-t border-emerald-950/80 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer */}
      <div className="container relative z-10 mx-auto px-5 sm:px-8 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group" data-cursor="link">
              <div className="w-8 h-8 bg-emerald-950 border border-emerald-500/40 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
                <Leaf size={15} className="text-amber-300" />
              </div>
              <span className="font-serif text-2xl font-medium tracking-tight text-[#f5f2eb]">
                Lotosphere
              </span>
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed max-w-sm text-[#a39e8f] font-light">
              Connecting architectural indoor spaces with regenerative botanical organisms. Sourced from organic solar nurseries and delivered in breathable mineral planters.
            </p>
            <div className="flex items-center gap-3 mt-7">
              <a
                href="https://lotosphere.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#091510] border border-emerald-900/60 hover:border-emerald-500/50 hover:bg-emerald-950 transition-all text-[#a39e8f] hover:text-white"
                aria-label="Website"
              >
                <Globe size={15} />
              </a>
              <a
                href="mailto:concierge@lotosphere.com"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#091510] border border-emerald-900/60 hover:border-emerald-500/50 hover:bg-emerald-950 transition-all text-[#a39e8f] hover:text-white"
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-amber-300/90 mb-5">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-xs text-[#a39e8f] hover:text-[#f5f2eb] font-light transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-950">
        <div className="container mx-auto px-5 sm:px-8 max-w-7xl py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-mono text-[#6a6659]">
            © {new Date().getFullYear()} LOTOSPHERE BOTANICAL BIOSPHERE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#6a6659]">
            <MapPin size={12} className="text-emerald-500" />
            <span>Kerala, India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
