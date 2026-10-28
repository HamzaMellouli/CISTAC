"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface SynapticOrbProps {
  affectiveState?: "FLOW" | "OVERLOAD" | "FATIGUE";
  isSpeaking?: boolean;
}

export const SynapticOrb: React.FC<SynapticOrbProps> = ({
  affectiveState = "FLOW",
  isSpeaking = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Clinically grounded harmonic sine wave cue with 5ms linear fade envelope
  const playAcousticCue = (frequency: number = 440, durationMs: number = 200) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // 5ms linear fade envelope to eliminate click artifacts
      const now = ctx.currentTime;
      const durationSec = durationMs / 1000.0;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.005);
      gain.gain.setValueAtTime(0.15, now + durationSec - 0.005);
      gain.gain.linearRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec);
    } catch (err) {
      console.warn("Web Audio API cue error:", err);
    }
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = 120;
    const height = 120;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Warm Doodle Color mapping by affective state
    let targetHex = 0xe86a33; // FLOW: Brand Terracotta
    if (affectiveState === "OVERLOAD") targetHex = 0x16a34a; // OVERLOAD: Calming Leaf
    if (affectiveState === "FATIGUE") targetHex = 0xd97706;  // FATIGUE: Alert Amber

    // Wireframe Sphere Geometry
    const geometry = new THREE.IcosahedronGeometry(1.0, 3);
    const material = new THREE.MeshBasicMaterial({
      color: targetHex,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Inner glowing core
    const coreGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: targetHex,
      transparent: true,
      opacity: 0.35,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Adaptive pulse frequency based on state
      let pulseFreq = 0.25;
      if (affectiveState === "FATIGUE") pulseFreq = 0.40;
      if (affectiveState === "OVERLOAD") pulseFreq = 0.15;

      const scale = 1.0 + 0.08 * Math.sin(elapsed * Math.PI * 2 * pulseFreq);
      sphere.scale.set(scale, scale, scale);
      core.scale.set(scale, scale, scale);

      sphere.rotation.x = elapsed * 0.15;
      sphere.rotation.y = elapsed * 0.25;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, [affectiveState]);

  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => playAcousticCue(440, 250)}>
      <div ref={mountRef} className="w-[120px] h-[120px]" />
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
        SYNAPTIC CO-REGULATOR
      </span>
    </div>
  );
};
