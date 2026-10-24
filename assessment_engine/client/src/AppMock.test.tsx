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
