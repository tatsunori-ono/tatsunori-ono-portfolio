import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";

export default function AstroidFieldWithConsent() {
  const mountRef           = useRef(null);
  /* ── UI state ── */
  const [audioReady,   setAudioReady]   = useState(false);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(null); // null | true | false
  const [sceneReady,   setSceneReady]   = useState(false);

  /* ── audio refs ── */
  const audioCtxRef     = useRef(null);
  const analyserRef     = useRef(null);
  const sourceRef       = useRef(null);
  const freqArrayRef    = useRef(null);
  const bufferRef       = useRef(null);

  /* ───────── inject CSS once for the name animation ───────── */
  useEffect(() => {
    const css = `
      .name-animate{
        position:absolute;top:12px;left:16px;
        font-family:Futura,ui-sans-serif,sans-serif;
        font-weight:700;font-size:clamp(1.25rem, 5vw, 2.25rem);line-height:1;z-index:10;
        display:inline-block;white-space:nowrap;
      }
      .name-animate span{display:inline-block;
        animation:slideLR 2s calc(var(--i)*.12s) infinite alternate ease-in-out;}
      @keyframes slideLR{from{transform:translateX(-4px);}to{transform:translateX(4px);}}
      .astroid-canvas-wrap{opacity:0;transition:opacity .6s ease;}
      .astroid-canvas-wrap.ready{opacity:1;}
      .astroid-loading{
        position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
        background:#fff;z-index:12;transition:opacity .4s ease;
      }
      .astroid-spinner{
        width:32px;height:32px;border-radius:50%;
        border:3px solid rgba(0,0,0,0.15);border-top-color:rgba(0,0,0,0.6);
        animation:astroidSpin .8s linear infinite;
      }
      @keyframes astroidSpin{to{transform:rotate(360deg);}}
    `;
    const tag = document.createElement("style");
    tag.innerHTML = css; document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  /* ───────── Three.js + audio setup ───────── */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const testCanvas = document.createElement("canvas");
    if (!canCreateWebGL(testCanvas)) {
      setWebglAvailable(false);
      console.error("WebGL is unavailable in this environment");
      return;
    }
    setWebglAvailable(true);
    const { clientWidth: w, clientHeight: h } = mount;

    /* scene / camera / renderer */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#ffffff");
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 4, 10);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch (e) {
      setWebglAvailable(false);
      console.error("WebGL init failed:", e);
      return;
    }
    renderer.setSize(w, h); mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.06; controls.enablePan = false;

    scene.add(new THREE.AmbientLight(0x888888));
    const dir = new THREE.DirectionalLight(0xffffff, 1); dir.position.set(6, 8, 4); scene.add(dir);

    /* shared geometry + material (rainbow normals) */
    const geom = new ParametricGeometry(astroidCubeParam, 60, 60);
    const mat  = new THREE.MeshNormalMaterial({ flatShading: true, side: THREE.DoubleSide });

    /* generate astroids */
    const NUM = 15, strength = 1.5, minR = 3, maxR = 10, tries = 100;
    const astroids = [];
    for (let i = 0; i < NUM; i++) {
      const base = 0.4 + Math.random(), radius = base + strength;
      let pos, ok = false;
      for (let t = 0; t < tries && !ok; t++) {
        pos = new THREE.Vector3().setFromSphericalCoords(
          THREE.MathUtils.randFloat(minR, maxR),
          Math.acos(2 * Math.random() - 1),
          2 * Math.PI * Math.random()
        );
        ok = astroids.every(a => a.mesh.position.distanceTo(pos) > a.radius + radius);
      }
      if (!ok) pos = new THREE.Vector3(0, 0, maxR + 5 + i);

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(pos); mesh.scale.setScalar(base);
      const rotX = (Math.random() - 0.5) * 0.6, rotY = (Math.random() - 0.5) * 0.6;
      scene.add(mesh); astroids.push({ mesh, base, rotX, rotY, radius });
    }

    /* resize */
    const onResize = () => {
      const ww = mount.clientWidth, hh = mount.clientHeight;
      camera.aspect = ww / hh; camera.updateProjectionMatrix(); renderer.setSize(ww, hh);
    };
    window.addEventListener("resize", onResize);

    /* click-to-spawn asteroids */
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const MAX_TRANSIENT = 25;
    let downX = 0, downY = 0, downTime = 0;

    const spawnAstroidAt = (clientX, clientY) => {
      const transientCount = astroids.reduce((n, a) => n + (a.transient ? 1 : 0), 0);
      if (transientCount >= MAX_TRANSIENT) return;

      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const distance = THREE.MathUtils.randFloat(4, 9);
      const pos = raycaster.ray.origin
        .clone()
        .add(raycaster.ray.direction.clone().multiplyScalar(distance));

      const base = 0.3 + Math.random() * 0.4;
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(pos);
      mesh.scale.setScalar(0.001);
      const rotX = (Math.random() - 0.5) * 1.2;
      const rotY = (Math.random() - 0.5) * 1.2;
      scene.add(mesh);
      astroids.push({
        mesh, base, rotX, rotY,
        transient: true,
        spawnTime: clock.getElapsedTime(),
      });
    };

    const onPointerDown = (e) => {
      downX = e.clientX; downY = e.clientY; downTime = performance.now();
    };
    const onPointerUp = (e) => {
      if (e.target !== renderer.domElement) return;
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (dist < 6 && performance.now() - downTime < 500) {
        spawnAstroidAt(e.clientX, e.clientY);
      }
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    /* render loop */
    const clock = new THREE.Clock(); let running = true; let firstFrame = true;
    const GROW_TIME = 0.4, LIFETIME = 2.5, SHRINK_TIME = 1;
    const animate = () => {
      if (!running) return; requestAnimationFrame(animate);
      const dt = clock.getDelta(); controls.update();

      /* beat value */
      let norm = 0;
      if (analyserRef.current && freqArrayRef.current) {
        analyserRef.current.getByteFrequencyData(freqArrayRef.current);
        const arr = freqArrayRef.current, nyq = (audioCtxRef.current?.sampleRate || 44100) / 2;
        const bins = Math.max(1, Math.floor((200 / nyq) * arr.length));
        norm = arr.slice(0, bins).reduce((s, v) => s + v, 0) / bins / 255;
      } else {
        const t = clock.getElapsedTime(); norm = (Math.sin(t * 4) + 1) / 2; // fake beat
      }

      /* update astroids */
      const now = clock.getElapsedTime();
      for (let i = astroids.length - 1; i >= 0; i--) {
        const a = astroids[i];
        a.mesh.rotation.x += a.rotX * dt; a.mesh.rotation.y += a.rotY * dt;

        if (a.transient) {
          const age = now - a.spawnTime;
          let scale;
          if (age < GROW_TIME) {
            scale = THREE.MathUtils.lerp(0, a.base, age / GROW_TIME);
          } else if (age < GROW_TIME + LIFETIME) {
            scale = a.base;
          } else if (age < GROW_TIME + LIFETIME + SHRINK_TIME) {
            scale = THREE.MathUtils.lerp(a.base, 0, (age - GROW_TIME - LIFETIME) / SHRINK_TIME);
          } else {
            scene.remove(a.mesh);
            astroids.splice(i, 1);
            continue;
          }
          a.mesh.scale.setScalar(scale + norm * strength * 0.3);
        } else {
          const target = a.base + norm * strength;
          a.mesh.scale.setScalar(THREE.MathUtils.lerp(a.mesh.scale.x, target, 0.15));
        }
      }

      renderer.render(scene, camera);
      if (firstFrame) { firstFrame = false; setSceneReady(true); }
    };
    animate();

    /* cleanup */
    return () => {
      running = false; window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      geom.dispose(); mat.dispose(); renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  /* ───────── audio preload ───────── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ctx;
        const res = await fetch("/dj-vocaloid.mp3");
        if (!res.ok) throw new Error(`fetch failed (${res.status})`);
        const buf = await res.arrayBuffer(); const decoded = await ctx.decodeAudioData(buf);
        if (cancelled) return; bufferRef.current = decoded; setAudioReady(true);
      } catch (e) { console.error("Audio preload failed:", e); }
    })();

    return () => {
      cancelled = true;
      try { sourceRef.current?.stop(); sourceRef.current?.disconnect(); analyserRef.current?.disconnect(); } catch {
        // Ignore errors during cleanup
      }
      audioCtxRef.current?.close();
    };
  }, []);

  /* ── audio control helpers ── */
  const startAudio = async () => {
    if (!bufferRef.current) return;
    try {
      let ctx = audioCtxRef.current; if (ctx.state === "suspended") await ctx.resume();
      const src = ctx.createBufferSource(); src.buffer = bufferRef.current; src.loop = true;
      const an  = ctx.createAnalyser(); an.fftSize = 2048; an.smoothingTimeConstant = 0.85;
      src.connect(an).connect(ctx.destination); src.start();
      sourceRef.current = src; analyserRef.current = an;
      freqArrayRef.current = new Uint8Array(an.frequencyBinCount);
      setIsPlaying(true);
    } catch (e) { console.error("Failed to start audio:", e); }
  };
  const pauseAudio = () => {
    try {
      sourceRef.current?.stop(); sourceRef.current?.disconnect(); analyserRef.current?.disconnect();
      sourceRef.current = null; analyserRef.current = null; setIsPlaying(false);
    } catch (e) { console.error("Failed to pause audio:", e); }
  };

  /* ── start audio silently on first user interaction (browsers block autoplay) ── */
  useEffect(() => {
    const tryStart = () => { if (bufferRef.current && !sourceRef.current) startAudio(); };
    const events = ["click", "keydown", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, tryStart, { once: true }));
    return () => events.forEach((ev) => window.removeEventListener(ev, tryStart));
  }, []);

  /* ─────────────── JSX ─────────────── */
  return (
    <div
      ref={mountRef}
      className={"astroid-canvas-wrap" + (sceneReady ? " ready" : "")}
      style={{ width: "100%", height: "100vh", position: "relative" }}
    >
      {/* loading indicator, shown until first frame renders */}
      {webglAvailable !== false && !sceneReady && (
        <div className="astroid-loading">
          <div className="astroid-spinner" />
        </div>
      )}

      {/* animated name */}
      <h1 className="name-animate">
        {"Tatsunori Ono".split("").map((ch, i) => (
          <span key={i} style={{ "--i": i }}>{ch === " " ? "\u00A0" : ch}</span>
        ))}
      </h1>

      {/* WebGL fallback */}
      {webglAvailable === false && (
        <div
          style={{
            position: "absolute", inset: 0,
            background: "rgba(255,255,255,0.95)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            fontFamily: "system-ui, sans-serif", zIndex: 15, padding: 32,
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 22, marginBottom: 10, fontWeight: 600 }}>
            WebGL is unavailable in this environment
          </h2>
          <p style={{ maxWidth: 520, fontSize: 14, opacity: 0.8 }}>
            Enable hardware acceleration or try a different browser/device to see the background animation.
          </p>
        </div>
      )}

      {/* play / pause controls */}
      <div
        style={{
          position: "absolute", top: 60, left: 16,
          display: "flex", gap: 8, alignItems: "center",
          fontFamily: "system-ui, sans-serif", zIndex: 10,
        }}
      >
        {!isPlaying ? (
          <button onClick={startAudio} disabled={!audioReady} style={btnSmall(audioReady)}>
            ▶ Play
          </button>
        ) : (
          <button onClick={pauseAudio} style={btnSmall(true)}>⏸ Pause</button>
        )}
      </div>
    </div>
  );
}

/* small button styles */
const btnSmall = (enabled) => ({
  padding: "6px 12px", borderRadius: 8, border: "1px solid #ccc",
  background: enabled ? "#fff" : "#eee", cursor: enabled ? "pointer" : "not-allowed",
});

function canCreateWebGL(canvas) {
  try {
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

/* ---------- astroid-cube parametric surface ---------- */
function astroidCubeParam(u, v, target) {
  u *= 2 * Math.PI; v *= 2 * Math.PI;
  const a = 1;
  const x = a * Math.pow(Math.cos(u), 3) * Math.pow(Math.cos(v), 3);
  const y = a * Math.pow(Math.sin(u), 3) * Math.pow(Math.cos(v), 3);
  const z = a * Math.pow(Math.sin(v), 3);
  target.set(x, y, z);
}
