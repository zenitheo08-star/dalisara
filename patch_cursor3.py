import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

# 1. Fix the stacking context so mix-blend-difference works.
# Let's remove the wrapper div and just use a Fragment.
target_wrapper_start = """  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none">
      <canvas"""
replace_wrapper_start = """  return createPortal(
    <>
      <canvas"""

target_wrapper_end = """      </motion.div>
    </div>,
    document.body"""
replace_wrapper_end = """      </motion.div>
    </>,
    document.body"""

content = content.replace(target_wrapper_start, replace_wrapper_start)
content = content.replace(target_wrapper_end, replace_wrapper_end)

# Also ensure canvas has z-index if needed, it had none directly before, 
# but we can give it z-[999998] and the cursor z-[999999].
# Wait, canvas had `pointer-events-none absolute inset-0 mix-blend-normal`
content = content.replace(
    '<canvas\n        ref={canvasRef}\n        aria-hidden="true"\n        className="pointer-events-none absolute inset-0 mix-blend-normal"',
    '<canvas\n        ref={canvasRef}\n        aria-hidden="true"\n        className="pointer-events-none fixed inset-0 mix-blend-normal z-[999998]"'
)

# Update z-indices
content = content.replace('className="fixed top-0 left-0 pointer-events-none z-[100]', 'className="fixed top-0 left-0 pointer-events-none z-[999999]')
content = content.replace('className="fixed top-0 left-0 pointer-events-none will-change-transform flex items-center justify-center w-0 h-0 z-20"', 'className="fixed top-0 left-0 pointer-events-none will-change-transform flex items-center justify-center w-0 h-0 z-[999999]"')

# 2. Fix the Koi SVG animation by properly nesting the tail inside the torso, and fixing transform origins.
old_svg = """<svg width="60" height="50" viewBox="0 0 90 76" fill="none" className="drop-shadow-2xl transition-colors duration-700" style={{ overflow: 'visible' }}>
              <defs>
                <clipPath id="koi-body-flowing">
                  <path d="M 20 38 C 35 28, 55 30, 62 34 C 68 37, 68 39, 62 42 C 55 46, 35 48, 20 38 Z" />
                </clipPath>
              </defs>
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
              </motion.g>"""

new_svg = """<svg width="60" height="50" viewBox="0 0 90 76" fill="none" className="drop-shadow-2xl transition-colors duration-700" style={{ overflow: 'visible' }}>
              <defs>
                <clipPath id="koi-body-flowing">
                  <path d="M 20 38 C 35 28, 55 30, 62 34 C 68 37, 68 39, 62 42 C 55 46, 35 48, 20 38 Z" />
                </clipPath>
              </defs>
              
              {/* === BODY & FINS GROUP === */}
              <motion.g style={{ rotate: torsoBend, transformOrigin: '40px 38px' }}>
                
                {/* === TAIL GROUP (Nested inside torso so it follows the body's bend) === */}
                <motion.g style={{ rotate: tailBend, transformOrigin: '22px 38px' }}>
                  <path d="M 23 38 C 10 23, -5 28, 0 38 C -5 48, 10 53, 23 38 Z" className="fill-[#070908]/90 dark:fill-white/90 transition-colors duration-700" />
                </motion.g>

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
              </motion.g>"""

if old_svg in content:
    content = content.replace(old_svg, new_svg)
else:
    print("Could not find old_svg")

with open('src/components/CustomCursor.tsx', 'w') as f:
    f.write(content)
print("Updated cursor stacking context and fish animation.")
