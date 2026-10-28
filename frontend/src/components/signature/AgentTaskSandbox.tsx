import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

export interface AgentTaskSandboxProps {
  sessionId: string
  sandboxHtml: string
  onTrialEvent?: (event: unknown) => void
  onSessionComplete?: (sessionData: unknown) => void
  onClose?: () => void
}

export const AgentTaskSandbox: React.FC<AgentTaskSandboxProps> = ({
  sessionId,
  sandboxHtml,
  onTrialEvent,
  onSessionComplete,
  onClose,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [trialCount, setTrialCount] = useState(0)

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return

      if (e.data.type === 'TRIAL_TELEMETRY') {
        setTrialCount((prev) => prev + 1)
        if (onTrialEvent) onTrialEvent(e.data.data)
      } else if (e.data.type === 'SESSION_COMPLETE') {
        if (onSessionComplete) onSessionComplete(e.data.data)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onTrialEvent, onSessionComplete])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cognitive Training Sandbox"
      className="fixed inset-0 z-50 bg-[#FFF5EE]/95 dark:bg-[#131B2E]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 select-none"
    >
      {/* Micro-Progress Bar adhering to Doodle System */}
      <div className="fixed top-0 left-0 w-full h-1 bg-border border-b border-border-strong z-50">
        <div
          className="h-full bg-brand transition-all duration-150"
          style={{ width: `${Math.min(100, trialCount * 5)}%` }}
        />
      </div>

      {/* Floating Header Pill */}
      <div className="absolute top-4 right-6 z-50 flex items-center gap-3">
        <span className="font-mono-tabular text-xs font-bold text-ink bg-surface px-3 py-1.5 rounded-lg border-2 border-border-strong shadow-[2px_2px_0_#263D5B]">
          TRIALS LOGGED: {trialCount}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="tactile-btn bg-surface text-ink hover:bg-surface-raised px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <X size={14} /> ESC / ABORT
        </button>
      </div>

      {/* Sandboxed iframe */}
      <iframe
        ref={iframeRef}
        srcDoc={sandboxHtml}
        sandbox="allow-scripts allow-same-origin"
        className="w-full max-w-4xl h-[560px] rounded-2xl border-2 border-border-strong shadow-hero bg-surface"
        title="AI Agent Cognitive Assessment & Training Sandbox"
      />
    </div>
  )
}
