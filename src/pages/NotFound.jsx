import { Link } from 'react-router-dom'
import { Leaf, ArrowLeft, Home, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4" style={{ background: 'var(--color-cream)' }}>
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl border border-border/50 text-center">
        <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6 text-forest">
          <Leaf size={40} />
        </div>

        <span className="text-label text-terracotta block mb-2">404 Error</span>

        <h1 className="font-serif text-3xl font-bold text-forest mb-3">
          Page Lost in the Wild
        </h1>

        <p className="text-charcoal-light text-sm mb-8 leading-relaxed">
          The botanical path you're looking for doesn't exist or has been pruned. Let's get you back to green ground.
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/" className="btn-primary justify-center" data-cursor="link">
            <Home size={16} /> Return Home
          </Link>
          <Link to="/shop" className="btn-secondary justify-center" data-cursor="link">
            <ShoppingBag size={16} /> Explore Plant Catalogue
          </Link>
        </div>
      </div>
    </div>
  )
}
