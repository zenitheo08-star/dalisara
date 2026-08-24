import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

target = """      {/* The Customized Cursor */}
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

replace = """      {/* The Customized Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center w-0 h-0 mix-blend-difference"
        style={{ x: mouseX, y: mouseY }}
        animate={{ opacity: showFish ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Outer Ring */}
        <motion.div
          className="absolute w-5 h-5 rounded-full border-[1.5px] border-white"
          animate={{ 
            scale: isPressing ? 0.7 : (hoverType !== 'default' && hoverType !== 'none' ? 1.5 : 1),
            opacity: hoverType === 'text' ? 0 : 1
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
        {/* Inner Dot */}
        <motion.div
          className="absolute w-1.5 h-1.5 bg-white rounded-full"
          animate={{ 
            scale: hoverType === 'text' ? 0 : (isPressing ? 0.5 : (hoverType !== 'default' && hoverType !== 'none' ? 0 : 1)),
            opacity: hoverType !== 'default' && hoverType !== 'none' ? 0 : 1
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
        {/* Text Beam (only shows for text inputs) */}
        <motion.div
          className="absolute w-[2px] h-5 bg-white rounded-full"
          animate={{
            opacity: hoverType === 'text' ? 1 : 0,
            scaleY: hoverType === 'text' ? 1 : 0
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      </motion.div>"""

if target in content:
    content = content.replace(target, replace)
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.write(content)
    print("Restored ring/dot cursor successfully")
else:
    print("Could not find target")
