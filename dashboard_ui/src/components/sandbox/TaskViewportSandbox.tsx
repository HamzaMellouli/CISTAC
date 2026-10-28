"use client";

import React, { useEffect, useRef, useState } from "react";

interface TaskViewportSandboxProps {
  sessionId: string;
  sandboxHtml: string;
  onTrialEvent?: (event: any) => void;
  onSessionComplete?: (sessionData: any) => void;
  onClose?: () => void;
}

export const TaskViewportSandbox: React.FC<TaskViewportSandboxProps> = ({
  sessionId,
  sandboxHtml,
  onTrialEvent,
  onSessionComplete,
  onClose,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [trialCount, setTrialCount] = useState(0);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== "object") return;

      if (e.data.type === "TRIAL_TELEMETRY") {
        setTrialCount((prev) => prev + 1);
        if (onTrialEvent) onTrialEvent(e.data.data);
      } else if (e.data.type === "SESSION_COMPLETE") {
        if (onSessionComplete) onSessionComplete(e.data.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onTrialEvent, onSessionComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-canvas/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      {/* Top 4px progress bar matching Doodle system */}
      <div className="fixed top-0 left-0 w-full h-1 bg-border border-b border-border-strong z-50">
        <div
          className="h-full bg-brand transition-all duration-150"
          style={{ width: `${Math.min(100, trialCount * 4)}%` }}
        />
      </div>

      {/* Floating minimal escape pill */}
      <div className="absolute top-4 right-6 z-50 flex items-center gap-3">
        <span className="text-xs font-mono font-semibold text-ink-muted tabular-nums bg-surface-raised px-2.5 py-1 rounded-md border-2 border-border-strong shadow-[2px_2px_0_#263D5B]">
          TRIALS LOGGED: {trialCount}
        </span>
        <button
          onClick={onClose}
          className="text-xs font-mono font-bold text-ink bg-surface border-2 border-border-strong px-3 py-1 rounded-md shadow-tactile hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-doodle active:translate-x-[1px] active:translate-y-[1px] transition-all"
        >
          ESC / ABORT
        </button>
      </div>

      {/* Sandboxed iframe */}
      <iframe
        ref={iframeRef}
        srcDoc={sandboxHtml}
        sandbox="allow-scripts allow-same-origin"
        className="w-full max-w-4xl h-[560px] rounded-2xl border-2 border-border-strong shadow-doodle-lg bg-surface"
        title="Sandboxed Cognitive Task Viewport"
      />
    </div>
  );
};
