import BrandStory from '@/components/home/BrandStory'
import Testimonials from '@/components/home/Testimonials'
import { Leaf, Award, HeartHandshake, Earth } from 'lucide-react'

export default function About() {
  return (
    <div className="space-y-0" style={{ background: 'var(--color-cream)' }}>
      {/* Header */}
      <section className="section-padding text-center bg-forest text-cream relative">
        <div className="container max-w-3xl">
          <span className="text-label text-sage block mb-4">Our Journey</span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Connecting People with Living Nature
          </h1>
          <p className="text-cream/80 text-base md:text-lg leading-relaxed">
            Lotosphere is a modern botanical studio dedicated to sustainable cultivation, artisanal planters, and bringing natural tranquility into human living spaces.
          </p>
        </div>
      </section>

      {/* Embedded Brand Story */}
      <BrandStory />

      {/* Values Grid */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-label text-sage block mb-3">Core Principles</span>
            <h2 className="font-serif text-3xl font-bold text-forest">What Drives Lotosphere</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-3xl bg-cream/30 border border-border/50">
              <div className="w-14 h-14 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto mb-6">
                <Earth size={28} />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest mb-3">100% Sustainable</h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                Zero single-use plastics in shipping. All soil blends and planters are ethically produced with natural materials.
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-cream/30 border border-border/50">
              <div className="w-14 h-14 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto mb-6">
                <Award size={28} />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest mb-3">Hand-Inspected Quality</h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                Every plant undergoes rigorous health, foliage, and root system checks before leaving our greenhouse.
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-cream/30 border border-border/50">
              <div className="w-14 h-14 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto mb-6">
                <HeartHandshake size={28} />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest mb-3">Lifelong Support</h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                Our plant experts are available to answer care questions, diagnose issues, and help your plants flourish forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  )
}
