import * as THREE from 'three';

export interface BarberCapeConfig {
  liftDurationMs: number;
}

export const BARBER_CAPE_CONFIG: BarberCapeConfig = {
  liftDurationMs: 1400,
};

export interface DualWingPhysicsParams {
  panel: 'left' | 'right';
  ix: number;
  iy: number;
  totalX: number;
  totalY: number;
  progress: number; // 0 to 1
  time: number;
}

/**
 * Computes realistic 3D salon haircutting cape drape and CENTER-SPLIT opening physics ("center mathi bey side open").
 * When clicked, the cape unclasps at the center seam, and both halves billow and curl away outward:
 * - Left wing peels towards the LEFT (-X)
 * - Right wing peels towards the RIGHT (+X)
 */
export function computeDualWingCapeDisplacement(params: DualWingPhysicsParams): { x: number; y: number; z: number } {
  const { panel, ix, iy, totalX, totalY, progress, time } = params;

  // Normalized local panel coordinates (0 to 1)
  const u = ix / (totalX - 1);
  const v = iy / (totalY - 1); // 0 (neck/collar) to 1 (hem bottom)

  // Distance from center seam (0 at center seam, 1 at outer shoulder edge):
  // For 'left' panel: u = 1 is the inner center seam; u = 0 is the outer left shoulder
  // For 'right' panel: u = 0 is the inner center seam; u = 1 is the outer right shoulder
  const distFromCenter = panel === 'left' ? 1 - u : u;
  const isLeft = panel === 'left';

  // 1. Natural resting 3D drape around neck and shoulders
  // Contours outward and downward with realistic chest prominence
  const chestContour = Math.cos(distFromCenter * Math.PI * 0.8) * 0.22 * (1 - v * 0.55);
  // Natural silky cascading folds fanning outward from the neck
  const pleat1 = Math.sin(distFromCenter * Math.PI * 7.5 + (isLeft ? 0.35 : -0.35)) * 0.085 * (0.35 + v * 0.65);
  const pleat2 = Math.sin(distFromCenter * Math.PI * 15 + v * 2) * 0.03 * (0.2 + v * 0.8);
  // Gentle breathing cloth undulation
  const idleBreath = Math.sin(time * 1.6 + v * 3.5 + distFromCenter * 2) * 0.02 * (1 - progress);

  const restingZ = chestContour + pleat1 + pleat2 + idleBreath;

  if (progress <= 0) {
    return {
      x: 0,
      y: 0,
      z: restingZ,
    };
  }

  // 2. Dynamic Center Split Opening Physics ("Center mathi bey side open")
  // The center seam (distFromCenter ~ 0) unclasps first, then wave rolls outward
  const peelTiming = Math.min(1, Math.max(0, progress * 1.5 - distFromCenter * 0.5));
  const smoothPeel = peelTiming * peelTiming * (3 - 2 * peelTiming);

  // Billow wave rolling across the fabric as it catches air
  const wave = Math.sin(progress * Math.PI * 2.4 - distFromCenter * 4.2) * 0.45 * (1 - progress);

  // Directional fling: left wing to -X, right wing to +X
  const directionSign = isLeft ? -1 : 1;
  const xFly = directionSign * (smoothPeel * 5.6 + distFromCenter * 0.7 * progress);

  // Billow forward in Z as it parts, then curl backward
  const zBillow = Math.sin(progress * Math.PI) * 1.15 + smoothPeel * 1.6 + wave;

  // Lifts up and tilts outward along Y
  const yLift = smoothPeel * 1.7 + Math.sin(distFromCenter * Math.PI + time * 3) * 0.14;

  return {
    x: xFly,
    y: yLift,
    z: restingZ * (1 - progress) + zBillow,
  };
}

/**
 * Creates normal/bump map for tactile fabric weave and raised embroidery depth.
 */
export function createRealisticCapeBumpTexture(): THREE.CanvasTexture | THREE.Texture {
  if (typeof document === 'undefined') {
    return new THREE.Texture();
  }
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Micro-woven twill weave noise
  for (let y = 0; y < size; y += 4) {
    for (let x = 0; x < size; x += 4) {
      const v = Math.floor(128 + (Math.sin(x * 0.8 + y * 0.8) + (Math.random() - 0.5)) * 16);
      ctx.fillStyle = `rgb(${v}, ${v}, ${v})`;
      ctx.fillRect(x, y, 4, 4);
    }
  }

  // Vertical fold ripple bumps
  for (let i = 0; i < 8; i++) {
    const fx = (i + 0.5) * (size / 8);
    const grad = ctx.createLinearGradient(fx - 24, 0, fx + 24, 0);
    grad.addColorStop(0, 'rgba(128, 128, 128, 0)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
    ctx.fillStyle = grad;
    ctx.fillRect(fx - 24, 0, 48, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Loads the photorealistic black & hot-pink jacquard cape texture.
 */
export function createRealisticCapePanelTexture(panel: 'left' | 'right'): THREE.Texture {
  if (typeof document === 'undefined') {
    return new THREE.Texture();
  }
  const texture = new THREE.TextureLoader().load('/images/chadar-black-pink.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Backwards compatibility alias
export function createRealisticSalonCapeTexture(): THREE.Texture {
  return createRealisticCapePanelTexture('left');
}

/**
 * Plays a soft, tactile barber cape snap and silk rustle when unclasped.
 */
export function playSilkRustleSound(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const duration = 0.35;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const envelope = Math.sin(progress * Math.PI) * Math.exp(-progress * 3);
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + duration);
    filter.Q.value = 1.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch {
    // Graceful fallback if Web Audio is restricted by browser policy
  }
}

export function computeRealisticCapeDisplacement(params: {
  ix: number;
  iy: number;
  totalX: number;
  totalY: number;
  liftProgress: number;
  time: number;
}): { x: number; y: number; z: number } {
  return computeDualWingCapeDisplacement({
    panel: 'left',
    ix: params.ix,
    iy: params.iy,
    totalX: params.totalX,
    totalY: params.totalY,
    progress: params.liftProgress,
    time: params.time,
  });
}

