// Opt-in, on-device voice timing. The microphone feeds an AnalyserNode; each animation frame reads
// one reused time-domain buffer, reduces it to a single RMS number, and drops the samples. Only
// onset timestamps (numbers) since the last markOnset() are kept. Nothing is recorded or sent:
// the caller sends the two numbers from measure() with its telemetry event.

export type VoiceMeasure = { voice_latency_ms: number | null; vocal_pace_hz: number | null }
export type VoiceSource = Pick<VoiceProbe, 'markOnset' | 'measure'>

// Rising edge above `threshold`, at least `minGapMs` after the previous onset.
function onsetDetector(threshold: number, minGapMs: number) {
  let above = false
  let last = -Infinity
  return (rms: number, t: number): boolean => {
    const loud = rms >= threshold
    const onset = loud && !above && t - last >= minGapMs
    above = loud
    if (onset) last = t
    return onset
  }
}

export function detectOnsets(rms: number[], frameMs: number, threshold = 0.02, minGapMs = 150): number[] {
  const isOnset = onsetDetector(threshold, minGapMs)
  return rms.flatMap((v, k) => (isOnset(v, k * frameMs) ? [k * frameMs] : []))
}

export class VoiceProbe {
  private readRms: () => number
  private release: (() => void) | null
  private now: () => number
  private isOnset = onsetDetector(0.02, 150)
  private mark: number | null = null
  private onsets: number[] = []

  // readRms: RMS of the current analyser frame; release: stop the mic. Injectable for tests.
  constructor(readRms: () => number, release: () => void, now = () => performance.now()) {
    this.readRms = readRms
    this.release = release
    this.now = now
  }

  // `makeContext` is injectable for tests; the default is a real AudioContext.
  static async start(makeContext: () => AudioContext = () => new AudioContext()): Promise<VoiceProbe> {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('microphone unavailable')
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const stopTracks = () => stream.getTracks().forEach((t) => t.stop())
    let ctx: AudioContext | undefined
    let analyser: AnalyserNode
    try {
      ctx = makeContext()
      // Created after an await, so autoplay policy (e.g. Safari) may leave it suspended: the
      // analyser would then read zeros and measure() would silently stay null.
      await ctx.resume()
      if (ctx.state !== 'running') throw new Error('audio context not running')
      analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      ctx.createMediaStreamSource(stream).connect(analyser) // not connected to the speakers
    } catch (e) {
      stopTracks()
      void ctx?.close()
      throw e
    }
    const audio = ctx
    const buf = new Float32Array(analyser.fftSize) // the only sample buffer, overwritten every frame
    let raf = 0
    const readRms = () => {
      analyser.getFloatTimeDomainData(buf)
      let sum = 0
      for (const s of buf) sum += s * s
      return Math.sqrt(sum / buf.length)
    }
    const probe = new VoiceProbe(readRms, () => {
      cancelAnimationFrame(raf)
      stopTracks()
      void audio.close()
    })
    const loop = (t: number) => {
      probe.tick(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return probe
  }

  // One analyser frame at time t (same clock as `now`).
  tick(t: number): void {
    if (!this.release) return
    if (this.isOnset(this.readRms(), t) && this.mark !== null && t >= this.mark) this.onsets.push(t)
  }

  markOnset(): void {
    this.mark = this.now()
    this.onsets = []
  }

  measure(): VoiceMeasure {
    if (this.mark === null || !this.onsets.length) return { voice_latency_ms: null, vocal_pace_hz: null }
    const elapsed = this.now() - this.mark
    return {
      voice_latency_ms: this.onsets[0] - this.mark,
      vocal_pace_hz: elapsed > 0 ? this.onsets.length / (elapsed / 1000) : null,
    }
  }

  stop(): void {
    this.release?.()
    this.release = null
  }
}
