import { useEffect, useRef } from 'react';

/**
 * Renders a supercar engine rev sound into a WAV blob using OfflineAudioContext,
 * then plays it via <audio autoplay> for the best autoplay support.
 */
const FerrariSound = () => {
  const audioRef = useRef(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (hasPlayedRef.current) return;
    if (sessionStorage.getItem('karzone_engine_played')) return;
    hasPlayedRef.current = true;

    const renderAndPlay = async () => {
      try {
        const sampleRate = 44100;
        const duration = 4.5; // seconds — short & punchy
        const offlineCtx = new OfflineAudioContext(1, sampleRate * duration, sampleRate);
        const now = 0;

        const masterGain = offlineCtx.createGain();
        masterGain.connect(offlineCtx.destination);
        masterGain.gain.setValueAtTime(0.65, now);

        // ---- Helper: noise buffer ----
        const makeNoise = (dur) => {
          const buf = offlineCtx.createBuffer(1, sampleRate * dur, sampleRate);
          const d = buf.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
          const src = offlineCtx.createBufferSource();
          src.buffer = buf;
          src.loop = true;
          return src;
        };

        // ---- Distortion curve ----
        const distortion = offlineCtx.createWaveShaper();
        const curveLen = 8192;
        const curve = new Float32Array(curveLen);
        for (let i = 0; i < curveLen; i++) {
          const x = (i * 2) / curveLen - 1;
          curve[i] = ((Math.PI + 15) * x) / (Math.PI + 15 * Math.abs(x));
        }
        distortion.curve = curve;
        distortion.oversample = '2x';

        // ---- Engine filter ----
        const engineFilter = offlineCtx.createBiquadFilter();
        engineFilter.type = 'lowpass';
        engineFilter.Q.setValueAtTime(2.5, now);
        engineFilter.frequency.setValueAtTime(350, now);
        engineFilter.frequency.exponentialRampToValueAtTime(1500, now + 0.8);
        engineFilter.frequency.exponentialRampToValueAtTime(5000, now + 1.8);
        engineFilter.frequency.exponentialRampToValueAtTime(10000, now + 2.5);
        engineFilter.frequency.exponentialRampToValueAtTime(4000, now + 3.2);
        engineFilter.frequency.exponentialRampToValueAtTime(800, now + 4.2);

        // ---- Engine gain envelope ----
        const engineGain = offlineCtx.createGain();
        engineGain.gain.setValueAtTime(0, now);
        engineGain.gain.linearRampToValueAtTime(0.35, now + 0.15);
        engineGain.gain.linearRampToValueAtTime(0.55, now + 0.8);
        engineGain.gain.linearRampToValueAtTime(0.75, now + 1.8);
        engineGain.gain.linearRampToValueAtTime(0.9, now + 2.5);
        engineGain.gain.linearRampToValueAtTime(0.5, now + 3.2);
        engineGain.gain.linearRampToValueAtTime(0.15, now + 4.0);
        engineGain.gain.linearRampToValueAtTime(0, now + 4.5);

        // Connect chain: oscillators -> distortion -> filter -> engineGain -> master
        distortion.connect(engineFilter);
        engineFilter.connect(engineGain);
        engineGain.connect(masterGain);

        // ---- Osc 1: Fundamental ----
        const osc1 = offlineCtx.createOscillator();
        const g1 = offlineCtx.createGain();
        osc1.type = 'sawtooth';
        g1.gain.setValueAtTime(0.4, now);
        osc1.frequency.setValueAtTime(80, now);
        osc1.frequency.linearRampToValueAtTime(100, now + 0.3);
        osc1.frequency.exponentialRampToValueAtTime(220, now + 0.8);
        osc1.frequency.exponentialRampToValueAtTime(440, now + 1.8);
        osc1.frequency.exponentialRampToValueAtTime(660, now + 2.5);
        osc1.frequency.exponentialRampToValueAtTime(350, now + 3.2);
        osc1.frequency.exponentialRampToValueAtTime(100, now + 4.2);
        osc1.connect(g1); g1.connect(distortion);
        osc1.start(now); osc1.stop(now + duration);

        // ---- Osc 2: Octave harmonic ----
        const osc2 = offlineCtx.createOscillator();
        const g2 = offlineCtx.createGain();
        osc2.type = 'sawtooth';
        g2.gain.setValueAtTime(0.2, now);
        osc2.frequency.setValueAtTime(160, now);
        osc2.frequency.linearRampToValueAtTime(200, now + 0.3);
        osc2.frequency.exponentialRampToValueAtTime(440, now + 0.8);
        osc2.frequency.exponentialRampToValueAtTime(880, now + 1.8);
        osc2.frequency.exponentialRampToValueAtTime(1320, now + 2.5);
        osc2.frequency.exponentialRampToValueAtTime(700, now + 3.2);
        osc2.frequency.exponentialRampToValueAtTime(200, now + 4.2);
        osc2.connect(g2); g2.connect(distortion);
        osc2.start(now); osc2.stop(now + duration);

        // ---- Osc 3: High singing harmonic ----
        const osc3 = offlineCtx.createOscillator();
        const g3 = offlineCtx.createGain();
        osc3.type = 'sine';
        g3.gain.setValueAtTime(0.08, now);
        g3.gain.linearRampToValueAtTime(0.15, now + 2.5);
        g3.gain.linearRampToValueAtTime(0, now + 4.2);
        osc3.frequency.setValueAtTime(240, now);
        osc3.frequency.exponentialRampToValueAtTime(660, now + 0.8);
        osc3.frequency.exponentialRampToValueAtTime(1320, now + 1.8);
        osc3.frequency.exponentialRampToValueAtTime(1980, now + 2.5);
        osc3.frequency.exponentialRampToValueAtTime(1050, now + 3.2);
        osc3.frequency.exponentialRampToValueAtTime(300, now + 4.2);
        osc3.connect(g3); g3.connect(engineFilter);
        osc3.start(now); osc3.stop(now + duration);

        // ---- Sub bass ----
        const subOsc = offlineCtx.createOscillator();
        const gSub = offlineCtx.createGain();
        subOsc.type = 'sine';
        gSub.gain.setValueAtTime(0.3, now);
        subOsc.frequency.setValueAtTime(40, now);
        subOsc.frequency.exponentialRampToValueAtTime(110, now + 0.8);
        subOsc.frequency.exponentialRampToValueAtTime(220, now + 1.8);
        subOsc.frequency.exponentialRampToValueAtTime(330, now + 2.5);
        subOsc.frequency.exponentialRampToValueAtTime(175, now + 3.2);
        subOsc.frequency.exponentialRampToValueAtTime(50, now + 4.2);
        subOsc.connect(gSub); gSub.connect(engineFilter);
        subOsc.start(now); subOsc.stop(now + duration);

        // ---- Exhaust noise ----
        const exhaust = makeNoise(duration);
        const exFilter = offlineCtx.createBiquadFilter();
        const exGain = offlineCtx.createGain();
        exFilter.type = 'bandpass';
        exFilter.Q.setValueAtTime(1.5, now);
        exFilter.frequency.setValueAtTime(500, now);
        exFilter.frequency.exponentialRampToValueAtTime(2000, now + 1.8);
        exFilter.frequency.exponentialRampToValueAtTime(5000, now + 2.5);
        exFilter.frequency.exponentialRampToValueAtTime(1500, now + 3.2);
        exFilter.frequency.exponentialRampToValueAtTime(500, now + 4.2);
        exGain.gain.setValueAtTime(0, now);
        exGain.gain.linearRampToValueAtTime(0.06, now + 0.3);
        exGain.gain.linearRampToValueAtTime(0.18, now + 2.5);
        exGain.gain.linearRampToValueAtTime(0.08, now + 3.2);
        exGain.gain.linearRampToValueAtTime(0, now + 4.3);
        exhaust.connect(exFilter); exFilter.connect(exGain);
        exGain.connect(masterGain);
        exhaust.start(now); exhaust.stop(now + duration);

        // ---- Exhaust crackle pops on decel ----
        for (let i = 0; i < 5; i++) {
          const t = now + 2.7 + Math.random() * 0.5;
          const pop = makeNoise(0.12);
          const pf = offlineCtx.createBiquadFilter();
          const pg = offlineCtx.createGain();
          pf.type = 'bandpass';
          pf.frequency.setValueAtTime(1800 + Math.random() * 2500, t);
          pf.Q.setValueAtTime(4 + Math.random() * 5, t);
          pg.gain.setValueAtTime(0, now);
          pg.gain.setValueAtTime(0.2 + Math.random() * 0.15, t);
          pg.gain.exponentialRampToValueAtTime(0.001, t + 0.06 + Math.random() * 0.05);
          pop.connect(pf); pf.connect(pg); pg.connect(masterGain);
          pop.start(t); pop.stop(t + 0.12);
        }
        for (let i = 0; i < 4; i++) {
          const t = now + 3.5 + Math.random() * 0.6;
          const pop = makeNoise(0.12);
          const pf = offlineCtx.createBiquadFilter();
          const pg = offlineCtx.createGain();
          pf.type = 'bandpass';
          pf.frequency.setValueAtTime(2000 + Math.random() * 2000, t);
          pf.Q.setValueAtTime(3 + Math.random() * 5, t);
          pg.gain.setValueAtTime(0, now);
          pg.gain.setValueAtTime(0.15 + Math.random() * 0.1, t);
          pg.gain.exponentialRampToValueAtTime(0.001, t + 0.05 + Math.random() * 0.05);
          pop.connect(pf); pf.connect(pg); pg.connect(masterGain);
          pop.start(t); pop.stop(t + 0.12);
        }

        // ---- Master envelope ----
        masterGain.gain.setValueAtTime(0.65, now);
        masterGain.gain.setValueAtTime(0.65, now + 3.5);
        masterGain.gain.linearRampToValueAtTime(0, now + 4.5);

        // ========== RENDER TO BUFFER ==========
        const renderedBuffer = await offlineCtx.startRendering();

        // Convert AudioBuffer to WAV blob
        const wavBlob = audioBufferToWav(renderedBuffer);
        const url = URL.createObjectURL(wavBlob);

        // Play via <audio> element for best autoplay support
        const audio = new Audio(url);
        audio.volume = 0.8;
        audioRef.current = audio;

        // Try autoplay
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('🏎️ Engine sound playing!');
              sessionStorage.setItem('karzone_engine_played', 'true');
            })
            .catch(() => {
              // Autoplay blocked — fall back to first click
              console.log('Autoplay blocked, waiting for click...');
              const onClick = () => {
                audio.play().then(() => {
                  console.log('🏎️ Engine sound playing (after click)!');
                  sessionStorage.setItem('karzone_engine_played', 'true');
                }).catch(() => {});
                document.removeEventListener('click', onClick, true);
                document.removeEventListener('touchstart', onClick, true);
              };
              document.addEventListener('click', onClick, true);
              document.addEventListener('touchstart', onClick, true);
            });
        }

        // Cleanup blob URL after done
        audio.addEventListener('ended', () => {
          URL.revokeObjectURL(url);
        });

      } catch (err) {
        console.error('Engine sound error:', err);
      }
    };

    renderAndPlay();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return null;
};

// ---- Convert AudioBuffer to WAV Blob ----
function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const data = buffer.getChannelData(0);
  const dataLength = data.length * bytesPerSample;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view, offset, str) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

export default FerrariSound;
