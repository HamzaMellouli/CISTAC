import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { TrialRecorder, tracker } from '../telemetry/tracker'
import type { TaskPayload, TelemetryEvent, TowerParams } from '../telemetry/types'
import fixtures from './fixtures.json'
import { Tower } from './Tower'

// Fixture: capacities [3,2,1], start [[R,G],[B],[]], goal [[B],[G],[R]], l_min 5, counter_intuitive [2].
const params = (fixtures as TaskPayload[]).find((t) => t.schema_type === 'tower')!.params as TowerParams
const OPT = params.optimal_moves

let pushed: TelemetryEvent[]

beforeEach(() => {
  vi.useFakeTimers()
  pushed = []
  vi.spyOn(tracker, 'push').mockImplementation((e) => void pushed.push(e))
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

function setup(p: TowerParams = params) {
  const recorder = new TrialRecorder({
    user_id: 'u',
    session_id: 's',
    task_id: 't',
    dimension: 'executive_function',
    voice_opt_in: false,
  })
  const onDone = vi.fn()
  render(<Tower params={p} recorder={recorder} onDone={onDone} />)
  return { onDone }
}

const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms))
const peg = (i: number) => screen.getByRole('button', { name: new RegExp(`^Peg ${i + 1}\\b`) })
// Keyboard activation (Enter/Space) arrives as a click with detail 0.
const press = (i: number) => act(() => void fireEvent.click(peg(i), { detail: 0 }))
const move = ([from, to]: [number, number]) => {
  press(from)
  press(to)
}
const predict = (v: string) => {
  fireEvent.change(screen.getByLabelText('How many moves will you need?'), { target: { value: v } })
  act(() => void fireEvent.click(screen.getByRole('button', { name: 'Start' })))
}
const pegText = (i: number) => peg(i).textContent

test('pegs are locked until a valid prediction is entered', () => {
  setup()
  expect(peg(0).getAttribute('aria-disabled')).toBe('true')
  move([1, 2])
  expect(pegText(1)).toContain('B')
  predict('0')
  predict('2.5')
  move([1, 2])
  expect(pegText(1)).toContain('B')
  predict('5')
  expect(peg(0).getAttribute('aria-disabled')).toBe('false')
  move([1, 2])
  expect(pegText(1)).not.toContain('B')
  expect(pegText(2)).toContain('B')
})

test('playing optimal_moves exactly scores 1 with l_user === l_min, then calls onDone', () => {
  const { onDone } = setup()
  advance(3000)
  predict('6')
  for (const m of OPT) move(m)
  expect(pushed).toHaveLength(1)
  expect(pushed[0]).toMatchObject({ trial_index: 0, score_norm: 1, error_flag: false })
  expect(pushed[0].trial_meta).toEqual({
    item_id: 't:0',
    l_min: 5,
    l_user: 5,
    predicted_moves: 6,
    planning_time_ms: 3000,
    conflict_latency_ms: 0,
    solved: true,
  })
  expect(onDone).toHaveBeenCalledOnce()
})

test('one wasted move pair scores l_min / (l_min + 2)', () => {
  setup()
  predict('5')
  move([0, 2])
  move([2, 0])
  for (const m of OPT) move(m)
  expect(pushed).toHaveLength(1)
  expect(pushed[0].score_norm).toBeCloseTo(5 / 7)
  expect(pushed[0].error_flag).toBe(true)
  expect(pushed[0].trial_meta).toMatchObject({ l_user: 7, solved: true })
})

test('a move onto a full peg, from an empty peg, or onto the same peg is ignored', () => {
  setup()
  predict('5')
  move(OPT[0]) // B onto peg 3 (capacity 1): now full
  move([0, 2]) // full destination
  expect(peg(0).getAttribute('aria-pressed')).toBe('false')
  move([0, 0]) // same peg: selects, then deselects
  press(1) // peg 2 is empty: nothing to pick up
  expect(peg(1).getAttribute('aria-pressed')).toBe('false')
  for (const m of OPT.slice(1)) move(m)
  expect(pushed).toHaveLength(1)
  expect(pushed[0]).toMatchObject({ score_norm: 1, trial_meta: { l_user: 5 } })
})

test('the selected peg shows aria-pressed', () => {
  setup()
  predict('5')
  press(0)
  expect(peg(0).getAttribute('aria-pressed')).toBe('true')
  press(0)
  expect(peg(0).getAttribute('aria-pressed')).toBe('false')
})

test('a 400 ms pause before the counter-intuitive move gives conflict_latency_ms 400', () => {
  setup()
  predict('5')
  advance(100)
  move(OPT[0])
  move(OPT[1])
  advance(400)
  for (const m of OPT.slice(2)) move(m)
  expect(pushed[0].trial_meta).toMatchObject({ conflict_latency_ms: 400 })
})

test('3 × l_min moves without reaching the goal ends unsolved with score 0', () => {
  const { onDone } = setup()
  predict('5')
  for (let k = 0; k < 7; k++) {
    move([0, 2])
    move([2, 0])
  }
  expect(pushed).toHaveLength(0)
  move([0, 2])
  expect(pushed).toHaveLength(1)
  expect(pushed[0]).toMatchObject({ score_norm: 0, error_flag: true, trial_meta: { l_user: 15, solved: false } })
  expect(onDone).toHaveBeenCalledOnce()
})

test('pointer clicks move discs once each; a held key does not repeat', () => {
  setup()
  predict('5')
  for (const [from, to] of OPT) {
    act(() => void fireEvent.pointerDown(peg(from)))
    act(() => void fireEvent.click(peg(from), { detail: 1 }))
    act(() => void fireEvent.pointerDown(peg(to)))
    act(() => void fireEvent.click(peg(to), { detail: 1 }))
  }
  expect(pushed[0]).toMatchObject({ score_norm: 1, trial_meta: { l_user: 5 } })
  expect(fireEvent.keyDown(peg(0), { key: 'Enter', repeat: true })).toBe(false) // default (click) prevented
})

test('keyboard-only completion: focus, Enter to predict, Enter on pegs', () => {
  setup()
  const input = screen.getByLabelText('How many moves will you need?')
  input.focus()
  fireEvent.change(input, { target: { value: '5' } })
  act(() => void fireEvent.submit(input.closest('form')!))
  for (const [from, to] of OPT) {
    peg(from).focus()
    act(() => void fireEvent.click(document.activeElement!, { detail: 0 }))
    peg(to).focus()
    act(() => void fireEvent.click(document.activeElement!, { detail: 0 }))
  }
  expect(pushed[0]).toMatchObject({ score_norm: 1, trial_meta: { l_user: 5, solved: true } })
})

test('start and goal are both shown with text-labelled discs', () => {
  setup()
  const goal = screen.getByRole('group', { name: 'Goal' })
  expect(goal.textContent).toContain('R')
  expect(screen.getAllByText('B').length).toBeGreaterThanOrEqual(2)
})

test('a hidden page aborts the trial; becoming visible calls onDone without an event', () => {
  const { onDone } = setup()
  predict('5')
  move(OPT[0])
  let h = true
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => h })
  act(() => void document.dispatchEvent(new Event('visibilitychange')))
  move(OPT[1])
  h = false
  act(() => void document.dispatchEvent(new Event('visibilitychange')))
  expect(pushed).toHaveLength(0)
  expect(onDone).toHaveBeenCalledOnce()
  for (const m of OPT.slice(1)) move(m)
  expect(pushed).toHaveLength(0)
})

test('hiding and showing the page after the trial finished does not call onDone again', () => {
  const { onDone } = setup()
  predict('5')
  for (const m of OPT) move(m)
  let h = true
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => h })
  act(() => void document.dispatchEvent(new Event('visibilitychange')))
  h = false
  act(() => void document.dispatchEvent(new Event('visibilitychange')))
  expect(pushed).toHaveLength(1)
  expect(onDone).toHaveBeenCalledOnce()
})
