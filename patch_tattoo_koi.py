import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

start_str = '<motion.div className="relative flex items-center justify-center"'
start_idx = content.find(start_str)
end_str = '</svg>\n          </motion.div>'
end_idx = content.find(end_str, start_idx) + len(end_str)

if start_idx != -1 and end_idx != -1:
    replacement = """<motion.div className="relative flex items-center justify-center" style={{ x: -45, y: -38 }}>
            <svg width="90" height="76" viewBox="0 0 90 76" fill="none" className="drop-shadow-2xl transition-colors duration-700" style={{ overflow: 'visible' }}>
              <defs>
                <clipPath id="koi-body-flowing">
                  {/* Elegant, slender body */}
                  <path d="M 20 38 C 35 28, 55 30, 62 34 C 68 37, 68 39, 62 42 C 55 46, 35 48, 20 38 Z" />
                </clipPath>
              </defs>
              
              {/* === TAIL GROUP === */}
              <motion.g style={{ rotate: tailBend, transformOrigin: '22px 38px' }}>
                {/* Layer 1: Long flowing outer tail */}
                <path d="M 23 38 C 10 13, -15 8, -5 23 C 0 31, 2 35, -2 38 C 2 41, 0 45, -5 53 C -15 68, 10 63, 23 38 Z" className="fill-[#070908]/90 dark:fill-white/90 transition-colors duration-700" />
                
                {/* Layer 2: Inner translucent tail */}
                <path d="M 21 38 C 12 23, -5 18, 0 28 C 3 33, 4 36, 0 38 C 4 40, 3 43, 0 48 C -5 58, 12 53, 21 38 Z" className="fill-[#1a2333]/80 dark:fill-white/60 transition-colors duration-700" />
                
                {/* Layer 3: Spine/Ray lines for detail (Tattoo aesthetic) */}
                <path d="M 20 38 Q 0 23 -8 15" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                <path d="M 20 38 Q -5 38 -12 38" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                <path d="M 20 38 Q 0 53 -8 61" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
              </motion.g>
              
              {/* === BODY & FINS GROUP === */}
              <motion.g style={{ rotate: torsoBend, transformOrigin: '40px 38px' }}>
                
                {/* Pelvic Fins (Flowing backwards) */}
                <path d="M 35 33 C 25 18, 15 15, 12 23 C 18 25, 25 29, 30 33 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/10 dark:stroke-[#0f141a]/20 transition-colors duration-700" strokeWidth="0.5" />
                <path d="M 35 43 C 25 58, 15 61, 12 53 C 18 51, 25 47, 30 43 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/10 dark:stroke-[#0f141a]/20 transition-colors duration-700" strokeWidth="0.5" />

                {/* Body Base */}
                <path d="M 20 38 C 35 28, 55 30, 62 34 C 68 37, 68 39, 62 42 C 55 46, 35 48, 20 38 Z" className="fill-[#0f141a] dark:fill-white stroke-[#070908] dark:stroke-white/50 transition-colors duration-700" strokeWidth="1" />
                
                {/* Patterns clipped to body (Subtle organic spots) */}
                <g clipPath="url(#koi-body-flowing)">
                  <circle cx="35" cy="38" r="7" className="fill-black dark:fill-[#e2e8f0] transition-colors duration-700" />
                  <circle cx="48" cy="41" r="6" className="fill-black/80 dark:fill-[#cbd5e1] transition-colors duration-700" />
                  <circle cx="55" cy="33" r="4.5" className="fill-black/90 dark:fill-[#f8fafc] transition-colors duration-700" />
                  <circle cx="40" cy="31" r="4" className="fill-black dark:fill-[#e2e8f0] transition-colors duration-700" />
                  <circle cx="28" cy="41" r="3" className="fill-[#1a2333] dark:fill-white/60 transition-colors duration-700" />
                </g>
              </motion.g>

              {/* === HEAD & PECTORAL FINS GROUP === */}
              {/* Pectoral Fins (Extremely long and elegant) */}
              <motion.g style={{ rotate: finWiggle, transformOrigin: '50px 31px' }}>
                <path d="M 50 31 C 45 8, 25 -2, 18 5 C 30 11, 40 21, 45 30 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/10 dark:stroke-[#0f141a]/20 transition-colors duration-700" strokeWidth="0.5" />
                <path d="M 48 30 Q 35 13 22 11" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
              </motion.g>
              <motion.g style={{ rotate: finWiggleOpposite, transformOrigin: '50px 45px' }}>
                <path d="M 50 45 C 45 68, 25 78, 18 71 C 30 65, 40 55, 45 46 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/10 dark:stroke-[#0f141a]/20 transition-colors duration-700" strokeWidth="0.5" />
                <path d="M 48 46 Q 35 63 22 65" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
              </motion.g>
              
              {/* Eyes (High contrast) */}
              <circle cx="58" cy="34" r="1.5" className="fill-white dark:fill-[#070908] transition-colors duration-700" />
              <circle cx="58" cy="42" r="1.5" className="fill-white dark:fill-[#070908] transition-colors duration-700" />
              <circle cx="58" cy="34" r="2.5" className="fill-transparent stroke-white/50 dark:stroke-[#070908]/50 transition-colors duration-700" strokeWidth="0.5" />
              <circle cx="58" cy="42" r="2.5" className="fill-transparent stroke-white/50 dark:stroke-[#070908]/50 transition-colors duration-700" strokeWidth="0.5" />
              
              {/* Flowing Whiskers (Barbels) - Long and elegant */}
              <path d="M 62 35 C 70 28, 78 33, 85 25" className="stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" fill="none" strokeWidth="0.75" />
              <path d="M 62 41 C 70 48, 78 43, 85 51" className="stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" fill="none" strokeWidth="0.75" />
            </svg>
          </motion.div>"""
    
    new_content = content[:start_idx] + replacement + content[end_idx:]
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.write(new_content)
    print("Tattoo SVG replaced successfully.")
else:
    print("Tags not found.")
