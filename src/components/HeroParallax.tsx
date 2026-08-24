import React, { memo, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { Link } from "react-router-dom";
import { LazyImage } from "./LazyImage";

export const Header = memo(function Header() {
  return (
    <div className="max-w-7xl relative mx-auto py-10 md:py-20 px-6 md:px-12 w-full left-0 top-0">
      <span className="text-[10px] uppercase tracking-[0.4em] mb-4 block opacity-60">
        A Visual Journey
      </span>
      <h2 className="text-4xl md:text-7xl font-serif italic tracking-tighter text-ink-900">
        The Dalisara Moments
      </h2>
      <p className="max-w-2xl text-sm md:text-base mt-6 text-ink-700 leading-relaxed opacity-80">
        Through the lens of quiet observation, we capture the essence of our coastline. 
        Each frame is an invitation to slow down, breathe deeply, and reconnect with the 
        rhythm of the sea and the sanctuary of the forest.
      </p>
    </div>
  );
});

export const ProductCard = memo(function ProductCard({
  product,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : {
        y: -12,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group/product h-64 md:h-96 w-[20rem] md:w-[30rem] relative shrink-0 will-change-transform"
    >
      <Link
        to={product.link}
        className="block group-hover/product:shadow-2xl transition-shadow duration-300 h-full w-full relative overflow-hidden focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:outline-none"
      >
        <LazyImage
          src={product.thumbnail}
          alt={product.title}
          rootMargin="300px 0px"
          wrapperClassName="w-full h-full absolute inset-0"
          className="object-cover object-center w-full h-full grayscale mix-blend-multiply dark:mix-blend-normal opacity-80 group-hover/product:grayscale-0 group-hover/product:opacity-100 transition-all duration-500 will-change-transform"
        />
        <div className="absolute inset-0 border border-ink-900/10 pointer-events-none mix-blend-overlay z-10"></div>
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-40 bg-ink-900 pointer-events-none transition-opacity duration-300 z-10"></div>
      <h3 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-sand-50 font-serif italic tracking-tight text-lg transition-opacity duration-300 pointer-events-none z-20">
        {product.title}
      </h3>
    </motion.div>
  );
});

export const HeroParallax = memo(function HeroParallax({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) {
  const firstRow = useMemo(() => products.slice(0, 5), [products]);
  const secondRow = useMemo(() => products.slice(5, 10), [products]);
  const thirdRow = useMemo(() => products.slice(10, 15), [products]);
  const ref = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Smooth, optimized scroll transforms directly mapped without redundant spring solvers
  const translateX = useTransform(scrollYProgress, [0, 1], [0, 800]);
  const translateXReverse = useTransform(scrollYProgress, [0, 1], [0, -800]);
  const rotateX = useTransform(scrollYProgress, [0, 0.25], [12, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0.3, 1]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.25], [10, 0]);
  const translateY = useTransform(scrollYProgress, [0, 0.25], [-400, 200]);

  return (
    <div
      ref={ref}
      className={`py-16 md:py-32 overflow-hidden antialiased relative flex flex-col self-auto bg-sand-100 border-t border-b border-ink-900/10 will-change-transform ${shouldReduceMotion ? 'h-auto' : 'h-[180vh] md:h-[260vh] [perspective:1000px] [transform-style:preserve-3d]'}`}
    >
      <Header />
      <motion.div
        style={shouldReduceMotion ? {} : {
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className={shouldReduceMotion ? "flex flex-col gap-8 md:gap-16 px-6 md:px-12 pb-16" : "will-change-transform"}
      >
        <motion.div 
          style={shouldReduceMotion ? {} : { x: translateX }}
          className={`flex ${shouldReduceMotion ? 'flex-nowrap overflow-x-auto pb-8 snap-x snap-mandatory space-x-6' : 'flex-row-reverse space-x-reverse space-x-8 md:space-x-16 mb-8 md:mb-16 will-change-transform'}`}
        >
          {firstRow.map((product) => (
            <div key={product.title} className={shouldReduceMotion ? 'snap-center shrink-0' : ''}>
              <ProductCard
                product={product}
              />
            </div>
          ))}
        </motion.div>
        <motion.div 
          style={shouldReduceMotion ? {} : { x: translateXReverse }}
          className={`flex ${shouldReduceMotion ? 'flex-nowrap overflow-x-auto pb-8 snap-x snap-mandatory space-x-6' : 'flex-row mb-8 md:mb-16 space-x-8 md:space-x-16 will-change-transform'}`}
        >
          {secondRow.map((product) => (
            <div key={product.title} className={shouldReduceMotion ? 'snap-center shrink-0' : ''}>
              <ProductCard
                product={product}
              />
            </div>
          ))}
        </motion.div>
        <motion.div 
          style={shouldReduceMotion ? {} : { x: translateX }}
          className={`flex ${shouldReduceMotion ? 'flex-nowrap overflow-x-auto pb-8 snap-x snap-mandatory space-x-6' : 'flex-row-reverse space-x-reverse space-x-8 md:space-x-16 will-change-transform'}`}
        >
          {thirdRow.map((product) => (
            <div key={product.title} className={shouldReduceMotion ? 'snap-center shrink-0' : ''}>
              <ProductCard
                product={product}
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
});

