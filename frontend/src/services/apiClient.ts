import { getDimensionsByPreset, type DimensionPresetKey } from '../config/dimensions'
import type {
  BrainTwinSnapshot,
  CollaborationScorePayload,
  DimensionEstimate,
  TelemetryEvent,
} from '../contracts'
import type { PersonaId } from '../store/useAppStore'
import {
  buildEstimatesForDimensions,
  buildSnapshotsForDimensions,
  SAMPLE_COLLABORATION_SCORE,
} from './mocks/fixtures'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export interface DashboardBundle {
  estimates: DimensionEstimate[]
  snapshots: BrainTwinSnapshot[]
  collaboration: CollaborationScorePayload
  usingMocks: boolean
}

export const apiClient = {
  isMockMode(): boolean {
    return USE_MOCKS
  },

  async getDashboardBundle(
    preset: DimensionPresetKey,
    persona: PersonaId,
  ): Promise<DashboardBundle> {
    const dimensions = getDimensionsByPreset(preset)
    if (USE_MOCKS) {
      return {
        estimates: buildEstimatesForDimensions(dimensions, persona),
        snapshots: buildSnapshotsForDimensions(dimensions, persona),
        collaboration: SAMPLE_COLLABORATION_SCORE,
        usingMocks: true,
      }
    }

    const res = await fetch(`${API_BASE}/v1/dashboard/profile`)
    if (!res.ok) {
      throw new Error(`Backend profile request failed with HTTP ${res.status}`)
    }
    const data = (await res.json()) as Partial<DashboardBundle>
    return {
      estimates:
        data.estimates ?? buildEstimatesForDimensions(dimensions, persona),
      snapshots:
        data.snapshots ?? buildSnapshotsForDimensions(dimensions, persona),
      collaboration: data.collaboration ?? SAMPLE_COLLABORATION_SCORE,
      usingMocks: false,
    }
  },

  async postTelemetryEvent(
    events: TelemetryEvent | TelemetryEvent[],
  ): Promise<{ accepted: number }> {
    const batch = Array.isArray(events) ? events : [events]
    if (USE_MOCKS) {
      return { accepted: batch.length }
    }
    const res = await fetch(`${API_BASE}/v1/telemetry/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    })
    if (!res.ok) {
      throw new Error(`Telemetry ingestion failed with HTTP ${res.status}`)
    }
    return (await res.json()) as { accepted: number }
  },
}
