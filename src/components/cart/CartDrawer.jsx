import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils'
import { overlayVariant, slideFromRight } from '@/animations/variants'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, itemCount, subtotal, updateQuantity, removeItem } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            variants={overlayVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            variants={slideFromRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#070f0b] border-l border-emerald-900/40 text-[#f5f2eb] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-950">
              <div className="flex items-center gap-3">
                <ShoppingBag size={19} className="text-amber-300" />
                <span className="font-serif text-lg font-medium">
                  Botanical Basket
                </span>
                {itemCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    {itemCount} {itemCount === 1 ? 'Specimen' : 'Specimens'}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/5 text-[#f5f2eb] hover:bg-white/10"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0b1b13] border border-emerald-900/50 flex items-center justify-center text-emerald-400">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <p className="font-serif text-lg text-[#f5f2eb] mb-1">Your basket is empty</p>
                    <p className="text-xs text-[#a39e8f] font-light">Explore living specimens in our collection</p>
                  </div>
                  <Link
                    to="/shop"
                    onClick={() => setIsOpen(false)}
                    className="mt-4 px-6 py-3 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-200 text-xs font-mono uppercase tracking-wider hover:bg-emerald-900 transition-all"
                  >
                    Enter Catalogue
                  </Link>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map(item => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="py-4 border-b border-emerald-950 last:border-0"
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <Link
                          to={`/products/${item.product.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex-shrink-0"
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#060c09] border border-emerald-900/40">
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover filter brightness-95"
                              loading="lazy"
                            />
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.product.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="font-serif text-sm font-medium text-[#f5f2eb] hover:text-amber-200 transition-colors truncate block"
                          >
                            {item.product.name}
                          </Link>
                          <p className="font-mono text-xs font-medium text-emerald-400 mt-1">
                            {formatCurrency(item.product.sale_price ?? item.product.price)}
                          </p>

                          {/* Qty + Remove */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 bg-[#091510] border border-emerald-900/60 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-emerald-900 text-[#a39e8f] hover:text-white transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-7 text-center font-mono text-xs font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-emerald-900 text-[#a39e8f] hover:text-white transition-colors"
                                aria-label="Increase quantity"
                                disabled={item.quantity >= (item.product.stock || Infinity)}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="p-1.5 rounded-lg text-[#8c887b] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-emerald-950 space-y-4 bg-[#050b08]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#a39e8f]">Subtotal</span>
                  <span className="font-serif text-lg font-semibold text-[#f5f2eb]">{formatCurrency(subtotal)}</span>
                </div>
                <p className="text-[11px] font-mono text-[#6a6659]">
                  Complimentary climate-controlled delivery calculated at checkout
                </p>
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-mono uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl shadow-emerald-950 border border-emerald-400/30 transition-all duration-300"
                >
                  <span>Proceed to Sanctuary Checkout</span>
                  <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-xs font-mono uppercase tracking-wider text-[#a39e8f] hover:text-[#f5f2eb] transition-colors py-1"
                >
                  Continue Exploring
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
