import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

start_str = '{/* === TAIL GROUP === */}'
end_str = '</motion.g>\n\n              {/* === HEAD & PECTORAL FINS GROUP === */}'

start_idx = content.find(start_str)
end_idx = content.find(end_str) + len('</motion.g>')

if start_idx == -1 or end_idx == -1:
    print("Could not find skeleton bounds")
    sys.exit(1)

replacement = """{/* === BODY & TAIL SKELETON === */}
              <motion.g style={{ rotate: torsoBend, transformOrigin: '58px 38px' }}>
                
                {/* TAIL (Child of Torso to stay attached) */}
                <motion.g style={{ rotate: tailBend, transformOrigin: '15px 38px' }}>
                  {/* Layer 1: Long flowing outer tail */}
                  <path d="M 23 38 C 10 13, -15 8, -5 23 C 0 31, 2 35, -2 38 C 2 41, 0 45, -5 53 C -15 68, 10 63, 23 38 Z" className="fill-[#070908]/90 dark:fill-white/90 transition-colors duration-700" />
                  
                  {/* Layer 2: Inner translucent tail */}
                  <path d="M 21 38 C 12 23, -5 18, 0 28 C 3 33, 4 36, 0 38 C 4 40, 3 43, 0 48 C -5 58, 12 53, 21 38 Z" className="fill-[#1a2333]/80 dark:fill-white/60 transition-colors duration-700" />
                  
                  {/* Layer 3: Spine/Ray lines for detail (Tattoo aesthetic) */}
                  <path d="M 20 38 Q 0 23 -8 15" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                  <path d="M 20 38 Q -5 38 -12 38" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                  <path d="M 20 38 Q 0 53 -8 61" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                </motion.g>
                
                {/* Pelvic Fins (Wispy and flowing) */}
                <path d="M 40 33 C 25 20, 10 18, 5 25 C 15 26, 25 30, 32 34 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/20 dark:stroke-[#0f141a]/30 transition-colors duration-700" strokeWidth="0.5" />
                <path d="M 40 43 C 25 56, 10 58, 5 51 C 15 50, 25 46, 32 42 Z" className="fill-[#0f141a]/90 dark:fill-white/90 stroke-white/20 dark:stroke-[#0f141a]/30 transition-colors duration-700" strokeWidth="0.5" />
                
                {/* Internal ray lines for pelvic fins */}
                <path d="M 35 33 Q 20 22 8 24" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />
                <path d="M 35 43 Q 20 54 8 52" className="stroke-white/20 dark:stroke-[#0f141a]/20 transition-colors duration-700" fill="none" strokeWidth="0.5" />

                {/* Body Base */}
                <path d="M 12 38 C 30 25, 55 31, 65 35 C 72 38, 72 38, 65 41 C 55 45, 30 51, 12 38 Z" className="fill-[#0f141a] dark:fill-white stroke-[#070908] dark:stroke-white/50 transition-colors duration-700" strokeWidth="0.5" />
                
                {/* Patterns clipped to body (Subtle organic spots) */}
                <g clipPath="url(#koi-body-flowing)">
                  <circle cx="35" cy="38" r="6" className="fill-black dark:fill-[#e2e8f0] transition-colors duration-700" />
                  <circle cx="48" cy="40" r="4.5" className="fill-black/80 dark:fill-[#cbd5e1] transition-colors duration-700" />
                  <circle cx="58" cy="35" r="3" className="fill-black/90 dark:fill-[#f8fafc] transition-colors duration-700" />
                  <circle cx="42" cy="33" r="3.5" className="fill-black dark:fill-[#e2e8f0] transition-colors duration-700" />
                  <circle cx="25" cy="40" r="2.5" className="fill-[#1a2333] dark:fill-white/60 transition-colors duration-700" />
                </g>
              </motion.g>"""

new_content = content[:start_idx] + replacement + content[end_idx:]

with open('src/components/CustomCursor.tsx', 'w') as f:
    f.write(new_content)
print("Skeleton nested successfully.")
