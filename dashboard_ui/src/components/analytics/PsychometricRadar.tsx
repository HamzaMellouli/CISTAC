"use client";

import React from "react";

interface NodeData {
  dlPFC: number;
  ACC: number;
  vlPFC_Striatum: number;
  Hippocampus_DG: number;
  Parieto_Occipital: number;
}

interface PsychometricRadarProps {
  nodes?: NodeData;
  previousNodes?: NodeData;
}

export const PsychometricRadar: React.FC<PsychometricRadarProps> = ({
  nodes = {
    dlPFC: 52.4,
    ACC: 48.2,
    vlPFC_Striatum: 50.1,
    Hippocampus_DG: 54.8,
    Parieto_Occipital: 51.5,
  },
}) => {
  const nodeKeys: (keyof NodeData)[] = [
    "dlPFC",
    "ACC",
    "vlPFC_Striatum",
    "Hippocampus_DG",
    "Parieto_Occipital",
  ];

  const labels = ["dlPFC", "ACC", "vlPFC", "HIPPO", "PARIETO"];
  const center = 110;
  const radius = 80;

  // Compute 5 polygon points
  const points = nodeKeys
    .map((key, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      // Scale T-score (range 30 to 70) to radius
      const score = nodes[key] || 50;
      const norm = Math.max(0.1, Math.min(1.0, (score - 30) / 40));
      const r = norm * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  // Baseline 50.0 ring points
  const baselinePoints = nodeKeys
    .map((_, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const r = ((50 - 30) / 40) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="neuro-card p-4 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3 border-b-2 border-border-strong/30 pb-2">
        <span className="text-xs font-display font-bold text-ink uppercase tracking-wide">
          Cortical Capacity Radar
        </span>
        <span className="text-[10px] font-mono font-bold text-brand uppercase tracking-wider bg-brand-subtle px-2 py-0.5 rounded border border-brand/20">
          T-Score Metric
        </span>
      </div>

      <svg width={220} height={220} className="overflow-visible my-1">
        {/* Concentric baseline circles */}
        {[0.25, 0.5, 0.75, 1.0].map((step, idx) => (
          <circle
            key={idx}
            cx={center}
            cy={center}
            r={radius * step}
            fill="none"
            stroke="#E7DFD8"
            strokeDasharray={step === 0.5 ? "3 3" : "none"}
            strokeWidth={step === 0.5 ? 1.5 : 1}
          />
        ))}

        {/* Axis spokes */}
        {nodeKeys.map((_, i) => {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#263D5B"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Normative baseline polygon (T=50) */}
        <polygon
          points={baselinePoints}
          fill="none"
          stroke="#263D5B"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          opacity={0.6}
        />

        {/* Active user state polygon */}
        <polygon
          points={points}
          fill="rgba(232, 106, 51, 0.20)"
          stroke="#E86A33"
          strokeWidth={2.5}
        />

        {/* Node point markers & labels */}
        {nodeKeys.map((key, i) => {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const score = nodes[key] || 50;
          const norm = Math.max(0.1, Math.min(1.0, (score - 30) / 40));
          const r = norm * radius;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);

          const lx = center + (radius + 20) * Math.cos(angle);
          const ly = center + (radius + 16) * Math.sin(angle);

          return (
            <g key={key}>
              <circle
                cx={x}
                cy={y}
                r={4}
                fill="#E86A33"
                stroke="#263D5B"
                strokeWidth={2}
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-mono font-bold fill-ink"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Numerical readout row */}
      <div className="w-full grid grid-cols-5 gap-1 mt-3 pt-2 border-t-2 border-border-strong/20">
        {nodeKeys.map((k, i) => (
          <div key={k} className="flex flex-col items-center">
            <span className="text-[9px] font-mono text-ink-muted">
              {labels[i]}
            </span>
            <span className="text-xs font-mono font-bold tabular-nums text-ink">
              {(nodes[k] || 50).toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
