import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

target = """  const fishAngle = useMotionValue(0);
  const fishWiggle = useMotionValue(0);
  const fishOffsetX = useMotionValue(0);
  const fishOffsetY = useMotionValue(0);"""

replacement = """  const fishAngle = useMotionValue(0);
  const fishWiggle = useMotionValue(0);
  const tailWiggle = useMotionValue(0);
  const finWiggle = useMotionValue(0);
  const finWiggleOpposite = useMotionValue(0);
  const fishOffsetX = useMotionValue(0);
  const fishOffsetY = useMotionValue(0);"""

if target in content:
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.write(content.replace(target, replacement))
    print('Motion values patched.')
else:
    print('Motion values target not found.')

