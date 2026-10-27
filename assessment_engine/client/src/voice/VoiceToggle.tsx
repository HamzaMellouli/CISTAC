import { useEffect, useRef, useState } from 'react'
import { VoiceProbe } from './voiceProbe'

type Props = { value: VoiceProbe | null; onChange: (probe: VoiceProbe | null) => void }

// Off by default and never persisted: every page load starts with the microphone off.
export function VoiceToggle({ value, onChange }: Props) {
  const [pending, setPending] = useState(false)
  const [reason, setReason] = useState<string | null>(null)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const toggle = async () => {
    setReason(null)
    if (value) {
      value.stop()
      onChange(null)
      return
    }
    setPending(true)
    try {
      const probe = await VoiceProbe.start()
      // Unmounted while the permission prompt was open: release the mic instead of handing it on.
      if (!mounted.current) return probe.stop()
      onChange(probe)
    } catch (e) {
      if (!mounted.current) return
      setReason(
        e instanceof DOMException && e.name === 'NotAllowedError'
          ? 'Microphone access was denied, so speaking speed stays off.'
          : 'No microphone is available, so speaking speed stays off.',
      )
    }
    setPending(false)
  }

  return (
    <div>
      <label>
        <input type="checkbox" checked={value !== null} disabled={pending} onChange={() => void toggle()} />
        Optional: measure speaking speed. Audio never leaves your device and is not recorded.
      </label>
      {reason && <p role="alert">{reason}</p>}
    </div>
  )
}
