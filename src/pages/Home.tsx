import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Compass, Sparkles, Waves } from 'lucide-react';
import { accommodations, galleryMoments } from '../data';
import { ParallaxImage } from '../components/ParallaxImage';
import { HeroParallax } from '../components/HeroParallax';
import AccordionGallery, { AccordionGalleryItem } from '../components/AccordionGallery';
import { ScrollExpand } from '../components/ScrollExpand';
import { RippleDistortion } from '../components/RippleDistortion';
import { LazyImage } from '../components/LazyImage';
import { SEO } from '../components/SEO';
import { AtmosphereCanvas } from '../components/AtmosphereCanvas';
import { FadeIn } from '../components/FadeIn';

const landscapeItems: AccordionGalleryItem[] = [
  { 
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=900&h=1200', 
    label: 'Arrival Grove', 
    link: '/about', 
    subtitle: 'Shaded inland approach & reception',
    category: 'Entrance'
  },
  { 
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=900&h=1200', 
    label: 'Grove Quarter', 
    link: '/stays', 
    subtitle: 'Quiet garden paths & interior canopy',
    category: 'Accommodation'
  },
  { 
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=900&h=1200', 
    label: 'Social Heart', 
    link: '/dining', 
    subtitle: 'The Shore Kitchen & Main Pool deck',
    category: 'Gathering'
  },
  { 
    image: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=80&w=900&h=1200', 
    label: 'Quiet North', 
    link: '/wellness', 
    subtitle: 'Wellness House & Movement Pavilion',
    category: 'Restoration'
  },
  { 
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=900&h=1200', 
    label: 'Shore Line', 
    link: '/stays', 
    subtitle: 'Western coastal band & Shore Pavilions',
    category: 'Coast'
  }
];

export const Home = memo(function Home() {
  const [isPressing, setIsPressing] = useState(false);
  const [videoSrc, setVideoSrc] = useState('/wave-pattern.mp4');

  useEffect(() => {
    const handleResize = () => {
      // Use landscape video on tablet/desktop (>= 768px)
      if (window.innerWidth >= 768) {
        setVideoSrc('/landscape-video.mp4');
      } else {
        setVideoSrc('/wave-pattern.mp4');
      }
    };
    handleResize(); // Initial check
    
    let timeoutId: number;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', throttledResize);
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="bg-sand-100 dark:bg-ink-950 relative transition-colors duration-1000">
      <SEO 
        title="Dalisara | The Slower Measure — San Vicente, Palawan"
        description="An upper-luxury coastal sanctuary in San Vicente, Palawan. Space to settle into the coast. Fictional portfolio project."
        canonical="/"
      />
      {/* Hero Section */}
      <section className="w-full h-[100vh] min-h-[100svh] relative flex flex-col overflow-hidden">
        {/* Absolute Background Video with Ripple Distortion */}
        <div className="absolute inset-0 w-full h-full z-0 bg-ink-950">
          <RippleDistortion 
            src={videoSrc}
            brushSize={140}
            strength={0.2}
            swirl={0.95}
            rings={4}
            spread={4}
            fade={3.2}
            spacing={15}
            dispersion={0.03}
            glint={0.4}
            tint="#0d9488"
            tintAmount={0.06}
            grayscale={false}
            trigger="hover"
            quality="high"
            className="w-full h-full opacity-90 cursor-crosshair"
          />
          {/* Contrast overlay to ensure text legibility over bright water */}
          <div className="absolute inset-0 bg-ink-950/35 dark:bg-ink-950/60 pointer-events-none transition-colors duration-300"></div>
          {/* Gradients to darken edges at top, and fade out smoothly to background at the bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/75 via-transparent to-sand-100 dark:to-[#070908] pointer-events-none transition-colors duration-300"></div>
          {/* Dedicated soft protective vignette for bottom room selections against foam */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-ink-950/70 via-ink-950/20 to-transparent pointer-events-none"></div>
        </div>

        <AtmosphereCanvas variant="coastal" intensity="subtle" className="opacity-40 z-0 pointer-events-none" />
        
        {/* Hero Content restricted to the first viewport height */}
        <div className="relative z-10 w-full h-[100vh] min-h-[700px] flex flex-col justify-end pb-12 pt-32 pointer-events-none">
          {/* Main Hero Content */}
          <div className="w-full px-6 md:px-12 max-w-[1600px] mx-auto flex flex-col items-center text-center justify-center flex-grow">
            <p className="text-[11px] md:text-xs uppercase tracking-[0.45em] mb-4 md:mb-6 text-white/90 font-medium hero-glow-subtle">
              San Vicente, Palawan
            </p>
            <h2 className="text-5xl md:text-[80px] lg:text-[108px] font-serif leading-[0.86] tracking-tighter text-white hero-glow-heading">
              The coast,<br/>
              <span className="italic font-light">at a slower measure.</span>
            </h2>
          </div>
          
          {/* Quick Nav at the bottom with spacious padding to clear floating action buttons */}
          <div className="w-full px-8 md:px-24 lg:px-32 max-w-[1600px] mx-auto mt-auto border-t border-white/25 pt-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-white pointer-events-auto">
             <Link to="/stays" className="group text-left border-l-2 border-white/0 hover:border-white/60 pl-4 py-1 transition-all">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/80 mb-1.5 block group-hover:text-white transition-colors font-medium">01 / Selection</span>
                <h3 className="text-xl md:text-2xl font-serif italic text-white group-hover:text-white/90 transition-colors hero-glow-subtle">Grove Pavilions</h3>
             </Link>
             <Link to="/stays" className="group text-left border-l-2 border-white/0 hover:border-white/60 pl-4 py-1 transition-all">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/80 mb-1.5 block group-hover:text-white transition-colors font-medium">02 / Selection</span>
                <h3 className="text-xl md:text-2xl font-serif italic text-white group-hover:text-white/90 transition-colors hero-glow-subtle">Pool Villas</h3>
             </Link>
             <Link to="/stays" className="group text-left border-l-2 border-white/0 hover:border-white/60 pl-4 py-1 transition-all">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/80 mb-1.5 block group-hover:text-white transition-colors font-medium">03 / Selection</span>
                <h3 className="text-xl md:text-2xl font-serif italic text-white group-hover:text-white/90 transition-colors hero-glow-subtle">Dalisara Houses</h3>
             </Link>
          </div>
        </div>

        {/* Cinematic Scroll Narrative */}
        <div className="relative z-10 w-full flex-grow flex flex-col justify-evenly items-center text-center py-32 pointer-events-none gap-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-white max-w-2xl px-6"
          >
            <p className="font-serif text-3xl md:text-5xl italic tracking-tight hero-glow-heading">
              Nothing but the horizon.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-white max-w-2xl px-6"
          >
            <p className="font-serif text-3xl md:text-5xl italic tracking-tight hero-glow-heading">
              Breathe with the tide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-white max-w-2xl px-6"
          >
            <p className="font-serif text-3xl md:text-5xl italic tracking-tight hero-glow-heading">
              Welcome to the sanctuary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <FadeIn className="py-32 px-6 md:px-12 max-w-5xl mx-auto text-center relative z-10 border-b border-ink-900/10 dark:border-white/10">
        <p className="font-serif text-3xl md:text-5xl italic tracking-tight leading-snug text-[#1A1A1A] dark:text-[#FCFAF5] mb-12 opacity-90">
          Dalisara is an independent upper-luxury coastal retreat in Palawan. 
          Designed around the principles of long horizons, seasonal honesty, 
          and material restraint.
        </p>
        <Link to="/about" className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-medium text-[#1A1A1A] dark:text-[#FCFAF5] hover:opacity-60 transition-all border-b border-ink-900/20 dark:border-white/20 pb-2">
          Our Philosophy <ArrowRight size={14} />
        </Link>
      </FadeIn>

      {/* Accommodations Preview */}
      <FadeIn className="py-24 bg-sand-50 dark:bg-ink-900 px-6 md:px-12 relative z-10 border-b border-ink-900/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-ink-900/10 dark:border-white/10 pb-8">
            <h2 className="font-serif text-5xl md:text-6xl italic tracking-tighter text-[#1A1A1A] dark:text-[#FCFAF5]">Sanctuary</h2>
            <Link to="/stays" className="mt-6 md:mt-0 inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-medium text-[#1A1A1A] dark:text-[#FCFAF5] hover:opacity-60 transition-all">
              Explore All Stays <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {accommodations.slice(0, 2).map((stay, index) => (
              <FadeIn key={stay.id} delay={index * 0.15}>
                <Link to={`/stays`} className="group flex flex-col block">
                  <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-sand-200 dark:bg-ink-950">
                    <LazyImage 
                      src={stay.images[0]} 
                      alt={stay.name} 
                      rootMargin="250px 0px"
                      wrapperClassName="w-full h-full"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 mix-blend-multiply dark:mix-blend-normal opacity-90 grayscale"
                    />
                  </div>
                  <h3 className="font-serif text-3xl italic tracking-tight text-[#1A1A1A] dark:text-[#FCFAF5] mb-2 group-hover:opacity-70 transition-colors">{stay.name}</h3>
                  <p className="text-[10px] uppercase tracking-[0.4em] opacity-60 text-[#1A1A1A] dark:text-[#FCFAF5] transition-colors">{stay.size} &mdash; {stay.view}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Interstitial Cinematic Scroll Expansion */}
      <section className="w-full border-b border-ink-900/10 dark:border-white/10 relative">
        <ScrollExpand
          mediaType="image"
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2400&h=1400"
          alt="Palawan Coastal Expanse"
          title="Where the horizon meets the canopy."
          scrollHint="Scroll to expand view"
          startWidth={48}
          startHeight={64}
          startRadius={20}
          endRadius={0}
          mediaZoom={1.25}
          scrollDistance={1.0}
          holdDistance={0.25}
          overlayScrim={0.5}
          useWindowScroll={true}
        >
          <div className="max-w-xl text-sand-50 space-y-6">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-sand-200">
              <Sparkles size={12} /> The Palawan Sanctuary
            </span>
            <p className="font-serif text-2xl md:text-4xl italic leading-snug">
              Immerse in the unfiltered stillness of San Vicente's untouched coastline.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-medium text-sand-50 hover:text-white border-b border-white/40 pb-1 transition-all"
            >
              Discover Our Sanctuary <ArrowRight size={13} />
            </Link>
          </div>
        </ScrollExpand>
      </section>

      {/* Visuals Gallery */}
      <HeroParallax products={galleryMoments} />

      {/* Accordion Gallery — Terrains & Coastal Sanctuaries */}
      <FadeIn className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-ink-900/10 dark:border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-ink-700 dark:text-sand-50/70 mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>San Vicente Biosphere</span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl italic tracking-tighter text-ink-900 dark:text-[#FCFAF5]">
              Landscapes &amp; Terrains
            </h2>
          </div>
          <p className="text-xs md:text-sm text-ink-700 dark:text-[#CFC9BE] max-w-md leading-relaxed">
            From the shaded canopy of the Arrival Grove to the open expanse of the western Shore Line. Hover across the map to discover the estate's layout.
          </p>
        </div>

        <AccordionGallery
          items={landscapeItems}
          defaultIndex={2}
          expandRatio={0.52}
          trigger="hover"
        />
      </FadeIn>

      {/* Dining & Wellness Preview */}
      <FadeIn className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="order-2 md:order-1 border-t border-ink-900/10 pt-8">
            <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-4 block">01 / Concept</span>
            <h2 className="font-serif text-5xl md:text-6xl italic tracking-tighter text-ink-900 mb-8">The Shore Kitchen</h2>
            <p className="text-sm text-ink-700 mb-12 leading-relaxed max-w-md opacity-80">
              Contemporary Filipino coastal cuisine. Sourced from the archipelago, guided by the seasons, and served with warmth.
            </p>
            <Link to="/dining" className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-medium text-ink-900 hover:opacity-60 transition-opacity border-b border-ink-900/20 pb-2">
              Dining Experiences <ArrowRight size={14} />
            </Link>
          </div>
          <div className="order-1 md:order-2 aspect-square overflow-hidden bg-sand-200">
            <LazyImage 
              src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200&h=1200" 
              alt="Dining at Dalisara" 
              rootMargin="250px 0px"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal opacity-90 grayscale"
            />
          </div>
        </div>
      </FadeIn>
    </div>
  );
});

