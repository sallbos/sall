/**
 * ============================================================================
 * MR.SALL – EPIC CYBERSECURITY CINEMATIC INTRO ANIMATION
 * 1920x1080 60FPS 3D Canvas Engine & Real-Time Audio Synthesizer
 * Scene 1: Digital Awakening | Scene 2: Hacker Atmosphere
 * Scene 3: 3D Logo Reveal    | Scene 4: Brand Reveal & Glitch
 * Scene 5: Final Energy Transition & Auto-Export
 * ============================================================================
 */

(() => {
  'use strict';

  // --- CONFIGURATION & CONSTANTS ---
  const WIDTH = 1920;
  const HEIGHT = 1080;
  const TOTAL_DURATION = 14.0; // Total 14 seconds

  // Scene Timings (in seconds)
  const SCENE_1_END = 3.0;   // Digital Awakening
  const SCENE_2_END = 6.2;   // Hacker Atmosphere
  const SCENE_3_END = 9.8;   // 3D Logo Reveal
  const SCENE_4_END = 12.5;  // Brand Reveal & Glitch
  const SCENE_5_END = 14.0;  // Final Transition

  // DOM Elements
  const canvas = document.getElementById('intro-canvas');
  const ctx = canvas.getContext('2d');
  const startOverlay = document.getElementById('start-overlay');
  const btnStartIntro = document.getElementById('btn-start-intro');
  const btnReplay = document.getElementById('btn-replay');
  const btnExportMp4 = document.getElementById('btn-export-mp4');
  const exportBtnLabel = document.getElementById('export-btn-label');
  const timelineFill = document.getElementById('timeline-fill');
  const sceneIndicator = document.getElementById('scene-indicator');
  const timeCounter = document.getElementById('time-counter');
  const flashOverlay = document.getElementById('flash-overlay');
  const recordingToast = document.getElementById('recording-toast');
  const logoFileInput = document.getElementById('logo-file-input');
  const logoFileInputHud = document.getElementById('logo-file-input-hud');
  const uploadStatusText = document.getElementById('upload-status-text');
  const previewLogoThumb = document.getElementById('preview-logo-thumb');

  // Audio Context (Synthesizer)
  let audioCtx = null;
  let audioDest = null; // For MediaRecorder streaming

  // Animation State
  let isPlaying = false;
  let startTime = 0;
  let currentTime = 0;
  let animationFrameId = null;
  let isRecording = false;
  let mediaRecorder = null;
  let recordedChunks = [];

  // Default Logo
  let logoImg = new Image();
  logoImg.crossOrigin = 'anonymous';
  logoImg.src = 'assets/logo.svg';

  let shieldOnlyImg = new Image();
  shieldOnlyImg.crossOrigin = 'anonymous';
  shieldOnlyImg.src = 'assets/favicon.svg';

  // Offscreen Canvas for 3D metallic & specular effect
  const offCanvas = document.createElement('canvas');
  offCanvas.width = 700;
  offCanvas.height = 700;
  const offCtx = offCanvas.getContext('2d');

  // --- AUDIO SYNTHESIS ENGINE (Web Audio API) ---
  const initAudio = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      audioDest = audioCtx.createMediaStreamDestination();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const connectToAudio = (node) => {
    if (!audioCtx) return;
    node.connect(audioCtx.destination);
    if (audioDest) {
      node.connect(audioDest);
    }
  };

  // Sound 1: Deep Cinematic Sub-Bass Drone & Drop
  const playSubDrop = (freq = 75, duration = 2.8) => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(26, now + duration);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    connectToAudio(gain);

    osc.start(now);
    osc.stop(now + duration);
  };

  // Sound 2: High-tech Data Chirp / Beep
  const playDataChirp = () => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'square';
    const now = audioCtx.currentTime;
    const freqs = [1200, 1800, 2400, 3200];
    const f = freqs[Math.floor(Math.random() * freqs.length)];

    osc.frequency.setValueAtTime(f, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    connectToAudio(gain);

    osc.start(now);
    osc.stop(now + 0.09);
  };

  // Sound 3: Cyber Riser (Ascending energy frequency sweep)
  const playRiser = (duration = 2.5) => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';

    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + duration);

    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(3500, now + duration);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.4, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    connectToAudio(gain);

    osc.start(now);
    osc.stop(now + duration);
  };

  // Sound 4: Heavy Cinematic Boom / Impact for Logo Reveal
  const playImpactBoom = () => {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    // Sub sine impact
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 1.8);

    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    osc.connect(gain);
    connectToAudio(gain);
    osc.start(now);
    osc.stop(now + 2.2);

    // Metallic white-noise crackle
    const bufferSize = audioCtx.sampleRate * 0.4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.08));
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const nGain = audioCtx.createGain();
    nGain.gain.setValueAtTime(0.3, now);
    nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    noise.connect(nGain);
    connectToAudio(nGain);
    noise.start(now);
  };

  // Sound 5: Glitch Burst
  const playGlitchStatic = () => {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220 + Math.random() * 400, now);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    connectToAudio(gain);
    osc.start(now);
    osc.stop(now + 0.15);
  };

  // Sound 6: Final Energy Blast
  const playEnergyFlash = () => {
    if (!audioCtx) return;
    playImpactBoom();
    playSubDrop(120, 2.5);
  };

  // --- PARTICLE SIMULATION SYSTEM ---
  const digitalParticles = [];
  const PARTICLE_COUNT = 160;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    digitalParticles.push({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      z: Math.random() * 1000 + 100, // 3D depth
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      vz: -(Math.random() * 4 + 1),
      size: Math.random() * 2.5 + 1.0,
      char: Math.random() > 0.5 ? '1' : '0',
      color: Math.random() > 0.6 ? '#00ff9d' : '#00d2ff',
      alpha: Math.random() * 0.8 + 0.2
    });
  }

  // Matrix Stream Columns
  const matrixCols = [];
  const COL_COUNT = 45;
  const CHARACTERS = '01MR.SALLCYBERDEFENSE256BITROOTACCESSCRYPTOPARSEEXPLOITHACK';

  for (let i = 0; i < COL_COUNT; i++) {
    matrixCols.push({
      x: (WIDTH / COL_COUNT) * i + Math.random() * 15,
      y: Math.random() * -1000,
      speed: Math.random() * 8 + 6,
      length: Math.floor(Math.random() * 20) + 10,
      chars: []
    });
  }

  // Terminal Log Lines for Scene 2
  const hackerLogs = [
    '> [BOOT_SEQUENCE]: SECURE_KERNEL_INITIALIZED',
    '> INJECTING_CYBER_PROBES: 192.168.1.1 // PORT 443 [OPEN]',
    '> PENETRATION_TEST_SUITE: ENGAGED [BYPASSING_DEFENSE_L1]',
    '> THREAT_INTELLIGENCE: 0 ZERO-DAY EXPLOITS NEUTRALIZED',
    '> ENCRYPTION_MATRIX: RSA-4096 / AES-GCM-256 [ACTIVE]',
    '> TARGET_ASSET_VERIFIED: MR.SALL_CYBERSECURITY_CORE',
    '> DEPLOYING_NEON_SHIELD_DEFENSE_BARRIER...',
    '> [STATUS]: SYSTEM DOMINANCE ACHIEVED 100%'
  ];

  // Electric Spark Particles around Logo (Scene 3 & 4)
  const sparkParticles = [];
  for (let i = 0; i < 60; i++) {
    sparkParticles.push({
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * 180 + 140,
      speed: (Math.random() * 0.04 + 0.02) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? '#00ff9d' : '#00d2ff',
      life: Math.random()
    });
  }

  // --- LOGO PREPARATION & METALLIC TEXTURE ---
  const prepareMetallicLogo = () => {
    offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
    const srcImg = shieldOnlyImg.complete && shieldOnlyImg.naturalWidth > 0 ? shieldOnlyImg : logoImg;

    if (srcImg.complete && srcImg.naturalWidth > 0) {
      const aspect = srcImg.naturalWidth / srcImg.naturalHeight;
      let drawW = 420;
      let drawH = drawW / aspect;
      if (drawH > 420) {
        drawH = 420;
        drawW = drawH * aspect;
      }
      const dx = (offCanvas.width - drawW) / 2;
      const dy = (offCanvas.height - drawH) / 2;

      // Draw base logo
      offCtx.drawImage(srcImg, dx, dy, drawW, drawH);

      // Add metallic cyber gradient overlay
      offCtx.globalCompositeOperation = 'source-atop';
      const grad = offCtx.createLinearGradient(0, dy, offCanvas.width, dy + drawH);
      grad.addColorStop(0, 'rgba(0, 255, 157, 0.4)');
      grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.85)'); // Specular sheen
      grad.addColorStop(0.7, 'rgba(0, 210, 255, 0.6)');
      grad.addColorStop(1, 'rgba(0, 255, 157, 0.4)');
      offCtx.fillStyle = grad;
      offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);

      offCtx.globalCompositeOperation = 'source-over';
    }
  };

  logoImg.onload = prepareMetallicLogo;
  shieldOnlyImg.onload = prepareMetallicLogo;

  // --- DRAWING FUNCTIONS FOR EACH SCENE ---

  // Background Grid in 3D Perspective (Hacker Cyberspace Floor)
  const drawPerspectiveGrid = (t) => {
    ctx.save();
    const horizonY = HEIGHT * 0.62;
    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 1;

    // Horizon glowing line
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(WIDTH, horizonY);
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ff9d';
    ctx.stroke();

    // Perspective floor lines
    const lineCount = 36;
    for (let i = 0; i <= lineCount; i++) {
      const xTop = (WIDTH / lineCount) * i;
      const xBottom = (xTop - WIDTH / 2) * 3.5 + WIDTH / 2;
      ctx.beginPath();
      ctx.moveTo(xTop, horizonY);
      ctx.lineTo(xBottom, HEIGHT);
      ctx.globalAlpha = 0.18;
      ctx.stroke();
    }

    // Moving horizontal grid lines (towards camera)
    const speed = (t * 80) % 50;
    for (let y = horizonY; y < HEIGHT; y += 30) {
      const realY = y + speed;
      if (realY > horizonY && realY < HEIGHT) {
        const factor = (realY - horizonY) / (HEIGHT - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, realY);
        ctx.lineTo(WIDTH, realY);
        ctx.globalAlpha = factor * 0.25;
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  // Matrix Code Streams (Scene 1 & 2)
  const drawMatrixRain = (t, intensity = 1.0) => {
    ctx.save();
    ctx.font = '16px "Share Tech Mono", monospace';

    matrixCols.forEach((col, idx) => {
      col.y += col.speed * 1.5;
      if (col.y > HEIGHT + 400) {
        col.y = -col.length * 24;
      }

      for (let j = 0; j < col.length; j++) {
        const charY = col.y + j * 24;
        if (charY > -20 && charY < HEIGHT + 20) {
          const charIdx = (Math.floor(t * 12) + j + idx) % CHARACTERS.length;
          const char = CHARACTERS[charIdx];

          const isHead = j === col.length - 1;
          if (isHead) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ff9d';
            ctx.globalAlpha = intensity;
          } else {
            const fade = j / col.length;
            ctx.fillStyle = j % 2 === 0 ? '#00ff9d' : '#00d2ff';
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#00ff9d';
            ctx.globalAlpha = fade * 0.65 * intensity;
          }
          ctx.fillText(char, col.x, charY);
        }
      }
    });
    ctx.restore();
  };

  // 3D Parallax Digital Particles & Binary Numbers (Scene 1)
  const drawDigitalParticles = (t) => {
    ctx.save();
    ctx.font = 'bold 18px "Orbitron", monospace';

    digitalParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      if (p.z <= 10) p.z = 1000;
      if (p.x < 0) p.x = WIDTH;
      if (p.x > WIDTH) p.x = 0;
      if (p.y < 0) p.y = HEIGHT;
      if (p.y > HEIGHT) p.y = 0;

      // 3D perspective projection
      const k = 450 / p.z;
      const screenX = (p.x - WIDTH / 2) * k + WIDTH / 2;
      const screenY = (p.y - HEIGHT / 2) * k + HEIGHT / 2;
      const renderSize = p.size * k;

      if (screenX >= 0 && screenX <= WIDTH && screenY >= 0 && screenY <= HEIGHT) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(p.alpha * k * 1.5, 0.9);
        ctx.shadowBlur = 8 * k;
        ctx.shadowColor = p.color;

        if (renderSize > 2.8) {
          ctx.fillText(p.char, screenX, screenY);
        } else {
          ctx.beginPath();
          ctx.arc(screenX, screenY, renderSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
    ctx.restore();
  };

  // Hacker Terminal Window & Telemetry (Scene 2)
  const drawHackerTelemetry = (t) => {
    ctx.save();
    const sceneT = t - SCENE_1_END; // 0 to 3.2
    const logCount = Math.min(Math.floor(sceneT * 2.8) + 1, hackerLogs.length);

    // Left Console
    ctx.font = '17px "Share Tech Mono", monospace';
    ctx.textAlign = 'left';

    const boxW = 540;
    const boxH = 340;
    const boxX = 80;
    const boxY = 160;

    // Terminal container box
    ctx.fillStyle = 'rgba(2, 6, 12, 0.75)';
    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ff9d';
    ctx.strokeRect(boxX, boxY, boxW, boxH);
    ctx.fillRect(boxX, boxY, boxW, boxH);

    // Header bar
    ctx.fillStyle = '#06111f';
    ctx.fillRect(boxX, boxY, boxW, 32);
    ctx.fillStyle = '#00ff9d';
    ctx.fillText('TERMINAL // ACADEMY_CYBER_DEFENSE.sh', boxX + 16, boxY + 22);

    // Terminal lines
    for (let i = 0; i < logCount; i++) {
      const line = hackerLogs[i];
      const isLatest = i === logCount - 1;
      ctx.fillStyle = isLatest ? '#ffffff' : '#00ff9d';
      ctx.globalAlpha = 0.9;
      ctx.fillText(line, boxX + 16, boxY + 65 + i * 32);
    }

    // Right Side Radar Scanner
    const radarX = WIDTH - 260;
    const radarY = 280;
    const radarR = 120;

    ctx.strokeStyle = 'rgba(0, 210, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(radarX, radarY, radarR, 0, Math.PI * 2);
    ctx.arc(radarX, radarY, radarR * 0.6, 0, Math.PI * 2);
    ctx.arc(radarX, radarY, radarR * 0.3, 0, Math.PI * 2);
    ctx.stroke();

    // Radar Sweep Line
    const sweepAngle = t * 4;
    ctx.beginPath();
    ctx.moveTo(radarX, radarY);
    ctx.lineTo(radarX + Math.cos(sweepAngle) * radarR, radarY + Math.sin(sweepAngle) * radarR);
    ctx.strokeStyle = '#00ff9d';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff9d';
    ctx.stroke();

    // Scanner beam across screen
    const scanLineY = (t * 400) % HEIGHT;
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, scanLineY);
    ctx.lineTo(WIDTH, scanLineY);
    ctx.stroke();

    ctx.restore();
  };

  // Scene 3: 3D Logo Reveal with Metallic Lighting & Pulse
  const draw3DLogoReveal = (t) => {
    ctx.save();
    const sceneT = Math.max(0, t - SCENE_2_END); // 0 to 3.6
    const progress = Math.min(sceneT / (SCENE_3_END - SCENE_2_END), 1);

    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2 - 40;

    // Camera movement: smooth zoom towards camera
    const scale = 0.65 + progress * 0.45; // zooms from 0.65 to 1.1

    // 3D Rotation (rotateY and slight tilt)
    const rotY = Math.sin((1 - progress) * Math.PI) * 0.8;
    const rotX = Math.sin(progress * Math.PI * 2) * 0.08;

    // Expanding Energy Shockwave Rings
    const pulseCount = 3;
    for (let i = 0; i < pulseCount; i++) {
      const ringT = (sceneT * 1.5 + i * 0.7) % 2.5;
      const ringRadius = ringT * 320;
      const ringAlpha = Math.max(0, 1 - ringT / 2.5) * 0.6;

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 === 0 ? '#00ff9d' : '#00d2ff';
      ctx.lineWidth = 3;
      ctx.globalAlpha = ringAlpha;
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#00ff9d';
      ctx.stroke();
      ctx.restore();
    }

    // Swarm of Electric Particles around the Logo
    sparkParticles.forEach((sp) => {
      sp.angle += sp.speed;
      const px = centerX + Math.cos(sp.angle) * sp.distance * scale;
      const py = centerY + Math.sin(sp.angle) * sp.distance * scale;

      ctx.save();
      ctx.fillStyle = sp.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = sp.color;
      ctx.beginPath();
      ctx.arc(px, py, sp.size * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 3D Perspective Matrix for Logo
    ctx.translate(centerX, centerY);
    ctx.scale(scale * Math.cos(rotY), scale);

    // Powerful Multi-Layer Neon Glow Behind Logo
    ctx.shadowBlur = 60;
    ctx.shadowColor = '#00ff9d';

    // Draw offscreen metallic rendered logo
    const dw = offCanvas.width;
    const dh = offCanvas.height;
    ctx.drawImage(offCanvas, -dw / 2, -dh / 2);

    // Metallic specular sheen sweep across the logo
    const sheenPos = ((sceneT * 1.2) % 3) - 1.5; // moves -1.5 to +1.5
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const sheenGrad = ctx.createLinearGradient(
      sheenPos * dw - 120, -dh / 2,
      sheenPos * dw + 120, dh / 2
    );
    sheenGrad.addColorStop(0, 'rgba(0, 255, 157, 0)');
    sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
    sheenGrad.addColorStop(1, 'rgba(0, 210, 255, 0)');
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(-dw / 2, -dh / 2, dw, dh);
    ctx.restore();

    ctx.restore();
  };

  // Scene 4: Brand Reveal with Futuristic Digital Glitch Effect
  const drawBrandReveal = (t) => {
    ctx.save();
    const sceneT = Math.max(0, t - SCENE_3_END); // 0 to 2.7
    const progress = Math.min(sceneT / 1.5, 1);

    const centerX = WIDTH / 2;
    const textBaseY = HEIGHT * 0.76;

    // Glitch displacements
    const isGlitching = Math.random() < 0.28;
    const glitchOffsetX = isGlitching ? (Math.random() - 0.5) * 22 : 0;
    const glitchOffsetY = isGlitching ? (Math.random() - 0.5) * 8 : 0;

    // Audio glitch triggering
    if (isGlitching && Math.random() < 0.4) {
      playGlitchStatic();
    }

    // 1. "MR.SALL"
    ctx.textAlign = 'center';
    ctx.font = '900 84px "Orbitron", sans-serif';
    ctx.letterSpacing = '10px';

    // RGB Splitting for cinematic chromatic aberration
    if (isGlitching) {
      // Red slice
      ctx.fillStyle = '#ff3366';
      ctx.fillText('MR.SALL', centerX + glitchOffsetX - 6, textBaseY + glitchOffsetY);
      // Cyan slice
      ctx.fillStyle = '#00d2ff';
      ctx.fillText('MR.SALL', centerX + glitchOffsetX + 6, textBaseY + glitchOffsetY);
    }

    // Main white/neon green text
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 35;
    ctx.shadowColor = '#00ff9d';
    ctx.fillText('MR.SALL', centerX + glitchOffsetX, textBaseY + glitchOffsetY);

    // 2. "CYBERSECURITY ACADEMY"
    ctx.font = '700 28px "Rajdhani", sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillStyle = '#00d2ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00d2ff';
    ctx.fillText('CYBERSECURITY ACADEMY', centerX, textBaseY + 54);

    // 3. "LEARN. PROTECT. INNOVATE."
    ctx.font = '600 22px "Orbitron", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillStyle = '#00ff9d';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ff9d';
    ctx.fillText('"LEARN. PROTECT. INNOVATE."', centerX, textBaseY + 98);

    ctx.restore();
  };

  // Scene 5: Final Energy Nova Flash & Particle Burst
  const drawFinalTransition = (t) => {
    ctx.save();
    const sceneT = Math.max(0, t - SCENE_4_END); // 0 to 1.5
    const progress = Math.min(sceneT / (SCENE_5_END - SCENE_4_END), 1);

    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2;

    // Flash trigger
    if (sceneT < 0.25) {
      flashOverlay?.classList.add('white-flash');
      flashOverlay?.classList.add('active');
    } else {
      flashOverlay?.classList.remove('white-flash');
      flashOverlay?.classList.remove('active');
    }

    // Nova Explosion Rings
    const blastRadius = progress * 1400;
    ctx.beginPath();
    ctx.arc(centerX, centerY, blastRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 14 * (1 - progress);
    ctx.shadowBlur = 40;
    ctx.shadowColor = '#00ff9d';
    ctx.globalAlpha = 1 - progress;
    ctx.stroke();

    // Thousands of high-speed outward particle sparks
    const sparkCount = 90;
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i / sparkCount) * Math.PI * 2;
      const dist = progress * 1100 + (i % 5) * 50;
      const sx = centerX + Math.cos(angle) * dist;
      const sy = centerY + Math.sin(angle) * dist;

      ctx.fillStyle = i % 2 === 0 ? '#00ff9d' : '#ffffff';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00ff9d';
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5 * (1 - progress * 0.7), 0, Math.PI * 2);
      ctx.fill();
    }

    // Fade to Black/Homepage transition
    if (progress > 0.75) {
      const fadeAlpha = (progress - 0.75) / 0.25;
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    ctx.restore();
  };

  // --- SOUND TIMING TRIGGER MANAGER ---
  let soundTriggered = {
    sub1: false,
    chirp1: false,
    riser: false,
    impact: false,
    flash: false
  };

  const handleSoundTriggers = (t) => {
    // 0.2s - Sub-bass drop
    if (t >= 0.2 && !soundTriggered.sub1) {
      playSubDrop(80, 2.8);
      soundTriggered.sub1 = true;
    }

    // 1.5s - Data chirps
    if (t >= 1.5 && t < 3.0 && Math.random() < 0.25) {
      playDataChirp();
    }

    // 3.2s - Cyber Riser
    if (t >= 3.2 && !soundTriggered.riser) {
      playRiser(2.8);
      soundTriggered.riser = true;
    }

    // 6.2s - Heavy Cinematic Boom for Logo Reveal
    if (t >= 6.2 && !soundTriggered.impact) {
      playImpactBoom();
      soundTriggered.impact = true;
    }

    // 12.5s - Final Energy Flash
    if (t >= 12.5 && !soundTriggered.flash) {
      playEnergyFlash();
      soundTriggered.flash = true;
    }
  };

  // --- MAIN RENDER LOOP ---
  const renderFrame = (timestamp) => {
    if (!startTime) startTime = timestamp;
    currentTime = (timestamp - startTime) / 1000;

    // Clear canvas with deep black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Audio events
    handleSoundTriggers(currentTime);

    // Update Timeline UI
    const progressPercent = Math.min((currentTime / TOTAL_DURATION) * 100, 100);
    if (timelineFill) timelineFill.style.width = `${progressPercent}%`;

    const currentSecStr = Math.floor(currentTime).toString().padStart(2, '0');
    if (timeCounter) timeCounter.textContent = `00:${currentSecStr} / 00:14`;

    // Scene Rendering
    if (currentTime < SCENE_1_END) {
      // Scene 1: Digital Awakening
      if (sceneIndicator) sceneIndicator.textContent = 'SCENE 1: DIGITAL AWAKENING';
      const scene1Progress = currentTime / SCENE_1_END;
      drawMatrixRain(currentTime, scene1Progress);
      drawDigitalParticles(currentTime);

    } else if (currentTime < SCENE_2_END) {
      // Scene 2: Hacker Atmosphere
      if (sceneIndicator) sceneIndicator.textContent = 'SCENE 2: HACKER ATMOSPHERE';
      drawPerspectiveGrid(currentTime);
      drawMatrixRain(currentTime, 0.4);
      drawHackerTelemetry(currentTime);

    } else if (currentTime < SCENE_3_END) {
      // Scene 3: 3D Logo Reveal
      if (sceneIndicator) sceneIndicator.textContent = 'SCENE 3: 3D LOGO REVEAL';
      drawPerspectiveGrid(currentTime);
      drawMatrixRain(currentTime, 0.25);
      draw3DLogoReveal(currentTime);

    } else if (currentTime < SCENE_4_END) {
      // Scene 4: Brand Reveal & Glitch
      if (sceneIndicator) sceneIndicator.textContent = 'SCENE 4: BRAND REVEAL';
      drawPerspectiveGrid(currentTime);
      draw3DLogoReveal(currentTime);
      drawBrandReveal(currentTime);

    } else if (currentTime <= SCENE_5_END) {
      // Scene 5: Final Transition
      if (sceneIndicator) sceneIndicator.textContent = 'SCENE 5: FINAL TRANSITION';
      draw3DLogoReveal(currentTime);
      drawBrandReveal(currentTime);
      drawFinalTransition(currentTime);

    } else {
      // Finished
      endIntro();
      return;
    }

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(renderFrame);
    }
  };

  // --- START & PLAYBACK CONTROLS ---
  const startIntro = () => {
    initAudio();
    prepareMetallicLogo();

    soundTriggered = {
      sub1: false,
      chirp1: false,
      riser: false,
      impact: false,
      flash: false
    };

    startOverlay?.classList.add('fade-out');
    startTime = 0;
    currentTime = 0;
    isPlaying = true;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(renderFrame);
  };

  const endIntro = () => {
    isPlaying = false;
    cancelAnimationFrame(animationFrameId);

    // If recording, finish recorder
    if (isRecording && mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }

    if (sceneIndicator) sceneIndicator.textContent = 'INTRO COMPLETE // WELCOME TO MR.SALL';

    // Smooth prompt to enter website after 1.5s
    setTimeout(() => {
      if (!isRecording) {
        startOverlay?.classList.remove('fade-out');
        const playBtn = document.getElementById('btn-start-intro');
        if (playBtn) playBtn.innerHTML = `
          <svg class="play-svg-icon" viewBox="0 0 24 24" fill="currentColor">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          <span>REPLAY INTRO</span>
        `;
      }
    }, 1200);
  };

  const replayIntro = () => {
    startIntro();
  };

  // --- 1-CLICK MP4 EXPORT (1080p 60FPS) ---
  const exportMp4 = () => {
    initAudio();
    if (isRecording) return;

    // Check supported formats
    let mimeType = 'video/mp4';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm; codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
    }

    const isMp4 = mimeType.includes('mp4');
    const extension = isMp4 ? 'mp4' : 'webm';

    // Capture 60 FPS stream from canvas
    const canvasStream = canvas.captureStream(60);

    // Combine with synthesized Web Audio destination
    if (audioDest && audioDest.stream) {
      const audioTrack = audioDest.stream.getAudioTracks()[0];
      if (audioTrack) {
        canvasStream.addTrack(audioTrack);
      }
    }

    recordedChunks = [];
    try {
      mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: mimeType,
        videoBitsPerSecond: 16000000 // 16 Mbps high quality 1080p
      });
    } catch (err) {
      console.warn('Fallback recorder options:', err);
      mediaRecorder = new MediaRecorder(canvasStream);
    }

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      isRecording = false;
      recordingToast?.classList.add('hidden');
      if (btnExportMp4) {
        btnExportMp4.classList.remove('recording');
        if (exportBtnLabel) exportBtnLabel.textContent = 'Export MP4 (1080p)';
      }

      const blob = new Blob(recordedChunks, { type: isMp4 ? 'video/mp4' : 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `MR_SALL_Cybersecurity_Intro_1080p.${extension}`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    };

    // Start recording and restart intro animation
    isRecording = true;
    recordingToast?.classList.remove('hidden');
    if (btnExportMp4) {
      btnExportMp4.classList.add('recording');
      if (exportBtnLabel) exportBtnLabel.textContent = 'Recording 1080p...';
    }

    mediaRecorder.start(250); // Record chunks every 250ms
    startIntro();
  };

  // --- USER LOGO UPLOAD HANDLER ---
  const handleLogoUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const newImg = new Image();
      newImg.onload = () => {
        shieldOnlyImg = newImg;
        logoImg = newImg;
        prepareMetallicLogo();

        if (uploadStatusText) {
          uploadStatusText.textContent = `Official Logo Loaded: ${file.name} ✔`;
          uploadStatusText.style.color = '#00ff9d';
        }
        if (previewLogoThumb) {
          previewLogoThumb.src = e.target.result;
        }

        // Auto-flash celebration
        flashOverlay?.classList.add('active');
        setTimeout(() => flashOverlay?.classList.remove('active'), 200);
      };
      newImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  logoFileInput?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoUpload(e.target.files[0]);
    }
  });

  logoFileInputHud?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoUpload(e.target.files[0]);
    }
  });

  // Drag and drop onto stage
  const stageWrapper = document.getElementById('stage-wrapper');
  if (stageWrapper) {
    stageWrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      stageWrapper.style.boxShadow = '0 0 50px #00ff9d';
    });
    stageWrapper.addEventListener('dragleave', () => {
      stageWrapper.style.boxShadow = '';
    });
    stageWrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      stageWrapper.style.boxShadow = '';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleLogoUpload(e.dataTransfer.files[0]);
      }
    });
  }

  // --- EVENT LISTENERS ---
  btnStartIntro?.addEventListener('click', startIntro);
  btnReplay?.addEventListener('click', replayIntro);
  btnExportMp4?.addEventListener('click', exportMp4);

  // Keyboard shortcut: Spacebar to toggle, R to replay, E to export
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (isPlaying) {
        isPlaying = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isPlaying = true;
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    } else if (e.code === 'KeyR') {
      replayIntro();
    } else if (e.code === 'KeyE') {
      exportMp4();
    }
  });

  // Initial setup: render Scene 1 preview frame immediately
  prepareMetallicLogo();
  drawMatrixRain(0, 0.8);
  drawDigitalParticles(0);

})();
