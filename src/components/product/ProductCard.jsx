import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Check, Leaf, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils'
import { staggerItem } from '@/animations/variants'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [leafFly, setLeafFly] = useState(false)
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const price = product.sale_price ?? product.price
  const isOnSale = product.sale_price && product.sale_price < product.price
  const isOutOfStock = product.stock === 0

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10
    setTilt({ x, y })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock || adding) return
    setAdding(true)
    setLeafFly(true)

    try {
      await addItem(product, 1)
      setAdded(true)
      setTimeout(() => {
        setAdded(false)
        setLeafFly(false)
      }, 2000)
    } finally {
      setAdding(false)
    }
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      variants={staggerItem}
      className="group relative"
    >
      {/* Animated Flying Spore/Leaf toward Cart */}
      <AnimatePresence>
        {leafFly && (
          <motion.div
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 0.2, x: 140, y: -240 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none text-amber-400"
          >
            <Leaf size={32} className="animate-spin text-emerald-400 drop-shadow-[0_0_8px_#22c55e]" />
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        to={`/products/${product.slug}`}
        className="block bg-[#0c1712]/80 backdrop-blur-md rounded-2xl p-3 border border-emerald-900/40 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-950/80"
        data-cursor="view"
      >
        {/* Image Container with Dark Vignette */}
        <div className="relative overflow-hidden rounded-xl mb-3 bg-[#070e0a] aspect-[3/4]">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 contrast-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#070e0a] via-transparent to-transparent opacity-60" />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                <Sparkles size={10} className="text-amber-400" /> Featured
              </span>
            )}
            {isOnSale && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                Sale
              </span>
            )}
            {product.air_purifying && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-teal-950/80 text-teal-300 border border-teal-500/30 backdrop-blur-sm">
                Purifying
              </span>
            )}
            {product.pet_friendly && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                Pet Safe
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 opacity-100 md:opacity-0 md:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || adding}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                isOutOfStock
                  ? 'bg-black/60 text-gray-400 cursor-not-allowed border border-gray-700'
                  : added
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/60 border border-emerald-400'
                  : 'bg-[#0f241a] text-emerald-200 hover:bg-emerald-600 hover:text-white border border-emerald-500/40 shadow-xl'
              }`}
              aria-label={isOutOfStock ? 'Out of stock' : `Add ${product.name} to cart`}
            >
              {added ? (
                <><Check size={14} /> Specimen Added</>
              ) : isOutOfStock ? (
                'Unavailable'
              ) : (
                <><ShoppingBag size={14} /> Quick Acquire</>
              )}
            </button>
          </div>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-red-950/80 text-red-300 border border-red-500/30">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Specimen Info */}
        <div className="px-1.5 pb-1">
          {product.categories && (
            <p className="text-[11px] font-mono uppercase tracking-wider text-emerald-400/80 mb-1">
              {product.categories.name}
            </p>
          )}
          <h3 className="font-serif text-base font-medium text-[#f5f2eb] group-hover:text-amber-200 transition-colors duration-200 mb-2 truncate">
            {product.name}
          </h3>

          {/* Care Level & Price */}
          <div className="flex items-center justify-between pt-1 border-t border-emerald-950">
            <div className="flex items-center gap-1.5">
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-md border"
                style={{
                  background:
                    product.care_level === 'Easy'
                      ? 'rgba(6, 78, 59, 0.4)'
                      : product.care_level === 'Moderate'
                      ? 'rgba(120, 53, 15, 0.4)'
                      : 'rgba(127, 29, 29, 0.4)',
                  borderColor:
                    product.care_level === 'Easy'
                      ? 'rgba(34, 197, 94, 0.3)'
                      : product.care_level === 'Moderate'
                      ? 'rgba(245, 158, 11, 0.3)'
                      : 'rgba(239, 68, 68, 0.3)',
                  color:
                    product.care_level === 'Easy'
                      ? '#86efac'
                      : product.care_level === 'Moderate'
                      ? '#fde047'
                      : '#fca5a5',
                }}
              >
                {product.care_level || 'Easy'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-serif font-semibold text-[#f5f2eb] text-sm">
                {formatCurrency(price)}
              </span>
              {isOnSale && (
                <span className="text-[11px] text-[#8c887b] line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
