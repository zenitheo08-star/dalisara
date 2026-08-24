import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Geometry, Triangle, Texture, RenderTarget } from 'ogl';
import './RippleDistortion.css';

const MAX_WAVES = 100;
const QUALITY_SCALE = { low: 0.5, medium: 1.0, high: 1.5 } as const;
const START_SCALE = 1.5;
const LIFE_CONSTANT = Math.log(500);

const waveVertex = `
precision highp float;

attribute vec2 position;
attribute vec2 uv;
attribute vec2 iOffset;
attribute vec2 iScale;
attribute float iOpacity;

varying vec2 vUv;
varying float vOpacity;

void main() {
  vUv = uv;
  vOpacity = iOpacity;
  gl_Position = vec4(iOffset + position * iScale, 0.0, 1.0);
}
`;

const waveFragment = `
precision highp float;

varying vec2 vUv;
varying float vOpacity;

uniform float uRings;

const float PI = 3.141592653589793;
const float EDGE = 0.006737947;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = dot(p, p);
  if (r > 1.0) discard;

  float brush = (exp(-r * 5.0) - EDGE) / (1.0 - EDGE);

  brush *= 0.55 + 0.45 * cos(sqrt(r) * PI * 2.0 * uRings);

  gl_FragColor = vec4(vec3(brush * vOpacity * vOpacity), 1.0);
}
`;

const screenVertex = `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const compositeFragment = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uTexel;
uniform vec3 uTint;
uniform vec3 uHighlight;
uniform float uStrength;
uniform float uSwirl;
uniform float uDispersion;
uniform float uGlint;
uniform float uTintAmount;
uniform float uGrayscale;

const float TAU = 6.283185307179586;

vec2 coverUV(vec2 uv) {
  vec2 safe = max(uTextureSize, vec2(1.0));
  vec2 s = uResolution / safe;
  vec2 scaledSize = safe * max(s.x, s.y);
  vec2 offset = (uResolution - scaledSize) * 0.5;
  return (uv * uResolution - offset) / scaledSize;
}

// Ultra-smooth Catmull-Rom Bicubic filtering for high-resolution video textures
vec4 sampleBicubic(sampler2D tex, vec2 uv, vec2 size) {
  vec2 texel = 1.0 / size;
  vec2 coord = uv * size - 0.5;
  vec2 f = fract(coord);
  vec2 f2 = f * f;
  vec2 f3 = f2 * f;

  vec2 w0 = f2 - 0.5 * (f3 + f);
  vec2 w1 = 1.5 * f3 - 2.5 * f2 + 1.0;
  vec2 w3 = 0.5 * (f3 - f2);
  vec2 w2 = 1.0 - w0 - w1 - w3;

  vec2 s0 = w0 + w1;
  vec2 s1 = w2 + w3;

  vec2 f0 = w1 / max(w0 + w1, 0.0001);
  vec2 f1 = w3 / max(w2 + w3, 0.0001);

  vec2 t0 = (floor(coord) - 0.5 + f0) * texel;
  vec2 t1 = (floor(coord) + 1.5 + f1) * texel;

  return (
    texture2D(tex, vec2(t0.x, t0.y)) * s0.x * s0.y +
    texture2D(tex, vec2(t1.x, t0.y)) * s1.x * s0.y +
    texture2D(tex, vec2(t0.x, t1.y)) * s0.x * s1.y +
    texture2D(tex, vec2(t1.x, t1.y)) * s1.x * s1.y
  );
}

void main() {
  float amount = texture2D(uDisplacement, vUv).r;
  vec2 base = coverUV(vUv);

  float theta = amount * uSwirl * TAU;
  vec2 dir = vec2(sin(theta), cos(theta));
  vec2 push = dir * amount * uStrength;

  vec3 color;
  if (uDispersion > 0.001) {
    float split = uDispersion * 0.25;
    color.r = sampleBicubic(uTexture, base + push * (1.0 + split), uTextureSize).r;
    color.g = sampleBicubic(uTexture, base + push, uTextureSize).g;
    color.b = sampleBicubic(uTexture, base + push * (1.0 - split), uTextureSize).b;
  } else {
    color = sampleBicubic(uTexture, base + push, uTextureSize).rgb;
  }

  if (uGrayscale > 0.001) {
    color = mix(color, vec3(dot(color, vec3(0.2126, 0.7152, 0.0722))), uGrayscale);
  }

  if (uTintAmount > 0.001) {
    color = mix(color, color * uTint * 1.9, clamp(amount * 1.6, 0.0, 1.0) * uTintAmount);
  }

  if (uGlint > 0.001) {
    float ex = texture2D(uDisplacement, vUv + vec2(uTexel.x, 0.0)).r - texture2D(uDisplacement, vUv - vec2(uTexel.x, 0.0)).r;
    float ey = texture2D(uDisplacement, vUv + vec2(0.0, uTexel.y)).r - texture2D(uDisplacement, vUv - vec2(0.0, uTexel.y)).r;
    vec3 normal = normalize(vec3(-ex * 26.0, -ey * 26.0, 1.0));
    vec3 light = normalize(vec3(-0.35, 0.55, 1.0));
    float raw = pow(max(dot(normal, light), 0.0), 22.0);
    float flatSpec = pow(max(light.z, 0.0), 22.0);
    color += uHighlight * clamp((raw - flatSpec) / max(1.0 - flatSpec, 0.0001), 0.0, 1.0) * uGlint;
  }

  gl_FragColor = vec4(color, 1.0);
}
`;

const hexToRGB = (hex: string): [number, number, number] => {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map(c => c + c)
          .join('')
      : clean;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return [1, 1, 1];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export interface RippleDistortionProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  brushSize?: number;
  strength?: number;
  swirl?: number;
  rings?: number;
  spread?: number;
  fade?: number;
  spacing?: number;
  dispersion?: number;
  glint?: number;
  tint?: string;
  tintAmount?: number;
  grayscale?: boolean;
  highlightColor?: string;
  trigger?: 'hover' | 'click' | 'both';
  clickStrength?: number;
  quality?: 'low' | 'medium' | 'high';
  enabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const RippleDistortion: React.FC<RippleDistortionProps> = ({
  src = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2000',
  brushSize = 150,
  strength = 0.2,
  swirl = 1,
  rings = 4,
  spread = 5,
  fade = 3,
  spacing = 15,
  dispersion = 0.02,
  glint = 0.3,
  tint = '#0d9488',
  tintAmount = 0.08,
  grayscale = false,
  highlightColor = '#ffffff',
  trigger = 'hover',
  clickStrength = 2,
  quality = 'medium',
  enabled = true,
  className = '',
  style
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const configRef = useRef({ brushSize, spread, fade, spacing, clickStrength, trigger, enabled });
  const uniformsRef = useRef<any>(null);
  
  const [isHovering, setIsHovering] = useState(false);
  const customCursorRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<SVGGElement>(null);
  const tailBaseRef = useRef<SVGGElement>(null);
  const torsoRef = useRef<SVGGElement>(null);
  const leftFinRef = useRef<SVGGElement>(null);
  const rightFinRef = useRef<SVGGElement>(null);
  const bodyGroupRef = useRef<SVGGElement>(null);
  const cursorState = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, targetX: 0, targetY: 0, angle: 0, speed: 0, swimCycle: 0, turnVelocity: 0 });

  configRef.current = { brushSize, spread, fade, spacing, clickStrength, trigger, enabled };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new Renderer({
      alpha: false,
      antialias: false,
      dpr: Math.max(2, window.devicePixelRatio || 1)
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    mount.appendChild(canvas);

    const imageTexture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE
    });

    let disposed = false;
    let video: HTMLVideoElement | null = null;
    let isVideo = src.includes('.mp4');

    if (isVideo) {
      video = document.createElement('video');
      if (src.startsWith('http')) {
        video.crossOrigin = 'anonymous';
      }
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;
      video.preload = 'auto';
      
      const handleVideoLoad = () => {
        if (disposed || !video) return;
        // Only set it once we actually have video dimensions to avoid WebGL errors
        if (video.videoWidth > 0) {
          imageTexture.image = video;
          compositeUniforms.uTextureSize.value = [video.videoWidth, video.videoHeight];
          video.play().catch(() => {});
        }
      };

      video.addEventListener('loadeddata', handleVideoLoad);
      video.addEventListener('canplay', handleVideoLoad);
      video.addEventListener('canplaythrough', handleVideoLoad);

      video.src = src;
      video.load();
    } else {
      const image = new window.Image();
      if (src.startsWith('http')) {
        image.crossOrigin = 'anonymous';
      }
      image.decoding = 'async';
      image.onload = () => {
        if (disposed) return;
        imageTexture.image = image;
        compositeUniforms.uTextureSize.value = [image.naturalWidth || 1, image.naturalHeight || 1];
      };
      image.src = src;
    }

    const offsets = new Float32Array(MAX_WAVES * 2);
    const scales = new Float32Array(MAX_WAVES * 2);
    const opacities = new Float32Array(MAX_WAVES);

    const waves = Array.from({ length: MAX_WAVES }, () => ({
      x: 0,
      y: 0,
      scale: START_SCALE,
      target: START_SCALE,
      size: 1,
      opacity: 0
    }));
    let current = 0;

    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]) },
      uv: { size: 2, data: new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]) },
      iOffset: { instanced: 1, size: 2, data: offsets },
      iScale: { instanced: 1, size: 2, data: scales },
      iOpacity: { instanced: 1, size: 1, data: opacities }
    });

    const waveUniforms = { uRings: { value: rings } };
    const waveProgram = new Program(gl, {
      vertex: waveVertex,
      fragment: waveFragment,
      uniforms: waveUniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      cullFace: false
    });
    waveProgram.setBlendFunc(gl.ONE, gl.ONE);
    const waveMesh = new Mesh(gl, { geometry, program: waveProgram, frustumCulled: false });

    const displacementTarget = new RenderTarget(gl, {
      width: 2,
      height: 2,
      depth: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE
    });

    const compositeUniforms = {
      uTexture: { value: imageTexture },
      uDisplacement: { value: displacementTarget.texture },
      uResolution: { value: [1, 1] },
      uTextureSize: { value: [1, 1] },
      uTexel: { value: [1, 1] },
      uTint: { value: hexToRGB(tint) },
      uHighlight: { value: hexToRGB(highlightColor) },
      uStrength: { value: strength },
      uSwirl: { value: swirl },
      uDispersion: { value: dispersion },
      uGlint: { value: glint },
      uTintAmount: { value: tintAmount },
      uGrayscale: { value: grayscale ? 1 : 0 }
    };

    const compositeMesh = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, {
        vertex: screenVertex,
        fragment: compositeFragment,
        uniforms: compositeUniforms,
        depthTest: false,
        depthWrite: false
      })
    });

    uniformsRef.current = { wave: waveUniforms, composite: compositeUniforms };

    let width = 1;
    let height = 1;

    const resize = () => {
      width = Math.max(1, mount.clientWidth);
      height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height);
      compositeUniforms.uResolution.value = [width, height];

      const scale = QUALITY_SCALE[quality] || QUALITY_SCALE.high;
      const fieldW = Math.max(2, Math.round(width * scale));
      const fieldH = Math.max(2, Math.round(height * scale));
      displacementTarget.setSize(fieldW, fieldH);
      compositeUniforms.uTexel.value = [1 / fieldW, 1 / fieldH];
    };

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    const setNewWave = (x: number, y: number, power: number) => {
      const cfg = configRef.current;
      const wave = waves[current];
      current = (current + 1) % MAX_WAVES;
      wave.x = x;
      wave.y = y;
      wave.scale = START_SCALE * power;
      wave.target = START_SCALE * Math.max(1, cfg.spread) * power;
      wave.size = Math.max(1, cfg.brushSize);
      wave.opacity = 1;
    };

    const localPoint = (clientX: number, clientY: number): [number, number] | null => {
      const rect = mount.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
        return null;
      }
      return [clientX - rect.left, rect.height - (clientY - rect.top)];
    };

    let previousX = 0;
    let previousY = 0;

    const onMove = (event: PointerEvent) => {
      const cfg = configRef.current;
      
      // Update custom cursor tracking target
      const rect = mount.getBoundingClientRect();
      const htmlX = event.clientX - rect.left;
      const htmlY = event.clientY - rect.top;
      
      cursorState.current.targetX = htmlX;
      cursorState.current.targetY = htmlY;

      if (!cfg.enabled || reduceMotion || cfg.trigger === 'click') return;
      const point = localPoint(event.clientX, event.clientY);
      if (!point) return;
      const step = Math.max(1, cfg.spacing);
      if (Math.abs(point[0] - previousX) > step || Math.abs(point[1] - previousY) > step) {
        setNewWave(point[0], point[1], 1);
        previousX = point[0];
        previousY = point[1];
      }
    };

    const onDown = (event: PointerEvent) => {
      const cfg = configRef.current;
      if (!cfg.enabled || reduceMotion || cfg.trigger === 'hover') return;
      const point = localPoint(event.clientX, event.clientY);
      if (!point) return;
      setNewWave(point[0], point[1], Math.max(1, cfg.clickStrength));
    };

    const onPointerEnterOrMove = (event: PointerEvent) => {
      setIsHovering(true);
      const cfg = configRef.current;
      if (!cfg.enabled || reduceMotion) return;
      if (cfg.trigger === 'hover' || cfg.trigger === 'both') {
        const point = localPoint(event.clientX, event.clientY);
        if (!point) return;
        setNewWave(point[0], point[1], 1.2);
      }
    };

    const onPointerLeave = () => {
      setIsHovering(false);
    };

    mount.addEventListener('pointermove', onMove, { passive: true });
    mount.addEventListener('pointerdown', onDown, { passive: true });
    mount.addEventListener('pointerenter', onPointerEnterOrMove, { passive: true });
    mount.addEventListener('pointerleave', onPointerLeave, { passive: true });

    let raf = 0;
    let previousTime = 0;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const delta = previousTime ? Math.min(0.05, (now - previousTime) / 1000) : 0;
      previousTime = now;
      const cfg = configRef.current;

      const growth = reduceMotion ? 0 : 1 - Math.exp(-delta * 1.09);
      const decay = reduceMotion ? 1 : Math.exp((-delta * LIFE_CONSTANT) / Math.max(0.15, cfg.fade));

      for (let i = 0; i < MAX_WAVES; i += 1) {
        const wave = waves[i];
        if (wave.opacity <= 0) {
          opacities[i] = 0;
          continue;
        }

        wave.opacity *= decay;
        wave.scale += (wave.target - wave.scale) * growth;

        if (wave.opacity < 0.002) {
          wave.opacity = 0;
          opacities[i] = 0;
          continue;
        }

        const half = (wave.scale * wave.size) / 2;
        offsets[i * 2] = (wave.x / width) * 2 - 1;
        offsets[i * 2 + 1] = (wave.y / height) * 2 - 1;
        scales[i * 2] = (half / width) * 2;
        scales[i * 2 + 1] = (half / height) * 2;
        opacities[i] = wave.opacity;
      }

      geometry.attributes.iOffset.needsUpdate = true;
      geometry.attributes.iScale.needsUpdate = true;
      geometry.attributes.iOpacity.needsUpdate = true;

      if (isVideo && video && video.readyState >= 2) {
        imageTexture.needsUpdate = true;
      }

      renderer.render({ scene: waveMesh, target: displacementTarget, clear: true });
      renderer.render({ scene: compositeMesh });

      // Swimming kinematics & physics
      const cur = cursorState.current;
      
      // Interpolate position slightly for smoother physics
      cur.x += (cur.targetX - cur.x) * 0.4;
      cur.y += (cur.targetY - cur.y) * 0.4;
      
      const vx = cur.x - cur.lastX;
      const vy = cur.y - cur.lastY;
      const dist = Math.sqrt(vx * vx + vy * vy);
      cur.lastX = cur.x;
      cur.lastY = cur.y;
      
      if (dist > 0.5) {
        let targetAngle = Math.atan2(vy, vx) * (180 / Math.PI);
        let angleDiff = targetAngle - cur.angle;
        while (angleDiff <= -180) angleDiff += 360;
        while (angleDiff > 180) angleDiff -= 360;
        
        // Track turning velocity for body bending
        cur.turnVelocity = cur.turnVelocity * 0.8 + (angleDiff * 0.2);
        cur.angle += angleDiff * 0.3;
      } else {
        cur.turnVelocity *= 0.9;
      }
      
      // Smooth the speed reading
      cur.speed = cur.speed * 0.9 + (dist * 0.1);
      
      // Swim cycle advances based on base speed + actual movement speed
      cur.swimCycle += 0.05 + (cur.speed * 0.015);
      
      if (customCursorRef.current) {
         customCursorRef.current.style.transform = `translate(${cur.x}px, ${cur.y}px) rotate(${cur.angle + 90}deg)`;
      }
      
      if (torsoRef.current && tailBaseRef.current && tailRef.current) {
        // Bend based on turn velocity (negative so body trails the turn)
        let bend = -cur.turnVelocity * 2.0;
        bend = Math.max(-45, Math.min(45, bend)); // clamp bend to prevent breaking spine
        
        const wiggle1 = Math.sin(cur.swimCycle) * (2 + cur.speed * 0.3);
        const wiggle2 = Math.sin(cur.swimCycle - 0.5) * (4 + cur.speed * 0.6);
        const wiggle3 = Math.sin(cur.swimCycle - 1.0) * (8 + cur.speed * 1.2);
        
        torsoRef.current.style.transform = `rotate(${bend * 0.4 + wiggle1}deg)`;
        tailBaseRef.current.style.transform = `rotate(${bend * 0.7 + wiggle2}deg)`;
        tailRef.current.style.transform = `rotate(${bend * 1.2 + wiggle3}deg)`;
        
        if (leftFinRef.current && rightFinRef.current) {
            const finAngle = Math.cos(cur.swimCycle) * (10 + Math.min(cur.speed * 1.0, 20));
            leftFinRef.current.style.transform = `rotate(${-finAngle}deg)`;
            rightFinRef.current.style.transform = `rotate(${finAngle}deg)`;
        }
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener('pointermove', onMove);
      mount.removeEventListener('pointerdown', onDown);
      mount.removeEventListener('pointerenter', onPointerEnterOrMove);
      mount.removeEventListener('pointerleave', onPointerLeave);
      uniformsRef.current = null;
      if (canvas.parentNode === mount) mount.removeChild(canvas);
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, quality]);

  useEffect(() => {
    const u = uniformsRef.current;
    if (!u) return;
    u.wave.uRings.value = rings;
    u.composite.uStrength.value = strength;
    u.composite.uSwirl.value = swirl;
    u.composite.uDispersion.value = dispersion;
    u.composite.uGlint.value = glint;
    u.composite.uTintAmount.value = tintAmount;
    u.composite.uGrayscale.value = grayscale ? 1 : 0;
    u.composite.uHighlight.value = hexToRGB(highlightColor);
    u.composite.uTint.value = hexToRGB(tint);
  }, [rings, strength, swirl, dispersion, glint, tintAmount, grayscale, highlightColor, tint]);

  return (
    <div 
      ref={mountRef} 
      className={`ripple-distortion ${className} ${isHovering ? '!cursor-none' : ''}`.trim()} 
      style={style}
      data-cursor="none"
    >
      {/* Custom Sea Creature Cursor */}
      <div 
        ref={customCursorRef}
        className="absolute top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-500 ease-out flex items-center justify-center"
        style={{ 
          opacity: isHovering ? 1 : 0, 
          width: '100px', 
          height: '120px', 
          marginLeft: '-50px', 
          marginTop: '-5px',
          transformOrigin: '50px 5px'
        }}
      >
        <svg width="100" height="120" viewBox="0 0 100 120" fill="none" style={{ overflow: 'visible' }}>
          <defs>
            <filter id="glowEffect" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <clipPath id="bodyClip">
              <path d="M 50 10 C 68 25, 65 65, 50 90 C 35 65, 32 25, 50 10 Z" />
            </clipPath>
          </defs>

          <g filter="url(#glowEffect)">
            
            {/* HEAD GROUP */}
            <g>
              {/* Whiskers */}
              <path d="M 45 15 C 35 5, 20 10, 15 20" className="stroke-ink-900/30 dark:stroke-white/40 transition-colors duration-700" strokeWidth="1" strokeLinecap="round" fill="none" />
              <path d="M 55 15 C 65 5, 80 10, 85 20" className="stroke-ink-900/30 dark:stroke-white/40 transition-colors duration-700" strokeWidth="1" strokeLinecap="round" fill="none" />
              
              {/* Head Body */}
              <path d="M50 10 C 68 20, 68 40, 50 50 C 32 40, 32 20, 50 10 Z" className="fill-white dark:fill-[#0f141a] stroke-ink-900/20 dark:stroke-[#0f141a] transition-colors duration-700" strokeWidth="1.5" />
              
              {/* Sanke / Showa Pattern for Light, Shiro Utsuri for Dark */}
              <path d="M 35 15 Q 50 40 65 15 Q 50 5 35 15 Z" className="fill-orange-500/90 dark:fill-white/80 transition-colors duration-700" />
              <circle cx="60" cy="35" r="4" className="fill-ink-900/80 dark:fill-transparent transition-colors duration-700" />

              {/* Eyes */}
              <circle cx="42" cy="28" r="1.5" className="fill-ink-900 dark:fill-[#070908] transition-colors duration-700" />
              <circle cx="58" cy="28" r="1.5" className="fill-ink-900 dark:fill-[#070908] transition-colors duration-700" />
              <circle cx="42" cy="28" r="2.5" fill="none" className="stroke-white dark:stroke-white/80 transition-colors duration-700" strokeWidth="0.5" />
              <circle cx="58" cy="28" r="2.5" fill="none" className="stroke-white dark:stroke-white/80 transition-colors duration-700" strokeWidth="0.5" />
              
              {/* Pectoral Fins (Flowing, graceful) */}
              <g ref={leftFinRef} style={{ transformOrigin: '35px 45px' }}>
                <path d="M 50 40 C 25 50, 5 65, 15 75 C 25 75, 40 60, 50 50 Z" className="fill-white/80 dark:fill-[#0f141a]/90 transition-colors duration-700" />
                <path d="M 50 40 C 25 50, 15 65, 15 65" className="stroke-ink-900/30 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" fill="none" />
              </g>
              <g ref={rightFinRef} style={{ transformOrigin: '65px 45px' }}>
                <path d="M 50 40 C 75 50, 95 65, 85 75 C 75 75, 60 60, 50 50 Z" className="fill-white/80 dark:fill-[#0f141a]/90 transition-colors duration-700" />
                <path d="M 50 40 C 75 50, 85 65, 85 65" className="stroke-ink-900/30 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" fill="none" />
              </g>

              {/* Spine line Head */}
              <path d="M 50 20 L 50 45" className="stroke-ink-900/20 dark:stroke-white/20 transition-colors duration-700" strokeWidth="1.5" strokeDasharray="2 4" />
            </g>
            
            {/* HIERARCHICAL CHAIN: Torso -> TailBase -> TailFin */}
            <g ref={torsoRef} style={{ transformOrigin: '50px 42px' }}>
              
              {/* Torso Body */}
              <path d="M50 40 C 65 45, 60 70, 50 75 C 40 70, 35 45, 50 40 Z" className="fill-white dark:fill-[#0f141a] stroke-ink-900/20 dark:stroke-[#0f141a] transition-colors duration-700" strokeWidth="1.5" />
              
              {/* Torso Pattern */}
              <path d="M 35 45 C 50 35, 60 55, 55 70 C 45 75, 35 60, 35 45 Z" className="fill-orange-500/80 dark:fill-white/70 transition-colors duration-700" />
              <circle cx="45" cy="55" r="5" className="fill-ink-900/80 dark:fill-transparent transition-colors duration-700" />
              
              {/* Pelvic Fins */}
              <path d="M 50 70 C 65 75, 75 85, 70 95 C 65 90, 55 85, 50 80 Z" className="fill-white/70 dark:fill-[#0f141a]/80 transition-colors duration-700" />
              <path d="M 50 70 C 35 75, 25 85, 30 95 C 35 90, 45 85, 50 80 Z" className="fill-white/70 dark:fill-[#0f141a]/80 transition-colors duration-700" />

              {/* Spine line Torso */}
              <path d="M 50 45 L 50 70" className="stroke-ink-900/20 dark:stroke-white/20 transition-colors duration-700" strokeWidth="1.5" strokeDasharray="2 4" />

              <g ref={tailBaseRef} style={{ transformOrigin: '50px 68px' }}>
                
                {/* Tail Base Body */}
                <path d="M50 65 C 58 70, 55 85, 50 90 C 45 85, 42 70, 50 65 Z" className="fill-white dark:fill-[#0f141a] stroke-ink-900/20 dark:stroke-[#0f141a] transition-colors duration-700" strokeWidth="1.5" />
                
                {/* Tail Base Pattern */}
                <path d="M 42 70 C 50 68, 55 75, 52 85 C 48 88, 42 80, 42 70 Z" className="fill-orange-600/80 dark:fill-white/60 transition-colors duration-700" />

                {/* Spine line Tail Base */}
                <path d="M 50 70 L 50 85" className="stroke-ink-900/20 dark:stroke-white/20 transition-colors duration-700" strokeWidth="1.5" strokeDasharray="2 4" />

                <g ref={tailRef} style={{ transformOrigin: '50px 85px' }}>
                   {/* Flowing Tail */}
                   <path d="M 50 85 C 65 100, 70 120, 50 115 C 30 120, 35 100, 50 85 Z" className="fill-white/90 dark:fill-[#0f141a] stroke-ink-900/20 dark:stroke-[#0f141a] transition-colors duration-700" />
                   <path d="M 50 85 C 55 100, 53 115, 50 120 C 47 115, 45 100, 50 85 Z" className="fill-white dark:fill-[#070908] transition-colors duration-700" />
                   <path d="M 50 85 C 60 100, 60 115, 60 115" className="stroke-ink-900/30 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" fill="none" />
                   <path d="M 50 85 C 40 100, 40 115, 40 115" className="stroke-ink-900/30 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" fill="none" />
                </g>

              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default RippleDistortion;
