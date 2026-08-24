import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

# Replace the body clipPath
target_clip = """                <clipPath id="koi-body-flowing">
                  {/* Elegant, slender body */}
                  <path d="M 20 38 C 35 28, 55 30, 62 34 C 68 37, 68 39, 62 42 C 55 46, 35 48, 20 38 Z" />
                </clipPath>"""
replace_clip = """                <clipPath id="koi-body-flowing">
                  {/* Elegant, highly slender body */}
                  <path d="M 12 38 C 30 25, 55 31, 65 35 C 72 38, 72 38, 65 41 C 55 45, 30 51, 12 38 Z" />
                </clipPath>"""
content = content.replace(target_clip, replace_clip)

# Replace the body base
target_body = """                {/* Body Base */}
                <path d="M 20 38 C 35 28, 55 30, 62 34 C 68 37, 68 39, 62 42 C 55 46, 35 48, 20 38 Z" className="fill-[#0f141a] dark:fill-white stroke-[#070908] dark:stroke-white/50 transition-colors duration-700" strokeWidth="1" />"""
replace_body = """                {/* Body Base */}
                <path d="M 12 38 C 30 25, 55 31, 65 35 C 72 38, 72 38, 65 41 C 55 45, 30 51, 12 38 Z" className="fill-[#0f141a] dark:fill-white stroke-[#070908] dark:stroke-white/50 transition-colors duration-700" strokeWidth="0.5" />"""
content = content.replace(target_body, replace_body)

# Replace Pelvic Fins
target_pelvic = """                {/* Pelvic Fins (Flowing backwards) */}
                <path d="M 35 33 C 25 18, 15 15, 12 23 C 18 25, 25 29, 30 33 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/10 dark:stroke-[#0f141a]/20 transition-colors duration-700" strokeWidth="0.5" />
                <path d="M 35 43 C 25 58, 15 61, 12 53 C 18 51, 25 47, 30 43 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/10 dark:stroke-[#0f141a]/20 transition-colors duration-700" strokeWidth="0.5" />"""
replace_pelvic = """                {/* Pelvic Fins (Wispy and flowing) */}
                <path d="M 40 33 C 25 20, 10 18, 5 25 C 15 26, 25 30, 32 34 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/20 dark:stroke-[#0f141a]/30 transition-colors duration-700" strokeWidth="0.5" />
                <path d="M 40 43 C 25 56, 10 58, 5 51 C 15 50, 25 46, 32 42 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/20 dark:stroke-[#0f141a]/30 transition-colors duration-700" strokeWidth="0.5" />
                
                {/* Internal ray lines for pelvic fins */}
                <path d="M 35 33 Q 20 22 8 24" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                <path d="M 35 43 Q 20 54 8 52" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />"""
content = content.replace(target_pelvic, replace_pelvic)

# Replace Patterns (spots) - reposition based on new body
target_spots = """                  <circle cx="35" cy="38" r="7" className="fill-black dark:fill-[#e2e8f0] transition-colors duration-700" />
                  <circle cx="48" cy="41" r="6" className="fill-black/80 dark:fill-[#cbd5e1] transition-colors duration-700" />
                  <circle cx="55" cy="33" r="4.5" className="fill-black/90 dark:fill-[#f8fafc] transition-colors duration-700" />
                  <circle cx="40" cy="31" r="4" className="fill-black dark:fill-[#e2e8f0] transition-colors duration-700" />
                  <circle cx="28" cy="41" r="3" className="fill-[#1a2333] dark:fill-white/60 transition-colors duration-700" />"""
replace_spots = """                  <circle cx="35" cy="38" r="6" className="fill-black dark:fill-[#e2e8f0] transition-colors duration-700" />
                  <circle cx="48" cy="40" r="4.5" className="fill-black/80 dark:fill-[#cbd5e1] transition-colors duration-700" />
                  <circle cx="58" cy="35" r="3" className="fill-black/90 dark:fill-[#f8fafc] transition-colors duration-700" />
                  <circle cx="42" cy="33" r="3.5" className="fill-black dark:fill-[#e2e8f0] transition-colors duration-700" />
                  <circle cx="25" cy="40" r="2.5" className="fill-[#1a2333] dark:fill-white/60 transition-colors duration-700" />"""
content = content.replace(target_spots, replace_spots)

# Make pectoral fins more elegant and wispy
target_pectoral = """              <motion.g style={{ rotate: finWiggle, transformOrigin: '50px 31px' }}>
                <path d="M 50 31 C 45 8, 25 -2, 18 5 C 30 11, 40 21, 45 30 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/10 dark:stroke-[#0f141a]/20 transition-colors duration-700" strokeWidth="0.5" />
                <path d="M 48 30 Q 35 13 22 11" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
              </motion.g>
              <motion.g style={{ rotate: finWiggleOpposite, transformOrigin: '50px 45px' }}>
                <path d="M 50 45 C 45 68, 25 78, 18 71 C 30 65, 40 55, 45 46 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/10 dark:stroke-[#0f141a]/20 transition-colors duration-700" strokeWidth="0.5" />
                <path d="M 48 46 Q 35 63 22 65" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
              </motion.g>"""
replace_pectoral = """              {/* Pectoral Fins (Flowing layers like a sketch) */}
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
content = content.replace(target_pectoral, replace_pectoral)

# Reposition eyes slightly for new head shape
target_eyes = """              {/* Eyes (High contrast) */}
              <circle cx="58" cy="34" r="1.5" className="fill-white dark:fill-[#070908] transition-colors duration-700" />
              <circle cx="58" cy="42" r="1.5" className="fill-white dark:fill-[#070908] transition-colors duration-700" />
              <circle cx="58" cy="34" r="2.5" className="fill-transparent stroke-white/50 dark:stroke-[#070908]/50 transition-colors duration-700" strokeWidth="0.5" />
              <circle cx="58" cy="42" r="2.5" className="fill-transparent stroke-white/50 dark:stroke-[#070908]/50 transition-colors duration-700" strokeWidth="0.5" />"""
replace_eyes = """              {/* Eyes (High contrast) */}
              <circle cx="61" cy="35" r="1.2" className="fill-white dark:fill-[#070908] transition-colors duration-700" />
              <circle cx="61" cy="41" r="1.2" className="fill-white dark:fill-[#070908] transition-colors duration-700" />
              <circle cx="61" cy="35" r="2.2" className="fill-transparent stroke-white/60 dark:stroke-[#070908]/60 transition-colors duration-700" strokeWidth="0.5" />
              <circle cx="61" cy="41" r="2.2" className="fill-transparent stroke-white/60 dark:stroke-[#070908]/60 transition-colors duration-700" strokeWidth="0.5" />"""
content = content.replace(target_eyes, replace_eyes)

# Update Whiskers (update transformOrigin to match new eyes)
target_whiskers = """              {/* Flowing Whiskers (Barbels) - Long and elegant */}
              <motion.g style={{ rotate: whiskerLeftBend, transformOrigin: '62px 35px' }}>
                <path d="M 62 35 C 70 28, 78 33, 85 25" className="stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" fill="none" strokeWidth="0.75" />
              </motion.g>
              <motion.g style={{ rotate: whiskerRightBend, transformOrigin: '62px 41px' }}>
                <path d="M 62 41 C 70 48, 78 43, 85 51" className="stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" fill="none" strokeWidth="0.75" />
              </motion.g>"""
replace_whiskers = """              {/* Flowing Whiskers (Barbels) - Long and elegant with dynamic physics */}
              <motion.g style={{ rotate: whiskerLeftBend, transformOrigin: '64px 36px' }}>
                <path d="M 64 36 C 75 30, 85 40, 95 30" className="stroke-[#0f141a]/70 dark:stroke-white/70 transition-colors duration-700" fill="none" strokeWidth="0.5" />
              </motion.g>
              <motion.g style={{ rotate: whiskerRightBend, transformOrigin: '64px 40px' }}>
                <path d="M 64 40 C 75 46, 85 36, 95 46" className="stroke-[#0f141a]/70 dark:stroke-white/70 transition-colors duration-700" fill="none" strokeWidth="0.5" />
              </motion.g>"""
content = content.replace(target_whiskers, replace_whiskers)

with open('src/components/CustomCursor.tsx', 'w') as f:
    f.write(content)
print("Applied tattoo body/fin styling refinements.")
