import { useCallback, useEffect, useRef, useState } from 'react'
import type { TrialRecorder } from '../telemetry/tracker'
import { pressProps, useTimedTrials } from '../telemetry/useTimedTrials'
import type { MstParams, Poly } from '../telemetry/types'
import { PolyView } from './svg'
import type { TaskProps } from './TaskRunner'

type Response = 'old' | 'similar' | 'new'
const EXPECTED = { old: 'old', lure: 'similar', new: 'new' } as const
const KEYS: Record<string, Response> = { '1': 'old', '2': 'similar', '3': 'new' }
// ponytail: the mst contract has no time_limit_ms, so test trials use a fixed limit; add one to the
// contract if Member 5 wants control.
const TEST_MS = 5000

// Encoding: each item for `ms`, one after another, with no responses and no events. A hidden page
// pauses the current item's timer; it resumes with the time left once visible.
function Encoding({ items, ms, onEnd }: { items: Poly[]; ms: number; onEnd: () => void }) {
  const [k, setK] = useState(0)
  const [hidden, setHidden] = useState(document.hidden)
  const left = useRef(ms)

  useEffect(() => {
    const onVis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    if (hidden) return
    if (k >= items.length) {
      onEnd()
      return
    }
    const t0 = Date.now()
    let fired = false
    const id = setTimeout(() => {
      fired = true
      left.current = ms
      setK(k + 1)
    }, left.current)
    return () => {
      clearTimeout(id)
      if (!fired) left.current = Math.max(0, left.current - (Date.now() - t0))
    }
  }, [k, hidden, ms, items.length, onEnd])

  if (k >= items.length) return null
  return (
    <>
      <p>{`Study: item ${k + 1} of ${items.length}`}</p>
      {!hidden && <PolyView poly={items[k]} label="Study shape" />}
    </>
  )
}

// Test: one timed trial per item; the expected answer is old → Old, lure → Similar, new → New.
function Test({ test, recorder, onDone }: { test: MstParams['test']; recorder: TrialRecorder; onDone: () => void }) {
  const { i, paused, respond } = useTimedTrials(recorder, test.length, TEST_MS, onDone, (j) => {
    const { kind, delta } = test[j]
    return { kind, delta, response: 'none' } // a response overrides this via respond's extra meta
  })
  const t = i < test.length ? test[i] : undefined

  const answer = useCallback(
    (r: Response) => {
      if (t) respond(EXPECTED[t.kind] === r, { response: r })
    },
    [t, respond],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return
      const r = KEYS[e.key]
      if (r) answer(r)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answer])

  if (!t) return null
  return (
    <>
      <p>Have you seen this exact shape? Old (1), Similar (2) or New (3).</p>
      {!paused && <PolyView poly={t.item} label="Test shape" />}
      <div>
        <button type="button" {...pressProps(() => answer('old'))}>
          Old (1)
        </button>
        <button type="button" {...pressProps(() => answer('similar'))}>
          Similar (2)
        </button>
        <button type="button" {...pressProps(() => answer('new'))}>
          New (3)
        </button>
      </div>
    </>
  )
}

// Mnemonic similarity: study the encode items, then judge each test item as old, similar (a lure) or new.
// No staircase: the tuning curve needs the generator's spread of `delta` values.
export function Mst({ params, recorder, onDone }: TaskProps<MstParams>) {
  const [testing, setTesting] = useState(false)
  const startTest = useCallback(() => setTesting(true), [])
  return (
    <section aria-label="Shape memory">
      {testing ? (
        <Test test={params.test} recorder={recorder} onDone={onDone} />
      ) : (
        <Encoding items={params.encode} ms={params.encode_ms} onEnd={startTest} />
      )}
    </section>
  )
}
