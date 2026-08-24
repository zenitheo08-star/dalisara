import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

target = """          <svg width="56" height="28" viewBox="0 0 40 20" fill="none" className="drop-shadow-md transition-colors duration-700">
            <defs>
              <clipPath id="koi-body-small">
                <path d="M 6 10 C 6 4.5, 20 2, 34 10 C 20 18, 6 15.5, 6 10 Z" />
              </clipPath>
            </defs>
            {/* Tail */}
            <path d="M 6 10 L 0 4 L 3 10 L 0 16 Z" className="fill-orange-500 dark:fill-[#0f141a] transition-colors duration-700" />
            <path d="M 4 10 L 0 7 L 1 10 L 0 13 Z" className="fill-white/80 dark:fill-[#070908] transition-colors duration-700" />
            
            {/* Pectoral Fins */}
            <path d="M 18 5 L 14 -1 L 22 3 Z" className="fill-white/90 dark:fill-[#0f141a]/90 stroke-ink-900/10 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" />
            <path d="M 18 15 L 14 21 L 22 17 Z" className="fill-white/90 dark:fill-[#0f141a]/90 stroke-ink-900/10 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" />
            
            {/* Pelvic Fins */}
            <path d="M 10 7 L 8 2 L 12 5 Z" className="fill-white/80 dark:fill-[#0f141a]/80 stroke-ink-900/10 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" />
            <path d="M 10 13 L 8 18 L 12 15 Z" className="fill-white/80 dark:fill-[#0f141a]/80 stroke-ink-900/10 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" />

            {/* Body Base */}
            <path d="M 6 10 C 6 4.5, 20 2, 34 10 C 20 18, 6 15.5, 6 10 Z" className="fill-white dark:fill-[#0f141a] stroke-ink-900/10 dark:stroke-[#0f141a] transition-colors duration-700" strokeWidth="0.5" />
            
            {/* Patterns clipped to body */}
            <g clipPath="url(#koi-body-small)">
              {/* Sanke (Light) and Shiro Utsuri (Dark) */}
              <circle cx="13" cy="10" r="5" className="fill-orange-500/90 dark:fill-white/80 transition-colors duration-700" />
              <circle cx="21" cy="12" r="4.5" className="fill-ink-900 dark:fill-transparent transition-colors duration-700" />
              <circle cx="27" cy="7" r="3.5" className="fill-orange-500/90 dark:fill-white/70 transition-colors duration-700" />
              <circle cx="17" cy="6" r="2.5" className="fill-ink-900 dark:fill-transparent transition-colors duration-700" />
              <circle cx="9" cy="12" r="2.5" className="fill-transparent dark:fill-white/60 transition-colors duration-700" />
            </g>
            
            {/* Eyes */}
            <circle cx="30" cy="7.5" r="1.2" className="fill-ink-900 dark:fill-[#070908] transition-colors duration-700" />
            <circle cx="30" cy="12.5" r="1.2" className="fill-ink-900 dark:fill-[#070908] transition-colors duration-700" />
            <circle cx="30" cy="7.5" r="2" className="fill-transparent stroke-white dark:stroke-white/80 transition-colors duration-700" strokeWidth="0.5" />
            <circle cx="30" cy="12.5" r="2" className="fill-transparent stroke-white dark:stroke-white/80 transition-colors duration-700" strokeWidth="0.5" />
            
            {/* Whiskers */}
            <path d="M 33 8 Q 37 5 39 8" className="stroke-ink-900/20 dark:stroke-white/40 transition-colors duration-700" fill="none" strokeWidth="0.5" />
            <path d="M 33 12 Q 37 15 39 12" className="stroke-ink-900/20 dark:stroke-white/40 transition-colors duration-700" fill="none" strokeWidth="0.5" />
          </svg>"""

replacement = """          <svg width="60" height="30" viewBox="0 0 40 20" fill="none" className="drop-shadow-md transition-colors duration-700" style={{ overflow: 'visible' }}>
            <defs>
              <clipPath id="koi-body-small">
                {/* Blunt head at x=32, tapers to x=4 */}
                <path d="M 4 10 C 15 4, 28 4, 32 6 C 36 8, 36 12, 32 14 C 28 16, 15 16, 4 10 Z" />
              </clipPath>
            </defs>
            
            {/* Tail Group with separate rotation */}
            <motion.g style={{ rotate: tailWiggle, transformOrigin: '8px 10px' }}>
              <path d="M 6 10 L -2 3 L 2 10 L -2 17 Z" className="fill-orange-500 dark:fill-[#0f141a] transition-colors duration-700" />
              <path d="M 4 10 L -2 6 L 0 10 L -2 14 Z" className="fill-white/80 dark:fill-[#070908] transition-colors duration-700" />
            </motion.g>
            
            {/* Pectoral Fins (Moved back slightly to match new head) */}
            <motion.g style={{ rotate: finWiggle, transformOrigin: '22px 5px' }}>
              <path d="M 22 5 L 16 -1 L 26 2 Z" className="fill-white/90 dark:fill-[#0f141a]/90 stroke-ink-900/10 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" />
            </motion.g>
            <motion.g style={{ rotate: finWiggleOpposite, transformOrigin: '22px 15px' }}>
              <path d="M 22 15 L 16 21 L 26 18 Z" className="fill-white/90 dark:fill-[#0f141a]/90 stroke-ink-900/10 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" />
            </motion.g>
            
            {/* Pelvic Fins */}
            <path d="M 12 7 L 8 2 L 15 5 Z" className="fill-white/80 dark:fill-[#0f141a]/80 stroke-ink-900/10 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" />
            <path d="M 12 13 L 8 18 L 15 15 Z" className="fill-white/80 dark:fill-[#0f141a]/80 stroke-ink-900/10 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" />

            {/* Body Base */}
            <path d="M 4 10 C 15 4, 28 4, 32 6 C 36 8, 36 12, 32 14 C 28 16, 15 16, 4 10 Z" className="fill-white dark:fill-[#0f141a] stroke-ink-900/10 dark:stroke-[#0f141a] transition-colors duration-700" strokeWidth="0.5" />
            
            {/* Patterns clipped to body */}
            <g clipPath="url(#koi-body-small)">
              <circle cx="15" cy="10" r="5" className="fill-orange-500/90 dark:fill-white/80 transition-colors duration-700" />
              <circle cx="23" cy="12" r="4" className="fill-ink-900 dark:fill-transparent transition-colors duration-700" />
              <circle cx="28" cy="7" r="3.5" className="fill-orange-500/90 dark:fill-white/70 transition-colors duration-700" />
              <circle cx="19" cy="6" r="2.5" className="fill-ink-900 dark:fill-transparent transition-colors duration-700" />
              <circle cx="11" cy="12" r="2.5" className="fill-transparent dark:fill-white/60 transition-colors duration-700" />
            </g>
            
            {/* Eyes */}
            <circle cx="31" cy="7.5" r="1.2" className="fill-ink-900 dark:fill-[#070908] transition-colors duration-700" />
            <circle cx="31" cy="12.5" r="1.2" className="fill-ink-900 dark:fill-[#070908] transition-colors duration-700" />
            <circle cx="31" cy="7.5" r="2.5" className="fill-transparent stroke-white dark:stroke-white/80 transition-colors duration-700" strokeWidth="0.5" />
            <circle cx="31" cy="12.5" r="2.5" className="fill-transparent stroke-white dark:stroke-white/80 transition-colors duration-700" strokeWidth="0.5" />
            
            {/* Whiskers */}
            <path d="M 33.5 8 Q 38 4 41 7" className="stroke-ink-900/30 dark:stroke-white/50 transition-colors duration-700" fill="none" strokeWidth="0.5" />
            <path d="M 33.5 12 Q 38 16 41 13" className="stroke-ink-900/30 dark:stroke-white/50 transition-colors duration-700" fill="none" strokeWidth="0.5" />
          </svg>"""

if target in content:
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.write(content.replace(target, replacement))
    print('SVG shape patched.')
else:
    print('SVG shape target not found.')

