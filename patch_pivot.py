import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

target = """          <motion.div
            style={{ rotate: fishWiggle, x: -6 }}
            className="relative flex items-center justify-center"
          >"""

replacement = """          <motion.div
            style={{ rotate: fishWiggle, x: -16, transformOrigin: '70% 50%' }}
            className="relative flex items-center justify-center"
          >"""

if target in content:
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.write(content.replace(target, replacement))
    print('Pivot patched.')
else:
    print('Pivot target not found.')

