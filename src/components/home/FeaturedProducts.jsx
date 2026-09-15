import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeletons'
import { getFeaturedProducts } from '@/services/productService'
import { staggerContainer } from '@/animations/variants'
import SideBranch from './SideBranch'

const FALLBACK_PRODUCTS = [
  {
    id: 'feat-1',
    name: 'Monstera Deliciosa',
    slug: 'monstera-deliciosa',
    price: 1499,
    sale_price: 1299,
    stock: 12,
    featured: true,
    care_level: 'Easy',
    air_purifying: true,
    pet_friendly: false,
    image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80',
    categories: { name: 'Indoor Plants', slug: 'indoor-plants' }
  },
  {
    id: 'feat-2',
    name: 'Fiddle Leaf Fig',
    slug: 'fiddle-leaf-fig',
    price: 2499,
    sale_price: null,
    stock: 5,
    featured: true,
    care_level: 'Moderate',
    air_purifying: true,
    pet_friendly: false,
    image_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80',
    categories: { name: 'Indoor Plants', slug: 'indoor-plants' }
  },
  {
    id: 'feat-3',
    name: 'Calathea Orbifolia',
    slug: 'calathea-orbifolia',
    price: 1299,
    sale_price: null,
    stock: 8,
    featured: true,
    care_level: 'Expert',
    air_purifying: true,
    pet_friendly: true,
    image_url: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&q=80',
    categories: { name: 'Pet Friendly', slug: 'pet-friendly' }
  },
  {
    id: 'feat-4',
    name: 'Snake Plant Laurentii',
    slug: 'snake-plant-laurentii',
    price: 899,
    sale_price: 749,
    stock: 20,
    featured: true,
    care_level: 'Easy',
    air_purifying: true,
    pet_friendly: false,
    image_url: 'https://images.unsplash.com/photo-1599598425947-020645558055?w=800&q=80',
    categories: { name: 'Succulents & Cacti', slug: 'succulents-cacti' }
  },
  {
    id: 'feat-5',
    name: 'Peace Lily Sensational',
    slug: 'peace-lily-sensational',
    price: 999,
    sale_price: null,
    stock: 15,
    featured: true,
    care_level: 'Easy',
    air_purifying: true,
    pet_friendly: false,
    image_url: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=800&q=80',
    categories: { name: 'Air Purifiers', slug: 'air-purifiers' }
  },
  {
    id: 'feat-6',
    name: 'Pothos Golden',
    slug: 'pothos-golden',
    price: 599,
    sale_price: null,
    stock: 25,
    featured: true,
    care_level: 'Easy',
    air_purifying: true,
    pet_friendly: false,
    image_url: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?w=800&q=80',
    categories: { name: 'Indoor Plants', slug: 'indoor-plants' }
  }
]

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeaturedProducts(6)
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data)
        } else {
          setProducts(FALLBACK_PRODUCTS)
        }
      })
      .catch(() => {
        setProducts(FALLBACK_PRODUCTS)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="relative py-24 bg-[#08100c] text-[#f5f2eb] overflow-hidden">
      {/* Signature Side Branch visual framing header from left */}
      <SideBranch direction="left" className="top-12 -left-4" />

      {/* Atmospheric Ambient Glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-700/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 sm:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/20 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-sm">
              <Sparkles size={12} className="text-amber-400" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#f5f2eb] tracking-tight font-display">
              Featured Living Plants
            </h2>
          </div>
          <div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-mono tracking-wider uppercase text-amber-300 hover:text-amber-200 transition-colors group"
              data-cursor="link"
            >
              <span>View All Species</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          >
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
