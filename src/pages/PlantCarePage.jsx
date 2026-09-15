import PlantCare from '@/components/home/PlantCare'
import { Sun, Droplets, Thermometer, ShieldCheck, HelpCircle } from 'lucide-react'

export default function PlantCarePage() {
  return (
    <div className="space-y-0" style={{ background: 'var(--color-cream)' }}>
      {/* Header Banner */}
      <section className="section-padding text-center bg-forest text-cream relative overflow-hidden">
        <div className="container relative z-10 max-w-3xl">
          <span className="text-label text-sage block mb-4">Botanical Knowledge Base</span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Master the Art of Plant Care
          </h1>
          <p className="text-cream/80 text-base md:text-lg leading-relaxed">
            Everything you need to keep your indoor jungle thriving season after season. Formulated by horticulturists for plant parents of all levels.
          </p>
        </div>
      </section>

      {/* Embedded Main Interactive PlantCare Component */}
      <PlantCare />

      {/* Extra Care Deep Dive Cards */}
      <section className="section-padding bg-white">
        <div className="container">
          <h2 className="font-serif text-3xl font-bold text-forest text-center mb-12">
            Essential Care Fundamentals
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-cream/40 border border-border/60">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
                <Sun size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest mb-3">Sunlight Management</h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                Most indoor tropicals prefer bright, indirect sunlight. Direct noon rays can burn foliage, while pitch darkness causes pale leggy growth.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-cream/40 border border-border/60">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                <Droplets size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest mb-3">Watering Rhythms</h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                Always check soil moisture 2 inches deep before watering. Overwatering is the #1 cause of plant distress — make sure your pot has drainage holes!
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-cream/40 border border-border/60">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <Thermometer size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest mb-3">Humidity & Temp</h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                Keep plants away from cold air-conditioner drafts or direct heater radiators. Grouping plants together creates a healthy micro-climate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
