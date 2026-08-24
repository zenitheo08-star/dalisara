import { memo } from 'react';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ParallaxImage } from '../components/ParallaxImage';
import { AnimatedTooltip, TooltipItem } from '../components/AnimatedTooltip';
import { LazyImage } from '../components/LazyImage';
import { SEO } from '../components/SEO';
import { useBooking } from '../store';

const culinaryBrigade: TooltipItem[] = [
  {
    id: 1,
    name: 'Chef Elena Ramos',
    designation: 'Executive Chef — Open Hearth & Foraging',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 2,
    name: 'Luis Manalo',
    designation: 'Head Sommelier & Fermentation Lead',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 3,
    name: 'Mirei Santos',
    designation: 'Pastry & Native Cacao Artisan',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 4,
    name: 'Karlo Dimagiba',
    designation: 'Master Mixologist — Canopy Bar',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
  },
];

export const Dining = memo(function Dining() {
  const { setBookingModalOpen } = useBooking();

  return (
    <div className="bg-sand-100 min-h-screen">
      <SEO 
        title="Coastal Dining & Cellar | Dalisara"
        description="Fresh island harvest, open-hearth coastal seafood, and biodynamic fermentation. Discover The Shore Kitchen and The Canopy Bar."
        canonical="/dining"
      />
      <section className="h-[60vh] md:h-[80vh] w-full relative border-b border-ink-900/10 overflow-hidden">
        <ParallaxImage 
          src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=2400&h=1200" 
          alt="Dining at Dalisara" 
          className="grayscale opacity-90 mix-blend-multiply dark:mix-blend-normal"
          priority
        />
        <div className="absolute inset-0 bg-ink-900/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-6xl md:text-[100px] leading-none tracking-tighter italic text-sand-50">Dining</h1>
        </div>
      </section>

      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto text-center border-b border-ink-900/10">
        <p className="font-serif text-3xl md:text-5xl italic tracking-tight leading-snug text-ink-900 mb-8 opacity-90">
          Guided by the seasons and the archipelago. Our approach to food is 
          straightforward, focusing on the quality of ingredients, tropical produce, and fresh coastal seafood.
        </p>
      </section>

      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32">
          <div className="order-2 md:order-1 border-t border-ink-900/10 pt-8 group">
            <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-4 block">01 / Concept</span>
            <h2 className="font-serif text-4xl italic tracking-tight text-ink-900 mb-6 group-hover:opacity-70 transition-opacity">The Shore Kitchen</h2>
            <p className="text-sm text-ink-700 leading-relaxed mb-6 opacity-80">
              Our main restaurant serves breakfast, lunch, and dinner. The menu is an evolving 
              interpretation of coastal Filipino cuisine, cooked over open fire and served in a 
              relaxed, open-air pavilion framing the ocean.
            </p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-ink-900 opacity-60 mb-8">Daily &mdash; 7:00 AM to 10:30 PM</p>
          </div>
          <div className="order-1 md:order-2 aspect-square overflow-hidden bg-sand-200">
            <LazyImage 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200&h=1200" 
              alt="The Shore Kitchen" 
              rootMargin="250px 0px"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32">
          <div className="aspect-[4/3] overflow-hidden bg-sand-200">
            <LazyImage 
              src="https://images.unsplash.com/photo-1478144592103-25e218a04891?auto=format&fit=crop&q=80&w=1200&h=900" 
              alt="Canopy Bar" 
              rootMargin="250px 0px"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="border-t border-ink-900/10 pt-8 group">
            <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-4 block">02 / Concept</span>
            <h2 className="font-serif text-4xl italic tracking-tight text-ink-900 mb-6 group-hover:opacity-70 transition-opacity">Canopy Bar</h2>
            <p className="text-sm text-ink-700 leading-relaxed mb-6 opacity-80">
              Set elevated within the coastal forest, the Canopy Bar offers panoramic views 
              of the horizon. A quiet space for late-afternoon tea, bespoke cocktails, and 
              small plates as the light shifts.
            </p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-ink-900 opacity-60 mb-8">Daily &mdash; 3:00 PM to Midnight</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32">
          <div className="order-2 md:order-1 border-t border-ink-900/10 pt-8 group">
            <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-4 block">03 / Concept</span>
            <h2 className="font-serif text-4xl italic tracking-tight text-ink-900 mb-6 group-hover:opacity-70 transition-opacity">Garden Table</h2>
            <p className="text-sm text-ink-700 leading-relaxed mb-6 opacity-80">
              A private, multi-course dining experience set within our botanical gardens. 
              Designed for couples or small groups seeking complete privacy and a menu 
              tailored to their preferences.
            </p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-ink-900 opacity-60 mb-8">By Reservation Only</p>
            <button 
              onClick={() => setBookingModalOpen(true)}
              className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-medium text-ink-900 hover:opacity-60 transition-opacity border-b border-ink-900/20 pb-2 group-hover:border-ink-900"
            >
              Reserve Experience <ArrowRight size={14} />
            </button>
          </div>
          <div className="order-1 md:order-2 aspect-[4/3] overflow-hidden bg-sand-200">
             <LazyImage 
              src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=1200&h=900" 
              alt="Garden Table" 
              rootMargin="250px 0px"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="aspect-[4/3] overflow-hidden bg-sand-200">
             <LazyImage 
              src="https://images.unsplash.com/photo-1596431940984-75464875080e?auto=format&fit=crop&q=80&w=1200&h=900" 
              alt="In-Villa Dining" 
              rootMargin="250px 0px"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover grayscale mix-blend-multiply dark:mix-blend-normal opacity-90"
            />
          </div>
          <div className="border-t border-ink-900/10 pt-8 group">
            <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-4 block">04 / Concept</span>
            <h2 className="font-serif text-4xl italic tracking-tight text-ink-900 mb-6 group-hover:opacity-70 transition-opacity">In-Villa Dining</h2>
            <p className="text-sm text-ink-700 leading-relaxed mb-6 opacity-80">
              A curated, reduced menu designed specifically for reliable service within the privacy of your pavilion or villa. Ideal for quiet lunches, child-friendly evenings, or breakfasts on your own terrace.
            </p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-ink-900 opacity-60 mb-8">Daily &mdash; 7:00 AM to 10:00 PM</p>
          </div>
        </div>

        {/* Culinary Brigade & Sommelier Council Section */}
        <div className="mt-32 p-8 md:p-12 rounded-3xl bg-sand-50 dark:bg-white/[0.03] border border-ink-900/10 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-sm">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ink-500 mb-2">
              <UtensilsCrossed className="w-3.5 h-3.5 text-ink-900 dark:text-sand-50" />
              <span>Hearth &amp; Cellar Council</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl italic tracking-tight text-ink-900 dark:text-sand-50 mb-3">
              The Culinary Artisans
            </h3>
            <p className="text-xs md:text-sm text-ink-700 dark:text-[#CFC9BE] leading-relaxed">
              From open-flame charcoal grilling to indigenous wild herb infusions and bespoke organic wines, our culinary brigade curates an honest reflection of the archipelago.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
            <AnimatedTooltip items={culinaryBrigade} />
            <span className="text-[10px] uppercase tracking-widest text-ink-400 dark:text-[#A8A398] font-mono">
              Hover to meet the brigade
            </span>
          </div>
        </div>
      </section>
    </div>
  );
});

