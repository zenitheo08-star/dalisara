import React, { useState, useEffect, useRef, memo } from 'react';
import { cn } from '../lib/utils';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  rootMargin?: string;
  threshold?: number;
  priority?: boolean;
  aspectRatio?: string;
  placeholderColor?: string;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

export const LazyImage = memo(function LazyImage({
  src,
  alt,
  className,
  wrapperClassName,
  rootMargin = '250px 0px',
  threshold = 0.01,
  priority = false,
  aspectRatio,
  placeholderColor,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [isIntersecting, setIsIntersecting] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // If priority is true or already intersecting, skip observer
    if (priority || isIntersecting) {
      setIsIntersecting(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.unobserve(entry.target);
            observer.disconnect();
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
  }, [priority, isIntersecting, rootMargin, threshold]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-sand-200/60 dark:bg-white/[0.04]',
        wrapperClassName
      )}
      style={{
        aspectRatio: aspectRatio,
        backgroundColor: placeholderColor,
      }}
    >
      {/* Subtle low-contrast shimmering placeholder skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-sand-200/50 dark:bg-white/[0.02] animate-pulse" />
      )}

      {/* Actual image mounted only once intersecting or priority */}
      {isIntersecting && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={(e) => {
            setIsLoaded(true);
            onLoad?.(e);
          }}
          onError={(e) => {
            setHasError(true);
            onError?.(e);
          }}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-700 ease-out will-change-transform',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...props}
        />
      )}
    </div>
  );
});
