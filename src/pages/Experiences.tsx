import { memo } from 'react';
import { ArrowRight, Compass, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ParallaxImage } from '../components/ParallaxImage';
import AccordionGallery, { AccordionGalleryItem } from '../components/AccordionGallery';
import { ScrollExpand } from '../components/ScrollExpand';
import { LazyImage } from '../components/LazyImage';
import { SEO } from '../components/SEO';

const experienceGalleryItems: AccordionGalleryItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=900&h=1200',
    label: 'First Light Paddle',
    link: '/contact',
    subtitle: 'Guided morning kayak or SUP',
    category: 'Marine'
  },
  {
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=900&h=1200',
    label: 'Reef Morning',
    link: '/contact',
    subtitle: 'Guided half-day snorkeling',
    category: 'Marine'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=900&h=1200',
    label: 'Island Day',
    link: '/contact',
    subtitle: 'Private boat excursion',
    category: 'Voyage'
  },
  {
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=900&h=1200',
    label: 'Long Beach Cycle',
    link: '/contact',
    subtitle: 'Coastal land exploration',
    category: 'Land'
  },
  {
    image: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?auto=format&fit=crop&q=80&w=900&h=1200',
    label: 'Kitchen Session',
    link: '/contact',
    subtitle: 'Contemporary Filipino cooking',
    category: 'Culinary'
  }
];

export const Experiences = memo(function Experiences() {
  return (
    <div className="bg-sand-100 min-h-screen">
      <SEO 
        title="Journeys & Palawan Outrigger Expeditions | Dalisara"
        description="First-light paddles, secret cove reef diving, and private coastal expeditions across the Palawan archipelago."
        canonical="/experiences"
      />
      <section className="h-[60vh] md:h-[80vh] w-full relative border-b border-ink-900/10 overflow-hidden">
        <ParallaxImage 
          src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=2400&h=1200" 
          alt="Experiences at Dalisara" 
          className="grayscale opacity-90 mix-blend-multiply dark:mix-blend-normal"
          priority
        />
        <div className="absolute inset-0 bg-ink-900/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-6xl md:text-[100px] leading-none tracking-tighter italic text-sand-50">Experiences</h1>
        </div>
      </section>

      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto text-center border-b border-ink-900/10 dark:border-white/10">
        <p className="font-serif text-3xl md:text-5xl italic tracking-tight leading-snug text-ink-900 dark:text-[#FCFAF5] mb-8 opacity-90">
          The coastline of Palawan requires little embellishment. Our experiences are 
          designed simply to bring you closer to the water, the forest, and the horizon.
        </p>
      </section>

      {/* Cinematic Outrigger Scroll Expansion */}
      <section className="w-full border-b border-ink-900/10 dark:border-white/10 relative">
        <ScrollExpand
          mediaType="image"
          src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2400&h=1400"
          alt="Palawan Traditional Outrigger on Sulu Sea"
          title="Untamed waters, native navigation."
          scrollHint="Scroll to unfold expedition"
          startWidth={44}
          startHeight={60}
          startRadius={24}
          endRadius={0}
          mediaZoom={1.3}
          scrollDistance={1.1}
          holdDistance={0.3}
          overlayScrim={0.52}
          useWindowScroll={true}
        >
          <div className="max-w-xl text-sand-50 space-y-6">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-sand-200">
              <Waves size={13} /> The Sulu Archipelagic Voyage
            </span>
            <p className="font-serif text-2xl md:text-4xl italic leading-snug">
              Every route is charted by native ocean captains, aligned with the tides and seasonal winds.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-medium text-sand-50 hover:text-white border-b border-white/40 pb-1 transition-all"
            >
              Request A Tailored Voyage <ArrowRight size={13} />
            </Link>
          </div>
        </ScrollExpand>
      </section>

      {/* Accordion Gallery of Expeditions */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-ink-900/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Curated Excursions</span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl italic tracking-tighter text-ink-900">
              The Palawan Expedition Gallery
            </h2>
          </div>
          <p className="text-xs md:text-sm text-ink-700 max-w-md leading-relaxed">
            Every journey is accompanied by our resident naturalists and native captains. Hover over any expedition to expand the details.
          </p>
        </div>

        <AccordionGallery
          items={experienceGalleryItems}
          defaultIndex={1}
          expandRatio={0.52}
          trigger="hover"
        />
      </section>

      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32">
          <div className="order-2 md:order-1 border-t border-ink-900/10 pt-8 group">
            <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-4 block">01 / Marine</span>
            <h2 className="font-serif text-3xl italic tracking-tight text-ink-900 mb-6 group-hover:opacity-70 transition-opacity">First Light Paddle & Reef Morning</h2>
            <p className="text-sm text-ink-700 leading-relaxed mb-6 opacity-80">
              The Sulu Sea is best experienced in the early hours. Join our guided small-group First Light Paddle (kayak or SUP) along the quiet shorelines, or coordinate a Reef Morning guided snorkeling excursion with a licensed local operator. All marine activities are strictly governed by weather conditions to ensure safety.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-medium text-ink-900 hover:opacity-60 transition-opacity border-b border-ink-900/20 pb-2 group-hover:border-ink-900">
              Enquire <ArrowRight size={14} />
            </Link>
          </div>
          <div className="order-1 md:order-2 aspect-[4/3] overflow-hidden bg-sand-200">
            <LazyImage 
              src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=1200&h=900" 
              alt="Marine Expeditions" 
              rootMargin="250px 0px"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32">
          <div className="aspect-square overflow-hidden bg-sand-200">
            <LazyImage 
              src="https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=80&w=1200&h=1200" 
              alt="Coastal Trails" 
              rootMargin="250px 0px"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="border-t border-ink-900/10 pt-8 group">
            <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-4 block">02 / Voyage & Land</span>
            <h2 className="font-serif text-3xl italic tracking-tight text-ink-900 mb-6 group-hover:opacity-70 transition-opacity">Island Day & Long Beach Cycle</h2>
            <p className="text-sm text-ink-700 leading-relaxed mb-6 opacity-80">
              For deeper exploration, reserve an Island Day—a private boat excursion adapted to the day's maritime conditions. If you prefer to stay on land, the Long Beach Cycle provides a lightly guided, slow-paced ride along the coast's longest unbroken stretch of sand.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="order-2 md:order-1 border-t border-ink-900/10 pt-8 group">
            <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-4 block">03 / Culinary & Respite</span>
            <h2 className="font-serif text-3xl italic tracking-tight text-ink-900 mb-6 group-hover:opacity-70 transition-opacity">Kitchen Session & Shore Picnic</h2>
            <p className="text-sm text-ink-700 leading-relaxed mb-6 opacity-80">
              Engage with our culinary philosophy through a small-group Dalisara Kitchen Session, exploring contemporary Filipino coastal techniques. Alternatively, reserve a private Shore Picnic prepared by the culinary team, set quietly at the coastal edge according to the tide and season.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-medium text-ink-900 hover:opacity-60 transition-opacity border-b border-ink-900/20 pb-2 group-hover:border-ink-900">
              Enquire <ArrowRight size={14} />
            </Link>
          </div>
          <div className="order-1 md:order-2 aspect-[4/3] overflow-hidden bg-sand-200">
            <LazyImage 
              src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200&h=900" 
              alt="Culinary Respite" 
              rootMargin="250px 0px"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
            />
          </div>
        </div>
      </section>
    </div>
  );
});

