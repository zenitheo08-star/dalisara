import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">' in line:
        start_idx = i
    if start_idx != -1 and '</svg>' in line:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    replacement = """          <svg width="56" height="28" viewBox="0 0 40 20" fill="none" className="drop-shadow-md transition-colors duration-700">
            <defs>
              <clipPath id="koi-body-small">
                <path d="M 6 10 C 6 4.5, 20 2, 34 10 C 20 18, 6 15.5, 6 10 Z" />
              </clipPath>
            </defs>
            {/* Tail */}
            <path d="M 6 10 L 0 4 L 3 10 L 0 16 Z" className="fill-orange-500 dark:fill-[#040f1a] transition-colors duration-700" />
            <path d="M 4 10 L 0 7 L 1 10 L 0 13 Z" className="fill-white/80 dark:fill-cyan-900/40 transition-colors duration-700" />
            
            {/* Pectoral Fins */}
            <path d="M 18 5 L 14 -1 L 22 3 Z" className="fill-white/90 dark:fill-[#061826]/90 stroke-ink-900/10 dark:stroke-cyan-400/30 transition-colors duration-700" strokeWidth="0.5" />
            <path d="M 18 15 L 14 21 L 22 17 Z" className="fill-white/90 dark:fill-[#061826]/90 stroke-ink-900/10 dark:stroke-cyan-400/30 transition-colors duration-700" strokeWidth="0.5" />
            
            {/* Pelvic Fins */}
            <path d="M 10 7 L 8 2 L 12 5 Z" className="fill-white/80 dark:fill-[#061826]/80 stroke-ink-900/10 dark:stroke-cyan-400/30 transition-colors duration-700" strokeWidth="0.5" />
            <path d="M 10 13 L 8 18 L 12 15 Z" className="fill-white/80 dark:fill-[#061826]/80 stroke-ink-900/10 dark:stroke-cyan-400/30 transition-colors duration-700" strokeWidth="0.5" />

            {/* Body Base */}
            <path d="M 6 10 C 6 4.5, 20 2, 34 10 C 20 18, 6 15.5, 6 10 Z" className="fill-white dark:fill-[#061826] stroke-ink-900/10 dark:stroke-cyan-400/50 transition-colors duration-700" strokeWidth="0.5" />
            
            {/* Patterns clipped to body */}
            <g clipPath="url(#koi-body-small)">
              {/* Kohaku / Sanke orange patterns in Light, Shiro Utsuri/Bioluminescent patterns in Dark */}
              <circle cx="13" cy="10" r="5" className="fill-orange-500/90 dark:fill-cyan-500/60 transition-colors duration-700" />
              <circle cx="21" cy="12" r="4.5" className="fill-ink-900 dark:fill-cyan-400/70 transition-colors duration-700" />
              <circle cx="27" cy="7" r="3.5" className="fill-orange-500/90 dark:fill-cyan-300/60 transition-colors duration-700" />
              <circle cx="17" cy="6" r="2.5" className="fill-ink-900 dark:fill-transparent transition-colors duration-700" />
              <circle cx="9" cy="12" r="2.5" className="fill-transparent dark:fill-cyan-300/50 transition-colors duration-700" />
            </g>
            
            {/* Eyes */}
            <circle cx="30" cy="7.5" r="1.2" className="fill-ink-900 dark:fill-[#040f1a] transition-colors duration-700" />
            <circle cx="30" cy="12.5" r="1.2" className="fill-ink-900 dark:fill-[#040f1a] transition-colors duration-700" />
            <circle cx="30" cy="7.5" r="2" className="fill-transparent stroke-white dark:stroke-cyan-300/80 transition-colors duration-700" strokeWidth="0.5" />
            <circle cx="30" cy="12.5" r="2" className="fill-transparent stroke-white dark:stroke-cyan-300/80 transition-colors duration-700" strokeWidth="0.5" />
            
            {/* Whiskers */}
            <path d="M 33 8 Q 37 5 39 8" className="stroke-ink-900/20 dark:stroke-cyan-300/50 transition-colors duration-700" fill="none" strokeWidth="0.5" />
            <path d="M 33 12 Q 37 15 39 12" className="stroke-ink-900/20 dark:stroke-cyan-300/50 transition-colors duration-700" fill="none" strokeWidth="0.5" />
          </svg>\n"""
    
    new_lines = lines[:start_idx] + [replacement] + lines[end_idx+1:]
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.writelines(new_lines)
    print("Replaced!")
else:
    print("Not found")

