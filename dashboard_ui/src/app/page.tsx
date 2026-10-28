"use client";

import React, { useState, useEffect } from "react";
import { Play, Sparkles, Brain, Shield, RefreshCw } from "lucide-react";

import { SynapticOrb } from "@/components/hud/SynapticOrb";
import { UserCVTile } from "@/components/hud/UserCVTile";
import { DigitalBrain3D } from "@/components/brain/DigitalBrain3D";
import { PsychometricRadar } from "@/components/analytics/PsychometricRadar";
import { TelemetryStreamCard } from "@/components/analytics/TelemetryStreamCard";
import { TaskViewportSandbox } from "@/components/sandbox/TaskViewportSandbox";

type AffectiveState = "FLOW" | "OVERLOAD" | "FATIGUE";

export default function NeuralCockpitPage() {
  const [userId] = useState("usr_4021");
  const [affectiveState, setAffectiveState] = useState<AffectiveState>("FLOW");
  const [activeSession, setActiveSession] = useState<any>(null);
  const [brainState, setBrainState] = useState<any>({
    dlPFC: 54.2,
    ACC: 47.8,
    vlPFC_Striatum: 49.5,
    Hippocampus_DG: 56.1,
    Parieto_Occipital: 52.0,
  });
  const [bottleneck, setBottleneck] = useState("ACC");
  const [latestMetrics, setLatestMetrics] = useState<any>(null);
  const [coachingText, setCoachingText] = useState(
    "Autonomic baseline calibrated. dlPFC working memory stable; ACC conflict monitoring identified as the active plasticity bottleneck. Initializing targeted isomorphic training block."
  );
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Apply affective state data attribute to document root
  useEffect(() => {
    document.documentElement.setAttribute("data-affective-state", affectiveState);
  }, [affectiveState]);

  // Load initial brain state from API
  const fetchBrainState = async () => {
    try {
      const res = await fetch(`/api/brain/state/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setBrainState(data.nodes);
        setBottleneck(data.plasticity_bottleneck);
      }
    } catch (err) {
      console.warn("Using offline simulated brain state");
    }
  };

  useEffect(() => {
    fetchBrainState();
  }, [userId]);

  // Launch Isomorphic Session
  const launchSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/session/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, intent: "DAILY_TRAINING" }),
      });
      if (res.ok) {
        const sessionData = await res.json();
        setActiveSession(sessionData);
        setIsSandboxOpen(true);
      }
    } catch (err) {
      console.error("Session init failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle telemetry completion from sandbox
  const handleSessionComplete = async (sessionTelemetry: any) => {
    setIsSandboxOpen(false);
    setIsLoading(true);
    try {
      const res = await fetch("/api/telemetry/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: activeSession?.session_id || `sess_${Date.now()}`,
          user_id: userId,
          task_type: sessionTelemetry.task_type,
          task_version: "1.0.0",
          trials: sessionTelemetry.trials,
        }),
      });

      if (res.ok) {
        const evalData = await res.json();
        setLatestMetrics(evalData.session_metrics);
        setBottleneck(evalData.plasticity_bottleneck);

        // Update brain nodes
        const updatedNodes = {
          dlPFC: evalData.digital_brain_delta.dlPFC.updated,
          ACC: evalData.digital_brain_delta.ACC.updated,
          vlPFC_Striatum: evalData.digital_brain_delta.vlPFC_Striatum.updated,
          Hippocampus_DG: evalData.digital_brain_delta.Hippocampus_DG.updated,
          Parieto_Occipital: evalData.digital_brain_delta.Parieto_Occipital.updated,
        };
        setBrainState(updatedNodes);

        // Fetch coaching reflection
        const coachRes = await fetch("/api/coach/reflection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            evaluation: evalData,
            affective_state: affectiveState,
          }),
        });

        if (coachRes.ok) {
          const coachData = await coachRes.json();
          setCoachingText(coachData.coaching_reflection);
        }
      }
    } catch (err) {
      console.error("Telemetry ingestion failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-canvas text-ink flex flex-col p-6 max-w-7xl mx-auto">
      {/* Top Cockpit Header Bar */}
      <header className="flex items-center justify-between border-b-2 border-border-strong pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-raised border-2 border-border-strong flex items-center justify-center text-brand shadow-doodle-sm">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-ink flex items-center gap-2">
              AI4Brain Cognitive Agent
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-subtle text-brand border-2 border-border-strong shadow-[2px_2px_0_#263D5B]">
                v1.4 Doodle UI
              </span>
            </h1>
            <p className="text-xs font-mono text-ink-muted">
              USER: <span className="font-bold text-ink">{userId}</span> | BOTTLENECK:{" "}
              <span className="text-brand font-bold">{bottleneck}</span>
            </p>
          </div>
        </div>

        {/* Dynamic Affective State Switcher */}
        <div className="flex items-center gap-2 bg-surface border-2 border-border-strong p-1.5 rounded-xl shadow-doodle-sm">
          <span className="text-xs font-mono text-ink-muted px-2 uppercase tracking-wider font-semibold">
            STATE:
          </span>
          {(["FLOW", "OVERLOAD", "FATIGUE"] as AffectiveState[]).map((st) => (
            <button
              key={st}
              onClick={() => setAffectiveState(st)}
              className={`text-xs font-mono font-bold px-3 py-1 rounded-lg transition-all ${
                affectiveState === st
                  ? "bg-brand text-brand-ink border-2 border-border-strong shadow-tactile"
                  : "text-ink-muted hover:text-ink hover:bg-surface-raised"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column: 3D Digital Brain & Radar (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <DigitalBrain3D
            nodes={brainState}
            bottleneckNode={bottleneck}
            onSelectNode={(node) => console.log("Selected node:", node)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PsychometricRadar nodes={brainState} />

            {/* AI Coach Entity Card */}
            <div className="neuro-card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-border-strong/40 pb-2 mb-3">
                  <span className="text-xs font-display font-bold text-ink uppercase tracking-wide">
                    Autonomous AI Coach
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Non-Clinical
                  </span>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed font-sans">
                  "{coachingText}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-border-strong/30 flex items-center justify-between">
                <span className="text-[11px] font-mono text-ink-muted font-medium">
                  Harmonic Cue (440Hz / 880Hz)
                </span>
                <span className="text-xs font-mono font-bold text-brand tabular-nums bg-brand-subtle px-2 py-0.5 rounded border border-brand/30">
                  COLLAB: 95.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry & Interactive Launch (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center justify-center p-4 bg-surface border-2 border-border-strong rounded-xl shadow-doodle">
            <SynapticOrb affectiveState={affectiveState} />
          </div>

          <TelemetryStreamCard metrics={latestMetrics || undefined} />

          {/* Action Trigger Box */}
          <div className="neuro-card p-5 flex flex-col gap-3 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-ink uppercase tracking-wide">
                Adaptive Isomorphic Training Block
              </span>
              <span className="text-xs font-mono font-bold text-brand bg-brand-subtle px-2 py-0.5 rounded border border-brand/30">
                85% Rule Active
              </span>
            </div>
            <p className="text-xs text-ink-muted leading-normal font-sans">
              Procedurally generates a novel un-memorizable task variant targeting the{" "}
              <strong className="text-brand font-bold">{bottleneck}</strong> node at calibrated difficulty $b$.
            </p>
            <button
              onClick={launchSession}
              disabled={isLoading}
              className="neuro-button neuro-button-primary w-full py-3 mt-2 flex items-center justify-center gap-2 text-sm font-display font-bold tracking-wide"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  INITIALIZING RUNTIME...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  LAUNCH ISOMORPHIC TRIAL
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Lower-Left CV Video Tile */}
      <UserCVTile trackingStatus="calibrated" affectiveState={affectiveState} />

      {/* Sandboxed Task Viewport Modal */}
      {isSandboxOpen && activeSession && (
        <TaskViewportSandbox
          sessionId={activeSession.session_id}
          sandboxHtml={activeSession.sandbox_html}
          onSessionComplete={handleSessionComplete}
          onClose={() => setIsSandboxOpen(false)}
        />
      )}
    </main>
  );
}
