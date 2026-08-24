import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

target = """      {/* The Fish */}
      <motion.div"""

replace = """      {/* Global style to hide the default cursor */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (pointer: fine) {
          body, body *, a, button, input, select, textarea, [role="button"] {
            cursor: none !important;
          }
        }
      `}} />

      {/* The Customized Cursor (Circle) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center w-0 h-0 mix-blend-difference"
        style={{ x: mouseX, y: mouseY }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Outer Ring */}
        <motion.div
          className="absolute w-5 h-5 rounded-full border-[1.5px] border-white/80"
          animate={{ 
            scale: isPressing ? 0.7 : (hoverType !== 'none' ? 1.5 : 1),
            borderColor: isPressing ? 'rgba(255,255,255,0.9)' : (hoverType !== 'none' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.8)')
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
        {/* Inner Dot */}
        <motion.div
          className="absolute w-1.5 h-1.5 bg-white rounded-full"
          animate={{ 
            scale: isPressing ? 0.5 : (hoverType !== 'none' ? 0 : 1),
            opacity: hoverType !== 'none' ? 0 : 1
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      </motion.div>

      {/* The Fish */}
      <motion.div"""

if target in content:
    content = content.replace(target, replace)
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.write(content)
    print("Added custom cursor and hidden default cursor.")
else:
    print("Could not find target in CustomCursor.tsx")

