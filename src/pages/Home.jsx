import Hero from '@/components/home/Hero'
import LivingWorld from '@/components/home/LivingWorld'
import Collections from '@/components/home/Collections'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import MeetYourPlant from '@/components/home/MeetYourPlant'
import PlantFinder from '@/components/home/PlantFinder'
import PlantCare from '@/components/home/PlantCare'
import BrandStory from '@/components/home/BrandStory'
import Community from '@/components/home/Community'
import Testimonials from '@/components/home/Testimonials'
import BotanicalCTA from '@/components/home/BotanicalCTA'
import Newsletter from '@/components/home/Newsletter'
import TreeGrowth from '@/components/home/TreeGrowth'
import ScrollProgressBar from '@/components/home/ScrollProgressBar'

export default function Home() {
  return (
    <div className="bg-[#050a08] overflow-x-hidden min-h-screen text-[#f5f2eb]">
      {/* Signature Top Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* Signature Interactive Tree Growth Scroll Indicator (grows from seed to full canopy) */}
      <TreeGrowth />

      {/* 01 — CINEMATIC BOTANICAL HERO */}
      <Hero />

      {/* 02 — THE LIVING WORLD ECOSYSTEM */}
      <LivingWorld />

      {/* 03 — CURATED BIOMES & COLLECTIONS */}
      <Collections />

      {/* 04 — FEATURED BOTANICAL SPECIMENS */}
      <FeaturedProducts />

      {/* 05 — MEET YOUR PLANT PERSONALITY */}
      <MeetYourPlant />

      {/* 06 — BOTANICAL SPECIES MATCHMAKER */}
      <PlantFinder />

      {/* 07 — HORTICULTURAL CARE WISDOM */}
      <PlantCare />

      {/* 08 — ORIGINS & ETHOS */}
      <BrandStory />

      {/* 09 — COMMUNITY BIOSPHERE */}
      <Community />

      {/* 10 — VERIFIED REVIEWS & FEEDBACK */}
      <Testimonials />

      {/* 11 — CONCLUDING CANOPY & NEWSLETTER */}
      <BotanicalCTA />
      <Newsletter />
    </div>
  )
}
