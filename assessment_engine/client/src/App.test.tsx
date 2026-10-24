import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

const fetchNextTask = vi.fn()
vi.mock('./tasks/taskSource', () => ({ fetchNextTask, getUserId: () => 'u1', newId: () => 's1' }))
const { default: App } = await import('./App')

afterEach(() => {
  cleanup()
  fetchNextTask.mockReset()
})

test('a fetch error shows a message and retry loads the task', async () => {
  fetchNextTask
    .mockRejectedValueOnce(new Error('HTTP 500'))
    .mockResolvedValueOnce({ task_id: 't1', dimension: 'working_memory', schema_type: 'bogus', params: {}, surface_seed: 0 })
  render(<App />)
  await userEvent.click(await screen.findByRole('button', { name: /try again/i }))
  expect(await screen.findByText(/Unsupported task/)).toBeTruthy()
  expect(fetchNextTask).toHaveBeenCalledTimes(2)
  // The task counter is the mock sequence number: first load is 0, the retry is 1.
  expect(fetchNextTask).toHaveBeenNthCalledWith(1, 'u1', 0)
  expect(fetchNextTask).toHaveBeenNthCalledWith(2, 'u1', 1)
})

test('a task that throws while rendering is skipped, not a blank app', async () => {
  const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  // React dev rethrows render errors through a window 'error' event; jsdom prints those unless cancelled.
  const quiet = (e: ErrorEvent) => e.preventDefault()
  window.addEventListener('error', quiet)
  fetchNextTask
    .mockResolvedValueOnce({ task_id: 't1', dimension: 'pattern_induction', schema_type: 'matrix', params: {}, surface_seed: 0 })
    .mockResolvedValueOnce({ task_id: 't2', dimension: 'working_memory', schema_type: 'bogus', params: {}, surface_seed: 0 })
  render(<App />)
  expect(await screen.findByText(/Unsupported task/)).toBeTruthy()
  expect(fetchNextTask).toHaveBeenCalledTimes(2)
  const ours = errSpy.mock.calls.filter((c) => String(c[0]).startsWith('task t1 failed to render'))
  expect(ours).toHaveLength(1)
  window.removeEventListener('error', quiet)
  errSpy.mockRestore()
})

test('unmounting App with the voice probe on stops the probe (mic released)', async () => {
  const { VoiceProbe } = await import('./voice/voiceProbe')
  const stop = vi.fn()
  const start = vi.spyOn(VoiceProbe, 'start').mockResolvedValue({ stop } as unknown as InstanceType<typeof VoiceProbe>)
  fetchNextTask.mockResolvedValue({ task_id: 't1', dimension: 'working_memory', schema_type: 'bogus', params: {}, surface_seed: 0 })
  const { unmount } = render(<App />)
  await userEvent.click(screen.getByRole('checkbox', { name: /speaking speed/i }))
  expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true)
  unmount()
  expect(stop).toHaveBeenCalledOnce()
  start.mockRestore()
})
