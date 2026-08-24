import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface AtmosphereCanvasProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'deep';
  variant?: 'coastal' | 'amber' | 'botanical';
}

export const AtmosphereCanvas: React.FC<AtmosphereCanvasProps> = ({
  className = '',
  intensity = 'subtle',
  variant = 'coastal',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 800);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palettes for atmospheric drift
    const colorSets = {
      coastal: [
        { r: 242, g: 237, b: 228, a: intensity === 'deep' ? 0.45 : 0.25 }, // warm sand
        { r: 215, g: 228, b: 226, a: intensity === 'deep' ? 0.35 : 0.18 }, // morning seafoam
        { r: 238, g: 220, b: 195, a: intensity === 'deep' ? 0.3 : 0.15 },  // low sun amber
      ],
      amber: [
        { r: 247, g: 236, b: 218, a: intensity === 'deep' ? 0.4 : 0.22 },
        { r: 235, g: 206, b: 172, a: intensity === 'deep' ? 0.35 : 0.18 },
        { r: 225, g: 190, b: 155, a: intensity === 'deep' ? 0.25 : 0.12 },
      ],
      botanical: [
        { r: 228, g: 236, b: 226, a: intensity === 'deep' ? 0.4 : 0.22 },
        { r: 210, g: 225, b: 215, a: intensity === 'deep' ? 0.35 : 0.18 },
        { r: 245, g: 239, b: 228, a: intensity === 'deep' ? 0.3 : 0.15 },
      ],
    };

    const colors = colorSets[variant];

    // Atmospheric nodes with harmonic speeds
    const nodes = [
      { x: width * 0.2, y: height * 0.3, radius: Math.max(width, height) * 0.55, vx: 0.0004, vy: 0.0006, phase: 0 },
      { x: width * 0.8, y: height * 0.7, radius: Math.max(width, height) * 0.6, vx: 0.0005, vy: 0.0003, phase: Math.PI / 3 },
      { x: width * 0.5, y: height * 0.5, radius: Math.max(width, height) * 0.7, vx: 0.0003, vy: 0.0005, phase: Math.PI * 0.8 },
    ];

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min(time - lastTime, 50);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Draw drifting radial gradients
      nodes.forEach((node, i) => {
        const color = colors[i % colors.length];
        const driftX = node.x + Math.sin(time * node.vx + node.phase) * (width * 0.15);
        const driftY = node.y + Math.cos(time * node.vy + node.phase) * (height * 0.15);

        const gradient = ctx.createRadialGradient(driftX, driftY, 0, driftX, driftY, node.radius);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * 0.5})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, variant, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <div 
        aria-hidden="true" 
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-sand-200/40 via-transparent to-sand-100/20 ${className}`} 
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full will-change-transform mix-blend-multiply dark:mix-blend-soft-light ${className}`}
    />
  );
};
