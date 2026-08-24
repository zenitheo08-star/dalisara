import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  href,
  children,
}: {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;
  href: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <Link
        to={href}
        className="text-xs uppercase tracking-[0.2em] font-medium hover:opacity-60 transition-opacity whitespace-nowrap text-ink-900 relative z-10 block py-4"
      >
        {item}
      </Link>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && children && (
            <div className="absolute top-[calc(100%)] left-1/2 transform -translate-x-1/2 pt-2 z-50">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation across items
                className="bg-sand-50/95 backdrop-blur-md overflow-hidden border border-ink-900/10 shadow-2xl"
              >
                <motion.div
                  layout // layout ensures smooth animation inside
                  className="w-max h-full p-2"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
  className,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className={cn("relative flex", className)}
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link to={href} className="flex space-x-6 group hover:bg-ink-900/5 p-4 transition-colors">
      <div className="w-32 h-20 bg-sand-200 overflow-hidden shrink-0 relative">
        <img
          src={src}
          alt={title}
          className="object-cover w-full h-full grayscale mix-blend-multiply dark:mix-blend-normal opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 border border-ink-900/10 pointer-events-none mix-blend-overlay"></div>
      </div>
      <div className="flex flex-col justify-center">
        <h4 className="text-lg font-serif italic text-ink-900 mb-1 group-hover:opacity-70 transition-opacity">
          {title}
        </h4>
        <p className="text-ink-700 text-xs max-w-[14rem] opacity-80 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, to, ...rest }: any) => {
  return (
    <Link
      to={to}
      {...rest}
      className="text-xs uppercase tracking-widest text-ink-700 hover:text-ink-900 hover:bg-ink-900/5 transition-colors block px-6 py-4"
    >
      {children}
    </Link>
  );
};
