const fs = require('fs');
let code = fs.readFileSync('src/components/AmbientAudio.tsx', 'utf-8');

// Replace the audio node ramp values
const oldRamp = `    if (mood === 'morning') {
      lowpassRef.current?.frequency.setTargetAtTime(400, time, rampTime);
      lfoRef.current?.frequency.setTargetAtTime(0.08, time, rampTime);
      lfoGainRef.current?.gain.setTargetAtTime(600, time, rampTime);
      ampLfoRef.current?.frequency.setTargetAtTime(0.08, time, rampTime);
      ampGainRef.current?.gain.setTargetAtTime(0.5, time, rampTime);
      waveGainRef.current?.gain.setTargetAtTime(0.5, time, rampTime);
    } else {
      lowpassRef.current?.frequency.setTargetAtTime(150, time, rampTime);
      lfoRef.current?.frequency.setTargetAtTime(0.04, time, rampTime);
      lfoGainRef.current?.gain.setTargetAtTime(250, time, rampTime);
      ampLfoRef.current?.frequency.setTargetAtTime(0.04, time, rampTime);
      ampGainRef.current?.gain.setTargetAtTime(0.2, time, rampTime);
      waveGainRef.current?.gain.setTargetAtTime(0.2, time, rampTime);
    }`;

const newRamp = `    // Update global dark mode
    if (mood === 'night') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (mood === 'morning') {
      // Brighter, closer waves
      lowpassRef.current?.frequency.setTargetAtTime(800, time, rampTime);
      lfoRef.current?.frequency.setTargetAtTime(0.12, time, rampTime); // Faster waves (8s)
      lfoGainRef.current?.gain.setTargetAtTime(800, time, rampTime);
      ampLfoRef.current?.frequency.setTargetAtTime(0.12, time, rampTime);
      ampGainRef.current?.gain.setTargetAtTime(0.6, time, rampTime);
      waveGainRef.current?.gain.setTargetAtTime(0.6, time, rampTime);
    } else {
      // Very deep, distant, muffled rolling waves
      lowpassRef.current?.frequency.setTargetAtTime(90, time, rampTime);
      lfoRef.current?.frequency.setTargetAtTime(0.03, time, rampTime); // Very slow waves (33s)
      lfoGainRef.current?.gain.setTargetAtTime(80, time, rampTime);
      ampLfoRef.current?.frequency.setTargetAtTime(0.03, time, rampTime);
      ampGainRef.current?.gain.setTargetAtTime(0.2, time, rampTime);
      waveGainRef.current?.gain.setTargetAtTime(0.2, time, rampTime);
    }`;

code = code.replace(oldRamp, newRamp);
fs.writeFileSync('src/components/AmbientAudio.tsx', code);
