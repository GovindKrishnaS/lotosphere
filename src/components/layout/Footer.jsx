import { Link } from 'react-router-dom'
import { Leaf, Mail, MapPin, Globe, Sparkles } from 'lucide-react'

function InstagramIcon({ size = 15, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function YoutubeIcon({ size = 15, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" />
    </svg>
  )
}

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
    { label: 'Our Story', to: '/our-story' },
    { label: 'Botanical Heritage', to: '/about' },
  ],
  Sanctuary: [
    { label: 'Botanical Concierge', to: '/about' },
    { label: 'Care Consultations', to: '/plant-care' },
    { label: 'Living Guarantee', to: '/about' },
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
              <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-500/40 transition-transform duration-300 group-hover:scale-105 shadow-lg bg-white/10 shrink-0 flex items-center justify-center">
                <img src="/lotosphere-logo.jpg" alt="Lotosphere Logo" className="w-full h-full object-cover" />
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
                href="https://lotosphere.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#091510] border border-emerald-900/60 hover:border-emerald-500/50 hover:bg-emerald-950 transition-all text-[#a39e8f] hover:text-white"
                aria-label="Website"
              >
                <Globe size={15} />
              </a>
              <a
                href="mailto:lotospheres@gmail.com"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#091510] border border-emerald-900/60 hover:border-emerald-500/50 hover:bg-emerald-950 transition-all text-[#a39e8f] hover:text-white"
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
              <a
                href="https://www.instagram.com/lotosphere"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#091510] border border-emerald-900/60 hover:border-emerald-500/50 hover:bg-emerald-950 transition-all text-[#a39e8f] hover:text-white"
                aria-label="Instagram"
              >
                <InstagramIcon size={15} />
              </a>
              <a
                href="https://www.youtube.com/@lotosphere"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#091510] border border-emerald-900/60 hover:border-emerald-500/50 hover:bg-emerald-950 transition-all text-[#a39e8f] hover:text-white"
                aria-label="YouTube"
              >
                <YoutubeIcon size={15} />
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
