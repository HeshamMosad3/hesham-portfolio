"use client";

import { useEffect, useRef } from "react";

/**
 * "Data city": a field of instanced 3D columns that rise and light up
 * under the pointer, with a shockwave on click. Idle state drifts on its own
 * so touch users still get motion. three.js loads lazily after first paint.
 */
export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const THREE = await import("@/lib/three-lite");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        return;
      }
      // Lower resolution on phones and weak devices: the scene is soft and dark, so it still looks sharp.
      const lowPower = host.clientWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4 || !window.matchMedia("(pointer: fine)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1 : 1.5));
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);

      const small = host.clientWidth < 760;
      const COLS = small ? 18 : 46;
      const ROWS = small ? 14 : 26;
      const SP = 0.62;
      const COUNT = COLS * ROWS;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x0a0a09, 12, 28);

      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      const camBase = new THREE.Vector3(0, small ? 9.5 : 8.2, small ? 15 : 14);
      camera.position.copy(camBase);
      const lookAt = new THREE.Vector3(0, 0, small ? -1 : -2);
      camera.lookAt(lookAt);

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xfff6e5, 1.6);
      key.position.set(-6, 12, 8);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x3ce0c0, 0.6);
      rim.position.set(8, 4, -10);
      scene.add(rim);
      const glow = new THREE.PointLight(0xffb547, 28, 7, 1.6);
      glow.position.set(0, 1.6, 0);
      scene.add(glow);

      const geo = new THREE.BoxGeometry(SP * 0.78, 1, SP * 0.78);
      geo.translate(0, 0.5, 0);
      const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.42, metalness: 0.25 });
      const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(mesh);

      const px = new Float32Array(COUNT);
      const pz = new Float32Array(COUNT);
      const h = new Float32Array(COUNT);
      const seed = new Float32Array(COUNT);
      let i = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          px[i] = (c - (COLS - 1) / 2) * SP;
          pz[i] = (r - (ROWS - 1) / 2) * SP;
          h[i] = 0.2;
          seed[i] = Math.random();
          i++;
        }
      }

      const dark = new THREE.Color(0x1d1d19);
      const primary = new THREE.Color(0xffb547);
      const secondary = new THREE.Color(0x3ce0c0);
      const tmpC = new THREE.Color();
      const dummy = new THREE.Object3D();
      for (let k = 0; k < COUNT; k++) mesh.setColorAt(k, dark);

      // Pointer → ground plane
      const ray = new THREE.Raycaster();
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = new THREE.Vector3();
      const ndc = new THREE.Vector2(0, 0);
      const target = new THREE.Vector2(0, 0);
      const focus = new THREE.Vector2(0, 0);
      let lastMove = -1e9;
      let camX = 0, camY = 0;
      const pulses: { x: number; z: number; t: number }[] = [];

      const toGround = (clientX: number, clientY: number) => {
        const r = host.getBoundingClientRect();
        if (clientY < r.top || clientY > r.bottom) return false;
        ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        if (!ray.ray.intersectPlane(plane, hit)) return false;
        return true;
      };
      const onMove = (e: PointerEvent) => {
        if (!toGround(e.clientX, e.clientY)) return;
        target.set(hit.x, hit.z);
        lastMove = performance.now();
      };
      const onDown = (e: PointerEvent) => {
        if ((e.target as Element)?.closest?.("a, button")) return;
        if (!toGround(e.clientX, e.clientY)) return;
        pulses.push({ x: hit.x, z: hit.z, t: performance.now() });
        if (pulses.length > 4) pulses.shift();
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });

      const resize = () => {
        const w = host.clientWidth, hh = host.clientHeight;
        renderer.setSize(w, hh, false);
        camera.aspect = w / Math.max(hh, 1);
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(host);
      resize();

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(host);

      const t0 = performance.now();
      let raf = 0;
      const frame = (now: number) => {
        const t = (now - t0) / 1000;

        // Idle autopilot after 2.5s without pointer movement
        if (now - lastMove > 2500) {
          target.set(Math.sin(t * 0.35) * (COLS * SP * 0.3), Math.cos(t * 0.27) * (ROWS * SP * 0.22));
        }
        focus.x += (target.x - focus.x) * 0.08;
        focus.y += (target.y - focus.y) * 0.08;
        glow.position.set(focus.x, 1.4, focus.y);

        for (let k = 0; k < COUNT; k++) {
          const x = px[k], z = pz[k];
          const base = 0.18 + 0.16 * (Math.sin(x * 0.42 + t * 0.8) + Math.cos(z * 0.5 + t * 0.6)) + seed[k] * 0.12;
          const dx = x - focus.x, dz = z - focus.y;
          const d2 = dx * dx + dz * dz;
          const infl = Math.exp(-d2 / 3.2);
          let wave = 0;
          for (const p of pulses) {
            const age = (now - p.t) / 1000;
            if (age > 2.4) continue;
            const pd = Math.hypot(x - p.x, z - p.z);
            const front = age * 7;
            wave += Math.exp(-((pd - front) ** 2) / 0.6) * (1 - age / 2.4) * 1.8;
          }
          const goal = Math.max(0.06, base + infl * (2.4 + seed[k] * 0.8) + wave);
          h[k] += (goal - h[k]) * 0.12;

          dummy.position.set(x, 0, z);
          dummy.scale.set(1, h[k], 1);
          dummy.updateMatrix();
          mesh.setMatrixAt(k, dummy.matrix);

          const glowAmt = Math.min(1, infl * 1.1 + wave * 0.6);
          tmpC.copy(dark).lerp(seed[k] > 0.965 ? secondary : primary, glowAmt * 0.95 + (seed[k] > 0.985 ? 0.25 : 0));
          mesh.setColorAt(k, tmpC);
        }
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

        camX += (ndc.x * 1.4 - camX) * 0.04;
        camY += (ndc.y * 0.6 - camY) * 0.04;
        camera.position.set(camBase.x + camX, camBase.y + camY, camBase.z);
        camera.lookAt(lookAt);

        renderer.render(scene, camera);
      };

      // 30 fps on low-power devices, full frame rate elsewhere.
      const minGap = lowPower ? 1000 / 30 : 0;
      let lastFrame = 0;
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        if (now - lastFrame < minGap) return;
        lastFrame = now;
        frame(now);
      };

      if (reduced) {
        frame(performance.now());
      } else {
        raf = requestAnimationFrame(loop);
      }
      host.classList.add("ready");

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // Defer heavy work until the browser is idle so the text paints first.
    // Start only after the page has fully loaded and the browser is idle,
    // so fonts and content never compete with three.js for the network.
    const hasIdle = typeof window.requestIdleCallback === "function";
    let id = 0;
    const schedule = () => {
      id = hasIdle ? window.requestIdleCallback(() => void start(), { timeout: 2000 }) : window.setTimeout(() => void start(), 300);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener("load", schedule);
      if (hasIdle) window.cancelIdleCallback(id);
      else clearTimeout(id);
      cleanup();
    };
  }, []);

  return <div ref={ref} className="hero-canvas" aria-hidden="true" />;
}
