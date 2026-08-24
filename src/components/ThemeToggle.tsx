import { useState, useEffect } from 'react';
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
