import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  BARBER_CAPE_CONFIG,
  computeDualWingCapeDisplacement,
  createRealisticCapeBumpTexture,
  playSilkRustleSound,
} from '@/lib/barber-cape-config';

interface BarberCapeRevealProps {
  onDismissed?: () => void;
}

export const BarberCapeReveal: React.FC<BarberCapeRevealProps> = ({ onDismissed }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isFullyDismissed, setIsFullyDismissed] = useState(false);
  const [hasStartedOpening, setHasStartedOpening] = useState(false);

  // Store mutable animation state in ref to avoid re-triggering WebGL
  const animStateRef = useRef({
    progress: 0,
    isOpen: false,
    startTime: 0,
    dismissed: false,
  });

  const triggerOpen = () => {
    if (animStateRef.current.isOpen || animStateRef.current.dismissed) return;
    animStateRef.current.isOpen = true;
    animStateRef.current.startTime = performance.now();
    setHasStartedOpening(true);
    playSilkRustleSound();
  };

  useEffect(() => {
    const container = mountRef.current;
    const parentContainer = containerRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    container.appendChild(renderer.domElement);

    // Multi-Point Studio Lighting for authentic silk luster and fold depth
    const ambientLight = new THREE.AmbientLight(0xfff5f8, 1.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(0, 4.5, 4.5);
    scene.add(keyLight);

    // Salon Neon Pink Rim Lights highlighting the embroidery and silken folds
    const leftPinkRim = new THREE.PointLight(0xff2a85, 4.2, 16);
    leftPinkRim.position.set(-4.5, 0, 3.2);
    scene.add(leftPinkRim);

    const rightPinkRim = new THREE.PointLight(0xff2a85, 4.2, 16);
    rightPinkRim.position.set(4.5, 0, 3.2);
    scene.add(rightPinkRim);

    const softFillLight = new THREE.DirectionalLight(0xdec8da, 1.2);
    softFillLight.position.set(0, -3.2, 3);
    scene.add(softFillLight);

    // Calculate dynamic panel dimensions to ensure 100% full screen coverage with center overlap
    const vFovRad = (camera.fov * Math.PI) / 180;
    const computeDimensions = (w: number, h: number) => {
      const visH = 2 * Math.tan(vFovRad / 2) * camera.position.z;
      const visW = visH * (w / h);
      const totalW = Math.max(visW * 1.35, 7.8);
      const totalH = Math.max(visH * 1.35, 5.8);
      const overlap = 0.16; // subtle center seam overlap
      const panelW = totalW / 2 + overlap;
      return { totalW, totalH, panelW, overlap };
    };

    let dims = computeDimensions(width, height);
    const segX = isSoftwareGl ? 32 : 56;
    const segY = isSoftwareGl ? 32 : 64;

    // Left and Right Wing Geometries
    let leftGeo = new THREE.PlaneGeometry(dims.panelW, dims.totalH, segX, segY);
    let rightGeo = new THREE.PlaneGeometry(dims.panelW, dims.totalH, segX, segY);

    // Split UV coordinates across left and right panels so they form a continuous brocade tapestry
    const applySplitUVs = (geoLeft: THREE.PlaneGeometry, geoRight: THREE.PlaneGeometry) => {
      const leftUv = geoLeft.attributes.uv;
      for (let i = 0; i < leftUv.count; i++) {
        const u = leftUv.getX(i);
        // Left half of the image: 0.0 to 0.50
        leftUv.setX(i, u * 0.5);
      }
      leftUv.needsUpdate = true;

      const rightUv = geoRight.attributes.uv;
      for (let i = 0; i < rightUv.count; i++) {
        const u = rightUv.getX(i);
        // Right half of the image: 0.50 to 1.0
        rightUv.setX(i, 0.5 + u * 0.5);
      }
      rightUv.needsUpdate = true;
    };

    applySplitUVs(leftGeo, rightGeo);

    // Load High-Resolution Photorealistic Black & Pink Jacquard Silk Fabric Texture
    const textureLoader = new THREE.TextureLoader();
    const realCapeTexture = textureLoader.load('/images/chadar-black-pink.jpg');
    realCapeTexture.colorSpace = THREE.SRGBColorSpace;
    realCapeTexture.generateMipmaps = true;
    realCapeTexture.minFilter = THREE.LinearMipmapLinearFilter;
    realCapeTexture.magFilter = THREE.LinearFilter;

    const bumpTex = createRealisticCapeBumpTexture();

    const leftMat = new THREE.MeshStandardMaterial({
      map: realCapeTexture,
      bumpMap: bumpTex,
      bumpScale: 0.045,
      roughness: 0.32,
      metalness: 0.18,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
    });

    const rightMat = new THREE.MeshStandardMaterial({
      map: realCapeTexture,
      bumpMap: bumpTex,
      bumpScale: 0.045,
      roughness: 0.32,
      metalness: 0.18,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
    });

    const leftMesh = new THREE.Mesh(leftGeo, leftMat);
    const rightMesh = new THREE.Mesh(rightGeo, rightMat);

    // Initial position: Left panel on left side, Right panel on right side with center seam overlap
    const baseLeftX = -dims.panelW / 2 + dims.overlap / 2;
    const baseRightX = dims.panelW / 2 - dims.overlap / 2;

    leftMesh.position.set(baseLeftX, 0, 0.02); // Left panel slightly under
    rightMesh.position.set(baseRightX, 0, 0.035); // Right panel overlaps on top with snap fasteners
    scene.add(leftMesh);
    scene.add(rightMesh);

    let leftOrigPos = leftGeo.attributes.position.clone();
    let rightOrigPos = rightGeo.attributes.position.clone();

    let frameId = 0;
    let disposed = false;
    const startRenderTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function renderLoop() {
      if (disposed) return;
      const t = (performance.now() - startRenderTime) * 0.001;

      // Check opening progress
      if (animStateRef.current.isOpen) {
        const elapsed = performance.now() - animStateRef.current.startTime;
        const p = Math.min(1, elapsed / BARBER_CAPE_CONFIG.liftDurationMs);
        // Exponential ease-in-out for authentic snap and loft of opening from center
        animStateRef.current.progress = p * p * (3 - 2 * p);

        // Smoothly fade the container background from solid black so the website emerges right down the middle
        if (parentContainer) {
          parentContainer.style.backgroundColor = `rgba(0, 0, 0, ${Math.max(0, 1 - p * 1.25)})`;
        }

        if (p >= 1 && !animStateRef.current.dismissed) {
          animStateRef.current.dismissed = true;
          setIsFullyDismissed(true);
          onDismissed?.();
          return;
        }
      }

      const p = animStateRef.current.progress;
      const cols = segX + 1;
      const rows = segY + 1;

      // Animate Left Panel Vertices (Peels from center to LEFT)
      const leftPosAttr = leftGeo.attributes.position;
      for (let iy = 0; iy < rows; iy++) {
        for (let ix = 0; ix < cols; ix++) {
          const index = iy * cols + ix;
          const origX = leftOrigPos.getX(index);
          const origY = leftOrigPos.getY(index);

          const disp = computeDualWingCapeDisplacement({
            panel: 'left',
            ix,
            iy,
            totalX: cols,
            totalY: rows,
            progress: p,
            time: t,
          });

          leftPosAttr.setXYZ(index, origX + disp.x, origY + disp.y, disp.z);
        }
      }
      leftPosAttr.needsUpdate = true;
      leftGeo.computeVertexNormals();

      // Animate Right Panel Vertices (Peels from center to RIGHT)
      const rightPosAttr = rightGeo.attributes.position;
      for (let iy = 0; iy < rows; iy++) {
        for (let ix = 0; ix < cols; ix++) {
          const index = iy * cols + ix;
          const origX = rightOrigPos.getX(index);
          const origY = rightOrigPos.getY(index);

          const disp = computeDualWingCapeDisplacement({
            panel: 'right',
            ix,
            iy,
            totalX: cols,
            totalY: rows,
            progress: p,
            time: t,
          });

          rightPosAttr.setXYZ(index, origX + disp.x, origY + disp.y, disp.z);
        }
      }
      rightPosAttr.needsUpdate = true;
      rightGeo.computeVertexNormals();

      // Global wing rotations and opacity fade as they part to both sides ("center mathi bey side open")
      if (p <= 0) {
        // Idle gentle breathing
        leftMesh.rotation.y = Math.sin(t * 0.8) * 0.015;
        rightMesh.rotation.y = -Math.sin(t * 0.8) * 0.015;
        leftMesh.rotation.x = Math.cos(t * 0.6) * 0.012;
        rightMesh.rotation.x = Math.cos(t * 0.6) * 0.012;
      } else {
        // Center-Split Opening: wings peel outward to left and right
        leftMesh.rotation.y = -p * 1.05; // rotates outward left
        leftMesh.rotation.z = p * 0.38; // tilts up left
        leftMesh.rotation.x = -p * 0.45;

        rightMesh.rotation.y = p * 1.05; // rotates outward right
        rightMesh.rotation.z = -p * 0.38; // tilts up right
        rightMesh.rotation.x = -p * 0.45;

        const fadeOpacity = Math.max(0, 1 - p * 1.3);
        leftMat.opacity = fadeOpacity;
        rightMat.opacity = fadeOpacity;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(renderLoop);
      } else {
        frameId = requestAnimationFrame(renderLoop);
      }
    }

    renderLoop();

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      dims = computeDimensions(width, height);

      leftGeo.dispose();
      rightGeo.dispose();
      leftOrigPos.array = new Float32Array();
      rightOrigPos.array = new Float32Array();

      leftGeo = new THREE.PlaneGeometry(dims.panelW, dims.totalH, segX, segY);
      rightGeo = new THREE.PlaneGeometry(dims.panelW, dims.totalH, segX, segY);
      applySplitUVs(leftGeo, rightGeo);

      leftOrigPos = leftGeo.attributes.position.clone();
      rightOrigPos = rightGeo.attributes.position.clone();

      leftMesh.geometry = leftGeo;
      rightMesh.geometry = rightGeo;

      leftMesh.position.set(-dims.panelW / 2 + dims.overlap / 2, 0, 0.02);
      rightMesh.position.set(dims.panelW / 2 - dims.overlap / 2, 0, 0.035);
    };
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      leftGeo.dispose();
      rightGeo.dispose();
      leftOrigPos.array = new Float32Array();
      rightOrigPos.array = new Float32Array();
      leftMat.dispose();
      rightMat.dispose();
      realCapeTexture.dispose();
      bumpTex.dispose();
      renderer.dispose();
    };
  }, [onDismissed]);

  if (isFullyDismissed) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Blossom Salon Real Barber Cape"
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black select-none cursor-pointer"
      onClick={triggerOpen}
      onTouchStart={triggerOpen}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
          triggerOpen();
        }
      }}
    >
      {/* 3D WebGL Canvas Layer - Photorealistic Jacquard Silk Dual-Wings */}
      <div
        ref={mountRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Realistic Barber Cape Collar & Metallic Snap Fastener at the Neckline */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-700 ${
          hasStartedOpening ? 'opacity-0 -translate-y-8 scale-90' : 'opacity-100'
        }`}
      >
        {/* Leather/Satin Neck Band Curve */}
        <div className="w-64 h-11 bg-gradient-to-b from-neutral-900 to-black rounded-b-3xl border-b-2 border-x border-pink-500/40 shadow-2xl flex items-center justify-between px-6">
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 border border-zinc-300 shadow-inner" />
          <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-widest text-pink-400/80 uppercase">
            <span>✂</span>
            <span>BLOSSOM SALON</span>
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 border border-zinc-300 shadow-inner" />
        </div>

        {/* Center Placket Seam Indicator */}
        <div className="w-0.5 h-8 bg-gradient-to-b from-pink-500/40 to-transparent" />
      </div>

      {/* Sleek, unobtrusive hint at the bottom */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-500 ${
          hasStartedOpening ? 'opacity-0 translate-y-4' : 'opacity-100 animate-pulse'
        }`}
      >
        <div className="px-4 py-2 rounded-full bg-black/75 backdrop-blur-md border border-pink-500/30 text-pink-200 text-xs tracking-wider uppercase flex items-center gap-2 shadow-2xl">
          <span className="text-pink-400">✂️</span>
          <span>Tap anywhere to release cape</span>
        </div>
      </div>
    </div>
  );
};
