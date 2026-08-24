import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { accommodations, formatPrice } from '../data';
import { ArrowRight, X, Check, ArrowUpRight, Waves } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';
import { RippleDistortion } from '../components/RippleDistortion';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from 'motion/react';
import { SEO } from '../components/SEO';
import { useBooking } from '../store';
import { FadeIn } from '../components/FadeIn';

export const Stays = memo(function Stays() {
  const { setBookingModalOpen, selectAccommodation } = useBooking();
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleToggleCompare = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 3) return prev; // Max 3
      return [...prev, id];
    });
  };

  const clearComparison = () => {
    setSelectedForCompare([]);
    setShowCompareModal(false);
  };

  const comparedStays = accommodations.filter(a => selectedForCompare.includes(a.id));

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowCompareModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showCompareModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showCompareModal]);

  return (
    <div className="bg-sand-100 dark:bg-ink-950 pt-32 pb-24 min-h-screen">
      <SEO 
        title="Sanctuary Pavilions & Villas | Dalisara"
        description="Thirty-two private pavilions and villas overlooking the Sulu Sea. Private plunge pools, outdoor garden showers, and sustainable native timber architecture."
        canonical="/stays"
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <header className="mb-24 md:w-2/3 border-b border-ink-900/10 dark:border-white/10 pb-12">
          <p className="text-[10px] uppercase tracking-[0.4em] mb-4 opacity-60">Selections</p>
          <h1 className="font-serif text-6xl md:text-[80px] leading-none tracking-tighter italic text-ink-900 dark:text-[#FCFAF5] mb-8">Accommodations</h1>
          <p className="text-sm text-ink-700 dark:text-[#CFC9BE] leading-relaxed max-w-lg opacity-80">
            Thirty-two private pavilions and villas, designed to frame the coast. 
            Material restraint and generous space allow the landscape to remain the focus.
          </p>
        </header>

        <div className="flex flex-col gap-32">
          {accommodations.map((stay, index) => {
            const isSelected = selectedForCompare.includes(stay.id);
            const isMaxReached = selectedForCompare.length >= 3 && !isSelected;
            // Only apply water ripple effect if the accommodation features a water element (pool/oceanfront)
            const hasWater = stay.id.includes('pool') || stay.id === 'dalisara-house' || stay.id === 'shore-pavilion';

            return (
              <FadeIn key={stay.id} direction={index % 2 === 0 ? 'left' : 'right'} className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                
                <div className={`md:col-span-7 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <Link to={`/stays/${stay.id}`} className="block relative aspect-[4/3] rounded-2xl overflow-hidden group bg-sand-200 dark:bg-ink-900 border border-ink-900/10 dark:border-white/10 focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:outline-none">
                    {hasWater ? (
                      <div className="w-full h-full relative cursor-crosshair">
                        <RippleDistortion 
                          src={stay.images[0]}
                          brushSize={130}
                          strength={0.2}
                          swirl={1.0}
                          rings={4}
                          spread={4.2}
                          fade={2.5}
                          spacing={12}
                          dispersion={0.02}
                          glint={0.3}
                          tint="#0d9488"
                          tintAmount={0.07}
                          grayscale={false}
                          trigger="hover"
                          quality="medium"
                          className="w-full h-full"
                        />
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-widest text-white/90 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                          <Waves size={11} className="text-teal-400" />
                          <span>Interactive Pool Water</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <LazyImage 
                          src={stay.images[0]} 
                          alt={stay.name} 
                          rootMargin="250px 0px"
                          wrapperClassName="w-full h-full"
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-ink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    )}
                  </Link>
                </div>

                <div className={`md:col-span-5 flex flex-col ${index % 2 === 1 ? 'md:order-1 md:items-end md:text-right' : ''}`}>
                  <div className="text-[10px] uppercase tracking-[0.4em] opacity-60 mb-4">{stay.size} &mdash; {stay.occupancy}</div>
                  <h2 className="font-serif text-5xl italic tracking-tighter text-ink-900 dark:text-[#FCFAF5] mb-6">{stay.name}</h2>
                  <p className="text-sm text-ink-700 dark:text-[#CFC9BE] mb-8 leading-relaxed max-w-md opacity-80">{stay.description}</p>
                  <div className="mb-12">
                    <div className="text-[10px] uppercase tracking-[0.4em] opacity-60 mb-1">Starting from</div>
                    <div className="text-xl text-ink-900 dark:text-[#FCFAF5]">{formatPrice(stay.price)} <span className="text-[10px] text-ink-900 dark:text-[#FCFAF5] uppercase tracking-[0.2em] ml-2">/ night</span></div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <button 
                      onClick={() => {
                        selectAccommodation(stay.id);
                        setBookingModalOpen(true);
                      }}
                      className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-medium text-ink-900 dark:text-[#FCFAF5] hover:opacity-60 transition-opacity border-b border-ink-900/20 dark:border-white/20 pb-2 group-hover:border-ink-900 focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:outline-none"
                    >
                      Reserve <ArrowRight size={14} />
                    </button>
                    <button 
                      onClick={() => handleToggleCompare(stay.id)}
                      disabled={isMaxReached}
                      className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-medium transition-opacity border-b pb-2 focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:outline-none ${isSelected ? 'text-ink-900 dark:text-[#FCFAF5] border-ink-900 dark:border-white' : 'text-ink-700 dark:text-[#CFC9BE] border-transparent hover:border-ink-900/20 dark:hover:border-white/20'} ${isMaxReached ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      {isSelected ? <Check size={14} /> : '+'} {isSelected ? 'Selected' : 'Compare'}
                    </button>
                  </div>
                </div>

              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Dock for Comparison */}
      <AnimatePresence>
        {selectedForCompare.length > 0 && (
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 100, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none"
          >
            <div className="max-w-xl mx-auto bg-sand-50 shadow-2xl border border-ink-900/10 p-4 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-ink-900">{selectedForCompare.length} selected</span>
                <button onClick={clearComparison} className="text-xs text-ink-700 hover:text-ink-900 transition-colors focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:outline-none">Clear</button>
              </div>
              <button 
                onClick={() => setShowCompareModal(true)}
                disabled={selectedForCompare.length < 2}
                className={`px-6 py-3 text-[10px] uppercase tracking-[0.3em] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:outline-none ${selectedForCompare.length >= 2 ? 'bg-ink-900 text-sand-50 hover:bg-ink-800' : 'bg-ink-900/10 text-ink-900/50 cursor-not-allowed'}`}
              >
                Compare Sanctuaries
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-ink-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
              className="bg-sand-50 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
              role="dialog"
              aria-modal="true"
              aria-labelledby="comparison-title"
            >
              <div className="sticky top-0 bg-sand-50/95 backdrop-blur z-20 p-6 md:p-8 border-b border-ink-900/10 flex items-center justify-between">
                <h2 id="comparison-title" className="font-serif text-3xl italic tracking-tight text-ink-900">Compare Sanctuaries</h2>
                <button 
                  onClick={() => setShowCompareModal(false)}
                  className="p-2 text-ink-700 hover:text-ink-900 transition-colors focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:outline-none"
                  aria-label="Close comparison"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-8 pb-6 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
                  {comparedStays.map(stay => (
                    <div key={stay.id} className="w-[85vw] md:w-auto shrink-0 snap-center md:flex-1 min-w-[280px]">
                      <div className="aspect-[4/3] bg-sand-200 mb-6 overflow-hidden relative">
                        <LazyImage 
                          src={stay.images[0]} 
                          alt={stay.name} 
                          className="w-full h-full object-cover" 
                          rootMargin="100px" 
                          wrapperClassName="w-full h-full" 
                        />
                      </div>
                      <h3 className="font-serif text-2xl italic tracking-tight text-ink-900 mb-2">{stay.name}</h3>
                      <div className="text-lg text-ink-900 mb-8">{formatPrice(stay.price)} <span className="text-xs uppercase tracking-[0.2em] opacity-60">/ night</span></div>
                      
                      <div className="space-y-6 text-sm text-ink-700">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-1">Area</div>
                          <div className="font-medium text-ink-900">{stay.size}</div>
                        </div>
                        <div className="h-px w-full bg-ink-900/10"></div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-1">Capacity</div>
                          <div className="font-medium text-ink-900">{stay.occupancy}</div>
                        </div>
                        <div className="h-px w-full bg-ink-900/10"></div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-1">Bedding</div>
                          <div className="font-medium text-ink-900">{stay.bed}</div>
                        </div>
                        <div className="h-px w-full bg-ink-900/10"></div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-1">View Orientation</div>
                          <div className="font-medium text-ink-900">{stay.view}</div>
                        </div>
                        <div className="h-px w-full bg-ink-900/10"></div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-3">Amenities</div>
                          <ul className="space-y-2">
                            {stay.features.slice(0, 4).map((feature, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-ink-900/40 mt-1">•</span> {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-12">
                        <button 
                          onClick={() => {
                            selectAccommodation(stay.id);
                            setShowCompareModal(false);
                            setBookingModalOpen(true);
                          }}
                          className="flex items-center justify-center gap-2 w-full py-4 bg-ink-900 text-sand-50 text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-ink-800 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink-900 focus-visible:outline-none"
                        >
                          Book Sanctuary <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

