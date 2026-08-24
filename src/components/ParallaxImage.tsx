import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect, memo } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const ParallaxImage = memo(function ParallaxImage({
  src,
  alt,
  className = '',
  priority = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Subtle parallax effect by moving image from -10% to 10%
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    if (priority || isInView) {
      setIsInView(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '300px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [priority, isInView]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-sand-200/40 dark:bg-white/[0.02]">
      {isInView && (
        <motion.img 
          style={{ y, scale: 1.15 }} 
          src={src} 
          alt={alt} 
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover will-change-transform transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
});

