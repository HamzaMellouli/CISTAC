import { afterEach, expect, test, vi } from 'vitest'
import { detectOnsets, VoiceProbe } from './voiceProbe'
import src from './voiceProbe.ts?raw'

const frames = (n: number, spikes: number[]) => Array.from({ length: n }, (_, k) => (spikes.includes(k) ? 0.2 : 0.001))

test('silence has no onsets', () => {
  expect(detectOnsets(frames(60, []), 16)).toEqual([])
})

test('spikes at frames 10 and 12 (16 ms frames) are one onset at 160 ms', () => {
  expect(detectOnsets(frames(60, [10, 12]), 16)).toEqual([160])
})

test('spikes 20 frames apart are two onsets', () => {
  expect(detectOnsets(frames(60, [10, 30]), 16)).toEqual([160, 480])
})

test('sustained sound above the threshold is a single onset', () => {
  expect(detectOnsets(frames(60, Array.from({ length: 40 }, (_, k) => k + 5)), 16)).toEqual([80])
})

test('the probe source never records, buffers for upload, or touches the network', () => {
  for (const banned of ['MediaRecorder', 'fetch(', 'sendBeacon', 'XMLHttpRequest', 'WebSocket']) {
    expect(src).not.toContain(banned)
  }
})

// A probe driven by hand: rms() returns the next scripted level, tick(t) runs one analyser frame.
function fakeProbe() {
  let level = 0
  let t = 0
  const release = vi.fn()
  const probe = new VoiceProbe(() => level, release, () => t)
  return {
    probe,
    release,
    frame: (ms: number, v: number) => {
      t = ms
      level = v
      probe.tick(ms)
    },
    at: (ms: number) => void (t = ms),
  }
}

test('measure() is null before any mark and with no onset since the mark', () => {
  const { probe, frame, at } = fakeProbe()
  expect(probe.measure()).toEqual({ voice_latency_ms: null, vocal_pace_hz: null })
  at(1000)
  probe.markOnset()
  frame(1100, 0.001)
  expect(probe.measure()).toEqual({ voice_latency_ms: null, vocal_pace_hz: null })
})

test('latency is the first onset after the mark; pace is onsets per second since the mark', () => {
  const { probe, frame, at } = fakeProbe()
  frame(900, 0.3) // before the mark: forgotten
  frame(950, 0.001)
  at(1000)
  probe.markOnset()
  frame(1400, 0.3)
  frame(1416, 0.001)
  frame(1800, 0.3)
  frame(1816, 0.001)
  at(2000)
  expect(probe.measure()).toEqual({ voice_latency_ms: 400, vocal_pace_hz: 2 })
})

test('stop() releases the microphone once', () => {
  const { probe, release } = fakeProbe()
  probe.stop()
  probe.stop()
  expect(release).toHaveBeenCalledOnce()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

test('a context that stays suspended releases the mic and the context, then throws', async () => {
  const track = { stop: vi.fn() }
  vi.stubGlobal('navigator', {
    mediaDevices: { getUserMedia: vi.fn(async () => ({ getTracks: () => [track] })) },
  })
  const ctx = { state: 'suspended', resume: vi.fn(async () => {}), close: vi.fn(async () => {}) }
  await expect(VoiceProbe.start(() => ctx as unknown as AudioContext)).rejects.toThrow(/not running/)
  expect(ctx.resume).toHaveBeenCalledOnce()
  expect(track.stop).toHaveBeenCalledOnce()
  expect(ctx.close).toHaveBeenCalledOnce()
})
