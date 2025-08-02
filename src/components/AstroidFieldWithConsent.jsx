import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";

export default function AstroidFieldWithConsent() {
  const mountRef           = useRef(null);
  /* ── UI state ── */
  const [audioConsent, setAudioConsent] = useState(null); // null | "yes" | "no"
  const [audioReady,   setAudioReady]   = useState(false);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [errorMsg,     setErrorMsg]     = useState("");

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
        font-weight:700;font-size:2.25rem;line-height:1;z-index:10;
        display:inline-block;white-space:nowrap;
      }
      .name-animate span{display:inline-block;
        animation:slideLR 2s calc(var(--i)*.12s) infinite alternate ease-in-out;}
      @keyframes slideLR{from{transform:translateX(-4px);}to{transform:translateX(4px);}}
    `;
    const tag = document.createElement("style");
    tag.innerHTML = css; document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  /* ───────── Three.js + audio setup ───────── */
  useEffect(() => {
    const mount = mountRef.current;
    const { clientWidth: w, clientHeight: h } = mount;

    /* scene / camera / renderer */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#ffffff");
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 4, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
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

    /* preload audio */
    let cancelled = false;
    (async () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ctx;
        const res = await fetch("/dj-vocaloid.mp3");
        if (!res.ok) throw new Error(`fetch failed (${res.status})`);
        const buf = await res.arrayBuffer(); const decoded = await ctx.decodeAudioData(buf);
        if (cancelled) return; bufferRef.current = decoded; setAudioReady(true);
      } catch (e) { setErrorMsg(String(e)); }
    })();

    /* render loop */
    const clock = new THREE.Clock(); let running = true;
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
      astroids.forEach(a => {
        a.mesh.rotation.x += a.rotX * dt; a.mesh.rotation.y += a.rotY * dt;
        const target = a.base + norm * strength;
        a.mesh.scale.setScalar(THREE.MathUtils.lerp(a.mesh.scale.x, target, 0.15));
      });

      renderer.render(scene, camera);
    };
    animate();

    /* cleanup */
    return () => {
      cancelled = true; running = false; window.removeEventListener("resize", onResize);
      try { sourceRef.current?.stop(); sourceRef.current?.disconnect(); analyserRef.current?.disconnect(); } catch {}
      audioCtxRef.current?.close(); geom.dispose(); mat.dispose(); renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
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
    } catch (e) { setErrorMsg(String(e)); }
  };
  const pauseAudio = () => {
    try {
      sourceRef.current?.stop(); sourceRef.current?.disconnect(); analyserRef.current?.disconnect();
      sourceRef.current = null; analyserRef.current = null; setIsPlaying(false);
    } catch (e) { setErrorMsg(String(e)); }
  };
  const handleConsent = (allow) => { setAudioConsent(allow ? "yes" : "no"); if (allow) startAudio(); };

  /* ─────────────── JSX ─────────────── */
  return (
    <div ref={mountRef} style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* animated name */}
      <h1 className="name-animate">
        {"Tatsunori Ono".split("").map((ch, i) => (
          <span key={i} style={{ "--i": i }}>{ch === " " ? "\u00A0" : ch}</span>
        ))}
      </h1>

      {/* consent banner */}
      {audioConsent === null && (
        <div
          style={{
            position: "absolute", inset: 0,
            background: "rgba(255,255,255,0.9)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            fontFamily: "system-ui, sans-serif", zIndex: 20, padding: 32,
          }}
        >
          <p
            style={{
              marginBottom: 24, fontSize: 20, maxWidth: 480, textAlign: "center",
              display: "flex", alignItems: "center", gap: 10, justifyContent: "center",
            }}
          >
            <i className="fas fa-volume-up" />
            This site contains audio.&nbsp;Allow playback?
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <button onClick={() => handleConsent(true)} style={btnStyle}>Yes</button>
            <button onClick={() => handleConsent(false)} style={btnStyle}>No</button>
          </div>
        </div>
      )}

      {/* play / pause controls */}
      {audioConsent === "yes" && (
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
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            {audioReady ? "Audio loaded" : "Loading audio…"}
          </span>
        </div>
      )}

      {/* error box */}
      {errorMsg && (
        <div style={{
          position: "absolute", bottom: 16, left: 16, right: 16,
          background: "rgba(255,0,0,0.08)", border: "1px solid rgba(255,0,0,0.3)",
          padding: 8, borderRadius: 8, color: "#900", fontSize: 12, zIndex: 10,
          fontFamily: "system-ui, sans-serif",
        }}>{errorMsg}</div>
      )}
    </div>
  );
}

/* small button styles */
const btnStyle = {
  padding: "10px 20px", borderRadius: 8, border: "1px solid #ccc",
  background: "#fff", cursor: "pointer", fontSize: 16,
};
const btnSmall = (enabled) => ({
  padding: "6px 12px", borderRadius: 8, border: "1px solid #ccc",
  background: enabled ? "#fff" : "#eee", cursor: enabled ? "pointer" : "not-allowed",
});

/* ---------- astroid-cube parametric surface ---------- */
function astroidCubeParam(u, v, target) {
  u *= 2 * Math.PI; v *= 2 * Math.PI;
  const a = 1;
  const x = a * Math.pow(Math.cos(u), 3) * Math.pow(Math.cos(v), 3);
  const y = a * Math.pow(Math.sin(u), 3) * Math.pow(Math.cos(v), 3);
  const z = a * Math.pow(Math.sin(v), 3);
  target.set(x, y, z);
}
