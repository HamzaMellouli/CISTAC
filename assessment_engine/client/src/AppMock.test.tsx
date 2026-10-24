import { cleanup, render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import App from './App'

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
})

// StrictMode runs App's mount effect twice in dev; mock mode must still start at fixtures[0] (N-back).
test('mock mode under StrictMode starts with the first fixture', async () => {
  vi.stubEnv('VITE_MOCK_TASKS', '1')
  render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  expect(await screen.findByRole('region', { name: 'N-back' })).toBeTruthy()
})

// Plain-http LAN demos are not a secure context, so crypto.randomUUID is undefined there.
test('loads without crypto.randomUUID', async () => {
  vi.stubEnv('VITE_MOCK_TASKS', '1')
  const real = globalThis.crypto
  vi.stubGlobal('crypto', { getRandomValues: real.getRandomValues.bind(real) })
  try {
    vi.resetModules()
    const { default: FreshApp } = await import('./App')
    render(<FreshApp />)
    expect(await screen.findByRole('region', { name: 'N-back' })).toBeTruthy()
  } finally {
    vi.unstubAllGlobals()
  }
})
