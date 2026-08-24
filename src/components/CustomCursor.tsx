import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';

// High-Performance 2D Heightmap Water Fluid Simulation
class WaterSim {
  width: number;
  height: number;
  size: number;
  map1: Float32Array;
  map2: Float32Array;
  imgData: ImageData;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.size = width * height;
    this.map1 = new Float32Array(this.size);
    this.map2 = new Float32Array(this.size);
    this.imgData = new ImageData(width, height);
  }

  disturb(x: number, y: number, radius: number, strength: number) {
    const rSq = radius * radius;
    const minX = Math.max(1, Math.floor(x - radius));
    const maxX = Math.min(this.width - 2, Math.ceil(x + radius));
    const minY = Math.max(1, Math.floor(y - radius));
    const maxY = Math.min(this.height - 2, Math.ceil(y + radius));

    for (let iy = minY; iy <= maxY; iy++) {
      for (let ix = minX; ix <= maxX; ix++) {
        const dSq = (ix - x) ** 2 + (iy - y) ** 2;
        if (dSq <= rSq) {
          this.map1[iy * this.width + ix] += strength * (1 - Math.sqrt(dSq) / radius);
        }
      }
    }
  }

  step() {
    const w = this.width;
    const h = this.height;
    const m1 = this.map1;
    const m2 = this.map2;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        let val = (m1[i - 1] + m1[i + 1] + m1[i - w] + m1[i + w]) * 0.5 - m2[i];
        
        let damping = 0.94; 
        
        const distToEdgeX = Math.min(x, w - 1 - x);
        const distToEdgeY = Math.min(y, h - 1 - y);
        const minEdgeDist = Math.min(distToEdgeX, distToEdgeY);
        
        if (minEdgeDist < 16) {
          damping *= minEdgeDist / 16;
        }
        
        val *= damping;
        m2[i] = val;
      }
    }

    this.map1 = m2;
    this.map2 = m1;
  }
}

const WATER_SCALE = 4;

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState<'default' | 'button' | 'link' | 'image' | 'text' | 'none'>('default');
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [isPressing, setIsPressing] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<WaterSim | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const hasMovedRef = useRef(false);

  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  
  // Directly driven motion values avoiding spring physics explosions
  const fishX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const fishY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const fishAngle = useMotionValue(0);
  const spineBend = useMotionValue(0);
  const torsoBend = useMotionValue(0);
  const tailBend = useMotionValue(0);
  
  const tailWiggle = useMotionValue(0);
  const finWiggle = useMotionValue(0);
  const finWiggleOpposite = useMotionValue(0);
  const whiskerLeftBend = useMotionValue(0);
  const whiskerRightBend = useMotionValue(0);
  const fishOffsetX = useMotionValue(0);
  const fishOffsetY = useMotionValue(0);
  
  // Animation states for the fish
  const swimPhase = useRef(0);
  const lastMoveTime = useRef(typeof performance !== 'undefined' ? performance.now() : 0);

  useEffect(() => {
    if (shouldReduceMotion || !isFinePointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let rafId: number;
    let lastBx = fishX.get();
    let lastBy = fishY.get();
    let vx = 0;
    let vy = 0;

    const handleResize = () => {
      if (!canvas) return;
      const w = Math.max(1, Math.floor(window.innerWidth / WATER_SCALE));
      const h = Math.max(1, Math.floor(window.innerHeight / WATER_SCALE));
      canvas.width = w;
      canvas.height = h;
      simRef.current = new WaterSim(w, h);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const loop = () => {
      if (!simRef.current) return;
      
      const tx = mouseX.get();
      const ty = mouseY.get();
      let bx = fishX.get();
      let by = fishY.get();

      // Steering behavior for natural momentum
      const dist = Math.hypot(tx - bx, ty - by);
      if (dist > 0.5) {
        const speedFactor = Math.min(dist * 0.06, 12);
        const targetVx = ((tx - bx) / dist) * speedFactor;
        const targetVy = ((ty - by) / dist) * speedFactor;
        vx += (targetVx - vx) * 0.08;
        vy += (targetVy - vy) * 0.08;
      } else {
        vx *= 0.9;
        vy *= 0.9;
      }
      
      bx += vx;
      by += vy;
      
      fishX.set(bx);
      fishY.set(by);

      const speed = Math.hypot(vx, vy);

      // We always calculate target angle if we are moving somewhat
      if (speed > 0.2) {
        lastMoveTime.current = performance.now();
        const targetAngle = Math.atan2(vy, vx) * (180 / Math.PI);
        let currentAngle = fishAngle.get();
        let diff = targetAngle - currentAngle;
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        // Natural turning inertia - slower turn at higher speeds
        const turnRate = Math.max(0.05, 0.15 - (speed * 0.005));
        fishAngle.set(currentAngle + diff * turnRate);
        
        // Reset offsets smoothly when actively moving
        fishOffsetX.set(fishOffsetX.get() * 0.9);
        fishOffsetY.set(fishOffsetY.get() * 0.9);

        // Dynamic procedural tail undulation based on speed
        // Wags faster when accelerating, slows to a gentle glide
        swimPhase.current += speed * 0.06 + 0.05;

        // Spine curvature that naturally bends into the turn
        const currentBend = spineBend.get();
        const turnSpeed = diff * turnRate;
        
        // Curves body into the turn
        const bend = currentBend * 0.85 - turnSpeed * 2.5;
        spineBend.set(bend);
        
        // Procedural multi-segment wave down the spine
        torsoBend.set(bend * 0.6 + Math.sin(swimPhase.current) * Math.min(speed * 0.8, 6));
        tailBend.set(bend * 0.8 + Math.sin(swimPhase.current - 1.2) * Math.min(speed * 1.5, 20));
        
        // Synchronized pectoral fin paddling
        finWiggle.set(Math.sin(swimPhase.current) * Math.min(speed * 1.2, 18));
        finWiggleOpposite.set(Math.sin(swimPhase.current + Math.PI) * Math.min(speed * 1.2, 18));
        
        // Whisker physics (bend against the turn and sway gently)
        whiskerLeftBend.set(turnSpeed * 2 + Math.sin(swimPhase.current * 1.5) * Math.min(speed * 0.5, 5));
        whiskerRightBend.set(turnSpeed * 2 - Math.sin(swimPhase.current * 1.5) * Math.min(speed * 0.5, 5));

        const simX = bx / WATER_SCALE;
        const simY = by / WATER_SCALE;
        
        simRef.current.disturb(simX, simY, 1.2, Math.min(speed * 1.5, 20));
        
        // Trailing wake behind fish
        const trailingDx = bx - vx * 2.0;
        const trailingDy = by - vy * 2.0;
        simRef.current.disturb(trailingDx / WATER_SCALE, trailingDy / WATER_SCALE, 1.5, -Math.min(speed * 1.0, 10));
      } else {
        // Smooth return to resting state
        spineBend.set(spineBend.get() * 0.92);
        torsoBend.set(torsoBend.get() * 0.92);
        tailBend.set(tailBend.get() * 0.92);
        finWiggle.set(finWiggle.get() * 0.92);
        finWiggleOpposite.set(finWiggleOpposite.get() * 0.92);
        whiskerLeftBend.set(whiskerLeftBend.get() * 0.92);
        whiskerRightBend.set(whiskerRightBend.get() * 0.92);

        // Fish AI Idle drifting
        const idleTime = performance.now() - lastMoveTime.current;
        if (idleTime > 1500) {
          const t = (idleTime - 1500) * 0.001; // seconds
          
          // Gentle floating offset
          const offsetX = Math.sin(t * 0.8) * 8;
          const offsetY = Math.sin(t * 1.2) * 5;
          
          // Blend into the drift smoothly over the first second
          const blend = Math.min(1, t);
          fishOffsetX.set(fishOffsetX.get() * (1 - blend) + offsetX * blend);
          fishOffsetY.set(fishOffsetY.get() * (1 - blend) + offsetY * blend);
          
          // Calculate angle for idle drift using derivative of offset
          const idleDx = Math.cos(t * 0.8) * 8 * 0.8;
          const idleDy = Math.cos(t * 1.2) * 5 * 1.2;
          const targetIdleAngle = Math.atan2(idleDy, idleDx) * (180 / Math.PI);
          
          let currentAngle = fishAngle.get();
          let diff = targetIdleAngle - currentAngle;
          while (diff < -180) diff += 360;
          while (diff > 180) diff -= 360;
          
          // Only apply idle rotation if we are strongly in idle phase
          fishAngle.set(currentAngle + diff * (0.02 * blend)); 
          
          // Very gentle tail flutter while drifting
          torsoBend.set(Math.sin(t * 2) * 2 * blend);
          tailBend.set(Math.sin(t * 2 - 1) * 6 * blend);
          finWiggle.set(Math.sin(t * 2) * 4 * blend);
          finWiggleOpposite.set(Math.sin(t * 2 + Math.PI) * 4 * blend);
          whiskerLeftBend.set(Math.sin(t * 1.5) * 5 * blend);
          whiskerRightBend.set(-Math.sin(t * 1.5) * 5 * blend);
        }
      }

                  simRef.current.step();

      const w = simRef.current.width;
      const h = simRef.current.height;
      const m1 = simRef.current.map1;
      const data = simRef.current.imgData.data;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          const sdx = m1[i + 1] - m1[i - 1];
          const sdy = m1[i + w] - m1[i - w];
          const px = i * 4;

          if (sdx === 0 && sdy === 0) {
            data[px + 3] = 0;
            continue;
          }

          const shade = sdx - sdy; 
          if (shade > 0) {
            data[px] = 255;
            data[px + 1] = 255;
            data[px + 2] = 255;
            data[px + 3] = Math.min(shade * 4, 160); 
          } else {
            data[px] = 10;
            data[px + 1] = 110;
            data[px + 2] = 160;
            data[px + 3] = Math.min(-shade * 3.5, 120); 
          }
        }
      }
      ctx.putImageData(simRef.current.imgData, 0, 0);

      lastBx = bx;
      lastBy = by;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [isFinePointer, shouldReduceMotion, fishX, fishY, mouseX, mouseY]);

  const triggerSplash = useCallback((x: number, y: number) => {
    if (simRef.current) {
      simRef.current.disturb(x / WATER_SCALE, y / WATER_SCALE, 3, 50);
      setTimeout(() => {
        if (simRef.current) {
          simRef.current.disturb(x / WATER_SCALE, y / WATER_SCALE, 2, -30);
        }
      }, 60);
    }
  }, []);

  useEffect(() => {
    const checkPointer = window.matchMedia('(pointer: fine)').matches;
    setIsFinePointer(checkPointer);
    if (!checkPointer || shouldReduceMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        fishX.set(e.clientX);
        fishY.set(e.clientY);
      } else {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsPressing(true);
      triggerSplash(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      setIsPressing(false);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest(
        'button, a, input, select, textarea, [role="button"], [data-cursor], .cursor-pointer'
      ) as HTMLElement | null;

      const imageContainer = target.closest('[data-cursor="view"], .group, [data-gallery-item]');
      const hideCursorContainer = target.closest('[data-cursor="none"]');

      if (hideCursorContainer) {
        setIsHovering(false);
        setHoverType('none');
        setHoverLabel(null);
      } else if (imageContainer && !target.closest('button, a, input')) {
        setIsHovering(true);
        setHoverType('image');
        setHoverLabel(imageContainer.getAttribute('data-cursor-label') || 'EXPLORE');
      } else if (interactiveEl) {
        setIsHovering(true);
        const tag = interactiveEl.tagName.toLowerCase();
        if (tag === 'button' || interactiveEl.getAttribute('role') === 'button') {
          setHoverType('button');
        } else if (tag === 'a') {
          setHoverType('link');
        } else if (['input', 'textarea', 'select'].includes(tag)) {
          setHoverType('text');
        } else {
          setHoverType('button');
        }
        setHoverLabel(interactiveEl.getAttribute('data-cursor-label') || null);
      } else {
        setIsHovering(false);
        setHoverType('default');
        setHoverLabel(null);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = (e: MouseEvent) => {
      setIsVisible(true);
      if (e.clientX !== undefined && e.clientY !== undefined) {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        if (!hasMovedRef.current) {
          fishX.set(e.clientX);
          fishY.set(e.clientY);
          hasMovedRef.current = true;
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('mouseenter', onMouseEnter, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible, shouldReduceMotion, mouseX, mouseY, fishX, fishY, triggerSplash]);

  if (!isFinePointer || shouldReduceMotion || typeof window === 'undefined') {
    return null;
  }

  const showFish = isVisible && hoverType !== 'none';

  return createPortal(
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 mix-blend-normal z-[999998]"
        style={{ width: '100vw', height: '100vh', filter: 'blur(1px)' }}
      />

      

      {/* Global style to hide the default cursor */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (pointer: fine) {
          body, body *, a, button, input, select, textarea, [role="button"] {
            cursor: none !important;
          }
        }
      `}} />

      {/* The Customized Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[999999] flex items-center justify-center w-0 h-0 mix-blend-difference"
        style={{ x: mouseX, y: mouseY }}
        animate={{ opacity: showFish ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Outer Ring */}
        <motion.div
          className="absolute w-5 h-5 rounded-full border-[1.5px] border-white"
          animate={{ 
            scale: isPressing ? 0.7 : (hoverType !== 'default' && hoverType !== 'none' ? 1.5 : 1),
            opacity: hoverType === 'text' ? 0 : 1
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
        {/* Inner Dot */}
        <motion.div
          className="absolute w-1.5 h-1.5 bg-white rounded-full"
          animate={{ 
            scale: hoverType === 'text' ? 0 : (isPressing ? 0.5 : (hoverType !== 'default' && hoverType !== 'none' ? 0 : 1)),
            opacity: hoverType !== 'default' && hoverType !== 'none' ? 0 : 1
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
        {/* Text Beam (only shows for text inputs) */}
        <motion.div
          className="absolute w-[2px] h-5 bg-white rounded-full"
          animate={{
            opacity: hoverType === 'text' ? 1 : 0,
            scaleY: hoverType === 'text' ? 1 : 0
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      </motion.div>

      {/* The Fish */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none will-change-transform flex items-center justify-center w-0 h-0 z-[999999]"
        style={{
          x: fishX,
          y: fishY,
        }}
        animate={{
          opacity: showFish ? 1 : 0,
          scale: showFish ? (isPressing ? 0.8 : 1) : 0,
        }}
        transition={{ opacity: { duration: 0.2 }, scale: { type: 'spring' } }}
      >
        <motion.div style={{ x: fishOffsetX, y: fishOffsetY, rotate: fishAngle }}>
          <motion.div className="relative flex items-center justify-center" style={{ x: -43, y: -27 }}>
            <svg width="60" height="50" viewBox="0 0 90 76" fill="none" className="drop-shadow-2xl transition-colors duration-700" style={{ overflow: 'visible' }}>
              <defs>
                <clipPath id="koi-body-flowing">
                  <path d="M 20 38 C 35 28, 55 30, 62 34 C 68 37, 68 39, 62 42 C 55 46, 35 48, 20 38 Z" />
                </clipPath>
              </defs>
              
              {/* === BODY & FINS GROUP === */}
              <motion.g style={{ rotate: torsoBend, transformOrigin: '40px 38px' }}>
                
                {/* === TAIL GROUP (Nested inside torso so it follows the body's bend) === */}
                <motion.g style={{ rotate: tailBend, transformOrigin: '22px 38px' }}>
                  <path d="M 23 38 C 10 23, -5 28, 0 38 C -5 48, 10 53, 23 38 Z" className="fill-[#070908]/90 dark:fill-white/90 transition-colors duration-700" />
                </motion.g>

                {/* Pelvic Fins */}
                <path d="M 35 33 C 25 18, 15 15, 12 23 C 18 25, 25 29, 30 33 Z" className="fill-[#0f141a]/90 dark:fill-white/90 transition-colors duration-700" />
                <path d="M 35 43 C 25 58, 15 61, 12 53 C 18 51, 25 47, 30 43 Z" className="fill-[#0f141a]/90 dark:fill-white/90 transition-colors duration-700" />

                {/* Body Base */}
                <path d="M 20 38 C 35 28, 55 30, 62 34 C 68 37, 68 39, 62 42 C 55 46, 35 48, 20 38 Z" className="fill-[#0f141a] dark:fill-white transition-colors duration-700" />
                
                {/* Patterns */}
                <g clipPath="url(#koi-body-flowing)">
                  <circle cx="35" cy="38" r="7" className="fill-black dark:fill-[#e2e8f0] transition-colors duration-700" />
                  <circle cx="48" cy="41" r="6" className="fill-black/80 dark:fill-[#cbd5e1] transition-colors duration-700" />
                  <circle cx="55" cy="33" r="4.5" className="fill-black/90 dark:fill-[#f8fafc] transition-colors duration-700" />
                  <circle cx="40" cy="31" r="4" className="fill-black dark:fill-[#e2e8f0] transition-colors duration-700" />
                  <circle cx="28" cy="41" r="3" className="fill-[#1a2333] dark:fill-white/60 transition-colors duration-700" />
                </g>
              </motion.g>

              {/* === HEAD & PECTORAL FINS GROUP === */}
              <motion.g style={{ rotate: finWiggle, transformOrigin: '50px 31px' }}>
                <path d="M 50 31 C 45 15, 25 5, 18 12 C 30 18, 40 25, 45 30 Z" className="fill-[#0f141a]/90 dark:fill-white/90 transition-colors duration-700" />
              </motion.g>
              <motion.g style={{ rotate: finWiggleOpposite, transformOrigin: '50px 45px' }}>
                <path d="M 50 45 C 45 61, 25 71, 18 64 C 30 58, 40 51, 45 46 Z" className="fill-[#0f141a]/90 dark:fill-white/90 transition-colors duration-700" />
              </motion.g>
              
              {/* Eyes */}
              <circle cx="58" cy="34" r="1.5" className="fill-white dark:fill-[#070908] transition-colors duration-700" />
              <circle cx="58" cy="42" r="1.5" className="fill-white dark:fill-[#070908] transition-colors duration-700" />
              <circle cx="58" cy="34" r="2.5" className="fill-transparent stroke-white/50 dark:stroke-[#070908]/50 transition-colors duration-700" strokeWidth="0.5" />
              <circle cx="58" cy="42" r="2.5" className="fill-transparent stroke-white/50 dark:stroke-[#070908]/50 transition-colors duration-700" strokeWidth="0.5" />
              
              {/* Whiskers */}
              <path d="M 62 35 C 70 28, 78 33, 85 25" className="stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" fill="none" strokeWidth="0.75" />
              <path d="M 62 41 C 70 48, 78 43, 85 51" className="stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" fill="none" strokeWidth="0.75" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      

      <AnimatePresence>
        {hoverType === 'image' && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none flex items-center justify-center z-40 w-0 h-0"
            style={{
              x: mouseX,
              y: mouseY,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 + 36, x: 22 }}
              animate={{ opacity: 1, scale: 1, y: 36, x: 36 }}
              exit={{ opacity: 0, scale: 0.85, y: 5 + 36, x: 22 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center justify-center whitespace-nowrap"
            >
              <span className="font-serif italic text-[10px] tracking-[0.22em] uppercase font-medium text-sand-50 bg-[#141210]/90 px-3.5 py-1.5 rounded-full shadow-2xl backdrop-blur-md border border-sand-50/20">
                {hoverLabel || 'EXPLORE'}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </>,
    document.body
  );
}
