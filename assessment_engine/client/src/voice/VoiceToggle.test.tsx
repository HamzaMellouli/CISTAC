import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import { VoiceProbe } from './voiceProbe'
import { VoiceToggle } from './VoiceToggle'

const LABEL = 'Optional: measure speaking speed. Audio never leaves your device and is not recorded.'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function Host({ onProbe }: { onProbe?: (p: VoiceProbe | null) => void }) {
  const [probe, setProbe] = useState<VoiceProbe | null>(null)
  return (
    <VoiceToggle
      value={probe}
      onChange={(p) => {
        setProbe(p)
        onProbe?.(p)
      }}
    />
  )
}

const box = () => screen.getByRole('checkbox', { name: LABEL }) as HTMLInputElement
const toggle = () => act(async () => void fireEvent.click(box()))

test('is off by default and does not ask for the microphone', () => {
  const start = vi.spyOn(VoiceProbe, 'start')
  render(<Host />)
  expect(box().checked).toBe(false)
  expect(start).not.toHaveBeenCalled()
})

test('turning on starts the probe; turning off stops it', async () => {
  const stop = vi.fn()
  const fake = { stop } as unknown as VoiceProbe
  vi.spyOn(VoiceProbe, 'start').mockResolvedValue(fake)
  const onProbe = vi.fn()
  render(<Host onProbe={onProbe} />)
  await toggle()
  expect(box().checked).toBe(true)
  expect(onProbe).toHaveBeenLastCalledWith(fake)
  await toggle()
  expect(box().checked).toBe(false)
  expect(stop).toHaveBeenCalledOnce()
  expect(onProbe).toHaveBeenLastCalledWith(null)
})

test('denied permission reverts to off and says why', async () => {
  vi.spyOn(VoiceProbe, 'start').mockRejectedValue(new DOMException('denied', 'NotAllowedError'))
  render(<Host />)
  await toggle()
  expect(box().checked).toBe(false)
  expect(screen.getByRole('alert').textContent).toMatch(/microphone access was denied/i)
})

test('no microphone available reverts to off and says why', async () => {
  vi.spyOn(VoiceProbe, 'start').mockRejectedValue(new Error('unavailable'))
  render(<Host />)
  await toggle()
  expect(box().checked).toBe(false)
  expect(screen.getByRole('alert').textContent).toMatch(/no microphone/i)
})

test('unmounting while the permission prompt is open stops the probe once it arrives', async () => {
  const stop = vi.fn()
  let resolve!: (p: VoiceProbe) => void
  vi.spyOn(VoiceProbe, 'start').mockReturnValue(new Promise((r) => (resolve = r)))
  const onProbe = vi.fn()
  const { unmount } = render(<Host onProbe={onProbe} />)
  await toggle()
  unmount()
  await act(async () => resolve({ stop } as unknown as VoiceProbe))
  expect(stop).toHaveBeenCalledOnce()
  expect(onProbe).not.toHaveBeenCalled()
})
