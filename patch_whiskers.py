import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

# Add motion values
mv_target = "  const finWiggleOpposite = useMotionValue(0);"
mv_replace = "  const finWiggleOpposite = useMotionValue(0);\n  const whiskerLeftBend = useMotionValue(0);\n  const whiskerRightBend = useMotionValue(0);"
if mv_target in content:
    content = content.replace(mv_target, mv_replace)
    print("Added motion values.")

# Add loop logic for active movement
loop_target = "finWiggleOpposite.set(Math.sin(swimPhase.current + Math.PI) * Math.min(speed * 1, 15));"
loop_replace = """finWiggleOpposite.set(Math.sin(swimPhase.current + Math.PI) * Math.min(speed * 1, 15));
        
        // Whisker physics (bend against the turn and sway gently)
        whiskerLeftBend.set(turnSpeed * 1.5 + Math.sin(swimPhase.current * 1.5) * Math.min(speed * 0.5, 5));
        whiskerRightBend.set(turnSpeed * 1.5 - Math.sin(swimPhase.current * 1.5) * Math.min(speed * 0.5, 5));"""
if loop_target in content:
    content = content.replace(loop_target, loop_replace)
    print("Added loop logic.")

# Add loop logic for idle
idle_target = "finWiggleOpposite.set(finWiggleOpposite.get() * 0.92);"
idle_replace = """finWiggleOpposite.set(finWiggleOpposite.get() * 0.92);
        whiskerLeftBend.set(whiskerLeftBend.get() * 0.92);
        whiskerRightBend.set(whiskerRightBend.get() * 0.92);"""
if idle_target in content:
    content = content.replace(idle_target, idle_replace)
    print("Added idle logic 1.")

idle2_target = "finWiggleOpposite.set(Math.sin(t * 2 + Math.PI) * 4 * blend);"
idle2_replace = """finWiggleOpposite.set(Math.sin(t * 2 + Math.PI) * 4 * blend);
          whiskerLeftBend.set(Math.sin(t * 1.5) * 5 * blend);
          whiskerRightBend.set(-Math.sin(t * 1.5) * 5 * blend);"""
if idle2_target in content:
    content = content.replace(idle2_target, idle2_replace)
    print("Added idle logic 2.")

# Wrap whiskers in motion.g
svg_target = """              {/* Flowing Whiskers (Barbels) - Long and elegant */}
              <path d="M 62 35 C 70 28, 78 33, 85 25" className="stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" fill="none" strokeWidth="0.75" />
              <path d="M 62 41 C 70 48, 78 43, 85 51" className="stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" fill="none" strokeWidth="0.75" />"""
svg_replace = """              {/* Flowing Whiskers (Barbels) - Long and elegant */}
              <motion.g style={{ rotate: whiskerLeftBend, transformOrigin: '62px 35px' }}>
                <path d="M 62 35 C 70 28, 78 33, 85 25" className="stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" fill="none" strokeWidth="0.75" />
              </motion.g>
              <motion.g style={{ rotate: whiskerRightBend, transformOrigin: '62px 41px' }}>
                <path d="M 62 41 C 70 48, 78 43, 85 51" className="stroke-[#0f141a]/80 dark:stroke-white/80 transition-colors duration-700" fill="none" strokeWidth="0.75" />
              </motion.g>"""
if svg_target in content:
    content = content.replace(svg_target, svg_replace)
    print("Added SVG wrapping.")
    
with open('src/components/CustomCursor.tsx', 'w') as f:
    f.write(content)
