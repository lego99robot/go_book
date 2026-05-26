"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";

type BookKey = "alice" | "frankenstein" | "moby" | string;
type ViewProfile = "mobile" | "tablet" | "desktop";

interface ImmersiveBookSceneProps {
  bookKey: BookKey;
  palette: {
    accent: string;
    ink: string;
    paper: string;
    shade: string;
  };
  isActive: boolean;
  scrollY: number;
}

interface SceneApi {
  root: THREE.Group;
  update: (elapsed: number, delta: number, state: SceneState) => void;
  resize?: (profile: ViewProfile, bounds: SceneBounds) => void;
  dispose?: () => void;
  hoverTargets?: THREE.Object3D[];
  setHover?: (isHovering: boolean) => void;
}

interface SceneState {
  reducedMotion: boolean;
  pointer: THREE.Vector2;
  profile: ViewProfile;
  bounds: SceneBounds;
}

interface SceneBounds {
  left: number;
  right: number;
  bottom: number;
  top: number;
  cup: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

function getProfile(width: number): ViewProfile {
  if (width < 720) return "mobile";
  if (width < 1100) return "tablet";
  return "desktop";
}

function getBounds(profile: ViewProfile, aspect: number): SceneBounds {
  const halfHeight = 5;
  const halfWidth = halfHeight * aspect;

  if (profile === "mobile") {
    return {
      left: -halfWidth,
      right: halfWidth,
      bottom: -halfHeight,
      top: -0.95,
      cup: {
        minX: Math.max(-halfWidth + 1.2, -2.3),
        maxX: Math.min(halfWidth - 1.2, 2.3),
        minY: -4.4,
        maxY: -2.65,
      },
    };
  }

  if (profile === "tablet") {
    return {
      left: -halfWidth,
      right: halfWidth,
      bottom: -halfHeight,
      top: -0.72,
      cup: {
        minX: -0.8,
        maxX: Math.min(halfWidth - 1.6, 3.4),
        minY: -4.1,
        maxY: -2.15,
      },
    };
  }

  return {
    left: -halfWidth,
    right: halfWidth,
    bottom: -halfHeight,
    top: -0.48,
    cup: {
      minX: Math.max(-halfWidth + 2.2, -1.0),
      maxX: Math.min(halfWidth - 2.0, 5.3),
      minY: -4.05,
      maxY: -1.65,
    },
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function color(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

function makeMat(hex: string, options: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    roughness: 0.72,
    metalness: 0.02,
    ...options,
  });
}

function makeLine(points: THREE.Vector3[], lineColor: string, opacity = 0.7) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: lineColor,
    transparent: true,
    opacity,
  });
  return new THREE.Line(geometry, material);
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    const line = child as THREE.Line;
    if ("geometry" in mesh && mesh.geometry) {
      mesh.geometry.dispose();
    }
    const material = (mesh.material || line.material) as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(material)) {
      material.forEach((item) => item.dispose());
    } else {
      material?.dispose();
    }
  });
}

function createAliceScene(palette: ImmersiveBookSceneProps["palette"], profile: ViewProfile, bounds: SceneBounds): SceneApi {
  const root = new THREE.Group();
  const porcelain = makeMat("#fff5df");
  const blush = makeMat(palette.accent, { transparent: true, opacity: 0.84 });
  const blue = makeMat(palette.shade, { transparent: true, opacity: 0.72 });

  const teapot = new THREE.Group();
  const kettleBody = new THREE.Mesh(new THREE.SphereGeometry(0.72, 40, 24), porcelain);
  kettleBody.scale.set(1.25, 0.82, 0.82);
  const lid = new THREE.Mesh(new THREE.SphereGeometry(0.26, 28, 16), blush);
  lid.position.set(0, 0.67, 0);
  lid.scale.set(1.2, 0.35, 1.2);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), blue);
  knob.position.set(0, 0.89, 0);
  const spout = new THREE.Mesh(new THREE.ConeGeometry(0.19, 0.9, 24), porcelain);
  spout.position.set(1.03, 0.03, 0);
  spout.rotation.z = -Math.PI / 2.7;
  spout.scale.set(0.72, 1, 0.72);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.075, 18, 44), blush);
  handle.position.set(-0.98, 0.03, 0);
  handle.rotation.y = Math.PI / 2;
  handle.scale.set(1, 1.18, 1);
  const handleInner = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.028, 14, 34), porcelain);
  handleInner.position.copy(handle.position);
  handleInner.rotation.copy(handle.rotation);
  handleInner.scale.set(1, 1.18, 1);
  teapot.add(kettleBody, lid, knob, spout, handle, handleInner);

  const spoutSteam = Array.from({ length: 5 }, (_, index) => {
    const line = makeLine(
      [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
      index % 2 === 0 ? palette.accent : palette.shade,
      0.34,
    );
    root.add(line);
    return line;
  });

  const cards = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const card = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.72, 0.028), i % 2 ? blush : blue);
    card.position.set(-3.8 + i * 0.92, -3.15 - (i % 2) * 0.42, -1.1 - i * 0.08);
    card.rotation.z = -0.18 + i * 0.11;
    cards.add(card);
  }

  const glowHalo = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.014, 8, 72),
    makeMat(palette.accent, { transparent: true, opacity: 0.22 }),
  );
  glowHalo.scale.set(1.35, 0.62, 1);
  glowHalo.position.set(0, -0.08, -0.22);
  teapot.add(glowHalo);

  root.add(cards, teapot);

  const applyLayout = (nextProfile: ViewProfile, nextBounds: SceneBounds) => {
    const scale = nextProfile === "mobile" ? 1.62 : nextProfile === "tablet" ? 2.02 : 2.58;
    teapot.scale.setScalar(scale);
    cards.scale.setScalar(scale * 0.5);
    teapot.position.set(nextProfile === "desktop" ? 2.7 : 0, nextProfile === "mobile" ? -2.42 : -1.84, 0);
    teapot.position.y = Math.min(teapot.position.y, nextBounds.top - 0.82);
    cards.position.set(0, nextProfile === "mobile" ? -0.7 : 0, -0.4);
  };

  applyLayout(profile, bounds);

  return {
    root,
    hoverTargets: [kettleBody, lid, knob, spout, handle, handleInner],
    setHover(isHovering) {
      root.userData.hover = isHovering;
    },
    resize(nextProfile, nextBounds) {
      applyLayout(nextProfile, nextBounds);
    },
    update(elapsed, _delta, state) {
      const hoverBoost = root.userData.hover ? 1 : 0;
      if (!state.reducedMotion) {
        teapot.position.y += Math.sin(elapsed * 1.05) * 0.0035;
        teapot.rotation.z = Math.sin(elapsed * 0.75) * 0.045 - 0.035 - hoverBoost * 0.08;
        teapot.rotation.x = Math.sin(elapsed * 0.6) * 0.018 + hoverBoost * 0.03;
        cards.children.forEach((card, index) => {
          card.position.y += Math.sin(elapsed * 0.45 + index) * 0.0009;
          card.rotation.z += Math.sin(elapsed * 0.4 + index) * 0.0004;
        });
      }
      const targetScale = 1 + hoverBoost * 0.055;
      glowHalo.scale.x = 1.35 + Math.sin(elapsed * 1.2) * 0.04 + hoverBoost * 0.12;
      glowHalo.scale.y = 0.62 + Math.sin(elapsed * 1.1) * 0.025 + hoverBoost * 0.05;
      teapot.scale.x += (targetScale * teapot.scale.y - teapot.scale.x) * 0.08;
      (glowHalo.material as THREE.MeshStandardMaterial).opacity = 0.2 + hoverBoost * 0.14;

      const spoutWorld = spout.getWorldPosition(new THREE.Vector3());
      spoutSteam.forEach((line, index) => {
        const drift = state.reducedMotion ? 0 : Math.sin(elapsed * 1.35 + index) * 0.12;
        const lift = 0.72 + index * 0.05 + hoverBoost * 0.1;
        const points = [
          spoutWorld.clone().add(new THREE.Vector3(0.03, 0.02, -0.02)),
          spoutWorld.clone().add(new THREE.Vector3(0.3 + index * 0.06, 0.22 + drift * 0.2, -0.02)),
          spoutWorld.clone().add(new THREE.Vector3(0.48 + index * 0.09, lift + drift, -0.02)),
        ];
        line.geometry.dispose();
        line.geometry = new THREE.BufferGeometry().setFromPoints(points);
        (line.material as THREE.LineBasicMaterial).opacity = state.reducedMotion ? 0.18 : 0.2 + hoverBoost * 0.16 + Math.max(0, Math.sin(elapsed * 1.1 + index)) * 0.12;
      });
    },
  };
}

function createFrankensteinScene(palette: ImmersiveBookSceneProps["palette"], profile: ViewProfile, bounds: SceneBounds): SceneApi {
  const root = new THREE.Group();
  const glass = makeMat("#dff8e8", { transparent: true, opacity: 0.28, roughness: 0.2 });
  const metal = makeMat("#c6d8cc", { metalness: 0.22, roughness: 0.48 });
  const glow = makeMat(palette.accent, {
    emissive: palette.accent,
    emissiveIntensity: 0.65,
    transparent: true,
    opacity: 0.72,
  });

  const lab = new THREE.Group();
  const flask = new THREE.Mesh(new THREE.SphereGeometry(0.86, 42, 24), glass);
  flask.scale.set(0.86, 1.22, 0.86);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.0, 32), glass);
  neck.position.y = 0.86;
  const liquid = new THREE.Mesh(new THREE.SphereGeometry(0.62, 38, 18), glow);
  liquid.position.y = -0.22;
  liquid.scale.set(0.88, 0.32, 0.88);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.12, 0.1, 48), metal);
  base.position.y = -1.05;

  const leftCoil = new THREE.Group();
  const rightCoil = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.018, 8, 28), metal);
    ringA.position.y = -0.42 + i * 0.16;
    ringA.rotation.x = Math.PI / 2;
    leftCoil.add(ringA);
    const ringB = ringA.clone();
    rightCoil.add(ringB);
  }
  leftCoil.position.set(-1.55, -0.2, 0);
  rightCoil.position.set(1.55, -0.2, 0);
  lab.add(flask, neck, liquid, base, leftCoil, rightCoil);

  const bolt = makeLine([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], palette.accent, 0.86);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.015, 8, 72), glow);
  halo.scale.set(1, 0.48, 1);
  halo.position.y = -0.14;

  const sideSpark = new THREE.Group();
  const sparkCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.18, 0),
    makeMat(palette.accent, {
      emissive: palette.accent,
      emissiveIntensity: 0.32,
      transparent: true,
      opacity: 0.48,
    }),
  );
  const sparkRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.014, 8, 36),
    makeMat("#dff8e8", {
      transparent: true,
      opacity: 0.34,
      emissive: palette.accent,
      emissiveIntensity: 0.16,
    }),
  );
  sparkRing.rotation.x = Math.PI / 2;
  sideSpark.add(sparkCore, sparkRing);

  root.add(halo, lab, bolt, sideSpark);

  let sideSparkBaseY = 0;

  const applyLayout = (nextProfile: ViewProfile, nextBounds: SceneBounds) => {
    const scale = nextProfile === "mobile" ? 1.22 : nextProfile === "tablet" ? 1.58 : 2.06;
    root.scale.setScalar(scale);
    lab.position.set(nextProfile === "desktop" ? 2.45 : 0, nextProfile === "mobile" ? -1.55 : -0.88, 0);
    halo.position.copy(lab.position).add(new THREE.Vector3(0, -0.04, -0.2));
    sideSparkBaseY = nextProfile === "mobile" ? -0.18 : nextProfile === "tablet" ? 0.34 : 0.52;
    sideSpark.position.set(nextProfile === "desktop" ? -3.7 : -1.55, sideSparkBaseY, -0.12);
    sideSpark.scale.setScalar(nextProfile === "mobile" ? 1.12 : nextProfile === "tablet" ? 1.22 : 1.3);
    lab.position.y = Math.min(lab.position.y, nextBounds.top - 0.38);
  };

  applyLayout(profile, bounds);

  return {
    root,
    hoverTargets: [flask, liquid],
    setHover(isHovering) {
      root.userData.hover = isHovering;
    },
    resize(nextProfile, nextBounds) {
      applyLayout(nextProfile, nextBounds);
    },
    update(elapsed, _delta, state) {
      const hoverBoost = root.userData.hover ? 1 : 0;
      const pulse = state.reducedMotion ? 0.2 : (Math.sin(elapsed * (2.2 + hoverBoost * 2)) + 1) * 0.5;
      liquid.scale.y = 0.28 + pulse * 0.18;
      liquid.position.y = -0.32 + pulse * 0.12;
      const material = liquid.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.35 + pulse * 0.65 + hoverBoost * 0.35;
      halo.rotation.z = elapsed * 0.12;
      halo.scale.x = 1 + pulse * 0.08;
      halo.scale.y = 0.48 + pulse * 0.04;
      sideSpark.rotation.z = elapsed * 0.32;
      sideSpark.position.y = sideSparkBaseY + (state.reducedMotion ? 0 : Math.sin(elapsed * 1.1) * 0.035);
      sparkCore.scale.setScalar(1 + pulse * 0.18);
      (sparkCore.material as THREE.MeshStandardMaterial).opacity = 0.38 + pulse * 0.18;
      (sparkRing.material as THREE.MeshStandardMaterial).opacity = 0.24 + pulse * 0.14;

      const jitter = state.reducedMotion ? 0.04 : 0.18 + hoverBoost * 0.08;
      const origin = leftCoil.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.16, 0.34, 0));
      const target = rightCoil.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(-0.16, 0.34, 0));
      const points = Array.from({ length: 5 }, (_, index) => {
        const t = index / 4;
        const point = origin.clone().lerp(target, t);
        if (index !== 0 && index !== 4) {
          point.y += Math.sin(elapsed * 7 + index * 1.7) * jitter;
          point.x += Math.cos(elapsed * 5 + index) * jitter * 0.24;
        }
        return point;
      });
      bolt.geometry.dispose();
      bolt.geometry = new THREE.BufferGeometry().setFromPoints(points);
      (bolt.material as THREE.LineBasicMaterial).opacity = state.reducedMotion ? 0.35 : 0.48 + pulse * 0.36 + hoverBoost * 0.12;

      if (!state.reducedMotion) {
        lab.position.x += state.pointer.x * 0.002;
        lab.rotation.z = Math.sin(elapsed * 0.52) * 0.018;
      }
    },
  };
}

function createMobyScene(palette: ImmersiveBookSceneProps["palette"], profile: ViewProfile, bounds: SceneBounds): SceneApi {
  const root = new THREE.Group();
  const whaleMat = makeMat("#f7f4ea", { roughness: 0.62 });
  const finMat = makeMat("#dfe8eb", { roughness: 0.68 });
  const waveColor = palette.shade;

  const sea = new THREE.Group();
  const whale = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.98, 64, 28), whaleMat);
  body.scale.set(1.72, 0.7, 0.64);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.62, 40, 20), whaleMat);
  head.position.set(-1.38, 0.08, 0);
  head.scale.set(1.08, 0.82, 0.82);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.72, 40, 16), finMat);
  belly.position.set(-0.48, -0.36, 0.03);
  belly.scale.set(1.55, 0.3, 0.52);
  const tailA = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.02, 32), whaleMat);
  tailA.position.set(1.82, 0.32, 0);
  tailA.rotation.z = -1.12;
  const tailB = tailA.clone();
  tailB.position.y = -0.25;
  tailB.rotation.z = -2.02;
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.84, 28), finMat);
  fin.position.set(-0.08, -0.68, 0.08);
  fin.rotation.z = -2.85;
  whale.add(body, head, belly, tailA, tailB, fin);

  const waves = Array.from({ length: 4 }, (_, index) => {
    const line = makeLine([new THREE.Vector3(), new THREE.Vector3()], waveColor, 0.36 + index * 0.09);
    sea.add(line);
    return line;
  });

  const compass = new THREE.Group();
  const compassRing = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.012, 8, 48), makeMat(palette.accent, { transparent: true, opacity: 0.28 }));
  const compassNeedle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.64, 0.02), makeMat(palette.accent, { transparent: true, opacity: 0.34 }));
  compassNeedle.rotation.z = -0.45;
  compass.add(compassRing, compassNeedle);

  const splashes = Array.from({ length: 5 }, (_, index) => {
    const splash = new THREE.Mesh(new THREE.SphereGeometry(0.055 + index * 0.006, 14, 10), makeMat("#f7f4ea", { transparent: true, opacity: 0.5 }));
    sea.add(splash);
    return splash;
  });

  sea.add(whale, compass);
  root.add(sea);

  const applyLayout = (nextProfile: ViewProfile, nextBounds: SceneBounds) => {
    const scale = nextProfile === "mobile" ? 1.0 : nextProfile === "tablet" ? 1.34 : 1.78;
    sea.scale.setScalar(scale);
    sea.position.set(nextProfile === "desktop" ? 0 : 0, nextProfile === "mobile" ? -2.54 : -1.96, 0);
    sea.position.y = Math.min(sea.position.y, nextBounds.top - 0.9);
    compass.position.set(nextProfile === "desktop" ? 3.1 : 2.0, -0.78, -0.35);
  };

  applyLayout(profile, bounds);

  return {
    root,
    hoverTargets: [body, head, tailA, tailB],
    setHover(isHovering) {
      root.userData.hover = isHovering;
    },
    resize(nextProfile, nextBounds) {
      applyLayout(nextProfile, nextBounds);
    },
    update(elapsed, _delta, state) {
      const hoverBoost = root.userData.hover ? 1 : 0;
      const swim = state.reducedMotion ? 0.45 : (elapsed * 0.17) % 1;
      const travel = state.bounds.right - state.bounds.left + 5.4;
      const swimX = state.reducedMotion ? 0 : state.bounds.right + 2.4 - travel * swim;
      const bob = state.reducedMotion ? 0 : Math.sin(elapsed * 1.25) * 0.12;
      whale.position.x = swimX / Math.max(sea.scale.x, 0.001);
      whale.position.y = bob + hoverBoost * 0.1;
      whale.rotation.z = state.reducedMotion ? 0 : Math.sin(elapsed * 0.65) * 0.035 - hoverBoost * 0.035;
      tailA.rotation.z = -1.12 + (state.reducedMotion ? 0 : Math.sin(elapsed * 3.2) * 0.13 + hoverBoost * 0.14);
      tailB.rotation.z = -2.02 - (state.reducedMotion ? 0 : Math.sin(elapsed * 3.2) * 0.13 + hoverBoost * 0.14);

      waves.forEach((line, lineIndex) => {
        const points = Array.from({ length: 24 }, (_, index) => {
          const t = index / 23;
          const x = -4.6 + t * 9.2;
          const y = -0.88 - lineIndex * 0.34 + Math.sin(t * Math.PI * 2 + elapsed * (1.55 + lineIndex * 0.16)) * (0.055 + lineIndex * 0.02);
          return new THREE.Vector3(x, y, -0.6 - lineIndex * 0.06);
        });
        line.geometry.dispose();
        line.geometry = new THREE.BufferGeometry().setFromPoints(points);
      });

      splashes.forEach((splash, index) => {
        const phase = (elapsed * (1.2 + hoverBoost * 0.9) + index * 0.34) % 1;
        splash.position.set(whale.position.x + 1.25 + index * 0.12, whale.position.y - 0.18 + phase * (0.36 + hoverBoost * 0.18), 0.04);
        const material = splash.material as THREE.MeshStandardMaterial;
        material.opacity = state.reducedMotion ? 0.18 : Math.max(0, 0.5 - phase * 0.48);
      });

      compass.rotation.z = elapsed * 0.08;
      sea.position.x += state.pointer.x * 0.0008;
    },
  };
}

function createSceneApi(bookKey: BookKey, palette: ImmersiveBookSceneProps["palette"], profile: ViewProfile, bounds: SceneBounds): SceneApi {
  if (bookKey === "frankenstein") return createFrankensteinScene(palette, profile, bounds);
  if (bookKey === "moby") return createMobyScene(palette, profile, bounds);
  return createAliceScene(palette, profile, bounds);
}

export function ImmersiveBookScene({ bookKey, palette, isActive, scrollY }: ImmersiveBookSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    isActive,
    scrollY,
  });

  useLayoutEffect(() => {
    stateRef.current.isActive = isActive;
    stateRef.current.scrollY = scrollY;
  }, [isActive, scrollY]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
    keyLight.position.set(-3, 4, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(color(palette.accent), 0.9);
    rimLight.position.set(4, -2, 5);
    scene.add(rimLight);

    let profile = getProfile(container.clientWidth);
    let aspect = Math.max(container.clientWidth / Math.max(container.clientHeight, 1), 0.5);
    let bounds = getBounds(profile, aspect);
    const api = createSceneApi(bookKey, palette, profile, bounds);
    scene.add(api.root);

    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const clock = new THREE.Clock();
    let animationFrame = 0;
    let hovering = false;

    const setCameraSize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.floor(canvas.clientWidth || rect.width);
      const height = Math.floor(canvas.clientHeight || rect.height);
      if (width < 2 || height < 2) return;
      aspect = Math.max(width / Math.max(height, 1), 0.5);
      profile = getProfile(width);
      bounds = getBounds(profile, aspect);
      const halfHeight = 5;
      const halfWidth = halfHeight * aspect;
      camera.left = -halfWidth;
      camera.right = halfWidth;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pixelRatio);
      const bufferWidth = Math.max(1, Math.floor(width * pixelRatio));
      const bufferHeight = Math.max(1, Math.floor(height * pixelRatio));
      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth;
        canvas.height = bufferHeight;
      }
      renderer.setViewport(0, 0, width, height);
      api.resize?.(profile, bounds);
    };

    const setPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const hitObjects = (objects?: THREE.Object3D[]) => {
      if (!objects?.length) return [];
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(objects, true);
    };

    const updateHover = (event: PointerEvent) => {
      setPointer(event);
      const targets = api.hoverTargets;
      const isHovering = hitObjects(targets).length > 0;
      if (isHovering !== hovering) {
        hovering = isHovering;
        api.setHover?.(hovering);
        canvas.style.cursor = hovering ? "pointer" : "default";
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      setPointer(event);
      if (hitObjects(api.hoverTargets).length > 0) {
        api.setHover?.(true);
        hovering = true;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      setPointer(event);
      updateHover(event);
    };

    const onPointerUp = (event: PointerEvent) => {
      setPointer(event);
      updateHover(event);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("pointerleave", updateHover);

    const resizeObserver = new ResizeObserver(setCameraSize);
    resizeObserver.observe(container);
    setCameraSize();
    const initialResizeOne = window.requestAnimationFrame(setCameraSize);
    const initialResizeTwo = window.requestAnimationFrame(() => {
      setCameraSize();
      renderer.render(scene, camera);
    });
    const initialResizeThree = window.setTimeout(setCameraSize, 160);

    const animate = () => {
      setCameraSize();
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const reducedMotion = prefersReduced.matches;
      if (stateRef.current.isActive || !reducedMotion) {
        api.update(elapsed, delta, {
          reducedMotion,
          pointer,
          profile,
          bounds,
        });
      }
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(initialResizeOne);
      window.cancelAnimationFrame(initialResizeTwo);
      window.clearTimeout(initialResizeThree);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", updateHover);
      api.dispose?.();
      disposeObject(api.root);
      renderer.dispose();
    };
  }, [bookKey, palette]);

  return (
    <div
      ref={containerRef}
      className="immersive-book-scene absolute inset-x-0 bottom-0 z-[6] h-[min(34vh,24rem)] overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ touchAction: bookKey === "alice" ? "pan-y" : "auto" }}
      />
    </div>
  );
}
