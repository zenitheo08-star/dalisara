import React, { useState, useEffect, useRef, memo } from 'react';
import { cn } from '../lib/utils';

export interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  className?: string;
  wrapperClassName?: string;
  rootMargin?: string;
  threshold?: number;
  autoPlayInView?: boolean;
}

export const LazyVideo = memo(function LazyVideo({
  src,
  poster,
  className,
  wrapperClassName,
  rootMargin = '200px 0px',
  threshold = 0.15,
  autoPlayInView = true,
  ...props
}: LazyVideoProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = containerRef.current;
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
            if (autoPlayInView && videoRef.current) {
              videoRef.current.play().catch(() => {
                // Autoplay blocked or not allowed, handle quietly
              });
            }
          } else {
            // Pause video when out of viewport to save GPU/CPU cycles
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, autoPlayInView]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-sand-200/60 dark:bg-white/[0.04]',
        wrapperClassName
      )}
    >
      {poster && !isLoaded && (
        <img
          src={poster}
          alt="Video preview poster"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}

      {isInView && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          muted
          loop
          onLoadedData={() => setIsLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-700 ease-out',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...props}
        />
      )}
    </div>
  );
});
