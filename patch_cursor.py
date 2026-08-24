import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

# 1. Update the Customized Cursor (Circle) to only show when showFish is true,
#    and change its style to match the ink-on-paper editorial theme.
old_custom_cursor = """      {/* The Customized Cursor (Circle) */}
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
      </motion.div>"""

new_custom_cursor = """      {/* The Customized Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center w-0 h-0 mix-blend-difference"
        style={{ x: mouseX, y: mouseY }}
        animate={{ opacity: showFish ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Inner Dot */}
        <motion.div
          className="absolute w-2 h-2 bg-white rounded-full"
          animate={{ 
            scale: hoverType === 'text' ? 0 : (isPressing ? 0.5 : (hoverType !== 'default' ? 2 : 1)),
            opacity: hoverType === 'text' ? 0 : 1
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
        {/* Text Beam */}
        <motion.div
          className="absolute w-[2px] h-5 bg-white rounded-full"
          animate={{
            opacity: hoverType === 'text' ? 1 : 0,
            scaleY: hoverType === 'text' ? 1 : 0
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      </motion.div>"""

if old_custom_cursor in content:
    content = content.replace(old_custom_cursor, new_custom_cursor)
else:
    print("Could not find old_custom_cursor")
    
# 2. Remove the old yellow dot
old_yellow_dot = """      <motion.div
        className="fixed top-0 left-0 pointer-events-none will-change-transform z-50 flex items-center justify-center w-0 h-0"
        style={{
          x: mouseX,
          y: mouseY,
        }}
      >
        <motion.div
          className="rounded-full bg-[#FBBF24]"
          animate={{
            width: hoverType === 'text' ? 2 : 5,
            height: hoverType === 'text' ? 24 : 5,
            opacity: isVisible ? (hoverType === 'button' || hoverType === 'link' ? 0 : hoverType === 'text' ? 0.6 : 0.95) : 0,
            scale: isPressing ? 0.75 : 1,
            boxShadow: hoverType === 'button' || hoverType === 'link' || hoverType === 'text' ? 'none' : '0 0 5px rgba(245, 158, 11, 0.75)',
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      </motion.div>"""

if old_yellow_dot in content:
    content = content.replace(old_yellow_dot, "")
else:
    print("Could not find old_yellow_dot")

with open('src/components/CustomCursor.tsx', 'w') as f:
    f.write(content)
print("Updated cursor successfully")
