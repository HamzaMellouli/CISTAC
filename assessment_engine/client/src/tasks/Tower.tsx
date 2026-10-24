import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { tracker } from '../telemetry/tracker'
import { useInputCapture } from '../telemetry/useInputCapture'
import type { TowerParams } from '../telemetry/types'
import type { TaskProps } from './TaskRunner'

const same = (a: string[][], b: string[][]) => JSON.stringify(a) === JSON.stringify(b)

// Fixed client palette (white text on each is >= 4.5:1). Payload disc ids never reach CSS.
// ponytail: colours repeat after 8 distinct discs; the id text still tells them apart.
const PALETTE = ['#1d4ed8', '#b91c1c', '#15803d', '#7e22ce', '#a16207', '#0f766e', '#be185d', '#374151']

// Pegs as columns, discs bottom-up (the last element of a stack is its top). Each disc carries its id as text.
function Pegs({ stacks, capacities, color }: { stacks: string[][]; capacities: number[]; color: (id: string) => string }) {
  return stacks.map((s, i) => (
    <span key={i} style={{ display: 'inline-flex', flexDirection: 'column-reverse', minHeight: capacities[i] * 28, minWidth: 56, borderBottom: '4px solid #555', verticalAlign: 'bottom', margin: 4 }}>
      {s.map((d, k) => (
        <span key={k} style={{ background: color(d), color: '#fff', padding: '2px 6px', margin: 1, borderRadius: 4 }}>
          {d}
        </span>
      ))}
    </span>
  ))
}

// Tower-of-London planning: one trial (index 0). Pegs stay locked until a move count is predicted;
// the time to that is planning_time_ms. A move is source peg then destination peg. The trial ends on
// reaching the goal or after 3 × l_min moves. A hidden page aborts it; visible again ends the task.
export function Tower({ params, recorder, onDone }: TaskProps<TowerParams>) {
  const { capacities, start, goal, l_min, optimal_moves, counter_intuitive } = params
  const [stacks, setStacks] = useState(start)
  const [selected, setSelected] = useState<number | null>(null)
  const [predicted, setPredicted] = useState<number | null>(null)
  const [draft, setDraft] = useState('')
  const [invalid, setInvalid] = useState(false)
  const [live, setLive] = useState(true) // input capture runs until the trial finishes or aborts
  const t0 = useRef(0)
  const planned = useRef(0) // submit time
  const moveTimes = useRef<number[]>([])
  const conflicts = useRef<number[]>([]) // pauses before position-matched counter-intuitive moves
  const over = useRef(false) // finished or aborted: input ignored

  useEffect(() => {
    recorder.start(0)
    t0.current = performance.now()
    over.current = false
    let aborted = false
    const onVis = () => {
      if (document.hidden && !over.current) {
        over.current = aborted = true
        recorder.abort()
        setLive(false)
      } else if (!document.hidden && aborted) {
        aborted = false
        onDone()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [recorder, onDone])
  useInputCapture(recorder, live)

  // Disc colour by first appearance in start, then goal.
  const ids = [...new Set([...start.flat(), ...goal.flat()])]
  const color = (id: string) => PALETTE[ids.indexOf(id) % PALETTE.length]

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n = Number(draft)
    if (over.current || predicted !== null) return
    const bad = draft.trim() === '' || !Number.isInteger(n) || n <= 0
    setInvalid(bad)
    if (bad) return
    planned.current = performance.now()
    setPredicted(n)
  }

  const pressPeg = (e: MouseEvent<HTMLButtonElement>) => {
    const i = Number(e.currentTarget.dataset.peg)
    if (over.current || predicted === null) return
    if (selected === null) {
      if (stacks[i].length) setSelected(i)
      return
    }
    setSelected(null)
    const from = selected
    if (from === i || stacks[i].length >= capacities[i]) return
    const next = stacks.map((s) => [...s])
    next[i].push(next[from].pop()!)
    setStacks(next)
    const now = performance.now()
    const times = moveTimes.current
    const m = times.length
    times.push(now)
    // Position-matched: the user's m-th move equals optimal step m and m is a counter-intuitive step.
    const opt = optimal_moves[m]
    if (opt && opt[0] === from && opt[1] === i && counter_intuitive.includes(m)) conflicts.current.push(times[m] - (m ? times[m - 1] : planned.current))
    const solved = same(next, goal)
    const l_user = times.length
    if (!solved && l_user < 3 * l_min) return
    over.current = true
    setLive(false)
    const c = conflicts.current
    tracker.push(
      recorder.finish({
        correct: solved && l_user === l_min,
        score: solved ? Math.min(1, l_min / l_user) : 0,
        meta: {
          l_min,
          l_user,
          predicted_moves: predicted,
          planning_time_ms: planned.current - t0.current,
          conflict_latency_ms: c.length ? c.reduce((a, b) => a + b, 0) / c.length : 0,
          solved,
        },
      }),
    )
    onDone()
  }

  const locked = predicted === null
  return (
    <section aria-label="Tower puzzle">
      <p>Rearrange the discs to match the goal. Move the top disc of one peg onto another peg; each peg holds a limited number of discs.</p>
      <div role="group" aria-label="Goal">
        <p>Goal</p>
        <Pegs stacks={goal} capacities={capacities} color={color} />
      </div>
      <form noValidate onSubmit={submit}>
        <label>
          How many moves will you need?{' '}
          <input type="number" min={1} step={1} value={draft} disabled={!locked} aria-describedby={invalid ? 'tower-hint' : undefined} onChange={(e) => setDraft(e.target.value)} />
        </label>{' '}
        <button type="submit" disabled={!locked}>
          Start
        </button>
      </form>
      {invalid && (
        <p id="tower-hint" role="alert">
          Enter a whole number of moves, 1 or more.
        </p>
      )}
      <div role="group" aria-label="Your pegs">
        {stacks.map((s, i) => (
          <button
            key={i}
            type="button"
            aria-disabled={locked}
            aria-pressed={selected === i}
            aria-label={`Peg ${i + 1}, holds ${capacities[i]}: ${s.length ? `${s.join(', ')} (top)` : 'empty'}`}
            style={{ verticalAlign: 'bottom', outline: selected === i ? '3px solid #2563eb' : undefined, opacity: locked ? 0.5 : 1 }}
            data-peg={i}
            // Native click covers pointer and Enter/Space once each; a held key's auto-repeat is suppressed.
            onClick={pressPeg}
            onKeyDown={(e) => e.repeat && e.preventDefault()}
          >
            {`Peg ${i + 1} `}
            <Pegs stacks={[s]} capacities={[capacities[i]]} color={color} />
          </button>
        ))}
      </div>
    </section>
  )
}
