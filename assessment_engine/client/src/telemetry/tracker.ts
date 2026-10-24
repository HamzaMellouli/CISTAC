import { hesitationJitter, nextErrorBurst } from './metrics'
import type { Dimension, TelemetryEvent, TrialMeta } from './types'

type TrialCtx = {
  user_id: string
  session_id: string
  task_id: string
  dimension: Dimension
  voice_opt_in: boolean
}

const MAX_RT_MS = 600_000 // server response_time_ms upper bound

type TrialResult = {
  correct: boolean
  score?: number
  windowMs?: number
  meta?: TrialMeta
  voice?: { voice_latency_ms: number | null; vocal_pace_hz: number | null }
}

// Builds one TelemetryEvent per trial from onset, input timestamps, and the committed response.
export class TrialRecorder {
  private ctx: TrialCtx
  private now: () => number
  private trial: { index: number; start: number; inputs: number[]; firstPress: number | null } | null =
    null
  private burst = 0

  constructor(ctx: TrialCtx, now = () => performance.now()) {
    this.ctx = ctx
    this.now = now
  }

  start(trialIndex: number): void {
    this.trial = { index: trialIndex, start: this.now(), inputs: [], firstPress: null }
  }

  // Every kind feeds hesitation jitter; only a key or pointer press sets keystroke latency.
  input(kind: 'key' | 'down' | 'move' = 'down'): void {
    const t = this.trial
    if (!t) return
    const now = this.now()
    t.inputs.push(now)
    if (kind !== 'move' && t.firstPress === null) t.firstPress = now
  }

  finish(r: TrialResult): TelemetryEvent {
    const t = this.trial
    if (!t) throw new Error('finish() without an active trial')
    this.trial = null
    this.burst = nextErrorBurst(this.burst, r.correct)
    const { voice_opt_in } = this.ctx
    return {
      user_id: this.ctx.user_id,
      session_id: this.ctx.session_id,
      task_id: this.ctx.task_id,
      trial_index: t.index,
      dimension: this.ctx.dimension,
      // Clamped to the server's bounds so one out-of-range value cannot get a whole batch rejected.
      score_norm: Math.min(1, Math.max(0, r.score ?? (r.correct ? 1 : 0))),
      response_time_ms: Math.min(MAX_RT_MS, r.windowMs ?? this.now() - t.start),
      error_flag: !r.correct,
      error_burst: this.burst,
      hesitation_jitter: hesitationJitter(t.inputs),
      keystroke_latency_ms: t.firstPress === null ? null : t.firstPress - t.start,
      trial_meta: { item_id: `${this.ctx.task_id}:${t.index}`, ...r.meta },
      voice_opt_in,
      // The server rejects voice fields without opt-in, so they are only attached when opted in.
      ...(voice_opt_in && r.voice ? r.voice : {}),
      client_ts: new Date().toISOString(),
    }
  }

  abort(): void {
    this.trial = null
  }
}

type TrackerOpts = {
  endpoint?: string
  flushMs?: number
  batchSize?: number
  maxBuffer?: number
  fetchFn?: (url: string, init?: RequestInit) => Promise<Response>
  beacon?: (url: string, data: Blob) => boolean
}

const MAX_PER_REQUEST = 100 // server Batch max_length

// Buffers events and sends them in the background; push() never awaits the network.
export class Tracker {
  private endpoint: string
  private batchSize: number
  private maxBuffer: number
  private fetchFn: (url: string, init?: RequestInit) => Promise<Response>
  private beacon?: (url: string, data: Blob) => boolean
  private buffer: TelemetryEvent[] = []
  private inFlight = false
  private timer: ReturnType<typeof setInterval>
  private onPageHide = () => this.flushBeacon()
  // Mobile browsers often discard a backgrounded tab without firing pagehide; hidden is the last reliable signal.
  private onVisibility = () => {
    if (document.visibilityState === 'hidden') this.flushBeacon()
  }

  constructor(opts: TrackerOpts = {}) {
    this.endpoint = opts.endpoint ?? '/v1/telemetry/event'
    this.batchSize = opts.batchSize ?? 20
    this.maxBuffer = opts.maxBuffer ?? 500
    this.fetchFn = opts.fetchFn ?? ((url, init) => fetch(url, init))
    this.beacon =
      opts.beacon ??
      (typeof navigator !== 'undefined' && navigator.sendBeacon
        ? navigator.sendBeacon.bind(navigator)
        : undefined)
    this.timer = setInterval(() => void this.flush(), opts.flushMs ?? 2000)
    if (typeof window !== 'undefined') window.addEventListener('pagehide', this.onPageHide)
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', this.onVisibility)
  }

  push(e: TelemetryEvent): void {
    this.buffer.push(e)
    if (this.buffer.length > this.maxBuffer) this.buffer.splice(0, this.buffer.length - this.maxBuffer)
    if (this.buffer.length >= this.batchSize) void this.flush()
  }

  async flush(): Promise<void> {
    if (this.inFlight || !this.buffer.length) return
    this.inFlight = true
    // Events stay in the buffer until acknowledged, so failures retry and overflow still drops the oldest.
    const batch = this.buffer.slice(0, MAX_PER_REQUEST)
    try {
      const res = await this.fetchFn(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
      })
      // A 4xx (other than 408/429) will never succeed: the server rejects the whole batch, so drop it
      // rather than block the queue head. 5xx, 408, 429 and network errors retry.
      const rejected =
        res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429
      if (rejected) console.error(`telemetry: dropped ${batch.length} events (HTTP ${res.status})`)
      if (res.ok || rejected) {
        const done = new Set(batch)
        this.buffer = this.buffer.filter((e) => !done.has(e))
      }
    } catch {
      // offline: keep events for the next flush
    } finally {
      this.inFlight = false
    }
  }

  flushBeacon(): void {
    // ponytail: without sendBeacon we fall back to a normal flush, which may not survive page unload.
    if (!this.beacon) return void this.flush()
    const kept: TelemetryEvent[] = []
    for (let i = 0; i < this.buffer.length; i += MAX_PER_REQUEST) {
      const chunk = this.buffer.slice(i, i + MAX_PER_REQUEST)
      const blob = new Blob([JSON.stringify(chunk)], { type: 'application/json' })
      if (!this.beacon(this.endpoint, blob)) kept.push(...chunk)
    }
    this.buffer = kept
  }

  destroy(): void {
    clearInterval(this.timer)
    if (typeof window !== 'undefined') window.removeEventListener('pagehide', this.onPageHide)
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', this.onVisibility)
  }
}

export const tracker = new Tracker()
