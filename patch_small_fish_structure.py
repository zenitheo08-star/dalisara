import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    content = f.read()

# 1. Add torsoBend and tailBend to useMotionValue declarations
target_motion_values = """  const fishWiggle = useMotionValue(0);
  const tailWiggle = useMotionValue(0);
  const finWiggle = useMotionValue(0);
  const finWiggleOpposite = useMotionValue(0);"""

replacement_motion_values = """  const spineBend = useMotionValue(0);
  const torsoBend = useMotionValue(0);
  const tailBend = useMotionValue(0);
  
  const tailWiggle = useMotionValue(0);
  const finWiggle = useMotionValue(0);
  const finWiggleOpposite = useMotionValue(0);"""

if target_motion_values in content:
    content = content.replace(target_motion_values, replacement_motion_values)
    print("Motion values added.")
else:
    print("Motion values not found.")

# 2. Update loop to calculate torsoBend and tailBend
target_loop = """        // Gentle overall body wiggle
        const bodyW = Math.sin(swimPhase.current) * Math.min(speed * 0.5, 4);
        fishWiggle.set(bodyW);
        
        // Fluid, sweeping tail motion
        tailWiggle.set(Math.sin(swimPhase.current - 1) * Math.min(speed * 1.5, 20));"""

replacement_loop = """        // Spine bending logic based on turning
        const currentBend = spineBend.get();
        // dy, dx logic gives us diff. We calculate turnSpeed using it.
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        let diff = targetAngle - fishAngle.get();
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        const turnSpeed = diff * 0.15;
        
        const bend = currentBend * 0.8 - turnSpeed * 1.8;
        spineBend.set(bend);
        
        torsoBend.set(bend * 0.6 + Math.sin(swimPhase.current) * Math.min(speed * 0.5, 4));
        tailBend.set(bend * 1.2 + Math.sin(swimPhase.current - 1) * Math.min(speed * 1.5, 20));"""

if target_loop in content:
    content = content.replace(target_loop, replacement_loop)
    print("Loop turning logic added.")
else:
    print("Loop logic not found.")
    
# 2.5 Update the else block to decay torso/tail bends
target_else = """        fishWiggle.set(fishWiggle.get() * 0.92);
        tailWiggle.set(tailWiggle.get() * 0.92);
        finWiggle.set(finWiggle.get() * 0.92);
        finWiggleOpposite.set(finWiggleOpposite.get() * 0.92);"""

replacement_else = """        spineBend.set(spineBend.get() * 0.92);
        torsoBend.set(torsoBend.get() * 0.92);
        tailBend.set(tailBend.get() * 0.92);
        finWiggle.set(finWiggle.get() * 0.92);
        finWiggleOpposite.set(finWiggleOpposite.get() * 0.92);"""

if target_else in content:
    content = content.replace(target_else, replacement_else)
    print("Loop else logic added.")
else:
    print("Loop else logic not found.")

target_else_2 = """          fishWiggle.set(Math.sin(t * 2) * 2 * blend);
          tailWiggle.set(Math.sin(t * 2 - 1) * 6 * blend);"""

replacement_else_2 = """          torsoBend.set(Math.sin(t * 2) * 2 * blend);
          tailBend.set(Math.sin(t * 2 - 1) * 6 * blend);"""

if target_else_2 in content:
    content = content.replace(target_else_2, replacement_else_2)
    print("Loop else 2 logic added.")
else:
    print("Loop else 2 logic not found.")


with open('src/components/CustomCursor.tsx', 'w') as f:
    f.write(content)
