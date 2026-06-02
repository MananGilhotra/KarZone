import React, { useState, useEffect, useRef, useCallback } from 'react';

const EngineStartButton = () => {
  const [state, setState] = useState('idle'); // idle, revving, done
  const [rpmDisplay, setRpmDisplay] = useState(0);
  const audioRef = useRef(null);
  const animRef = useRef(null);

  // Skip if already played
  useEffect(() => {
    if (sessionStorage.getItem('karzone_engine_started')) {
      setState('done');
    }
  }, []);

  const playEngineSound = useCallback(async () => {
    try {
      const sampleRate = 44100;
      const duration = 4.5;
      const ctx = new OfflineAudioContext(1, sampleRate * duration, sampleRate);
      const now = 0;

      const master = ctx.createGain();
      master.connect(ctx.destination);
      master.gain.setValueAtTime(0.7, now);

      const makeNoise = (dur) => {
        const buf = ctx.createBuffer(1, sampleRate * dur, sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const s = ctx.createBufferSource();
        s.buffer = buf; s.loop = true;
        return s;
      };

      // Distortion
      const dist = ctx.createWaveShaper();
      const c = new Float32Array(8192);
      for (let i = 0; i < 8192; i++) {
        const x = (i * 2) / 8192 - 1;
        c[i] = ((Math.PI + 15) * x) / (Math.PI + 15 * Math.abs(x));
      }
      dist.curve = c; dist.oversample = '2x';

      // Engine filter
      const filt = ctx.createBiquadFilter();
      filt.type = 'lowpass'; filt.Q.setValueAtTime(2.5, now);
      filt.frequency.setValueAtTime(350, now);
      filt.frequency.exponentialRampToValueAtTime(1500, now + 0.8);
      filt.frequency.exponentialRampToValueAtTime(5000, now + 1.8);
      filt.frequency.exponentialRampToValueAtTime(10000, now + 2.5);
      filt.frequency.exponentialRampToValueAtTime(4000, now + 3.2);
      filt.frequency.exponentialRampToValueAtTime(800, now + 4.2);

      // Engine gain
      const eg = ctx.createGain();
      eg.gain.setValueAtTime(0, now);
      eg.gain.linearRampToValueAtTime(0.35, now + 0.15);
      eg.gain.linearRampToValueAtTime(0.55, now + 0.8);
      eg.gain.linearRampToValueAtTime(0.75, now + 1.8);
      eg.gain.linearRampToValueAtTime(0.9, now + 2.5);
      eg.gain.linearRampToValueAtTime(0.5, now + 3.2);
      eg.gain.linearRampToValueAtTime(0.15, now + 4.0);
      eg.gain.linearRampToValueAtTime(0, now + 4.5);

      dist.connect(filt); filt.connect(eg); eg.connect(master);

      // Fundamental
      const o1 = ctx.createOscillator(); const g1 = ctx.createGain();
      o1.type = 'sawtooth'; g1.gain.setValueAtTime(0.4, now);
      o1.frequency.setValueAtTime(80, now);
      o1.frequency.linearRampToValueAtTime(100, now + 0.3);
      o1.frequency.exponentialRampToValueAtTime(220, now + 0.8);
      o1.frequency.exponentialRampToValueAtTime(440, now + 1.8);
      o1.frequency.exponentialRampToValueAtTime(660, now + 2.5);
      o1.frequency.exponentialRampToValueAtTime(350, now + 3.2);
      o1.frequency.exponentialRampToValueAtTime(100, now + 4.2);
      o1.connect(g1); g1.connect(dist);
      o1.start(now); o1.stop(now + duration);

      // Octave
      const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
      o2.type = 'sawtooth'; g2.gain.setValueAtTime(0.2, now);
      o2.frequency.setValueAtTime(160, now);
      o2.frequency.linearRampToValueAtTime(200, now + 0.3);
      o2.frequency.exponentialRampToValueAtTime(440, now + 0.8);
      o2.frequency.exponentialRampToValueAtTime(880, now + 1.8);
      o2.frequency.exponentialRampToValueAtTime(1320, now + 2.5);
      o2.frequency.exponentialRampToValueAtTime(700, now + 3.2);
      o2.frequency.exponentialRampToValueAtTime(200, now + 4.2);
      o2.connect(g2); g2.connect(dist);
      o2.start(now); o2.stop(now + duration);

      // Singing harmonic
      const o3 = ctx.createOscillator(); const g3 = ctx.createGain();
      o3.type = 'sine'; g3.gain.setValueAtTime(0.08, now);
      g3.gain.linearRampToValueAtTime(0.15, now + 2.5);
      g3.gain.linearRampToValueAtTime(0, now + 4.2);
      o3.frequency.setValueAtTime(240, now);
      o3.frequency.exponentialRampToValueAtTime(660, now + 0.8);
      o3.frequency.exponentialRampToValueAtTime(1320, now + 1.8);
      o3.frequency.exponentialRampToValueAtTime(1980, now + 2.5);
      o3.frequency.exponentialRampToValueAtTime(1050, now + 3.2);
      o3.frequency.exponentialRampToValueAtTime(300, now + 4.2);
      o3.connect(g3); g3.connect(filt);
      o3.start(now); o3.stop(now + duration);

      // Sub
      const oS = ctx.createOscillator(); const gS = ctx.createGain();
      oS.type = 'sine'; gS.gain.setValueAtTime(0.3, now);
      oS.frequency.setValueAtTime(40, now);
      oS.frequency.exponentialRampToValueAtTime(110, now + 0.8);
      oS.frequency.exponentialRampToValueAtTime(220, now + 1.8);
      oS.frequency.exponentialRampToValueAtTime(330, now + 2.5);
      oS.frequency.exponentialRampToValueAtTime(175, now + 3.2);
      oS.frequency.exponentialRampToValueAtTime(50, now + 4.2);
      oS.connect(gS); gS.connect(filt);
      oS.start(now); oS.stop(now + duration);

      // Exhaust noise
      const ex = makeNoise(duration);
      const ef = ctx.createBiquadFilter(); const exg = ctx.createGain();
      ef.type = 'bandpass'; ef.Q.setValueAtTime(1.5, now);
      ef.frequency.setValueAtTime(500, now);
      ef.frequency.exponentialRampToValueAtTime(2000, now + 1.8);
      ef.frequency.exponentialRampToValueAtTime(5000, now + 2.5);
      ef.frequency.exponentialRampToValueAtTime(1500, now + 3.2);
      ef.frequency.exponentialRampToValueAtTime(500, now + 4.2);
      exg.gain.setValueAtTime(0, now);
      exg.gain.linearRampToValueAtTime(0.06, now + 0.3);
      exg.gain.linearRampToValueAtTime(0.18, now + 2.5);
      exg.gain.linearRampToValueAtTime(0.08, now + 3.2);
      exg.gain.linearRampToValueAtTime(0, now + 4.3);
      ex.connect(ef); ef.connect(exg); exg.connect(master);
      ex.start(now); ex.stop(now + duration);

      // Crackle pops
      for (let i = 0; i < 5; i++) {
        const t = now + 2.7 + Math.random() * 0.5;
        const p = makeNoise(0.12); const pf = ctx.createBiquadFilter(); const pg = ctx.createGain();
        pf.type = 'bandpass'; pf.frequency.setValueAtTime(1800 + Math.random() * 2500, t);
        pf.Q.setValueAtTime(4 + Math.random() * 5, t);
        pg.gain.setValueAtTime(0, now); pg.gain.setValueAtTime(0.2 + Math.random() * 0.15, t);
        pg.gain.exponentialRampToValueAtTime(0.001, t + 0.06 + Math.random() * 0.05);
        p.connect(pf); pf.connect(pg); pg.connect(master);
        p.start(t); p.stop(t + 0.12);
      }
      for (let i = 0; i < 4; i++) {
        const t = now + 3.5 + Math.random() * 0.6;
        const p = makeNoise(0.12); const pf = ctx.createBiquadFilter(); const pg = ctx.createGain();
        pf.type = 'bandpass'; pf.frequency.setValueAtTime(2000 + Math.random() * 2000, t);
        pf.Q.setValueAtTime(3 + Math.random() * 5, t);
        pg.gain.setValueAtTime(0, now); pg.gain.setValueAtTime(0.15 + Math.random() * 0.1, t);
        pg.gain.exponentialRampToValueAtTime(0.001, t + 0.05 + Math.random() * 0.05);
        p.connect(pf); pf.connect(pg); pg.connect(master);
        p.start(t); p.stop(t + 0.12);
      }

      master.gain.setValueAtTime(0.7, now);
      master.gain.setValueAtTime(0.7, now + 3.5);
      master.gain.linearRampToValueAtTime(0, now + 4.5);

      // Render
      const rendered = await ctx.startRendering();
      const wav = audioBufferToWav(rendered);
      const url = URL.createObjectURL(wav);
      const audio = new Audio(url);
      audio.volume = 0.85;
      audioRef.current = audio;
      await audio.play();
      audio.addEventListener('ended', () => URL.revokeObjectURL(url));
    } catch (err) {
      console.error('Engine sound error:', err);
    }
  }, []);

  const handleStart = async () => {
    if (state !== 'idle') return;
    setState('revving');
    sessionStorage.setItem('karzone_engine_started', 'true');

    playEngineSound();

    // RPM animation
    const startTime = performance.now();
    const animateRPM = (time) => {
      const elapsed = (time - startTime) / 1000;
      let rpm = 0;

      if (elapsed < 0.3) rpm = 800 + elapsed * 1000;
      else if (elapsed < 0.8) rpm = 1100 + ((elapsed - 0.3) / 0.5) * 2000;
      else if (elapsed < 1.8) rpm = 3100 + ((elapsed - 0.8) / 1.0) * 3000;
      else if (elapsed < 2.5) rpm = 6100 + ((elapsed - 1.8) / 0.7) * 2900;
      else if (elapsed < 3.2) rpm = 9000 - ((elapsed - 2.5) / 0.7) * 5000;
      else if (elapsed < 4.0) rpm = 4000 - ((elapsed - 3.2) / 0.8) * 3200;
      else rpm = Math.max(0, 800 - (elapsed - 4.0) * 1600);

      rpm += (Math.random() - 0.5) * 200;
      setRpmDisplay(Math.max(0, Math.round(rpm)));

      if (elapsed < 4.5) {
        animRef.current = requestAnimationFrame(animateRPM);
      } else {
        setRpmDisplay(0);
        setState('done');
      }
    };
    animRef.current = requestAnimationFrame(animateRPM);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, []);

  if (state === 'done') return null;

  const rpmPercent = rpmDisplay / 9000;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-700 ${
        state === 'revving' && rpmDisplay < 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: state === 'revving'
          ? `radial-gradient(ellipse at center, rgba(0,0,0,${0.95 - rpmPercent * 0.3}) 0%, rgba(0,0,0,0.98) 100%)`
          : 'radial-gradient(ellipse at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.98) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Ambient glow particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: state === 'revving'
                ? `rgba(255, ${60 + Math.random() * 80}, 0, ${0.2 + rpmPercent * 0.4})`
                : `rgba(255, ${150 + Math.random() * 50}, 0, ${Math.random() * 0.15 + 0.05})`,
              animation: `engineFloat ${Math.random() * 4 + 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div
        className="flex flex-col items-center gap-6 relative"
        style={{
          animation: state === 'revving' ? `engineShake 0.04s infinite` : 'none',
          transform: state === 'revving' ? `scale(${1 + rpmPercent * 0.02})` : 'scale(1)',
        }}
      >
        {/* Title */}
        <div className="text-center mb-2">
          <h1
            className="text-5xl sm:text-7xl font-black tracking-[0.15em] select-none"
            style={{
              background: state === 'revving'
                ? `linear-gradient(135deg, #ff4500 0%, #ff8c00 40%, #ffd700 100%)`
                : 'linear-gradient(135deg, #ff6a00 0%, #ff9500 40%, #ffb700 60%, #ff6a00 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'engineShimmer 2.5s ease-in-out infinite',
              filter: state === 'revving' ? `brightness(${1 + rpmPercent * 0.8})` : 'brightness(1)',
            }}
          >
            KARZONE
          </h1>
          <p className="text-gray-600 text-xs tracking-[0.4em] uppercase mt-1 font-medium">
            {state === 'revving' ? 'Engine Running' : 'Premium Car Rentals'}
          </p>
        </div>

        {/* Engine Start Button */}
        {state === 'idle' && (
          <div className="relative" style={{ animation: 'engineFadeIn 0.8s ease-out' }}>
            {/* Outer glow rings */}
            <div
              className="absolute -inset-6 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,106,0,0.08) 0%, transparent 70%)',
                animation: 'enginePulseGlow 3s ease-in-out infinite',
              }}
            />
            <div
              className="absolute -inset-3 rounded-full border border-orange-500/10"
              style={{ animation: 'enginePulseRing 2.5s ease-out infinite' }}
            />
            <div
              className="absolute -inset-3 rounded-full border border-orange-500/5"
              style={{ animation: 'enginePulseRing 2.5s ease-out infinite 0.8s' }}
            />

            {/* Main button */}
            <button
              onClick={handleStart}
              className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none group"
              style={{
                background: 'conic-gradient(from 0deg, #1a1a1a, #252525, #1a1a1a, #151515, #1a1a1a)',
                boxShadow: `
                  0 0 40px rgba(255,106,0,0.12),
                  0 0 80px rgba(255,106,0,0.06),
                  inset 0 2px 4px rgba(255,255,255,0.05),
                  inset 0 -2px 4px rgba(0,0,0,0.8)
                `,
              }}
            >
              {/* Chrome ring */}
              <div
                className="absolute inset-1 rounded-full"
                style={{
                  background: 'conic-gradient(from 45deg, #333, #555, #333, #222, #444, #333)',
                  padding: '2px',
                }}
              >
                <div
                  className="w-full h-full rounded-full flex flex-col items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle at 40% 35%, #222 0%, #111 50%, #0a0a0a 100%)',
                  }}
                >
                  {/* Power icon */}
                  <svg
                    viewBox="0 0 24 24"
                    className="w-10 h-10 sm:w-12 sm:h-12 mb-2 transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(255,106,0,0.8)]"
                    fill="none"
                    stroke="url(#powerGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <defs>
                      <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff8c00" />
                        <stop offset="100%" stopColor="#ff4500" />
                      </linearGradient>
                    </defs>
                    <path d="M12 2v6" />
                    <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" />
                  </svg>

                  {/* Text */}
                  <span
                    className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase transition-colors duration-300"
                    style={{
                      background: 'linear-gradient(180deg, #ff8c00, #cc5500)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    ENGINE
                  </span>
                  <span
                    className="text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-600 group-hover:text-gray-400 transition-colors"
                  >
                    START
                  </span>
                </div>
              </div>

              {/* LED indicator */}
              <div
                className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                style={{
                  background: '#ff6a00',
                  boxShadow: '0 0 6px #ff6a00, 0 0 12px rgba(255,106,0,0.5)',
                  animation: 'engineBlink 1.5s ease-in-out infinite',
                }}
              />
            </button>
          </div>
        )}

        {/* RPM Tachometer during revving */}
        {state === 'revving' && (() => {
          // Gauge geometry
          const cx = 150, cy = 150, r = 120;
          const startAngle = 135;  // degrees, bottom-left
          const endAngle = 405;    // degrees, bottom-right (270° sweep)
          const sweepDeg = endAngle - startAngle;
          const toRad = (deg) => (deg * Math.PI) / 180;

          // Arc path helper
          const describeArc = (radius, start, end) => {
            const s = toRad(start);
            const e = toRad(end);
            const x1 = cx + radius * Math.cos(s);
            const y1 = cy + radius * Math.sin(s);
            const x2 = cx + radius * Math.cos(e);
            const y2 = cy + radius * Math.sin(e);
            const largeArc = end - start > 180 ? 1 : 0;
            return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
          };

          const needleAngle = startAngle + rpmPercent * sweepDeg;
          const needleRad = toRad(needleAngle);
          const needleLen = r - 18;
          const needleX = cx + needleLen * Math.cos(needleRad);
          const needleY = cy + needleLen * Math.sin(needleRad);

          // Redline starts at 7000 RPM
          const redlineStart = startAngle + (7000 / 9000) * sweepDeg;

          // Dynamic glow color
          const glowColor = rpmPercent > 0.78 ? '#ff0000' : '#ff6a00';
          const glowIntensity = 4 + rpmPercent * 18;

          return (
            <div className="flex flex-col items-center gap-3" style={{ animation: 'engineFadeIn 0.3s ease-out' }}>
              <div className="relative" style={{ width: '300px', height: '300px' }}>
                {/* Background glow */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at center, ${glowColor}${Math.round(rpmPercent * 15).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
                    filter: `blur(${20 + rpmPercent * 20}px)`,
                    transition: 'all 100ms linear',
                  }}
                />

                <svg viewBox="0 0 300 300" className="w-full h-full relative">
                  <defs>
                    <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ff8c00" />
                      <stop offset="70%" stopColor="#ff4500" />
                      <stop offset="100%" stopColor="#ff0000" />
                    </linearGradient>
                    <filter id="needleGlow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="arcGlow">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Outer ring */}
                  <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke="#1a1a1a" strokeWidth="1" />
                  <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="#222" strokeWidth="0.5" />

                  {/* Background arc track */}
                  <path
                    d={describeArc(r, startAngle, endAngle)}
                    fill="none"
                    stroke="#1a1a1a"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />

                  {/* Redline zone background */}
                  <path
                    d={describeArc(r, redlineStart, endAngle)}
                    fill="none"
                    stroke="rgba(255,0,0,0.12)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />

                  {/* Active arc (fills with RPM) */}
                  {rpmPercent > 0.01 && (
                    <path
                      d={describeArc(r, startAngle, startAngle + rpmPercent * sweepDeg)}
                      fill="none"
                      stroke="url(#arcGrad)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      filter="url(#arcGlow)"
                      style={{ transition: 'none' }}
                    />
                  )}

                  {/* Tick marks & numbers */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                    const angle = startAngle + (num / 9) * sweepDeg;
                    const rad = toRad(angle);
                    const inR = r - 20;
                    const outR = r - 8;
                    const textR = r - 32;
                    const isRedzone = num >= 7;
                    const isActive = num / 9 < rpmPercent;

                    return (
                      <g key={num}>
                        {/* Major tick */}
                        <line
                          x1={cx + inR * Math.cos(rad)}
                          y1={cy + inR * Math.sin(rad)}
                          x2={cx + outR * Math.cos(rad)}
                          y2={cy + outR * Math.sin(rad)}
                          stroke={isRedzone ? (isActive ? '#ff0000' : '#661111') : (isActive ? '#ff8c00' : '#333')}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {/* Number label */}
                        <text
                          x={cx + textR * Math.cos(rad)}
                          y={cy + textR * Math.sin(rad)}
                          fill={isRedzone ? (isActive ? '#ff2200' : '#661111') : (isActive ? '#ff8c00' : '#555')}
                          fontSize="14"
                          fontWeight="800"
                          fontFamily="monospace"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {num}
                        </text>
                      </g>
                    );
                  })}

                  {/* Minor ticks (between major) */}
                  {[...Array(45)].map((_, i) => {
                    if (i % 5 === 0) return null;
                    const angle = startAngle + (i / 45) * sweepDeg;
                    const rad = toRad(angle);
                    const inR = r - 14;
                    const outR = r - 8;
                    const frac = i / 45;
                    const isActive = frac < rpmPercent;

                    return (
                      <line
                        key={`minor-${i}`}
                        x1={cx + inR * Math.cos(rad)}
                        y1={cy + inR * Math.sin(rad)}
                        x2={cx + outR * Math.cos(rad)}
                        y2={cy + outR * Math.sin(rad)}
                        stroke={frac > 7/9 ? (isActive ? '#ff0000' : '#331111') : (isActive ? '#ff6a0066' : '#222')}
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* Needle shadow */}
                  <line
                    x1={cx + 2}
                    y1={cy + 2}
                    x2={needleX + 2}
                    y2={needleY + 2}
                    stroke="rgba(0,0,0,0.5)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Needle */}
                  <line
                    x1={cx}
                    y1={cy}
                    x2={needleX}
                    y2={needleY}
                    stroke={rpmPercent > 0.78 ? '#ff1100' : '#ff5500'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    filter="url(#needleGlow)"
                  />

                  {/* Needle counterweight */}
                  <line
                    x1={cx}
                    y1={cy}
                    x2={cx - 12 * Math.cos(needleRad)}
                    y2={cy - 12 * Math.sin(needleRad)}
                    stroke="#444"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Center hub */}
                  <circle cx={cx} cy={cy} r="8" fill="#1a1a1a" stroke={rpmPercent > 0.78 ? '#ff1100' : '#ff5500'} strokeWidth="2" />
                  <circle cx={cx} cy={cy} r="3" fill={rpmPercent > 0.78 ? '#ff1100' : '#ff6a00'} />

                  {/* Digital RPM readout */}
                  <text
                    x={cx}
                    y={cy + 45}
                    fill={rpmPercent > 0.78 ? '#ff1100' : '#ff6a00'}
                    fontSize="32"
                    fontWeight="900"
                    fontFamily="monospace"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                      filter: `drop-shadow(0 0 ${glowIntensity}px ${glowColor})`,
                    }}
                  >
                    {rpmDisplay.toLocaleString()}
                  </text>
                  <text
                    x={cx}
                    y={cy + 65}
                    fill="#444"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="monospace"
                    textAnchor="middle"
                    letterSpacing="3"
                  >
                    RPM × 1000
                  </text>

                  {/* Gear indicator */}
                  <text
                    x={cx}
                    y={cy + 88}
                    fill={rpmPercent > 0.78 ? '#ff3300' : '#ff8c00'}
                    fontSize="18"
                    fontWeight="900"
                    fontFamily="monospace"
                    textAnchor="middle"
                    style={{
                      filter: `drop-shadow(0 0 6px ${glowColor}88)`,
                    }}
                  >
                    {rpmPercent < 0.15 ? 'N' : rpmPercent < 0.35 ? '1' : rpmPercent < 0.55 ? '2' : rpmPercent < 0.75 ? '3' : '4'}
                  </text>
                </svg>
              </div>

              {/* LED strip indicator */}
              <div className="flex gap-1">
                {[...Array(20)].map((_, i) => {
                  const frac = i / 20;
                  const active = frac < rpmPercent;
                  const inRedzone = frac > 0.75;
                  return (
                    <div
                      key={i}
                      className="rounded-sm transition-all duration-75"
                      style={{
                        width: '10px',
                        height: '5px',
                        background: active
                          ? inRedzone ? '#ff0000' : frac > 0.5 ? '#ff6a00' : '#ff8c00'
                          : '#111',
                        boxShadow: active
                          ? `0 0 ${3 + rpmPercent * 4}px ${inRedzone ? '#ff0000' : '#ff6a00'}`
                          : 'none',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Skip */}
        {state === 'idle' && (
          <button
            onClick={() => {
              setState('done');
              sessionStorage.setItem('karzone_engine_started', 'true');
            }}
            className="text-gray-700 hover:text-gray-400 text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 mt-2"
          >
            Skip →
          </button>
        )}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes engineFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-15px) scale(1.2); opacity: 0.6; }
        }
        @keyframes engineShake {
          0% { transform: translate(0, 0); }
          20% { transform: translate(${rpmPercent > 0.5 ? '2px' : '1px'}, ${rpmPercent > 0.5 ? '-1px' : '0'}); }
          40% { transform: translate(${rpmPercent > 0.5 ? '-2px' : '-1px'}, ${rpmPercent > 0.5 ? '2px' : '1px'}); }
          60% { transform: translate(${rpmPercent > 0.5 ? '1px' : '0'}, ${rpmPercent > 0.5 ? '-2px' : '-1px'}); }
          80% { transform: translate(${rpmPercent > 0.5 ? '-1px' : '1px'}, ${rpmPercent > 0.5 ? '1px' : '0'}); }
          100% { transform: translate(0, 0); }
        }
        @keyframes engineShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes enginePulseRing {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes enginePulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes engineBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes engineFadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ---- WAV encoder ----
function audioBufferToWav(buffer) {
  const sr = buffer.sampleRate;
  const data = buffer.getChannelData(0);
  const len = data.length;
  const ab = new ArrayBuffer(44 + len * 2);
  const v = new DataView(ab);

  const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + len * 2, true); w(8, 'WAVE');
  w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
  v.setUint16(22, 1, true); v.setUint32(24, sr, true);
  v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, len * 2, true);

  let o = 44;
  for (let i = 0; i < len; i++) {
    const s = Math.max(-1, Math.min(1, data[i]));
    v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    o += 2;
  }

  return new Blob([ab], { type: 'audio/wav' });
}

export default EngineStartButton;
