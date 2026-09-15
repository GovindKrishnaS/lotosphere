import { motion } from 'framer-motion'
import { Sparkles, Heart, MessageSquare, Camera } from 'lucide-react'
import SideBranch from './SideBranch'

const COMMUNITY_POSTS = [
  {
    id: 'post-1',
    author: 'Clara Oswald',
    handle: '@clara_botanica',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    title: 'Morning misting ritual for Monstera.',
    likes: 342,
    comments: 28,
    tag: 'Living Space',
  },
  {
    id: 'post-2',
    author: 'Devon Vance',
    handle: '@devon_greenery',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80',
    title: 'Vertical Pothos canopy across urban loft.',
    likes: 512,
    comments: 44,
    tag: 'Canopy',
  },
  {
    id: 'post-3',
    author: 'Maya Lin',
    handle: '@maya_studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80',
    title: 'Snake Plant in terracotta morning light.',
    likes: 429,
    comments: 31,
    tag: 'Ceramics',
  },
]

export default function Community() {
  return (
    <section className="relative py-24 bg-[#040806] text-[#f5f2eb] overflow-hidden">
      {/* Side Branch Framing from Right */}
      <SideBranch direction="right" className="top-10 -right-4" />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5 sm:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-sm">
              <Sparkles size={12} className="text-amber-400" />
              <span>Community</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#f5f2eb] font-display">
              Community Sanctuaries
            </h2>
          </div>
          <p className="text-sm text-[#a39e8f] max-w-md mt-3 md:mt-0 font-light">
            Living plant spaces shared by our collector community.
          </p>
        </div>

        {/* Community Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMMUNITY_POSTS.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-[#091510]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-emerald-900/40 shadow-xl group hover:border-emerald-500/50 transition-all duration-300"
            >
              {/* Media Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#060c09]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 font-mono text-[10px] uppercase tracking-wider border border-amber-400/30">
                  {post.tag}
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-500/40"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#f5f2eb] leading-tight font-display">{post.author}</h4>
                    <span className="text-[11px] font-mono text-emerald-400/80 font-light">{post.handle}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#c9c4b7] font-light leading-relaxed mb-4">
                  "{post.title}"
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-emerald-950 text-xs font-mono text-[#8c887b]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Heart size={13} className="fill-emerald-400" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1 hover:text-[#f5f2eb] transition-colors">
                      <MessageSquare size={13} />
                      {post.comments}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-amber-300/90 text-[10px]">
                    <Camera size={12} />
                    Verified Parent
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
