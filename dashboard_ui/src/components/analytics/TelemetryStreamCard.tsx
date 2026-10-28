"use client";

import React from "react";
import { Activity, Zap, Shield, TrendingUp, AlertCircle } from "lucide-react";

interface TelemetryStreamCardProps {
  metrics?: {
    ddm_drift_rate_v: number;
    ddm_boundary_a: number;
    ddm_non_decision_t0_ms: number;
    theta_ability: number;
    t_score: number;
    rci_vs_baseline: number;
    statistically_significant: boolean;
    accuracy: number;
    mean_correct_rt_ms: number;
    task_specific?: {
      signal_detection_d_prime?: number;
      task_switch_cost_ms?: number;
      lure_discrimination_index?: number;
      reaction_time_jitter_ms?: number;
    };
  };
}

export const TelemetryStreamCard: React.FC<TelemetryStreamCardProps> = ({
  metrics = {
    ddm_drift_rate_v: 2.14,
    ddm_boundary_a: 1.18,
    ddm_non_decision_t0_ms: 162.4,
    theta_ability: 1.25,
    t_score: 62.5,
    rci_vs_baseline: 2.12,
    statistically_significant: true,
    accuracy: 0.88,
    mean_correct_rt_ms: 412.5,
    task_specific: {
      signal_detection_d_prime: 2.45,
      task_switch_cost_ms: 68.2,
      lure_discrimination_index: 0.72,
      reaction_time_jitter_ms: 45.1,
    },
  },
}) => {
  return (
    <div className="neuro-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-border-strong/30 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand" />
          <span className="text-xs font-display font-bold text-ink tracking-wide uppercase">
            Computational Psychometrics Telemetry
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border-2 ${
            metrics.statistically_significant
              ? "bg-emerald-50 text-emerald-700 border-emerald-600 shadow-[2px_2px_0_#15803D]"
              : "bg-surface-raised text-ink-muted border-border-strong"
          }`}
        >
          {metrics.statistically_significant ? (
            <>
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>RCI SIG (p &lt; 0.05)</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>STABLE BASELINE</span>
            </>
          )}
        </div>
      </div>

      {/* Primary KPI Grid (4 Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1: Drift Rate v */}
        <div className="bg-surface-raised border-2 border-border-strong p-3 rounded-xl flex flex-col justify-between shadow-[2px_2px_0_#263D5B]">
          <span className="text-[10px] font-mono font-bold text-ink-muted uppercase">
            DDM Drift Rate (v)
          </span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-lg font-mono font-bold tabular-nums text-ink">
              {metrics.ddm_drift_rate_v.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-ink-muted">ms⁻¹</span>
          </div>
          <span className="text-[9px] font-mono text-brand font-semibold">
            Speed of Processing
          </span>
        </div>

        {/* Metric 2: Boundary Separation a */}
        <div className="bg-surface-raised border-2 border-border-strong p-3 rounded-xl flex flex-col justify-between shadow-[2px_2px_0_#263D5B]">
          <span className="text-[10px] font-mono font-bold text-ink-muted uppercase">
            Boundary Threshold (a)
          </span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-lg font-mono font-bold tabular-nums text-ink">
              {metrics.ddm_boundary_a.toFixed(2)}
            </span>
          </div>
          <span className="text-[9px] font-mono text-ink-muted font-semibold">
            Cautiousness Policy
          </span>
        </div>

        {/* Metric 3: Latent Ability θ (IRT) */}
        <div className="bg-surface-raised border-2 border-border-strong p-3 rounded-xl flex flex-col justify-between shadow-[2px_2px_0_#263D5B]">
          <span className="text-[10px] font-mono font-bold text-ink-muted uppercase">
            3PL-IRT Ability (θ)
          </span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-lg font-mono font-bold tabular-nums text-brand">
              {metrics.theta_ability >= 0 ? "+" : ""}
              {metrics.theta_ability.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-ink-muted">SD</span>
          </div>
          <span className="text-[9px] font-mono text-ink-muted font-semibold">
            T-Score: {metrics.t_score.toFixed(1)}
          </span>
        </div>

        {/* Metric 4: Mean Correct RT */}
        <div className="bg-surface-raised border-2 border-border-strong p-3 rounded-xl flex flex-col justify-between shadow-[2px_2px_0_#263D5B]">
          <span className="text-[10px] font-mono font-bold text-ink-muted uppercase">
            Mean Reaction Time
          </span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-lg font-mono font-bold tabular-nums text-ink">
              {metrics.mean_correct_rt_ms.toFixed(0)}
            </span>
            <span className="text-[10px] font-mono text-ink-muted">ms</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-700 font-semibold">
            Acc: {(metrics.accuracy * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Task Specific Sub-telemetry Stream */}
      {metrics.task_specific && (
        <div className="bg-surface border-2 border-border-strong rounded-xl p-3 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-ink-muted">
            <TrendingUp className="w-3.5 h-3.5 text-brand" />
            <span>SIGNAL DETECTION (d'):</span>
            <span className="font-bold tabular-nums text-ink">
              {metrics.task_specific.signal_detection_d_prime?.toFixed(2) ?? "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-ink-muted">
            <span>SWITCH COST:</span>
            <span className="font-bold tabular-nums text-brand">
              {metrics.task_specific.task_switch_cost_ms?.toFixed(0) ?? "0"} ms
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-ink-muted">
            <span>RT JITTER:</span>
            <span className="font-bold tabular-nums text-ink">
              &plusmn;{metrics.task_specific.reaction_time_jitter_ms?.toFixed(1) ?? "0"} ms
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
