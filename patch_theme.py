import sys

# Patch ThemeToggle
with open('src/components/ThemeToggle.tsx', 'w') as f:
    f.write("""import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-50">
      <div className="bg-white/80 dark:bg-[#070908]/80 backdrop-blur-xl border border-ink-900/10 dark:border-white/10 p-1 rounded-full shadow-xl flex items-center gap-1 transition-all duration-500 hover:shadow-2xl hover:scale-105 origin-bottom-left">
        <button
          onClick={() => setTheme('light')}
          className={cn(
            "p-2 rounded-full transition-all duration-500",
            theme === 'light' 
              ? "bg-ink-900 text-sand-50 shadow-md" 
              : "text-ink-900/50 hover:text-ink-900 hover:bg-black/5 dark:text-sand-50/50 dark:hover:text-sand-50 dark:hover:bg-white/5"
          )}
          aria-label="Light mode"
        >
          <Sun className="w-4 h-4" strokeWidth={2} />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={cn(
            "p-2 rounded-full transition-all duration-500",
            theme === 'dark' 
              ? "bg-sand-50 text-ink-900 shadow-md" 
              : "text-ink-900/50 hover:text-ink-900 hover:bg-black/5 dark:text-sand-50/50 dark:hover:text-sand-50 dark:hover:bg-white/5"
          )}
          aria-label="Dark mode"
        >
          <Moon className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
""")

print("ThemeToggle patched.")

# Patch RippleDistortion
with open('src/components/RippleDistortion.tsx', 'r') as f:
    content = f.read()

target = """          <g filter="url(#glowEffect)">
            
            {/* HEAD GROUP */}
            <g>
              {/* Whiskers */}
              <path d="M 45 15 C 35 5, 20 10, 15 20" className="stroke-ink-900/40 dark:stroke-cyan-300/60 transition-colors duration-700" strokeWidth="1" strokeLinecap="round" fill="none" />
              <path d="M 55 15 C 65 5, 80 10, 85 20" className="stroke-ink-900/40 dark:stroke-cyan-300/60 transition-colors duration-700" strokeWidth="1" strokeLinecap="round" fill="none" />
              
              {/* Head Body */}
              <path d="M50 10 C 68 20, 68 40, 50 50 C 32 40, 32 20, 50 10 Z" className="fill-white dark:fill-[#020617] stroke-ink-900/20 dark:stroke-cyan-400/60 transition-colors duration-700" strokeWidth="1.5" />
              
              {/* Head Pattern */}
              <path d="M 35 15 Q 50 40 65 15 Q 50 5 35 15 Z" className="fill-orange-500/90 dark:fill-cyan-500/60 transition-colors duration-700" />

              {/* Eyes */}
              <circle cx="42" cy="28" r="1.5" className="fill-ink-900 dark:fill-cyan-100 transition-colors duration-700" />
              <circle cx="58" cy="28" r="1.5" className="fill-ink-900 dark:fill-cyan-100 transition-colors duration-700" />
              <circle cx="42" cy="28" r="2.5" fill="none" className="stroke-white dark:stroke-cyan-400/80 transition-colors duration-700" strokeWidth="0.5" />
              <circle cx="58" cy="28" r="2.5" fill="none" className="stroke-white dark:stroke-cyan-400/80 transition-colors duration-700" strokeWidth="0.5" />
              
              {/* Pectoral Fins */}
              <g ref={leftFinRef} style={{ transformOrigin: '35px 45px' }}>
                <path d="M 50 40 C 25 50, 5 65, 15 75 C 25 75, 40 60, 50 50 Z" className="fill-white/80 dark:fill-cyan-900/40 transition-colors duration-700" />
                <path d="M 50 40 C 25 50, 15 65, 15 65" className="stroke-ink-900/30 dark:stroke-cyan-400/50 transition-colors duration-700" strokeWidth="0.5" fill="none" />
              </g>
              <g ref={rightFinRef} style={{ transformOrigin: '65px 45px' }}>
                <path d="M 50 40 C 75 50, 95 65, 85 75 C 75 75, 60 60, 50 50 Z" className="fill-white/80 dark:fill-cyan-900/40 transition-colors duration-700" />
                <path d="M 50 40 C 75 50, 85 65, 85 65" className="stroke-ink-900/30 dark:stroke-cyan-400/50 transition-colors duration-700" strokeWidth="0.5" fill="none" />
              </g>

              {/* Spine line Head */}
              <path d="M 50 20 L 50 45" className="stroke-ink-900/30 dark:stroke-cyan-300/50 transition-colors duration-700" strokeWidth="1.5" strokeDasharray="2 4" />
            </g>
            
            {/* HIERARCHICAL CHAIN: Torso -> TailBase -> TailFin */}
            <g ref={torsoRef} style={{ transformOrigin: '50px 42px' }}>
              
              {/* Torso Body */}
              <path d="M50 40 C 65 45, 60 70, 50 75 C 40 70, 35 45, 50 40 Z" className="fill-white dark:fill-[#020617] stroke-ink-900/20 dark:stroke-cyan-400/60 transition-colors duration-700" strokeWidth="1.5" />
              
              {/* Torso Pattern */}
              <path d="M 35 45 C 50 35, 60 55, 55 70 C 45 75, 35 60, 35 45 Z" className="fill-orange-500/80 dark:fill-cyan-500/50 transition-colors duration-700" />
              
              {/* Pelvic Fins */}
              <path d="M 50 70 C 65 75, 75 85, 70 95 C 65 90, 55 85, 50 80 Z" className="fill-white/70 dark:fill-cyan-900/30 transition-colors duration-700" />
              <path d="M 50 70 C 35 75, 25 85, 30 95 C 35 90, 45 85, 50 80 Z" className="fill-white/70 dark:fill-cyan-900/30 transition-colors duration-700" />

              {/* Spine line Torso */}
              <path d="M 50 45 L 50 70" className="stroke-ink-900/30 dark:stroke-cyan-300/50 transition-colors duration-700" strokeWidth="1.5" strokeDasharray="2 4" />

              <g ref={tailBaseRef} style={{ transformOrigin: '50px 68px' }}>
                
                {/* Tail Base Body */}
                <path d="M50 65 C 58 70, 55 85, 50 90 C 45 85, 42 70, 50 65 Z" className="fill-white dark:fill-[#020617] stroke-ink-900/20 dark:stroke-cyan-400/60 transition-colors duration-700" strokeWidth="1.5" />
                
                {/* Tail Base Pattern */}
                <path d="M 42 70 C 50 68, 55 75, 52 85 C 48 88, 42 80, 42 70 Z" className="fill-orange-600/80 dark:fill-cyan-600/60 transition-colors duration-700" />

                {/* Spine line Tail Base */}
                <path d="M 50 70 L 50 85" className="stroke-ink-900/30 dark:stroke-cyan-300/50 transition-colors duration-700" strokeWidth="1.5" strokeDasharray="2 4" />

                <g ref={tailRef} style={{ transformOrigin: '50px 85px' }}>
                   {/* Flowing Tail */}
                   <path d="M 50 85 C 65 100, 70 120, 50 115 C 30 120, 35 100, 50 85 Z" className="fill-white/90 dark:fill-[#020617] stroke-ink-900/20 dark:stroke-cyan-400/60 transition-colors duration-700" />
                   <path d="M 50 85 C 55 100, 53 115, 50 120 C 47 115, 45 100, 50 85 Z" className="fill-white dark:fill-cyan-900/40 transition-colors duration-700" />
                   <path d="M 50 85 C 60 100, 60 115, 60 115" className="stroke-ink-900/30 dark:stroke-cyan-400/50 transition-colors duration-700" strokeWidth="0.5" fill="none" />
                   <path d="M 50 85 C 40 100, 40 115, 40 115" className="stroke-ink-900/30 dark:stroke-cyan-400/50 transition-colors duration-700" strokeWidth="0.5" fill="none" />
                </g>

              </g>
            </g>
          </g>"""

replacement = """          <g filter="url(#glowEffect)">
            
            {/* HEAD GROUP */}
            <g>
              {/* Whiskers */}
              <path d="M 45 15 C 35 5, 20 10, 15 20" className="stroke-ink-900/40 dark:stroke-cyan-300/50 transition-colors duration-700" strokeWidth="1" strokeLinecap="round" fill="none" />
              <path d="M 55 15 C 65 5, 80 10, 85 20" className="stroke-ink-900/40 dark:stroke-cyan-300/50 transition-colors duration-700" strokeWidth="1" strokeLinecap="round" fill="none" />
              
              {/* Head Body */}
              <path d="M50 10 C 68 20, 68 40, 50 50 C 32 40, 32 20, 50 10 Z" className="fill-white dark:fill-[#061826] stroke-ink-900/20 dark:stroke-[#061826] transition-colors duration-700" strokeWidth="1.5" />
              
              {/* Head Pattern */}
              <path d="M 35 15 Q 50 40 65 15 Q 50 5 35 15 Z" className="fill-orange-500/90 dark:fill-cyan-400/70 transition-colors duration-700" />

              {/* Eyes */}
              <circle cx="42" cy="28" r="1.5" className="fill-ink-900 dark:fill-[#040f1a] transition-colors duration-700" />
              <circle cx="58" cy="28" r="1.5" className="fill-ink-900 dark:fill-[#040f1a] transition-colors duration-700" />
              <circle cx="42" cy="28" r="2.5" fill="none" className="stroke-white dark:stroke-cyan-300/80 transition-colors duration-700" strokeWidth="0.5" />
              <circle cx="58" cy="28" r="2.5" fill="none" className="stroke-white dark:stroke-cyan-300/80 transition-colors duration-700" strokeWidth="0.5" />
              
              {/* Pectoral Fins */}
              <g ref={leftFinRef} style={{ transformOrigin: '35px 45px' }}>
                <path d="M 50 40 C 25 50, 5 65, 15 75 C 25 75, 40 60, 50 50 Z" className="fill-white/80 dark:fill-[#061826]/90 transition-colors duration-700" />
                <path d="M 50 40 C 25 50, 15 65, 15 65" className="stroke-ink-900/30 dark:stroke-cyan-400/40 transition-colors duration-700" strokeWidth="0.5" fill="none" />
              </g>
              <g ref={rightFinRef} style={{ transformOrigin: '65px 45px' }}>
                <path d="M 50 40 C 75 50, 95 65, 85 75 C 75 75, 60 60, 50 50 Z" className="fill-white/80 dark:fill-[#061826]/90 transition-colors duration-700" />
                <path d="M 50 40 C 75 50, 85 65, 85 65" className="stroke-ink-900/30 dark:stroke-cyan-400/40 transition-colors duration-700" strokeWidth="0.5" fill="none" />
              </g>

              {/* Spine line Head */}
              <path d="M 50 20 L 50 45" className="stroke-ink-900/30 dark:stroke-cyan-300/30 transition-colors duration-700" strokeWidth="1.5" strokeDasharray="2 4" />
            </g>
            
            {/* HIERARCHICAL CHAIN: Torso -> TailBase -> TailFin */}
            <g ref={torsoRef} style={{ transformOrigin: '50px 42px' }}>
              
              {/* Torso Body */}
              <path d="M50 40 C 65 45, 60 70, 50 75 C 40 70, 35 45, 50 40 Z" className="fill-white dark:fill-[#061826] stroke-ink-900/20 dark:stroke-[#061826] transition-colors duration-700" strokeWidth="1.5" />
              
              {/* Torso Pattern */}
              <path d="M 35 45 C 50 35, 60 55, 55 70 C 45 75, 35 60, 35 45 Z" className="fill-orange-500/80 dark:fill-cyan-400/60 transition-colors duration-700" />
              
              {/* Pelvic Fins */}
              <path d="M 50 70 C 65 75, 75 85, 70 95 C 65 90, 55 85, 50 80 Z" className="fill-white/70 dark:fill-[#061826]/80 transition-colors duration-700" />
              <path d="M 50 70 C 35 75, 25 85, 30 95 C 35 90, 45 85, 50 80 Z" className="fill-white/70 dark:fill-[#061826]/80 transition-colors duration-700" />

              {/* Spine line Torso */}
              <path d="M 50 45 L 50 70" className="stroke-ink-900/30 dark:stroke-cyan-300/30 transition-colors duration-700" strokeWidth="1.5" strokeDasharray="2 4" />

              <g ref={tailBaseRef} style={{ transformOrigin: '50px 68px' }}>
                
                {/* Tail Base Body */}
                <path d="M50 65 C 58 70, 55 85, 50 90 C 45 85, 42 70, 50 65 Z" className="fill-white dark:fill-[#061826] stroke-ink-900/20 dark:stroke-[#061826] transition-colors duration-700" strokeWidth="1.5" />
                
                {/* Tail Base Pattern */}
                <path d="M 42 70 C 50 68, 55 75, 52 85 C 48 88, 42 80, 42 70 Z" className="fill-orange-600/80 dark:fill-cyan-400/50 transition-colors duration-700" />

                {/* Spine line Tail Base */}
                <path d="M 50 70 L 50 85" className="stroke-ink-900/30 dark:stroke-cyan-300/30 transition-colors duration-700" strokeWidth="1.5" strokeDasharray="2 4" />

                <g ref={tailRef} style={{ transformOrigin: '50px 85px' }}>
                   {/* Flowing Tail */}
                   <path d="M 50 85 C 65 100, 70 120, 50 115 C 30 120, 35 100, 50 85 Z" className="fill-white/90 dark:fill-[#061826] stroke-ink-900/20 dark:stroke-[#061826] transition-colors duration-700" />
                   <path d="M 50 85 C 55 100, 53 115, 50 120 C 47 115, 45 100, 50 85 Z" className="fill-white dark:fill-[#040f1a] transition-colors duration-700" />
                   <path d="M 50 85 C 60 100, 60 115, 60 115" className="stroke-ink-900/30 dark:stroke-cyan-400/40 transition-colors duration-700" strokeWidth="0.5" fill="none" />
                   <path d="M 50 85 C 40 100, 40 115, 40 115" className="stroke-ink-900/30 dark:stroke-cyan-400/40 transition-colors duration-700" strokeWidth="0.5" fill="none" />
                </g>

              </g>
            </g>
          </g>"""

if target in content:
    with open('src/components/RippleDistortion.tsx', 'w') as f:
        f.write(content.replace(target, replacement))
    print('RippleDistortion patched.')
else:
    print('Target not found in RippleDistortion.tsx!')

