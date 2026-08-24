import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

# Current closing tag for torsoBend is after the spots
target = """                  <circle cx="25" cy="40" r="2.5" className="fill-[#1a2333] dark:fill-white/60 transition-colors duration-700" />
                </g>
              </motion.g>

              {/* === HEAD & PECTORAL FINS GROUP === */}
              {/* Pectoral Fins (Extremely long and elegant) */}
              {/* Pectoral Fins (Flowing layers like a sketch) */}
              <motion.g style={{ rotate: finWiggle, transformOrigin: '55px 33px' }}>
                {/* Main large fin */}
                <path d="M 55 33 C 45 -5, 10 -15, 0 10 C 20 12, 35 22, 50 31 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/20 dark:stroke-[#0f141a]/30 transition-colors duration-700" strokeWidth="0.5" />
                {/* Secondary flowing tendril */}
                <path d="M 50 31 C 40 5, 20 -5, -10 -5 C 10 5, 25 18, 45 30" className="fill-transparent stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" strokeWidth="0.5" />
                {/* Ink ray lines */}
                <path d="M 52 31 Q 30 10 10 7" className="stroke-white/30 dark:stroke-[#0f141a]/30 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                <path d="M 45 28 Q 30 0 -5 2" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
              </motion.g>
              <motion.g style={{ rotate: finWiggleOpposite, transformOrigin: '55px 43px' }}>
                <path d="M 55 43 C 45 81, 10 91, 0 66 C 20 64, 35 54, 50 45 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/20 dark:stroke-[#0f141a]/30 transition-colors duration-700" strokeWidth="0.5" />
                <path d="M 50 45 C 40 71, 20 81, -10 81 C 10 71, 25 58, 45 46" className="fill-transparent stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" strokeWidth="0.5" />
                <path d="M 52 45 Q 30 66 10 69" className="stroke-white/30 dark:stroke-[#0f141a]/30 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                <path d="M 45 48 Q 30 76 -5 74" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
              </motion.g>"""

replace = """                  <circle cx="25" cy="40" r="2.5" className="fill-[#1a2333] dark:fill-white/60 transition-colors duration-700" />
                </g>

                {/* === PECTORAL FINS (Inside Torso to stay attached) === */}
                <motion.g style={{ rotate: finWiggle, transformOrigin: '55px 33px' }}>
                  {/* Main large fin */}
                  <path d="M 55 33 C 45 -5, 10 -15, 0 10 C 20 12, 35 22, 50 31 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/20 dark:stroke-[#0f141a]/30 transition-colors duration-700" strokeWidth="0.5" />
                  {/* Secondary flowing tendril */}
                  <path d="M 50 31 C 40 5, 20 -5, -10 -5 C 10 5, 25 18, 45 30" className="fill-transparent stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" strokeWidth="0.5" />
                  {/* Ink ray lines */}
                  <path d="M 52 31 Q 30 10 10 7" className="stroke-white/30 dark:stroke-[#0f141a]/30 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                  <path d="M 45 28 Q 30 0 -5 2" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                </motion.g>
                <motion.g style={{ rotate: finWiggleOpposite, transformOrigin: '55px 43px' }}>
                  <path d="M 55 43 C 45 81, 10 91, 0 66 C 20 64, 35 54, 50 45 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/20 dark:stroke-[#0f141a]/30 transition-colors duration-700" strokeWidth="0.5" />
                  <path d="M 50 45 C 40 71, 20 81, -10 81 C 10 71, 25 58, 45 46" className="fill-transparent stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" strokeWidth="0.5" />
                  <path d="M 52 45 Q 30 66 10 69" className="stroke-white/30 dark:stroke-[#0f141a]/30 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                  <path d="M 45 48 Q 30 76 -5 74" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                </motion.g>
              </motion.g>"""

if target in content:
    content = content.replace(target, replace)
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.write(content)
    print("Pectoral fins moved inside torsoBend.")
else:
    print("Could not find pectoral fins target.")
