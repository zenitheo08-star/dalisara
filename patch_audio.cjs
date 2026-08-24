const fs = require('fs');
let code = fs.readFileSync('src/components/AmbientAudio.tsx', 'utf-8');

// The replacement logic:
const newCode = `import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Waves, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function AmbientAudio() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [mood, setMood] = useState<'morning' | 'night'>('morning');
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Refs for audio nodes to modulate based on mood
  const lowpassRef = useRef<BiquadFilterNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);
  const ampLfoRef = useRef<OscillatorNode | null>(null);
  const ampGainRef = useRef<GainNode | null>(null);
  const waveGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (isPlaying && !audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Generate Pink Noise
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      
      for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11; // compensate for gain
          b6 = white * 0.115926;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Lowpass filter for underwater/distant rolling sound
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = mood === 'morning' ? 400 : 200;
      lowpass.Q.value = 0.5;
      lowpassRef.current = lowpass;

      // Wave LFO (Filter Sweep)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = mood === 'morning' ? 0.08 : 0.05; // ~12s vs 20s cycle
      lfoRef.current = lfo;

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = mood === 'morning' ? 600 : 300; // Frequency sweep range
      lfoGainRef.current = lfoGain;
      
      lfo.connect(lfoGain);
      lfoGain.connect(lowpass.frequency);

      // Volume Modulation LFO (Amplitude Sweep)
      const ampLfo = ctx.createOscillator();
      ampLfo.type = 'sine';
      ampLfo.frequency.value = mood === 'morning' ? 0.08 : 0.05; // Match wave cycle
      ampLfoRef.current = ampLfo;

      const ampGain = ctx.createGain();
      ampGain.gain.value = mood === 'morning' ? 0.5 : 0.3; // Amplitude sweep depth
      ampGainRef.current = ampGain;
      
      const waveGain = ctx.createGain();
      waveGain.gain.value = mood === 'morning' ? 0.5 : 0.3; // Base amplitude
      waveGainRef.current = waveGain;
      
      ampLfo.connect(ampGain);
      ampGain.connect(waveGain.gain);

      // Master Output
      const masterGain = ctx.createGain();
      masterGain.gain.value = volume;
      gainNodeRef.current = masterGain;

      noiseSource.connect(lowpass);
      lowpass.connect(waveGain);
      waveGain.connect(masterGain);
      masterGain.connect(ctx.destination);

      noiseSource.start(0);
      lfo.start(0);
      ampLfo.start(0);
    }

    if (isPlaying && audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
    } else if (!isPlaying && audioCtxRef.current?.state === 'running') {
        audioCtxRef.current.suspend();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.1);
    }
  }, [volume]);

  // Handle Mood Transitions
  useEffect(() => {
    if (!audioCtxRef.current) return;
    const time = audioCtxRef.current.currentTime;
    
    // Use a smooth 2-second ramp for parameter changes
    const rampTime = 2.0;

    if (mood === 'morning') {
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
    }
  }, [mood]);

  return (
    <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-50 flex flex-col items-start space-y-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-sand-50 border border-ink-900/10 shadow-2xl p-6 w-72 origin-bottom-left"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-serif text-lg italic tracking-tight text-ink-900">Atmosphere</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink-700 opacity-60">Coastal Soundscape</p>
              </div>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={\`p-3 rounded-full transition-colors \${isPlaying ? 'bg-ink-900 text-sand-50' : 'bg-sand-200 text-ink-900 hover:bg-ink-900 hover:text-sand-50'}\`}
              >
                {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Mood Selector */}
            <div className="bg-sand-200/50 p-1 rounded-full mb-8 relative flex">
              <motion.div 
                layoutId="mood-pill"
                className="absolute inset-y-1 w-[calc(50%-4px)] bg-sand-50 shadow-sm rounded-full"
                animate={{ 
                  left: mood === 'morning' ? '4px' : 'calc(50%)' 
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
              <button 
                onClick={() => setMood('morning')} 
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 text-[10px] py-2 uppercase tracking-widest relative z-10 transition-colors duration-300",
                  mood === 'morning' ? "text-ink-900 font-medium" : "text-ink-700/60 hover:text-ink-900"
                )}
              >
                <Sun className="w-3 h-3" />
                <span>Morning</span>
              </button>
              <button 
                onClick={() => setMood('night')} 
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 text-[10px] py-2 uppercase tracking-widest relative z-10 transition-colors duration-300",
                  mood === 'night' ? "text-ink-900 font-medium" : "text-ink-700/60 hover:text-ink-900"
                )}
              >
                <Moon className="w-3 h-3" />
                <span>Night</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-xs text-ink-700 font-medium">
                <span className="uppercase tracking-widest text-[10px]">Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-ink-900/20 rounded-none appearance-none cursor-pointer accent-ink-900"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/90 backdrop-blur-md border border-ink-900/10 text-ink-900 p-4 rounded-full shadow-xl hover:bg-sand-50 transition-colors flex items-center justify-center"
        aria-label="Toggle Atmosphere Controls"
      >
        <Waves className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
`;

fs.writeFileSync('src/components/AmbientAudio.tsx', newCode);
