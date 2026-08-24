import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, HTMLMotionProps, useReducedMotion } from 'motion/react';
import { Link, LinkProps } from 'react-router-dom';
import { cn } from '../lib/utils';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface TouchRippleLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  rippleColor?: string;
  activeScale?: number;
}

export function TouchRippleLink({
  children,
  className,
  containerClassName,
  rippleColor,
  activeScale = 0.98,
  onClick,
  ...props
}: TouchRippleLinkProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2.2;
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev.slice(-3), newRipple]);

    // Physical haptic pulse on mobile devices
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Safe failover
      }
    }
  }, [shouldReduceMotion]);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <motion.div
      whileTap={shouldReduceMotion ? undefined : { scale: activeScale }}
      transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
      className={cn("inline-block", containerClassName)}
    >
      <Link
        {...props}
        onPointerDown={handlePointerDown}
        onClick={onClick}
        className={cn(
          "relative overflow-hidden block select-none touch-manipulation",
          className
        )}
      >
        {children}

        {/* Luminous Ripple Container */}
        {!shouldReduceMotion && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
            <AnimatePresence>
              {ripples.map((ripple) => (
                <motion.span
                  key={ripple.id}
                  initial={{ scale: 0.1, opacity: 0.45 }}
                  animate={{ scale: 1, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  onAnimationComplete={() => removeRipple(ripple.id)}
                  style={{
                    position: 'absolute',
                    left: ripple.x - ripple.size / 2,
                    top: ripple.y - ripple.size / 2,
                    width: ripple.size,
                    height: ripple.size,
                  }}
                  className={cn(
                    "rounded-full pointer-events-none",
                    rippleColor || "bg-ink-900/12 dark:bg-white/20 dark:shadow-[0_0_24px_rgba(255,255,255,0.35)]"
                  )}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export interface TouchRippleButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
  rippleColor?: string;
  activeScale?: number;
}

export function TouchRippleButton({
  children,
  className,
  rippleColor,
  activeScale = 0.94,
  onClick,
  onPointerDown,
  ...props
}: TouchRippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerDown?.(e);
    if (shouldReduceMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2.2;
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev.slice(-3), newRipple]);

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Safe failover
      }
    }
  }, [onPointerDown, shouldReduceMotion]);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <motion.button
      whileTap={shouldReduceMotion ? undefined : { scale: activeScale }}
      transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
      onPointerDown={handlePointerDown}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden select-none touch-manipulation",
        className
      )}
      {...props}
    >
      {children}

      {!shouldReduceMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                initial={{ scale: 0.1, opacity: 0.45 }}
                animate={{ scale: 1, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                onAnimationComplete={() => removeRipple(ripple.id)}
                style={{
                  position: 'absolute',
                  left: ripple.x - ripple.size / 2,
                  top: ripple.y - ripple.size / 2,
                  width: ripple.size,
                  height: ripple.size,
                }}
                className={cn(
                  "rounded-full pointer-events-none",
                  rippleColor || "bg-ink-900/15 dark:bg-white/25 dark:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                )}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.button>
  );
}
