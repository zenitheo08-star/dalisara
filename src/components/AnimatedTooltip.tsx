"use client";

import React, { useState, useRef, useCallback, memo } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";

export interface TooltipItem {
  id: number;
  name: string;
  designation: string;
  image: string;
}

export const AnimatedTooltip = memo(function AnimatedTooltip({
  items,
}: {
  items: TooltipItem[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const animationFrameRef = useRef<number | null>(null);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLImageElement>) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const currentTarget = event.currentTarget;
    const offsetX = event.nativeEvent.offsetX;

    animationFrameRef.current = requestAnimationFrame(() => {
      if (currentTarget) {
        const halfWidth = currentTarget.offsetWidth / 2;
        x.set(offsetX - halfWidth);
      }
    });
  }, [x]);

  return (
    <div className="flex items-center">
      {items.map((item) => (
        <div
          className="group relative -mr-3.5 cursor-pointer"
          key={item.id}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 15, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-xl bg-ink-900/95 dark:bg-[#070908]/95 px-4 py-2 text-xs shadow-2xl backdrop-blur-md border border-white/15 pointer-events-none"
              >
                <div className="absolute inset-x-8 -bottom-px z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sand-200 to-transparent opacity-50" />
                <div className="relative z-30 text-sm font-serif font-medium text-sand-50 tracking-wide">
                  {item.name}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-sand-200/80 font-mono mt-0.5">
                  {item.designation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <img
            onMouseMove={handleMouseMove}
            height={56}
            width={56}
            src={item.image}
            alt={item.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="relative !m-0 h-12 w-12 rounded-full border-2 border-sand-50 dark:border-[#1A1D1A] object-cover object-center !p-0 shadow-md transition-all duration-300 group-hover:z-30 group-hover:scale-110 group-hover:border-ink-900 dark:group-hover:border-sand-50"
          />
        </div>
      ))}
    </div>
  );
});

export default AnimatedTooltip;

