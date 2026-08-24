#!/bin/bash
cat src/pages/Home.tsx | head -n 14 > temp_home.tsx
cat << 'INNER' >> temp_home.tsx
import { useState } from 'react';

export function Home() {
  const [isPressing, setIsPressing] = useState(false);

  return (
    <div className="bg-sand-100">
      {/* Hero Section */}
      <section className="h-screen min-h-[700px] w-full grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden border-b border-ink-900/10 pt-20">
        <div className="col-span-1 lg:col-span-7 relative p-10 lg:border-r border-ink-900/10 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] mb-4 opacity-60">San Vicente, Palawan</p>
            <h2 className="text-6xl md:text-[80px] xl:text-[100px] font-serif leading-[0.85] tracking-tighter italic mb-8">
              The coast,<br/>at a <span className="pl-12 md:pl-20">slower</span><br/>measure.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
            <div className="space-y-4">
              <div 
                className="w-full h-48 bg-sand-200 relative overflow-hidden group cursor-pointer select-none"
                onMouseDown={() => setIsPressing(true)}
                onMouseUp={() => setIsPressing(false)}
                onMouseLeave={() => setIsPressing(false)}
                onTouchStart={() => setIsPressing(true)}
                onTouchEnd={() => setIsPressing(false)}
              >
                <motion.img 
                  animate={{ opacity: isPressing ? 0 : 0.9 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800&h=600" 
                  alt="The Shore Kitchen" 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                  referrerPolicy="no-referrer"
                  draggable={false}
                />
                <motion.img 
                  animate={{ opacity: isPressing ? 0.9 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800&h=600" 
                  alt="The Shore Kitchen - Dusk" 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                  referrerPolicy="no-referrer"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-white/80 text-[10px] uppercase tracking-widest backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full border border-white/20">
                    Hold to reveal
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white text-[10px] uppercase tracking-widest z-10 transition-all duration-500">
                  {isPressing ? "The Shore Kitchen — Dusk" : "The Shore Kitchen"}
                </div>
              </div>
              <p className="text-sm leading-relaxed opacity-80">Contemporary Filipino coastal cuisine served against the rhythm of the Sulu Sea. Material restraint meets seasonal honesty.</p>
            </div>
INNER
cat src/pages/Home.tsx | tail -n +41 >> temp_home.tsx
mv temp_home.tsx src/pages/Home.tsx
