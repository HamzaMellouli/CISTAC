import { Component, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { TrialRecorder } from './telemetry/tracker'
import type { TaskPayload } from './telemetry/types'
import { TaskRunner } from './tasks/TaskRunner'
import { fetchNextTask, getUserId, newId } from './tasks/taskSource'
import type { VoiceProbe } from './voice/voiceProbe'
import { VoiceToggle } from './voice/VoiceToggle'

// Created on first use rather than at import, so an id failure can never crash module load.
let ids: { userId: string; sessionId: string } | undefined
const sessionIds = () => (ids ??= { userId: getUserId(), sessionId: newId() }) // one session per page load

// A task whose params make it throw while rendering is logged and skipped instead of blanking the app.
class SkipOnError extends Component<{ taskId: string; onSkip: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err: unknown) {
    console.error(`task ${this.props.taskId} failed to render; skipping`, err)
    this.props.onSkip()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'running'; task: TaskPayload; recorder: TrialRecorder; n: number }

// Session loop: fetch the next task, run it, repeat.
export default function App() {
  const [state, setState] = useState<State>({ kind: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [voice, setVoice] = useState<VoiceProbe | null>(null) // opt-in, off on every page load
  // Read when the next task's recorder is created, so toggling never rebuilds a running task.
  const optedIn = useRef(false)
  const voiceRef = useRef<VoiceProbe | null>(null)
  useLayoutEffect(() => {
    optedIn.current = voice !== null
    voiceRef.current = voice
  })
  // Never leave the microphone open past this component (HMR, embedding).
  useEffect(() => () => voiceRef.current?.stop(), [])

  useEffect(() => {
    let cancelled = false
    const { userId, sessionId } = sessionIds()
    fetchNextTask(userId, attempt).then(
      (task) => {
        if (cancelled) return
        const recorder = new TrialRecorder({
          user_id: userId,
          session_id: sessionId,
          task_id: task.task_id,
          dimension: task.dimension,
          voice_opt_in: optedIn.current,
        })
        setState({ kind: 'running', task, recorder, n: attempt })
      },
      (err: unknown) => {
        if (!cancelled) setState({ kind: 'error', message: String(err instanceof Error ? err.message : err) })
      },
    )
    return () => {
      cancelled = true
    }
  }, [attempt])

  const next = useCallback(() => {
    setState({ kind: 'loading' })
    setAttempt((a) => a + 1)
  }, [])

  const toggle = <VoiceToggle value={voice} onChange={setVoice} />
  if (state.kind === 'loading')
    return (
      <main aria-busy="true">
        {toggle}
        <p>Loading the next exercise…</p>
      </main>
    )
  if (state.kind === 'error')
    return (
      <main>
        {toggle}
        <p role="alert">Could not load the next exercise ({state.message}).</p>
        <button type="button" onClick={next}>
          Try again
        </button>
      </main>
    )
  return (
    <main>
      {toggle}
      <SkipOnError key={state.n} taskId={state.task.task_id} onSkip={next}>
        <TaskRunner task={state.task} recorder={state.recorder} onDone={next} voice={voice} />
      </SkipOnError>
    </main>
  )
}
