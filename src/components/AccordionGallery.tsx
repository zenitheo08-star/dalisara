import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { LazyImage } from './LazyImage';

export interface AccordionGalleryItem {
  image: string;
  label: string;
  link?: string;
  subtitle?: string;
  category?: string;
}

export interface AccordionGalleryProps {
  items: AccordionGalleryItem[];
  defaultIndex?: number;
  expandRatio?: number;
  trigger?: 'hover' | 'click';
  className?: string;
  heightClassName?: string;
}

export const AccordionGallery = memo(function AccordionGallery({
  items,
  defaultIndex = 0,
  expandRatio = 0.52,
  trigger = 'hover',
  className,
  heightClassName = 'h-[480px] md:h-[620px]',
}: AccordionGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex);
  const shouldReduceMotion = useReducedMotion();

  const total = items.length;
  // Calculate collapsed width ratio per non-active item
  // If active gets expandRatio (e.g. 0.52), remaining (1 - expandRatio) is split equally among (total - 1) items
  const collapsedRatio = total > 1 ? (1 - expandRatio) / (total - 1) : 1;

  const handleInteraction = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <div
      className={cn(
        "w-full flex flex-col md:flex-row gap-2.5 md:gap-3 select-none",
        heightClassName,
        className
      )}
    >
      {items.map((item, idx) => {
        const isActive = activeIndex === idx;

        return (
          <motion.div
            key={idx}
            layout={!shouldReduceMotion}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            onMouseEnter={() => {
              if (trigger === 'hover') handleInteraction(idx);
            }}
            onClick={() => {
              if (trigger === 'click') handleInteraction(idx);
            }}
            style={{
              flex: isActive ? `${expandRatio * 100} 1 0%` : `${collapsedRatio * 100} 1 0%`,
            }}
            className={cn(
              "relative overflow-hidden rounded-2xl cursor-pointer group transition-[box-shadow,border-color] duration-500 focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:outline-none",
              "border border-ink-900/10 dark:border-white/10",
              isActive
                ? "shadow-2xl ring-1 ring-ink-900/20 dark:ring-white/25"
                : "opacity-85 hover:opacity-100"
            )}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleInteraction(idx);
              }
            }}
          >
            {/* Deferred Background Image with IntersectionObserver */}
            <LazyImage
              src={item.image}
              alt={item.label}
              rootMargin="250px 0px"
              wrapperClassName="absolute inset-0 w-full h-full"
              className={`w-full h-full object-cover object-center ${shouldReduceMotion ? '' : 'transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform'}`}
              style={{
                filter: isActive
                  ? 'grayscale(0%) contrast(1.05) brightness(0.95)'
                  : 'grayscale(35%) contrast(1) brightness(0.7)',
              }}
            />

            {/* Gradient Scrim */}
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-700 pointer-events-none",
                isActive
                  ? "bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                  : "bg-gradient-to-t from-black/85 via-black/40 to-black/20"
              )}
            />

            {/* Top Index Tag */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
              <span className="text-[11px] font-mono tracking-widest text-sand-50/80 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                0{idx + 1}
              </span>

              {item.category && (
                <span className="text-[10px] uppercase tracking-[0.25em] text-sand-50/70 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                  {item.category}
                </span>
              )}
            </div>

            {/* Vertical Label when Collapsed (Desktop only) */}
            <AnimatePresence>
              {!isActive && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  className="hidden md:flex absolute inset-0 items-end justify-center pb-8 pointer-events-none"
                >
                  <span className="[writing-mode:vertical-rl] rotate-180 font-serif text-lg tracking-widest text-sand-50/90 whitespace-nowrap drop-shadow-md">
                    {item.label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expanded Content Overlay */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10 flex flex-col justify-end text-sand-50"
                >
                  {item.subtitle && (
                    <span className="text-[11px] uppercase tracking-[0.3em] text-sand-50/70 mb-1.5 block">
                      {item.subtitle}
                    </span>
                  )}
                  
                  <h3 className="text-2xl md:text-4xl font-serif italic tracking-tight text-white mb-4 drop-shadow-md">
                    {item.label}
                  </h3>

                  {item.link && (
                    <div className="pt-2">
                      {item.link.startsWith('http') ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white text-sand-50 hover:text-ink-900 backdrop-blur-md border border-white/30 text-xs uppercase tracking-widest font-medium transition-all duration-300 group/btn shadow-lg focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:outline-none"
                        >
                          <span>Explore Experience</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </a>
                      ) : (
                        <Link
                          to={item.link}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white text-sand-50 hover:text-ink-900 backdrop-blur-md border border-white/30 text-xs uppercase tracking-widest font-medium transition-all duration-300 group/btn shadow-lg focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:outline-none"
                        >
                          <span>Explore Experience</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Link>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
});

export default AccordionGallery;

