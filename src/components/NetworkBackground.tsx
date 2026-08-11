import { useEffect, useRef } from "react";
import * as THREE from "three";

export function NetworkBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // A fresh canvas per effect run avoids WebGL context re-acquisition issues
    // that React 18 StrictMode's dev-only double mount/unmount would trigger.
    const canvas = document.createElement("canvas");
    canvas.className = "h-full w-full";
    wrapper.appendChild(canvas);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCompact = window.innerWidth < 640;

    // Additive blending only reads as a glow against a dark surface — on a
    // light background it just washes out to near-white and disappears.
    // Pick colors + a blend mode that stays legible in either theme.
    const themeAttr = document.documentElement.getAttribute("data-theme");
    const isDark =
      themeAttr === "dark" ||
      (themeAttr !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    // ─── Tuneable constants ───────────────────────────────────────────────────
    const NODE_COUNT   = isCompact ? 30  : 65;
    const LINK_DIST    = isCompact ? 100 : 130;
    const MAX_LINES    = NODE_COUNT * 6;
    const PULSE_COUNT  = isCompact ? 8   : 16;
    const DUST_COUNT   = isCompact ? 50  : 100; // ambient floating particles

    // ─── Renderer ─────────────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 1, 1200);
    camera.position.z = 240;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
    } catch (err) {
      console.error("[NetworkBackground] WebGL unavailable:", err);
      wrapper.removeChild(canvas);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    // ─── Nodes ────────────────────────────────────────────────────────────────
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 480,
        (Math.random() - 0.5) * 320,
        (Math.random() - 0.5) * 220,
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.18,
      ),
    }));

    // ─── Texture factory ──────────────────────────────────────────────────────
    function makeGlowTexture(inner: string, mid: string, outer: string, size = 128) {
      const c   = document.createElement("canvas");
      c.width   = size;
      c.height  = size;
      const ctx = c.getContext("2d")!;
      const r   = size / 2;
      const g   = ctx.createRadialGradient(r, r, 0, r, r, r);
      g.addColorStop(0,    inner);
      g.addColorStop(0.22, mid);
      g.addColorStop(0.55, outer);
      g.addColorStop(1,    "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    }

    // Dark theme: white-hot glowing core (reads well with additive blending).
    // Light theme: flat saturated dot, no white core (would vanish on a
    // light page), composited with normal blending instead.
    const dotTexture = isDark
      ? makeGlowTexture("rgba(255,255,255,1)", "rgba(255,220,60,1)", "rgba(255,140,0,0.55)", 128)
      : makeGlowTexture("rgba(196,130,20,1)", "rgba(196,130,20,0.9)", "rgba(196,130,20,0)", 128);
    const pulseTexture = isDark
      ? makeGlowTexture("rgba(255,255,255,1)", "rgba(80,200,255,1)", "rgba(30,100,220,0.5)", 96)
      : makeGlowTexture("rgba(30,90,175,1)", "rgba(30,90,175,0.9)", "rgba(30,90,175,0)", 96);
    const pulse2Texture = isDark
      ? makeGlowTexture("rgba(255,255,200,1)", "rgba(255,190,40,1)", "rgba(200,80,0,0.45)", 96)
      : makeGlowTexture("rgba(170,90,10,1)", "rgba(170,90,10,0.9)", "rgba(170,90,10,0)", 96);
    const dustTexture = isDark
      ? makeGlowTexture("rgba(180,210,255,1)", "rgba(120,160,255,0.6)", "rgba(60,90,200,0.15)", 48)
      : makeGlowTexture("rgba(100,120,150,0.9)", "rgba(100,120,150,0.6)", "rgba(100,120,150,0)", 48);

    const blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
    const lineColor1 = isDark ? 0x4faeff : 0x2f6fb0;
    const lineColor2 = isDark ? 0xffd040 : 0xb87d10;
    const lineOpacity1 = isDark ? 0.13 : 0.18;
    const lineOpacity2 = isDark ? 0.08 : 0.12;
    const dustOpacity = isDark ? 0.2 : 0.25;

    // ─── Main node points ──────────────────────────────────────────────────────
    const nodePositions  = new Float32Array(NODE_COUNT * 3);
    const nodeSizes      = new Float32Array(NODE_COUNT);
    for (let i = 0; i < NODE_COUNT; i++) nodeSizes[i] = 10 + Math.random() * 8;

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    pointsGeo.setAttribute("size",     new THREE.BufferAttribute(nodeSizes, 1));

    const pointsMat = new THREE.PointsMaterial({
      color:         0xffffff,
      map:           dotTexture,
      size:          10,
      transparent:   true,
      opacity:       0.4,
      depthWrite:    false,
      sizeAttenuation: true,
      blending,
    });
    const points = new THREE.Points(pointsGeo, pointsMat);
    scene.add(points);

    // ─── Connection lines ──────────────────────────────────────────────────────
    const linePositions = new Float32Array(MAX_LINES * 2 * 3);
    const lineGeo       = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setDrawRange(0, 0);
    const lineMat = new THREE.LineBasicMaterial({
      color:       lineColor1,
      transparent: true,
      opacity:     lineOpacity1,
      blending,
    });
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegments);

    // Secondary line layer — gold tinted edges for variety
    const linePositions2 = new Float32Array(MAX_LINES * 2 * 3);
    const lineGeo2       = new THREE.BufferGeometry();
    lineGeo2.setAttribute("position", new THREE.BufferAttribute(linePositions2, 3));
    lineGeo2.setDrawRange(0, 0);
    const lineMat2 = new THREE.LineBasicMaterial({
      color:       lineColor2,
      transparent: true,
      opacity:     lineOpacity2,
      blending,
    });
    const lineSegments2 = new THREE.LineSegments(lineGeo2, lineMat2);
    scene.add(lineSegments2);

    // ─── Cyan data-packet pulses ───────────────────────────────────────────────
    const pulsePositions = new Float32Array(PULSE_COUNT * 3);
    const pulseGeo       = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePositions, 3));
    const pulseMat = new THREE.PointsMaterial({
      color:         0xffffff,
      map:           pulseTexture,
      size:          8,
      transparent:   true,
      opacity:       0.45,
      depthWrite:    false,
      sizeAttenuation: true,
      blending,
    });
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    scene.add(pulsePoints);

    // ─── Gold data-packet pulses ───────────────────────────────────────────────
    const pulse2Positions = new Float32Array(PULSE_COUNT * 3);
    const pulse2Geo       = new THREE.BufferGeometry();
    pulse2Geo.setAttribute("position", new THREE.BufferAttribute(pulse2Positions, 3));
    const pulse2Mat = new THREE.PointsMaterial({
      color:         0xffffff,
      map:           pulse2Texture,
      size:          7,
      transparent:   true,
      opacity:       0.35,
      depthWrite:    false,
      sizeAttenuation: true,
      blending,
    });
    const pulse2Points = new THREE.Points(pulse2Geo, pulse2Mat);
    scene.add(pulse2Points);

    // ─── Ambient dust / starfield ──────────────────────────────────────────────
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustVels      = Array.from({ length: DUST_COUNT }, () => ({
      x: (Math.random() - 0.5) * 0.06,
      y: (Math.random() - 0.5) * 0.06,
      z: (Math.random() - 0.5) * 0.04,
    }));
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPositions[i * 3]     = (Math.random() - 0.5) * 600;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color:         0xffffff,
      map:           dustTexture,
      size:          7,
      transparent:   true,
      opacity:       dustOpacity,
      depthWrite:    false,
      sizeAttenuation: true,
      blending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // ─── Pulse state ──────────────────────────────────────────────────────────
    const pulses = Array.from({ length: PULSE_COUNT }, () => ({
      a: 0, b: 1,
      t: Math.random(),
      speed: 0.007 + Math.random() * 0.012,
    }));
    const pulses2 = Array.from({ length: PULSE_COUNT }, () => ({
      a: 0, b: 1,
      t: Math.random(),
      speed: 0.004 + Math.random() * 0.008,
    }));

    // ─── Resize ───────────────────────────────────────────────────────────────
    function resize() {
      const w = wrapper!.clientWidth || window.innerWidth;
      const h = wrapper!.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    // Defer first resize to let the DOM finish layout
    requestAnimationFrame(resize);

    const posAttr    = pointsGeo.getAttribute("position")  as THREE.BufferAttribute;
    const linePosAttr = lineGeo.getAttribute("position")   as THREE.BufferAttribute;
    const linePosAttr2 = lineGeo2.getAttribute("position") as THREE.BufferAttribute;
    const pulsePosAttr  = pulseGeo.getAttribute("position")  as THREE.BufferAttribute;
    const pulse2PosAttr = pulse2Geo.getAttribute("position") as THREE.BufferAttribute;
    const dustPosAttr   = dustGeo.getAttribute("position")   as THREE.BufferAttribute;

    // ─── Mouse parallax ───────────────────────────────────────────────────────
    const pointer = { x: 0, y: 0 };
    function onPointerMove(e: PointerEvent) {
      const rect = wrapper!.getBoundingClientRect();
      pointer.x  = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      pointer.y  = ((e.clientY - rect.top)  / rect.height) * 2 - 1;
    }
    window.addEventListener("pointermove", onPointerMove);

    let activeEdges: [number, number][] = [];

    // ─── Per-frame render ─────────────────────────────────────────────────────
    function renderFrame(withMotion: boolean, t: number) {
      if (withMotion) {
        // Node movement + boundary bounce
        for (const n of nodes) {
          n.pos.add(n.vel);
          if (Math.abs(n.pos.x) > 240) n.vel.x *= -1;
          if (Math.abs(n.pos.y) > 160) n.vel.y *= -1;
          if (Math.abs(n.pos.z) > 110) n.vel.z *= -1;
        }

        // Sinusoidal scene tilt for a "breathing" cinematic feel
        scene.rotation.y += 0.0028;
        scene.rotation.x  = Math.sin(t * 0.00018) * 0.18;
        scene.rotation.z  = Math.sin(t * 0.00011) * 0.04;

        // Vivid node size breathing
        const beat = Math.sin(t * 0.003);
        pointsMat.size = 9 + beat * 1.5;
        pulseMat.size  = 7 + beat * 1;

        // Camera parallax follows pointer
        camera.position.x += (pointer.x *  70 - camera.position.x) * 0.035;
        camera.position.y += (-pointer.y * 45 - camera.position.y) * 0.035;
        camera.lookAt(0, 0, 0);

        // Drift ambient dust
        for (let i = 0; i < DUST_COUNT; i++) {
          dustPositions[i * 3]     += dustVels[i].x;
          dustPositions[i * 3 + 1] += dustVels[i].y;
          dustPositions[i * 3 + 2] += dustVels[i].z;
          if (Math.abs(dustPositions[i * 3])     > 300) dustVels[i].x *= -1;
          if (Math.abs(dustPositions[i * 3 + 1]) > 200) dustVels[i].y *= -1;
          if (Math.abs(dustPositions[i * 3 + 2]) > 150) dustVels[i].z *= -1;
        }
        dustPosAttr.needsUpdate = true;
      }

      // Sync node GPU positions
      nodes.forEach((n, i) => posAttr.setXYZ(i, n.pos.x, n.pos.y, n.pos.z));
      posAttr.needsUpdate = true;

      // Build connection edges — split into two layers for color variety
      activeEdges = [];
      let lineIdx  = 0;
      let lineIdx2 = 0;
      outer: for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (lineIdx + lineIdx2 >= MAX_LINES) break outer;
          const d = nodes[i].pos.distanceTo(nodes[j].pos);
          if (d < LINK_DIST) {
            const useGold = (i + j) % 4 === 0; // 25 % of edges are gold
            if (useGold && lineIdx2 < MAX_LINES) {
              linePosAttr2.setXYZ(lineIdx2 * 2,     nodes[i].pos.x, nodes[i].pos.y, nodes[i].pos.z);
              linePosAttr2.setXYZ(lineIdx2 * 2 + 1, nodes[j].pos.x, nodes[j].pos.y, nodes[j].pos.z);
              lineIdx2++;
            } else if (lineIdx < MAX_LINES) {
              linePosAttr.setXYZ(lineIdx * 2,     nodes[i].pos.x, nodes[i].pos.y, nodes[i].pos.z);
              linePosAttr.setXYZ(lineIdx * 2 + 1, nodes[j].pos.x, nodes[j].pos.y, nodes[j].pos.z);
              lineIdx++;
            }
            activeEdges.push([i, j]);
          }
        }
      }
      lineGeo.setDrawRange(0, lineIdx * 2);
      lineGeo2.setDrawRange(0, lineIdx2 * 2);
      linePosAttr.needsUpdate  = true;
      linePosAttr2.needsUpdate = true;

      // Animate traveling data packets
      if (activeEdges.length > 0) {
        pulses.forEach((p, i) => {
          if (withMotion) {
            p.t += p.speed;
            if (p.t >= 1) {
              p.t = 0;
              const edge = activeEdges[Math.floor(Math.random() * activeEdges.length)];
              p.a = edge[0];
              p.b = edge[1];
            }
          }
          const a = nodes[p.a] ?? nodes[0];
          const b = nodes[p.b] ?? nodes[0];
          pulsePosAttr.setXYZ(i,
            a.pos.x + (b.pos.x - a.pos.x) * p.t,
            a.pos.y + (b.pos.y - a.pos.y) * p.t,
            a.pos.z + (b.pos.z - a.pos.z) * p.t,
          );
        });
        pulsePosAttr.needsUpdate = true;

        pulses2.forEach((p, i) => {
          if (withMotion) {
            p.t += p.speed;
            if (p.t >= 1) {
              p.t = 0;
              const edge = activeEdges[Math.floor(Math.random() * activeEdges.length)];
              p.a = edge[0];
              p.b = edge[1];
            }
          }
          const a = nodes[p.a] ?? nodes[0];
          const b = nodes[p.b] ?? nodes[0];
          pulse2PosAttr.setXYZ(i,
            a.pos.x + (b.pos.x - a.pos.x) * p.t,
            a.pos.y + (b.pos.y - a.pos.y) * p.t,
            a.pos.z + (b.pos.z - a.pos.z) * p.t,
          );
        });
        pulse2PosAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }

    // Seed pulses
    for (const p of [...pulses, ...pulses2]) {
      const i = Math.floor(Math.random() * nodes.length);
      const j = Math.floor(Math.random() * nodes.length);
      p.a = i;
      p.b = j === i ? (i + 1) % nodes.length : j;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    let raf = 0;
    let animating = false;

    function tick(t: number) {
      raf = requestAnimationFrame(tick);
      renderFrame(true, t);
    }
    function start() {
      if (animating) return;
      animating = true;
      raf = requestAnimationFrame(tick);
    }
    function stop() {
      animating = false;
      cancelAnimationFrame(raf);
    }

    function cleanup() {
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      pointsGeo.dispose();    pointsMat.dispose();    dotTexture.dispose();
      pulseGeo.dispose();     pulseMat.dispose();     pulseTexture.dispose();
      pulse2Geo.dispose();    pulse2Mat.dispose();    pulse2Texture.dispose();
      dustGeo.dispose();      dustMat.dispose();      dustTexture.dispose();
      lineGeo.dispose();      lineMat.dispose();
      lineGeo2.dispose();     lineMat2.dispose();
      renderer.dispose();
      wrapper!.removeChild(canvas);
    }

    if (reduceMotion) {
      // Still draw a single static frame for reduced-motion users
      requestAnimationFrame(() => renderFrame(false, 0));
      return cleanup;
    }

    // Start animation immediately — IntersectionObserver is unreliable on
    // transparent overlays (zero painted pixels = never intersecting).
    // Pause only when the tab is hidden to save GPU.
    start();

    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      cleanup();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    />
  );
}
