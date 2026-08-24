import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

target = """      {/* The Fish */}
      <motion.div"""

replace = """      {/* The Actual Cursor Precision Dot */}
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
      </motion.div>

      {/* The Fish */}
      <motion.div"""

if target in content:
    content = content.replace(target, replace)
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.write(content)
    print("Dot added successfully.")
else:
    print("Target not found.")

