import { useState } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent } from 'motion/react';

export function ScrollProgress() {
  const { scrollY, scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  // Smooth out the scroll progress for a luxurious, physics-driven feel
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Only reveal the scroll indicator after the user begins scrolling down
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (typeof latest === 'number') {
      setIsVisible(latest > 30);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[60] pointer-events-none h-[2px] overflow-hidden"
    >
      {/* Background track shimmer for ultra-refined editorial depth */}
      <div className="absolute inset-0 bg-ink-900/[0.04] dark:bg-white/[0.06]" />

      {/* Dynamic Progress Bar */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%' }}
        className="h-full w-full bg-gradient-to-r from-ink-900/80 via-ink-900 to-ink-800 dark:from-[#D4CFC2]/70 dark:via-[#FCFAF5] dark:to-[#FFFFFF] shadow-[0_1px_8px_rgba(26,26,26,0.15)] dark:shadow-[0_0_12px_rgba(252,250,245,0.45)]"
      />
    </motion.div>
  );
}
