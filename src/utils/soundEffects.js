// Premium Synth Sound Effects using Web Audio API
// No assets required, works offline, completely responsive and light-weight.

let isMuted = false;

// Safe helper to resume/initialize AudioContext on user interaction
const getAudioContext = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  const ctx = new AudioContextClass();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
};

export const soundEffects = {
  setMuted: (muted) => {
    isMuted = muted;
    // Save to local storage for persistence
    localStorage.setItem('chess_muted', JSON.stringify(muted));
  },
  
  isMuted: () => {
    return isMuted;
  },

  init: () => {
    const saved = localStorage.getItem('chess_muted');
    if (saved !== null) {
      isMuted = JSON.parse(saved);
    }
  },

  playMove: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  },

  playCapture: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(450, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(900, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.15);
  },

  playCheck: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(698.46, ctx.currentTime + 0.08); // F5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.16); // A5

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.22);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.32);
  },

  playCheckmate: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [220, 277.18, 329.63, 440, 554.37, 659.25, 880]; // A chord arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.4);
    });
  },

  playVictory: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const rootFreqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major
    rootFreqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + index * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + 0.8);
    });
  },

  playDefeat: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const rootFreqs = [220.00, 207.65, 196.00, 174.61, 164.81, 146.83, 110.00]; // Dark descending minor progression
    rootFreqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + index * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.12);
      osc.stop(ctx.currentTime + index * 0.12 + 0.6);
    });
  },

  playTick: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }
};
