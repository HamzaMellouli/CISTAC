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

interface AppState {
  theme: ThemeMode
  reducedMotion: boolean
  dimensionPreset: DimensionPresetKey
  showMascot: boolean
  activePersona: PersonaId
  simulateOffline: boolean
  simulateLlmDown: boolean
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setReducedMotion: (reduced: boolean) => void
  setDimensionPreset: (preset: DimensionPresetKey) => void
  setShowMascot: (show: boolean) => void
  setActivePersona: (persona: PersonaId) => void
  setSimulateOffline: (offline: boolean) => void
  setSimulateLlmDown: (llmDown: boolean) => void
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
      }
    }),
}))
