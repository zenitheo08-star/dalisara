import { memo } from 'react';
import { Sparkles, Waves } from 'lucide-react';
import { ParallaxImage } from '../components/ParallaxImage';
import { AnimatedTooltip, TooltipItem } from '../components/AnimatedTooltip';
import { RippleDistortion } from '../components/RippleDistortion';
import { LazyImage } from '../components/LazyImage';
import { SEO } from '../components/SEO';
import { AtmosphereCanvas } from '../components/AtmosphereCanvas';

const wellnessPractitioners: TooltipItem[] = [
  {
    id: 1,
    name: 'Isla Valenzuela',
    designation: 'Lead Wellness Therapist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 2,
    name: 'Kian Reyes',
    designation: 'Mobility & Movement Guide',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 3,
    name: 'Anya Santos',
    designation: 'Botanical & Skincare Specialist',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 4,
    name: 'David Chen',
    designation: 'Yoga & Meditation Teacher',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
  },
];

export const Wellness = memo(function Wellness() {
  return (
    <div className="bg-sand-100 min-h-screen relative">
      <SEO 
        title="Botanical Restoration & Wellness House | Dalisara"
        description="Botanical wellness rituals, ocean stone therapy, and restorative movement pavilions nestled within San Vicente's coastal forest."
        canonical="/wellness"
      />
      <section className="h-[60vh] md:h-[80vh] w-full relative border-b border-ink-900/10 overflow-hidden">
        <AtmosphereCanvas variant="botanical" intensity="medium" className="opacity-30 z-10" />
        <ParallaxImage 
          src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2400&h=1200" 
          alt="Wellness at Dalisara" 
          className="grayscale opacity-90 mix-blend-multiply dark:mix-blend-normal"
          priority
        />
        <div className="absolute inset-0 bg-ink-900/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-6xl md:text-[100px] leading-none tracking-tighter italic text-sand-50">Wellness</h1>
        </div>
      </section>

      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto text-center border-b border-ink-900/10">
        <p className="font-serif text-3xl md:text-5xl italic tracking-tight leading-snug text-ink-900 mb-8 opacity-90">
          Restraint over excess. Our wellness philosophy centers on restorative body care through 
          simple, profound connection to the environment and skilled touch.
        </p>
      </section>

      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32">
          <div className="order-2 md:order-1 border-t border-ink-900/10 pt-8 group">
            <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-4 block">01 / Restoration</span>
            <h2 className="font-serif text-4xl italic tracking-tight text-ink-900 mb-6 group-hover:opacity-70 transition-opacity">The Wellness House</h2>
            <p className="text-sm text-ink-700 leading-relaxed mb-6 opacity-80">
              Featuring four treatment rooms (including two for couples), a quiet relaxation lounge, and a sheltered garden court. Treatments focus on restorative body care, massage, and simple recovery rituals after travel or outdoor activity.
            </p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-ink-900 opacity-60 mb-8">9:00 AM – 8:00 PM</p>
          </div>
          <div className="order-1 md:order-2 aspect-[3/4] overflow-hidden bg-sand-200">
            <LazyImage 
              src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200&h=1600" 
              alt="The Wellness House" 
              rootMargin="250px 0px"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32">
          <div className="aspect-[4/3] overflow-hidden bg-sand-200">
            <LazyImage 
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=1200&h=900" 
              alt="Movement Pavilion" 
              rootMargin="250px 0px"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="border-t border-ink-900/10 pt-8 group">
            <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-4 block">02 / Movement</span>
            <h2 className="font-serif text-4xl italic tracking-tight text-ink-900 mb-6 group-hover:opacity-70 transition-opacity">Movement Pavilion & Fitness Room</h2>
            <p className="text-sm text-ink-700 leading-relaxed mb-6 opacity-80">
              An open-sided, sheltered platform dedicated to yoga, mobility, stretching, and small group movement sessions. A compact, climate-controlled fitness room is also available, equipped with cardio machines and free weights.
            </p>
          </div>
        </div>

        {/* 03 / Hydrotherapy & Cold Mineral Pool with Interactive Ripple Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32">
          <div className="order-2 md:order-1 border-t border-ink-900/10 pt-8 group">
            <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-4 block">03 / Hydrotherapy</span>
            <h2 className="font-serif text-4xl italic tracking-tight text-ink-900 dark:text-[#FCFAF5] mb-6 group-hover:opacity-70 transition-opacity">
              Thermal Baths &amp; Mineral Plunges
            </h2>
            <p className="text-sm text-ink-700 dark:text-[#CFC9BE] leading-relaxed mb-6 opacity-80">
              Fed by filtered subterranean spring waters and enriched with ocean minerals. Alternating contrast plunges stimulate deep circulation, reduce muscle inflammation, and calm the autonomic nervous system.
            </p>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-ink-500 dark:text-sand-200">
              <Waves className="w-3.5 h-3.5 animate-pulse text-teal-600 dark:text-teal-400" />
              <span>Interactive Spring — Hover or click water surface</span>
            </div>
          </div>
          <div className="order-1 md:order-2 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-ink-900/10 dark:border-white/10 relative group">
            <RippleDistortion 
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1400&h=1050"
              brushSize={140}
              strength={0.22}
              swirl={1.2}
              rings={4}
              spread={4.5}
              fade={2.8}
              spacing={12}
              dispersion={0.03}
              glint={0.35}
              tint="#0d9488"
              tintAmount={0.08}
              grayscale={false}
              trigger="hover"
              clickStrength={2.2}
              quality="medium"
              className="w-full h-full cursor-crosshair"
            />
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-widest text-white/80 pointer-events-none">
              Move cursor to disturb waters
            </div>
          </div>
        </div>

        {/* Master Practitioners Section */}
        <div className="p-8 md:p-12 rounded-3xl bg-sand-50 dark:bg-white/[0.03] border border-ink-900/10 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-sm">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ink-500 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-ink-900 dark:text-sand-50" />
              <span>Wellness Team</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl italic tracking-tight text-ink-900 dark:text-sand-50 mb-3">
              Restorative Therapists &amp; Movement Guides
            </h3>
            <p className="text-xs md:text-sm text-ink-700 dark:text-[#CFC9BE] leading-relaxed">
              Our practitioners are trained in restorative body care, massage, and mobility coaching, utilizing warming oils, heated river stones, and ocean-grounded breath rhythms.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
            <AnimatedTooltip items={wellnessPractitioners} />
            <span className="text-[10px] uppercase tracking-widest text-ink-400 dark:text-[#A8A398] font-mono">
              Hover to meet the team
            </span>
          </div>
        </div>
      </section>
    </div>
  );
});


