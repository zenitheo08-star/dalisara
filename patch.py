import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

# Remove cursor: none
style_target = """<style dangerouslySetInnerHTML={{__html: `
        @media (pointer: fine) {
          body, body *, a, button, input, select, textarea, [role="button"] {
            cursor: none !important;
          }
        }
      `}} />"""
content = content.replace(style_target, "")

# Remove Precision Dot
dot_target = """{/* The Actual Cursor Precision Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-30 flex items-center justify-center w-0 h-0 mix-blend-difference"
        style={{ x: mouseX, y: mouseY }}
        animate={{ opacity: showFish ? 1 : 0 }}
      >
        <motion.div
          className="w-1.5 h-1.5 bg-white rounded-full"
          animate={{ scale: isPressing ? 0.5 : 1 }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>"""
content = content.replace(dot_target, "")

# Replace SVG with simpler koi
# The old SVG before the tattoo changes:
new_svg = """<svg width="60" height="50" viewBox="0 0 90 76" fill="none" className="drop-shadow-2xl transition-colors duration-700" style={{ overflow: 'visible' }}>
              {/* === TAIL GROUP === */}
              <motion.g style={{ rotate: tailBend, transformOrigin: '22px 38px' }}>
                <path d="M 23 38 C 10 23, -5 28, 0 38 C -5 48, 10 53, 23 38 Z" className="fill-[#070908]/90 dark:fill-white/90 transition-colors duration-700" />
              </motion.g>
              
              {/* === BODY & FINS GROUP === */}
              <motion.g style={{ rotate: torsoBend, transformOrigin: '40px 38px' }}>
                {/* Pelvic Fins */}
                <path d="M 35 33 C 25 18, 15 15, 12 23 C 18 25, 25 29, 30 33 Z" className="fill-[#0f141a]/90 dark:fill-white/90 transition-colors duration-700" />
                <path d="M 35 43 C 25 58, 15 61, 12 53 C 18 51, 25 47, 30 43 Z" className="fill-[#0f141a]/90 dark:fill-white/90 transition-colors duration-700" />

                {/* Body Base */}
                <path d="M 20 38 C 35 28, 55 30, 62 34 C 68 37, 68 39, 62 42 C 55 46, 35 48, 20 38 Z" className="fill-[#0f141a] dark:fill-white transition-colors duration-700" />
                
                {/* Patterns */}
                <g clipPath="url(#koi-body-flowing)">
                  <circle cx="35" cy="38" r="7" className="fill-black dark:fill-[#e2e8f0] transition-colors duration-700" />
                  <circle cx="48" cy="41" r="6" className="fill-black/80 dark:fill-[#cbd5e1] transition-colors duration-700" />
                  <circle cx="55" cy="33" r="4.5" className="fill-black/90 dark:fill-[#f8fafc] transition-colors duration-700" />
                  <circle cx="40" cy="31" r="4" className="fill-black dark:fill-[#e2e8f0] transition-colors duration-700" />
                  <circle cx="28" cy="41" r="3" className="fill-[#1a2333] dark:fill-white/60 transition-colors duration-700" />
                </g>
              </motion.g>

              {/* === HEAD & PECTORAL FINS GROUP === */}
              <motion.g style={{ rotate: finWiggle, transformOrigin: '50px 31px' }}>
                <path d="M 50 31 C 45 15, 25 5, 18 12 C 30 18, 40 25, 45 30 Z" className="fill-[#0f141a]/90 dark:fill-white/90 transition-colors duration-700" />
              </motion.g>
              <motion.g style={{ rotate: finWiggleOpposite, transformOrigin: '50px 45px' }}>
                <path d="M 50 45 C 45 61, 25 71, 18 64 C 30 58, 40 51, 45 46 Z" className="fill-[#0f141a]/90 dark:fill-white/90 transition-colors duration-700" />
              </motion.g>
              
              {/* Eyes */}
              <circle cx="58" cy="34" r="1.5" className="fill-white dark:fill-[#070908] transition-colors duration-700" />
              <circle cx="58" cy="42" r="1.5" className="fill-white dark:fill-[#070908] transition-colors duration-700" />
              <circle cx="58" cy="34" r="2.5" className="fill-transparent stroke-white/50 dark:stroke-[#070908]/50 transition-colors duration-700" strokeWidth="0.5" />
              <circle cx="58" cy="42" r="2.5" className="fill-transparent stroke-white/50 dark:stroke-[#070908]/50 transition-colors duration-700" strokeWidth="0.5" />
              
              {/* Whiskers */}
              <path d="M 62 35 C 70 28, 78 33, 85 25" className="stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" fill="none" strokeWidth="0.75" />
              <path d="M 62 41 C 70 48, 78 43, 85 51" className="stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" fill="none" strokeWidth="0.75" />
            </svg>"""

# find start and end of current SVG
import re
start_idx = content.find('<svg width="63"')
if start_idx == -1:
    start_idx = content.find('<svg width="90"')
end_idx = content.find('</svg>', start_idx) + 6

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_svg + content[end_idx:]
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.write(content)
    print("Reverted to simple koi successfully.")
else:
    print("Failed to find SVG bounds.")
