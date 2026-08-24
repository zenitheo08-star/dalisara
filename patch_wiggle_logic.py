import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if '        // Natural swim phase scaling' in line:
        start_idx = i
    if start_idx != -1 and '        } // END OF IDLE IF' in line or 'simRef.current.step();' in line:
        if 'simRef.current.step();' in line:
            end_idx = i
            break

if start_idx != -1 and end_idx != -1:
    replacement = """        // Natural swim phase scaling (slower frequency for more fluid, less frantic movement)
        swimPhase.current += speed * 0.08;

        // Gentle overall body wiggle
        const bodyW = Math.sin(swimPhase.current) * Math.min(speed * 0.5, 4);
        fishWiggle.set(bodyW);
        
        // Fluid, sweeping tail motion
        tailWiggle.set(Math.sin(swimPhase.current - 1) * Math.min(speed * 1.5, 20));
        
        // Synchronized pectoral fin paddling
        finWiggle.set(Math.sin(swimPhase.current) * Math.min(speed * 1, 15));
        finWiggleOpposite.set(Math.sin(swimPhase.current + Math.PI) * Math.min(speed * 1, 15));

        const simX = bx / WATER_SCALE;
        const simY = by / WATER_SCALE;
        
        simRef.current.disturb(simX, simY, 1.2, Math.min(speed * 2, 25));
        
        // Trailing wake behind fish
        const trailingDx = bx - dx * 1.5;
        const trailingDy = by - dy * 1.5;
        simRef.current.disturb(trailingDx / WATER_SCALE, trailingDy / WATER_SCALE, 1.5, -Math.min(speed * 1.2, 12));
      } else {
        // Smooth return to resting state
        fishWiggle.set(fishWiggle.get() * 0.92);
        tailWiggle.set(tailWiggle.get() * 0.92);
        finWiggle.set(finWiggle.get() * 0.92);
        finWiggleOpposite.set(finWiggleOpposite.get() * 0.92);

        // Fish AI Idle drifting
        const idleTime = performance.now() - lastMoveTime.current;
        if (idleTime > 1500) {
          const t = (idleTime - 1500) * 0.001; // seconds
          
          // Gentle floating offset
          const offsetX = Math.sin(t * 0.8) * 8;
          const offsetY = Math.sin(t * 1.2) * 5;
          
          // Blend into the drift smoothly over the first second
          const blend = Math.min(1, t);
          fishOffsetX.set(fishOffsetX.get() * (1 - blend) + offsetX * blend);
          fishOffsetY.set(fishOffsetY.get() * (1 - blend) + offsetY * blend);
          
          // Calculate angle for idle drift using derivative of offset
          const idleDx = Math.cos(t * 0.8) * 8 * 0.8;
          const idleDy = Math.cos(t * 1.2) * 5 * 1.2;
          const targetIdleAngle = Math.atan2(idleDy, idleDx) * (180 / Math.PI);
          
          let currentAngle = fishAngle.get();
          let diff = targetIdleAngle - currentAngle;
          while (diff < -180) diff += 360;
          while (diff > 180) diff -= 360;
          
          // Only apply idle rotation if we are strongly in idle phase
          fishAngle.set(currentAngle + diff * (0.02 * blend)); 
          
          // Very gentle tail flutter while drifting
          fishWiggle.set(Math.sin(t * 2) * 2 * blend);
          tailWiggle.set(Math.sin(t * 2 - 1) * 6 * blend);
          finWiggle.set(Math.sin(t * 2) * 4 * blend);
          finWiggleOpposite.set(Math.sin(t * 2 + Math.PI) * 4 * blend);
        }
      }

      """
    
    new_lines = lines[:start_idx] + [replacement] + lines[end_idx:]
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.writelines(new_lines)
    print("Replaced wiggle loop logic!")
else:
    print("Not found")
