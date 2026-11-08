import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  getFinishPreset,
  getFocusPreset,
  type SalonFinishId,
  type SalonFocusId,
} from '@/lib/salon-hero-config';

export interface Salon3DCanvasProps {
  finishId: SalonFinishId;
  focusId: SalonFocusId;
  exploded: boolean;
  isDark: boolean;
  onSelectFocus?: (focus: SalonFocusId) => void;
}

function createMarbleTexture(isDark: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = isDark ? '#1e1e26' : '#f3efe8';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle architectural stone veining
  ctx.strokeStyle = isDark ? 'rgba(212, 175, 55, 0.22)' : 'rgba(24, 24, 27, 0.08)';
  ctx.lineWidth = 1.8;
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    let x = (i * 41) % 512;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 512) {
      y += 32;
      x += Math.sin(y * 0.03 + i) * 18;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 124);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const Salon3DCanvas: React.FC<Salon3DCanvasProps> = ({
  finishId,
  focusId,
  exploded,
  isDark,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Store latest reactive props in refs so WebGL scene never tears down on state updates
  const stateRef = useRef({
    finishId,
    focusId,
    exploded,
    isDark,
    userYaw: 0,
    userPitch: 0,
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
  });

  useEffect(() => {
    stateRef.current.finishId = finishId;
    stateRef.current.focusId = focusId;
    stateRef.current.exploded = exploded;
    stateRef.current.isDark = isDark;
  }, [finishId, focusId, exploded, isDark]);

  useEffect(() => {
    const container = mountRef.current;
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

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 40);
    camera.position.set(0.2, 1.85, 5.1);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 3-Point Warm/Cool Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xfff6e5, 0x1e293b, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.2);
    keyLight.position.set(3.5, 5.5, 4.0);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 15;
      const d = 2.8;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 1.25);
    rimLight.position.set(-4.0, 3.0, -3.5);
    scene.add(rimLight);

    const warmFillLight = new THREE.PointLight(0xfbbf24, 1.35, 8);
    warmFillLight.position.set(0, 1.8, 1.8);
    scene.add(warmFillLight);

    // Shared PBR Materials
    const initialPreset = getFinishPreset(stateRef.current.finishId);
    const marbleTex = createMarbleTexture(stateRef.current.isDark);
    marbleTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const brushedMetalMat = new THREE.MeshPhysicalMaterial({
      color: initialPreset.metalHex,
      metalness: 0.92,
      roughness: 0.18,
      anisotropy: 0.75,
      clearcoat: 0.35,
      clearcoatRoughness: 0.15,
    });

    const polishedChromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      metalness: 0.96,
      roughness: 0.08,
      clearcoat: 0.5,
    });

    const leatherMat = new THREE.MeshStandardMaterial({
      color: initialPreset.leatherHex,
      roughness: 0.52,
      metalness: 0.12,
    });

    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: marbleTex,
      roughness: 0.32,
      metalness: 0.08,
    });

    const mirrorGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.05,
      clearcoat: 1.0,
    });

    const haloEmissiveMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      emissive: initialPreset.accentHex,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });

    const crystalGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.88,
      transparent: true,
      opacity: isSoftwareGl ? 0.42 : 1.0,
      ior: 1.55,
      thickness: 0.8,
      clearcoat: 1.0,
      depthWrite: false,
    });

    const elixirCoreMat = new THREE.MeshStandardMaterial({
      color: initialPreset.accentHex,
      emissive: initialPreset.metalHex,
      emissiveIntensity: 0.45,
      roughness: 0.2,
      metalness: 0.3,
    });

    // Root Turntable Group
    const atelierRoot = new THREE.Group();
    scene.add(atelierRoot);

    // Contact Shadow Disc (offset +0.015 on Y to prevent Z-fighting)
    const shadowTex = createContactShadowTexture();
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 4.4),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.22 + 0.015;
    scene.add(shadowPlane);

    // 1. Podium & Architectural Base (Primary Silhouette)
    const podiumGroup = new THREE.Group();
    const mainPlinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.68, 1.82, 0.22, 48),
      podiumMat
    );
    mainPlinth.position.y = -0.11;
    mainPlinth.receiveShadow = !isSoftwareGl;
    podiumGroup.add(mainPlinth);

    const podiumTrimRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.7, 0.022, 16, 64),
      brushedMetalMat
    );
    podiumTrimRing.rotation.x = Math.PI / 2;
    podiumTrimRing.position.y = 0.0;
    podiumGroup.add(podiumTrimRing);

    const outerOrbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.008, 12, 72),
      brushedMetalMat
    );
    outerOrbitRing.rotation.x = Math.PI / 2;
    outerOrbitRing.position.y = -0.05;
    podiumGroup.add(outerOrbitRing);
    atelierRoot.add(podiumGroup);

    // 2. Illuminated Vanity Halo Mirror Arch (Primary Silhouette)
    const mirrorGroup = new THREE.Group();
    mirrorGroup.position.set(0, 1.18, -0.68);

    const mirrorDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.92, 0.92, 0.04, 48),
      mirrorGlassMat
    );
    mirrorDisc.rotation.x = Math.PI / 2;
    mirrorGroup.add(mirrorDisc);

    const mirrorFrame = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.042, 20, 64),
      brushedMetalMat
    );
    mirrorGroup.add(mirrorFrame);

    const mirrorHaloLed = new THREE.Mesh(
      new THREE.TorusGeometry(0.87, 0.016, 16, 64),
      haloEmissiveMat
    );
    mirrorHaloLed.position.z = 0.025;
    mirrorGroup.add(mirrorHaloLed);

    // Twin vertical architectural support pillars for mirror
    for (const side of [-1, 1]) {
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.028, 1.35, 16),
        brushedMetalMat
      );
      pillar.position.set(side * 0.65, -0.52, -0.04);
      mirrorGroup.add(pillar);
    }
    atelierRoot.add(mirrorGroup);

    // 3. Sculpted Hydraulic Salon Throne (Composite Multi-Part Group)
    const throneGroup = new THREE.Group();
    throneGroup.position.set(0, 0, 0.08);

    // 3a. Hydraulic Base & Pump Column
    const hydraulicBaseGroup = new THREE.Group();
    const baseDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.52, 0.05, 36),
      polishedChromeMat
    );
    baseDisc.position.y = 0.025;
    hydraulicBaseGroup.add(baseDisc);

    const pumpColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.11, 0.42, 24),
      polishedChromeMat
    );
    pumpColumn.position.y = 0.24;
    hydraulicBaseGroup.add(pumpColumn);

    const pumpCollar = new THREE.Mesh(
      new THREE.TorusGeometry(0.115, 0.02, 16, 32),
      brushedMetalMat
    );
    pumpCollar.rotation.x = Math.PI / 2;
    pumpCollar.position.y = 0.14;
    hydraulicBaseGroup.add(pumpCollar);
    throneGroup.add(hydraulicBaseGroup);

    // 3b. Contoured Leather Seat Cushion (ExtrudeGeometry with bevels)
    const seatGroup = new THREE.Group();
    const seatShape = new THREE.Shape();
    seatShape.moveTo(-0.36, -0.34);
    seatShape.lineTo(0.36, -0.34);
    seatShape.quadraticCurveTo(0.44, 0, 0.38, 0.36);
    seatShape.lineTo(-0.38, 0.36);
    seatShape.quadraticCurveTo(-0.44, 0, -0.36, -0.34);

    const seatGeo = new THREE.ExtrudeGeometry(seatShape, {
      depth: 0.11,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.035,
      bevelSegments: 4,
    });
    seatGeo.rotateX(Math.PI / 2);
    const seatMesh = new THREE.Mesh(seatGeo, leatherMat);
    seatMesh.position.y = 0.52;
    seatMesh.castShadow = !isSoftwareGl;
    seatGroup.add(seatMesh);

    // Gold/Metallic under-chassis cradle
    const seatCradle = new THREE.Mesh(
      new THREE.BoxGeometry(0.74, 0.045, 0.66),
      brushedMetalMat
    );
    seatCradle.position.y = 0.41;
    seatGroup.add(seatCradle);
    throneGroup.add(seatGroup);

    // 3c. Ergonomic Backrest & Adjustable Stitched Headrest
    const backrestGroup = new THREE.Group();
    const backShape = new THREE.Shape();
    backShape.moveTo(-0.33, 0);
    backShape.lineTo(0.33, 0);
    backShape.quadraticCurveTo(0.38, 0.35, 0.28, 0.62);
    backShape.lineTo(-0.28, 0.62);
    backShape.quadraticCurveTo(-0.38, 0.35, -0.33, 0);

    const backGeo = new THREE.ExtrudeGeometry(backShape, {
      depth: 0.09,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.03,
      bevelSegments: 4,
    });
    const backrestMesh = new THREE.Mesh(backGeo, leatherMat);
    backrestMesh.position.set(0, 0.56, -0.36);
    backrestMesh.rotation.x = -0.16;
    backrestMesh.castShadow = !isSoftwareGl;
    backrestGroup.add(backrestMesh);

    // Sculpted Headrest Cushion + Dual Chrome Posts
    const headrestMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.16, 0.09),
      leatherMat
    );
    headrestMesh.position.set(0, 1.32, -0.47);
    headrestMesh.rotation.x = -0.12;
    backrestGroup.add(headrestMesh);

    for (const side of [-1, 1]) {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.18, 12),
        polishedChromeMat
      );
      post.position.set(side * 0.11, 1.21, -0.44);
      post.rotation.x = -0.16;
      backrestGroup.add(post);
    }
    throneGroup.add(backrestGroup);

    // 3d. Sculpted Brushed-Metal Armrests & Footrest T-Bar
    const armsAndFootrestGroup = new THREE.Group();
    for (const side of [-1, 1]) {
      const armVertical = new THREE.Mesh(
        new THREE.CylinderGeometry(0.026, 0.026, 0.34, 16),
        brushedMetalMat
      );
      armVertical.position.set(side * 0.44, 0.62, -0.05);
      armsAndFootrestGroup.add(armVertical);

      const armTopBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.075, 0.04, 0.58),
        leatherMat
      );
      armTopBar.position.set(side * 0.44, 0.79, 0.02);
      armsAndFootrestGroup.add(armTopBar);

      const armTrim = new THREE.Mesh(
        new THREE.BoxGeometry(0.082, 0.018, 0.6),
        brushedMetalMat
      );
      armTrim.position.set(side * 0.44, 0.765, 0.02);
      armsAndFootrestGroup.add(armTrim);
    }

    // Footrest Bar
    const footrestStrut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.42, 16),
      polishedChromeMat
    );
    footrestStrut.position.set(0, 0.26, 0.42);
    footrestStrut.rotation.x = 0.68;
    armsAndFootrestGroup.add(footrestStrut);

    const footrestStep = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.54, 16),
      brushedMetalMat
    );
    footrestStep.rotation.z = Math.PI / 2;
    footrestStep.position.set(0, 0.14, 0.58);
    armsAndFootrestGroup.add(footrestStep);
    throneGroup.add(armsAndFootrestGroup);
    atelierRoot.add(throneGroup);

    // 4. Floating Japanese Damascus Styling Shears (Secondary Read - Left Orbit)
    const shearsGroup = new THREE.Group();
    shearsGroup.position.set(-1.12, 1.18, 0.35);

    const createShearBlade = (isLeftBlade: boolean) => {
      const half = new THREE.Group();
      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(0, -0.032);
      bladeShape.lineTo(0.68, -0.004);
      bladeShape.quadraticCurveTo(0.45, 0.038, 0, 0.032);
      bladeShape.closePath();

      const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
        depth: 0.016,
        bevelEnabled: true,
        bevelThickness: 0.006,
        bevelSize: 0.006,
        bevelSegments: 2,
      });
      const bladeMesh = new THREE.Mesh(
        bladeGeo,
        isLeftBlade ? polishedChromeMat : brushedMetalMat
      );
      bladeMesh.position.z = isLeftBlade ? 0.012 : -0.012;
      half.add(bladeMesh);

      // Shank + Finger Ring
      const shank = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.014, 0.34, 12),
        brushedMetalMat
      );
      shank.rotation.z = Math.PI / 2;
      shank.position.set(-0.17, isLeftBlade ? 0.03 : -0.03, 0);
      half.add(shank);

      const fingerRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.088, 0.018, 16, 32),
        brushedMetalMat
      );
      fingerRing.position.set(-0.39, isLeftBlade ? 0.075 : -0.075, 0);
      half.add(fingerRing);

      return half;
    };

    const shearBladeA = createShearBlade(true);
    shearBladeA.rotation.z = 0.34;
    const shearBladeB = createShearBlade(false);
    shearBladeB.rotation.z = -0.34;

    const pivotJewel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.034, 0.055, 20),
      brushedMetalMat
    );
    pivotJewel.rotation.x = Math.PI / 2;

    const shearsOrbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.56, 0.006, 12, 48),
      brushedMetalMat
    );
    shearsOrbitRing.rotation.y = 0.4;

    shearsGroup.add(shearBladeA, shearBladeB, pivotJewel, shearsOrbitRing);
    shearsGroup.rotation.set(0.2, 0.45, 0.65);
    atelierRoot.add(shearsGroup);

    // 5. Botanical Crystal Elixir Flacon & Atomizer (Secondary Read - Right Orbit)
    const elixirGroup = new THREE.Group();
    elixirGroup.position.set(1.12, 0.85, 0.38);

    // Floating Mini Pedestal under Elixir
    const miniPedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.36, 0.06, 32),
      podiumMat
    );
    miniPedestal.position.y = -0.34;
    elixirGroup.add(miniPedestal);

    const miniPedestalRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.01, 12, 40),
      brushedMetalMat
    );
    miniPedestalRim.rotation.x = Math.PI / 2;
    miniPedestalRim.position.y = -0.31;
    elixirGroup.add(miniPedestalRim);

    // Faceted Crystal Bottle Body
    const bottleOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.24, 0.48, 8),
      crystalGlassMat
    );
    bottleOuter.renderOrder = 2;
    elixirGroup.add(bottleOuter);

    // Golden Argan Core Inside Bottle
    const bottleInnerCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.18, 0.36, 8),
      elixirCoreMat
    );
    bottleInnerCore.position.y = -0.02;
    elixirGroup.add(bottleInnerCore);

    // Brushed Gold Neck & Atomizer Cap Group
    const atomizerGroup = new THREE.Group();
    const neckCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.1, 0.1, 24),
      brushedMetalMat
    );
    neckCollar.position.y = 0.29;
    atomizerGroup.add(neckCollar);

    const nozzleHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.075, 0.11, 24),
      polishedChromeMat
    );
    nozzleHead.position.y = 0.39;
    atomizerGroup.add(nozzleHead);

    const sprayTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.16, 12),
      brushedMetalMat
    );
    sprayTube.rotation.z = Math.PI / 2;
    sprayTube.position.set(0.08, 0.39, 0);
    atomizerGroup.add(sprayTube);

    const atomizerBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 20, 16),
      leatherMat
    );
    atomizerBulb.position.set(0.2, 0.37, 0);
    atomizerGroup.add(atomizerBulb);

    elixirGroup.add(atomizerGroup);
    atelierRoot.add(elixirGroup);

    // Pre-warm shaders on GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer Interaction Handlers (360° Drag Orbit)
    const domElem = renderer.domElement;
    const onPointerDown = (e: PointerEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.lastPointerX = e.clientX;
      stateRef.current.lastPointerY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!stateRef.current.isDragging) return;
      const dx = e.clientX - stateRef.current.lastPointerX;
      const dy = e.clientY - stateRef.current.lastPointerY;
      stateRef.current.lastPointerX = e.clientX;
      stateRef.current.lastPointerY = e.clientY;
      stateRef.current.userYaw += dx * 0.007;
      stateRef.current.userPitch = THREE.MathUtils.clamp(
        stateRef.current.userPitch + dy * 0.004,
        -0.25,
        0.35
      );
    };
    const onPointerUp = () => {
      stateRef.current.isDragging = false;
    };

    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', onResize);

    // Zero-GC Scratch Objects for Render Loop
    const _targetCamPos = new THREE.Vector3();
    const _currentLookAt = new THREE.Vector3(0, 0.75, 0);
    const _targetLookAt = new THREE.Vector3();
    const _targetColor = new THREE.Color();
    const _bgColor = new THREE.Color();

    let explodeFactor = 0;
    let lastThemeDark = stateRef.current.isDark;
    let frameId = 0;
    let disposed = false;
    const startTime = performance.now();
    let lastTime = startTime;

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
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;

      const { finishId: curFinishId, focusId: curFocusId, exploded: curExploded, isDark: curDark } =
        stateRef.current;

      // Update Theme Background & Podium Texture if theme switched
      if (curDark !== lastThemeDark) {
        lastThemeDark = curDark;
        const newMarble = createMarbleTexture(curDark);
        newMarble.anisotropy = renderer.capabilities.getMaxAnisotropy();
        podiumMat.map?.dispose();
        podiumMat.map = newMarble;
        podiumMat.needsUpdate = true;
      }

      const targetBgHex = curDark ? 0x0c0c0e : 0xffffff;
      _bgColor.setHex(targetBgHex);
      if (scene.background instanceof THREE.Color) {
        scene.background.lerp(_bgColor, 1 - Math.exp(-8 * dt));
      }
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.lerp(_bgColor, 1 - Math.exp(-8 * dt));
      }

      // Smoothly interpolate Finish Material Colors
      const finishPreset = getFinishPreset(curFinishId);
      _targetColor.setHex(finishPreset.metalHex);
      brushedMetalMat.color.lerp(_targetColor, 1 - Math.exp(-6 * dt));

      _targetColor.setHex(finishPreset.leatherHex);
      leatherMat.color.lerp(_targetColor, 1 - Math.exp(-6 * dt));

      _targetColor.setHex(finishPreset.accentHex);
      haloEmissiveMat.emissive.lerp(_targetColor, 1 - Math.exp(-6 * dt));
      elixirCoreMat.color.lerp(_targetColor, 1 - Math.exp(-6 * dt));

      // Smoothly interpolate Camera Position & Target
      const focusPreset = getFocusPreset(curFocusId);
      _targetCamPos.set(...focusPreset.cameraPos);
      _targetLookAt.set(...focusPreset.lookTarget);

      camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, 4.5, dt);
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        _targetCamPos.y + stateRef.current.userPitch,
        4.5,
        dt
      );
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, 4.5, dt);

      _currentLookAt.x = THREE.MathUtils.damp(_currentLookAt.x, _targetLookAt.x, 5.0, dt);
      _currentLookAt.y = THREE.MathUtils.damp(_currentLookAt.y, _targetLookAt.y, 5.0, dt);
      _currentLookAt.z = THREE.MathUtils.damp(_currentLookAt.z, _targetLookAt.z, 5.0, dt);
      camera.lookAt(_currentLookAt);

      // Smooth Exploded-View Separation
      const targetExplode = curExploded ? 1 : 0;
      explodeFactor = THREE.MathUtils.damp(explodeFactor, targetExplode, 5.0, dt);

      seatGroup.position.y = explodeFactor * 0.28;
      backrestGroup.position.y = explodeFactor * 0.42;
      backrestGroup.position.z = -explodeFactor * 0.25;
      armsAndFootrestGroup.position.y = explodeFactor * 0.16;
      mirrorGroup.position.z = -0.68 - explodeFactor * 0.35;
      atomizerGroup.position.y = explodeFactor * 0.28;

      // Subtle Scissors Shear Animation & Orbital Float
      const shearAngle = 0.32 + Math.sin(elapsed * 1.8) * 0.08 + explodeFactor * 0.22;
      shearBladeA.rotation.z = shearAngle;
      shearBladeB.rotation.z = -shearAngle;
      shearBladeA.position.z = 0.012 + explodeFactor * 0.12;
      shearBladeB.position.z = -0.012 - explodeFactor * 0.12;

      shearsGroup.position.y = 1.18 + Math.sin(elapsed * 1.4) * 0.04;
      shearsGroup.rotation.y = 0.45 + Math.sin(elapsed * 0.9) * 0.15;

      elixirGroup.position.y = 0.85 + Math.cos(elapsed * 1.3) * 0.035;
      bottleOuter.rotation.y = elapsed * 0.35;
      bottleInnerCore.rotation.y = elapsed * 0.35;

      // Smooth Turntable Rotation + User Drag Yaw
      if (!stateRef.current.isDragging && curFocusId === 'overview') {
        stateRef.current.userYaw += dt * 0.18;
      }
      atelierRoot.rotation.y = THREE.MathUtils.damp(
        atelierRoot.rotation.y,
        stateRef.current.userYaw,
        6.0,
        dt
      );

      renderer.render(scene, camera);

      if (!isVisible) return;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    let isVisible = true;
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              const nowVisible = entry.isIntersecting;
              if (nowVisible && !isVisible) {
                isVisible = true;
                lastTime = performance.now();
                tick();
              } else {
                isVisible = nowVisible;
              }
            },
            { threshold: 0.05 }
          )
        : null;
    io?.observe(container);

    tick();

    return () => {
      disposed = true;
      io?.disconnect();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
      marbleTex.dispose();
      shadowTex.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="salon-3d-viewport"
      className="w-full h-full min-h-[380px] cursor-grab active:cursor-grabbing select-none"
      aria-label="Blossom Salon Showcase"
    />
  );
};
