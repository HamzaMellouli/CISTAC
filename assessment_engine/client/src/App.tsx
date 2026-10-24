import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TrialRecorder } from './telemetry/tracker'
import type { TaskPayload } from './telemetry/types'
import { TaskRunner } from './tasks/TaskRunner'
import { fetchNextTask, getUserId } from './tasks/taskSource'
import type { VoiceProbe } from './voice/voiceProbe'
import { VoiceToggle } from './voice/VoiceToggle'

const userId = getUserId()
const sessionId = crypto.randomUUID() // one per page load

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
  useLayoutEffect(() => {
    optedIn.current = voice !== null
  })

  useEffect(() => {
    let cancelled = false
    fetchNextTask(userId).then(
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
      <TaskRunner key={state.n} task={state.task} recorder={state.recorder} onDone={next} voice={voice} />
    </main>
  )
}
