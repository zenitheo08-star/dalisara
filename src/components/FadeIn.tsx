import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  once?: boolean;
  key?: string | number;
}

export function FadeIn({
  children,
  delay = 0,
  className,
  direction = 'up',
  duration = 0.8,
  once = true,
}: FadeInProps) {
  const directionOffset = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directionOffset[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // cinematic ease out
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
