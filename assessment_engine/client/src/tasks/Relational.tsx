import { useEffect, useState, type CSSProperties } from 'react'
import { WeightedStaircase } from '../adaptive/staircase'
import { pressProps, useTimedTrials } from '../telemetry/useTimedTrials'
import type { RelationalParams, Statement } from '../telemetry/types'
import type { TaskProps } from './TaskRunner'

type Trial = RelationalParams['levels'][number][number]

const ARROW = { more: '▷', less: '◁' } as const
const WORDS = { same: 'SAME as', opposite: 'OPPOSITE to', before: 'BEFORE', after: 'AFTER', contains: 'CONTAINS' } as const
const hidden: CSSProperties = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }

// One premise or the question as plain text. more/less are drawn as arrows with a hidden text alternative.
function Sentence({ s, ask }: { s: Statement; ask?: boolean }) {
  const [pre, post] = ask ? ['Is ', '?'] : ['', '']
  if (s.rel === 'more' || s.rel === 'less')
    return (
      <p>
        <span aria-hidden="true">{`${pre}${s.a} ${ARROW[s.rel]} ${s.b}${post}`}</span>
        <span style={hidden}>{ask ? `Is ${s.a} ${s.rel} than ${s.b}?` : `${s.a} is ${s.rel} than ${s.b}`}</span>
      </p>
    )
  if (ask) return <p>{s.rel === 'contains' ? `Does ${s.a} CONTAIN ${s.b}?` : `Is ${s.a} ${WORDS[s.rel]} ${s.b}?`}</p>
  return <p>{s.rel === 'contains' ? `${s.a} CONTAINS ${s.b}` : `${s.a} is ${WORDS[s.rel]} ${s.b}`}</p>
}

// Relational reasoning: true/false judgments over chained premises, staircased by level (easiest first).
// Keys T/F or the buttons. A trial whose level runs out of items wraps to that level's first item.
export function Relational({ params, recorder, onDone }: TaskProps<RelationalParams>) {
  const { n_trials, time_limit_ms, levels } = params
  const [s] = useState(() => ({
    stair: new WeightedStaircase(levels.length),
    used: levels.map(() => 0),
    picks: [] as { trial: Trial; level: number }[],
  }))
  const { i, paused, respond } = useTimedTrials(recorder, n_trials, time_limit_ms, onDone, (correct) => {
    const { trial, level } = s.picks[i]
    s.stair.update(correct)
    return { hops: trial.hops, inverted: trial.inverted, level }
  })
  if (i < n_trials && !s.picks[i]) {
    const level = s.stair.level
    s.picks[i] = { trial: levels[level][s.used[level]++ % levels[level].length], level }
  }
  const t = s.picks[i]?.trial

  useEffect(() => {
    if (!t) return
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return
      const k = e.key.toLowerCase()
      if (k === 't' || k === 'f') respond((k === 't') === t.answer)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [t, respond])

  if (!t) return null
  return (
    <section aria-label="Word relations">
      <p>Read the statements, then answer: is the question true or false?</p>
      {!paused && (
        <div style={{ border: `3px solid ${t.inverted ? '#f59e0b' : 'transparent'}`, padding: 12 }}>
          {t.inverted && <p style={{ fontWeight: 700 }}>Rule inverted</p>}
          {t.premises.map((p, k) => (
            <Sentence key={k} s={p} />
          ))}
          <Sentence s={t.question} ask />
        </div>
      )}
      <div>
        <button type="button" {...pressProps(() => respond(t.answer))}>
          True (T)
        </button>
        <button type="button" {...pressProps(() => respond(!t.answer))}>
          False (F)
        </button>
      </div>
    </section>
  )
}
