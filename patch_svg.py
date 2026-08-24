import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

start_tag = '<motion.div\n            style={{ rotate: fishWiggle, x: -16, transformOrigin: \'70% 50%\' }}\n            className="relative flex items-center justify-center"\n          >'

end_tag = '</motion.div>\n        </motion.div>'

if start_tag in content and end_tag in content:
    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag, start_idx) + len('</motion.div>')
    
    replacement = """<motion.div className="relative flex items-center justify-center" style={{ x: -25, y: -15 }}>
            <svg width="50" height="30" viewBox="0 0 50 30" fill="none" className="drop-shadow-md transition-colors duration-700" style={{ overflow: 'visible' }}>
              <defs>
                <clipPath id="koi-head-clip">
                  <path d="M 28 9 C 40 9, 46 12, 46 15 C 46 18, 40 21, 28 21 Z" />
                </clipPath>
                <clipPath id="koi-torso-clip">
                  <path d="M 20 10.5 C 28 10.5, 32 10.5, 32 15 C 32 19.5, 28 19.5, 20 19.5 Z" />
                </clipPath>
                <clipPath id="koi-tailbase-clip">
                  <path d="M 14 12 C 20 12, 24 12.5, 24 15 C 24 17.5, 20 18, 14 18 Z" />
                </clipPath>
              </defs>

              {/* === HIERARCHICAL BODY === */}
              {/* Root Group (Head) */}
              <g>
                
                {/* Pectoral Fins */}
                <motion.g style={{ rotate: finWiggle, transformOrigin: '36px 11px' }}>
                  <path d="M 36 11 C 35 3, 26 0, 25 5 C 28 8, 32 10, 36 11 Z" className="fill-white/90 dark:fill-[#0f141a]/90 stroke-ink-900/10 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" />
                </motion.g>
                <motion.g style={{ rotate: finWiggleOpposite, transformOrigin: '36px 19px' }}>
                  <path d="M 36 19 C 35 27, 26 30, 25 25 C 28 22, 32 20, 36 19 Z" className="fill-white/90 dark:fill-[#0f141a]/90 stroke-ink-900/10 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" />
                </motion.g>

                {/* Head Body */}
                <path d="M 28 9 C 40 9, 46 12, 46 15 C 46 18, 40 21, 28 21 Z" className="fill-white dark:fill-[#0f141a] stroke-ink-900/10 dark:stroke-[#0f141a] transition-colors duration-700" strokeWidth="0.5" />
                
                {/* Head Patterns */}
                <g clipPath="url(#koi-head-clip)">
                  <circle cx="34" cy="15" r="6" className="fill-orange-500/90 dark:fill-white/80 transition-colors duration-700" />
                  <circle cx="42" cy="12" r="4" className="fill-ink-900 dark:fill-transparent transition-colors duration-700" />
                  <circle cx="28" cy="18" r="3.5" className="fill-orange-500/90 dark:fill-white/70 transition-colors duration-700" />
                </g>

                {/* Eyes */}
                <circle cx="42" cy="11.5" r="1.2" className="fill-ink-900 dark:fill-[#070908] transition-colors duration-700" />
                <circle cx="42" cy="18.5" r="1.2" className="fill-ink-900 dark:fill-[#070908] transition-colors duration-700" />
                <circle cx="42" cy="11.5" r="2" className="fill-transparent stroke-white dark:stroke-white/80 transition-colors duration-700" strokeWidth="0.5" />
                <circle cx="42" cy="18.5" r="2" className="fill-transparent stroke-white dark:stroke-white/80 transition-colors duration-700" strokeWidth="0.5" />

                {/* Whiskers (Sweeping back organically) */}
                <path d="M 45 12 C 48 10, 46 7, 43 8" className="stroke-ink-900/40 dark:stroke-white/60 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                <path d="M 45 18 C 48 20, 46 23, 43 22" className="stroke-ink-900/40 dark:stroke-white/60 transition-colors duration-700" fill="none" strokeWidth="0.5" />

                {/* === TORSO GROUP === */}
                <motion.g style={{ rotate: torsoBend, transformOrigin: '28px 15px' }}>
                  
                  {/* Pelvic Fins */}
                  <path d="M 26 11 C 25 7, 20 6, 19 9 C 22 10, 24 11, 26 11 Z" className="fill-white/80 dark:fill-[#0f141a]/80 stroke-ink-900/10 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" />
                  <path d="M 26 19 C 25 23, 20 24, 19 21 C 22 20, 24 19, 26 19 Z" className="fill-white/80 dark:fill-[#0f141a]/80 stroke-ink-900/10 dark:stroke-white/30 transition-colors duration-700" strokeWidth="0.5" />

                  {/* Torso Body */}
                  <path d="M 20 10.5 C 28 10.5, 32 10.5, 32 15 C 32 19.5, 28 19.5, 20 19.5 Z" className="fill-white dark:fill-[#0f141a] stroke-ink-900/10 dark:stroke-[#0f141a] transition-colors duration-700" strokeWidth="0.5" />
                  
                  {/* Torso Patterns */}
                  <g clipPath="url(#koi-torso-clip)">
                     <circle cx="24" cy="12" r="3.5" className="fill-ink-900 dark:fill-transparent transition-colors duration-700" />
                     <circle cx="26" cy="17" r="4" className="fill-orange-500/90 dark:fill-white/80 transition-colors duration-700" />
                  </g>

                  {/* === TAIL GROUP === */}
                  <motion.g style={{ rotate: tailBend, transformOrigin: '20px 15px' }}>
                    
                    {/* Tail Base */}
                    <path d="M 14 12 C 20 12, 24 12.5, 24 15 C 24 17.5, 20 18, 14 18 Z" className="fill-white dark:fill-[#0f141a] stroke-ink-900/10 dark:stroke-[#0f141a] transition-colors duration-700" strokeWidth="0.5" />
                    
                    {/* Tail Base Patterns */}
                    <g clipPath="url(#koi-tailbase-clip)">
                       <circle cx="18" cy="15" r="3" className="fill-ink-900 dark:fill-transparent transition-colors duration-700" />
                    </g>

                    {/* Tail Fin */}
                    <path d="M 16 15 C 10 5, 5 8, 6 15 C 5 22, 10 25, 16 15 Z" className="fill-white/80 dark:fill-[#070908] transition-colors duration-700" />
                    <path d="M 18 15 C 10 3, 3 8, 4 15 C 3 22, 10 27, 18 15 Z" className="fill-orange-500/90 dark:fill-[#0f141a]/80 transition-colors duration-700" />
                    
                  </motion.g>
                </motion.g>
              </g>
            </svg>
          </motion.div>"""
    
    new_content = content[:start_idx] + replacement + content[end_idx:]
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.write(new_content)
    print("SVG replaced successfully.")
else:
    print("Tags not found.")
