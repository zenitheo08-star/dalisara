import sys

with open('src/components/CustomCursor.tsx', 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if 'const loop = () => {' in line:
        start_idx = i
    if start_idx != -1 and 'simRef.current.step();' in line:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    replacement = """    const loop = () => {
      if (!simRef.current) return;
      
      const tx = mouseX.get();
      const ty = mouseY.get();
      let bx = fishX.get();
      let by = fishY.get();

      // Smoother follow distance (0.12 instead of 0.25 for a more organic feel)
      bx += (tx - bx) * 0.12;
      by += (ty - by) * 0.12;
      
      fishX.set(bx);
      fishY.set(by);

      const dx = bx - lastBx;
      const dy = by - lastBy;
      const speed = Math.hypot(dx, dy);

      // We always calculate target angle if we are moving somewhat
      if (speed > 0.5) {
        lastMoveTime.current = performance.now();
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        let currentAngle = fishAngle.get();
        let diff = targetAngle - currentAngle;
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        // Smooth rotation tracking
        fishAngle.set(currentAngle + diff * 0.15);
      }

      if (speed > 0.1) {
        // Reset offsets smoothly when actively moving
        fishOffsetX.set(fishOffsetX.get() * 0.9);
        fishOffsetY.set(fishOffsetY.get() * 0.9);

        // Natural swim phase scaling
        swimPhase.current += speed * 0.15;

        // Smoother, less frantic wiggle
        fishWiggle.set(Math.sin(swimPhase.current * 1.2) * Math.min(speed * 2.5, 20));

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
          fishWiggle.set(Math.sin(t * 3) * 5 * blend);
        }
      }

      """
    
    new_lines = lines[:start_idx] + [replacement] + lines[end_idx:]
    with open('src/components/CustomCursor.tsx', 'w') as f:
        f.writelines(new_lines)
    print("Replaced loop!")
else:
    print("Not found")
