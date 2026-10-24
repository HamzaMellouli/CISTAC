import { create } from 'zustand'
import type { DimensionPresetKey } from '../config/dimensions'

export type ThemeMode = 'light' | 'dark'
export type PersonaId =
  | 'new-user'
  | 'steady-improver'
  | 'noisy-low-confidence'
  | 'edge-missing-dim'
  | 'edge-10-dimensions'
  | 'edge-llm-offline'

export type FocusGoalId =
  | 'deep-focus-wm'
  | 'fast-set-shifting'
  | 'balanced-360-twin'

export type PeakWindowId = 'morning' | 'afternoon' | 'evening'
export type BaselineModeId = 'quick-2min' | 'standard-5min'

export interface ConsentPreferences {
  focusGoal: FocusGoalId
  peakWindow: PeakWindowId
  coreTelemetry: true
  nonBiometricMode: true
  historicalSnapshots: boolean
  coachAndCollab: boolean
  researchExport: boolean
  nonClinicalAck: boolean
  baselineMode: BaselineModeId
  inputLatencyMs: number | null
  consentReceiptId: string
  updatedAtIso: string
}

export const DEFAULT_CONSENT_PREFERENCES: ConsentPreferences = {
  focusGoal: 'balanced-360-twin',
  peakWindow: 'morning',
  coreTelemetry: true,
  nonBiometricMode: true,
  historicalSnapshots: true,
  coachAndCollab: true,
  researchExport: false,
  nonClinicalAck: true,
  baselineMode: 'quick-2min',
  inputLatencyMs: 138,
  consentReceiptId: 'CONSENT-ST-2026-8F4A',
  updatedAtIso: '2026-10-24T17:00:00Z',
}

interface AppState {
  theme: ThemeMode
  reducedMotion: boolean
  dimensionPreset: DimensionPresetKey
  showMascot: boolean
  activePersona: PersonaId
  simulateOffline: boolean
  simulateLlmDown: boolean
  consentPreferences: ConsentPreferences
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setReducedMotion: (reduced: boolean) => void
  setDimensionPreset: (preset: DimensionPresetKey) => void
  setShowMascot: (show: boolean) => void
  setActivePersona: (persona: PersonaId) => void
  setSimulateOffline: (offline: boolean) => void
  setSimulateLlmDown: (llmDown: boolean) => void
  updateConsentPreferences: (patch: Partial<ConsentPreferences>) => void
  applyFastTrackConsent: () => void
  resetConsentPreferences: () => void
  resetDemoState: () => void
}

function syncDocumentAttributes(theme: ThemeMode, reducedMotion: boolean) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute(
      'data-reduced-motion',
      reducedMotion ? 'true' : 'false',
    )
  }
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  reducedMotion: false,
  dimensionPreset: '7',
  showMascot: true,
  activePersona: 'steady-improver',
  simulateOffline: false,
  simulateLlmDown: false,
  consentPreferences: DEFAULT_CONSENT_PREFERENCES,
  setTheme: (theme) =>
    set((state) => {
      syncDocumentAttributes(theme, state.reducedMotion)
      return { theme }
    }),
  toggleTheme: () =>
    set((state) => {
      const next: ThemeMode = state.theme === 'light' ? 'dark' : 'light'
      syncDocumentAttributes(next, state.reducedMotion)
      return { theme: next }
    }),
  setReducedMotion: (reducedMotion) =>
    set((state) => {
      syncDocumentAttributes(state.theme, reducedMotion)
      return { reducedMotion }
    }),
  setDimensionPreset: (dimensionPreset) => set({ dimensionPreset }),
  setShowMascot: (showMascot) => set({ showMascot }),
  setActivePersona: (activePersona) => set({ activePersona }),
  setSimulateOffline: (simulateOffline) => set({ simulateOffline }),
  setSimulateLlmDown: (simulateLlmDown) => set({ simulateLlmDown }),
  updateConsentPreferences: (patch) =>
    set((state) => ({
      consentPreferences: {
        ...state.consentPreferences,
        ...patch,
        coreTelemetry: true,
        nonBiometricMode: true,
      },
    })),
  applyFastTrackConsent: () =>
    set({
      consentPreferences: {
        ...DEFAULT_CONSENT_PREFERENCES,
        nonClinicalAck: true,
        inputLatencyMs: 138,
        consentReceiptId: 'CONSENT-ST-2026-FAST',
      },
    }),
  resetConsentPreferences: () =>
    set({
      consentPreferences: {
        ...DEFAULT_CONSENT_PREFERENCES,
        historicalSnapshots: false,
        coachAndCollab: false,
        researchExport: false,
        nonClinicalAck: false,
        inputLatencyMs: null,
        consentReceiptId: 'CONSENT-ST-2026-MINIMAL',
      },
    }),
  resetDemoState: () =>
    set(() => {
      syncDocumentAttributes('light', false)
      return {
        theme: 'light',
        reducedMotion: false,
        dimensionPreset: '7',
        showMascot: true,
        activePersona: 'steady-improver',
        simulateOffline: false,
        simulateLlmDown: false,
        consentPreferences: DEFAULT_CONSENT_PREFERENCES,
      }
    }),
}))
