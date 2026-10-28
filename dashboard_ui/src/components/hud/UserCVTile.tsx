"use client";

import React, { useState } from "react";
import { Camera, ShieldCheck, Eye } from "lucide-react";

interface UserCVTileProps {
  trackingStatus?: "calibrated" | "degraded";
  affectiveState?: "FLOW" | "OVERLOAD" | "FATIGUE";
}

export const UserCVTile: React.FC<UserCVTileProps> = ({
  trackingStatus = "calibrated",
  affectiveState = "FLOW",
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const isCalibrated = trackingStatus === "calibrated";

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 left-6 z-40 bg-surface border-2 border-border-strong text-xs font-mono font-bold px-3 py-1.5 rounded-full flex items-center gap-2 text-ink shadow-tactile hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
      >
        <Camera className="w-3.5 h-3.5 text-brand" />
        CV HUD (RESTORE)
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 w-[170px] h-[130px] rounded-2xl overflow-hidden bg-surface flex flex-col justify-between p-3 border-2 border-border-strong shadow-doodle select-none transition-all duration-200 ${
        isCalibrated ? "" : "border-dashed border-amber-600"
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-bold">
          <span
            className={`w-2 h-2 rounded-full ${
              isCalibrated ? "bg-emerald-600 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span className="text-ink">
            {isCalibrated ? "CALIBRATED" : "DEGRADED"}
          </span>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-ink-muted hover:text-ink text-xs font-mono font-bold"
          title="Minimize CV Tile"
        >
          _
        </button>
      </div>

      {/* Simulated Neural Gaze Wireframe */}
      <div className="relative w-full h-12 bg-surface-raised rounded-lg border border-border-strong/40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-15 flex items-center justify-center">
          <div className="w-16 h-10 border border-brand rounded-full" />
          <div className="w-6 h-6 border border-border-strong rounded-full absolute" />
        </div>
        <div className="flex items-center gap-1 z-10 text-[9px] font-mono text-ink-muted font-semibold">
          <Eye className="w-3 h-3 text-brand" />
          <span>NON-BIOMETRIC</span>
        </div>
      </div>

      {/* Privacy Guarantee Pill */}
      <div className="flex items-center justify-between text-[9px] font-mono text-ink-muted">
        <span className="flex items-center gap-1 text-emerald-700 font-bold">
          <ShieldCheck className="w-3 h-3" /> CLIENT ONLY
        </span>
        <span className="tabular-nums font-bold text-ink">60 FPS</span>
      </div>
    </div>
  );
};
