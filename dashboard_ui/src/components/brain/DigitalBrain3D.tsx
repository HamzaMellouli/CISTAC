"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface BrainNodes {
  dlPFC: number;
  ACC: number;
  vlPFC_Striatum: number;
  Hippocampus_DG: number;
  Parieto_Occipital: number;
}

interface DigitalBrain3DProps {
  nodes?: BrainNodes;
  bottleneckNode?: string;
  onSelectNode?: (nodeKey: string) => void;
}

const DEFAULT_NODES: BrainNodes = {
  dlPFC: 52.4,
  ACC: 48.2,
  vlPFC_Striatum: 50.1,
  Hippocampus_DG: 54.8,
  Parieto_Occipital: 51.5,
};

// Spatial positions in 3D coordinate space for the 5 cortical nodes
const NODE_COORDINATES: Record<keyof BrainNodes, [number, number, number]> = {
  dlPFC: [-0.9, 0.7, 0.8],          // Left anterolateral prefrontal
  ACC: [0.0, 0.5, 0.4],             // Midline anterior cingulate
  vlPFC_Striatum: [-0.8, -0.2, 0.6],// Inferior lateral prefrontal / basal
  Hippocampus_DG: [0.6, -0.4, -0.2],// Medial temporal lobe
  Parieto_Occipital: [0.0, 0.8, -1.0],// Posterior parietal / visual cortex
};

const NODE_LABELS: Record<keyof BrainNodes, { title: string; desc: string }> = {
  dlPFC: { title: "dlPFC", desc: "Working Memory, Planning, Fluid Reasoning (Gf)" },
  ACC: { title: "ACC", desc: "Conflict Monitoring, Task Switching, Error Recovery" },
  vlPFC_Striatum: { title: "vlPFC / Striatum", desc: "Inhibitory Motor Gating, Impulsivity Suppression" },
  Hippocampus_DG: { title: "Hippocampus & DG", desc: "Mnemonic Separation, Transitive Binding" },
  Parieto_Occipital: { title: "Parieto-Occipital", desc: "Processing Speed, Spatial Attention" },
};

export const DigitalBrain3D: React.FC<DigitalBrain3DProps> = ({
  nodes = DEFAULT_NODES,
  bottleneckNode = "ACC",
  onSelectNode,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<keyof BrainNodes>("dlPFC");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 560;
    const height = mount.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfff5ee); // Doodle canvas background

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 1. Point-cloud cortical mesh (sketchbook wireframe style)
    const particleCount = 750;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Ellipsoidal brain contour
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.35 + 0.15 * Math.sin(theta * 4.0) * Math.cos(phi * 2.0);

      const x = r * Math.sin(phi) * Math.cos(theta) * 0.95;
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.85;
      const z = r * Math.cos(phi) * 1.15;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Slate Navy cortical pen points (#263D5B)
      colors[i * 3] = 0.15;
      colors[i * 3 + 1] = 0.24;
      colors[i * 3 + 2] = 0.36;
    }

    const brainGeometry = new THREE.BufferGeometry();
    brainGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    brainGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const brainMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });
    const brainCloud = new THREE.Points(brainGeometry, brainMaterial);
    scene.add(brainCloud);

    // 2. Five Functional Cortical Spheres with luminosity mapped to T-scores
    const nodeMeshes: THREE.Mesh[] = [];
    (Object.keys(NODE_COORDINATES) as (keyof BrainNodes)[]).forEach((key) => {
      const coord = NODE_COORDINATES[key];
      const tScore = nodes[key] || 50.0;

      const intensity = Math.max(0.4, Math.min(1.0, (tScore - 30.0) / 40.0));
      const isBottleneck = (key === bottleneckNode);

      // Warm terracotta for high T-score, amber for bottleneck, navy for normal
      const colorHex = isBottleneck ? 0xd97706 : (tScore >= 55 ? 0xe86a33 : 0x263d5b);

      const nodeGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: intensity,
      });

      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.position.set(...coord);
      mesh.userData = { key, tScore };
      scene.add(mesh);
      nodeMeshes.push(mesh);

      // Connective splines between nodes
      const splineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(...coord),
      ]);
      const splineMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.35 * intensity,
      });
      const spline = new THREE.Line(splineGeo, splineMat);
      scene.add(spline);
    });

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle rotation
      brainCloud.rotation.y = elapsed * 0.08;
      nodeMeshes.forEach((m) => {
        const origKey = m.userData.key as keyof BrainNodes;
        const origCoord = NODE_COORDINATES[origKey];
        const angle = elapsed * 0.08;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        m.position.x = origCoord[0] * cos - origCoord[2] * sin;
        m.position.z = origCoord[0] * sin + origCoord[2] * cos;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      brainGeometry.dispose();
      brainMaterial.dispose();
      renderer.dispose();
    };
  }, [nodes, bottleneckNode]);

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border-2 border-border-strong bg-canvas shadow-doodle flex flex-col">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-surface/90 border-2 border-border-strong px-3 py-1 rounded-full shadow-[2px_2px_0_#263D5B]">
        <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
        <span className="text-xs font-mono font-bold tracking-wider text-ink uppercase">
          Digital Brain State (5-Node Kalman)
        </span>
      </div>

      {/* Contextual Interactive HUD Card */}
      <div className="absolute bottom-4 right-4 z-10 w-72 neuro-card p-3.5 bg-surface/95 backdrop-blur-md border-2 border-border-strong rounded-xl shadow-doodle">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-display font-bold text-brand">
            {NODE_LABELS[selectedNode].title}
          </span>
          <span className="text-xs font-mono font-bold text-ink bg-surface-raised px-2 py-0.5 rounded border border-border-strong tabular-nums">
            T = {(nodes[selectedNode] || 50.0).toFixed(1)}
          </span>
        </div>
        <p className="text-xs text-ink-muted mb-2.5 leading-snug font-sans">
          {NODE_LABELS[selectedNode].desc}
        </p>

        {/* Node Selector Pills */}
        <div className="grid grid-cols-5 gap-1 pt-2 border-t-2 border-border-strong/20">
          {(Object.keys(NODE_COORDINATES) as (keyof BrainNodes)[]).map((key) => {
            const isTarget = key === selectedNode;
            const isBNeck = key === bottleneckNode;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedNode(key);
                  if (onSelectNode) onSelectNode(key);
                }}
                className={`text-[10px] font-mono py-1 rounded-md font-bold transition-all text-center border ${
                  isTarget
                    ? "bg-brand text-brand-ink border-border-strong shadow-[2px_2px_0_#263D5B]"
                    : isBNeck
                    ? "text-amber-800 bg-amber-50 border-amber-500 hover:bg-amber-100"
                    : "text-ink-muted bg-surface-raised border-border hover:text-ink hover:border-border-strong"
                }`}
              >
                {key === "vlPFC_Striatum" ? "vlPFC" : key === "Hippocampus_DG" ? "HIPPO" : key}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
