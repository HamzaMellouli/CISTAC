import React, { Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'

const DesignSystemPage = React.lazy(() => import('./pages/DesignSystemPage'))

function RouteLoadingSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="tactile-card p-6 space-y-4"
    >
      <div className="h-8 w-64 rounded-sm bg-surface-raised" />
      <div className="h-4 w-96 rounded-sm bg-surface-raised" />
      <div className="h-64 w-full rounded-md bg-surface-raised" />
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AppShell>
        <Suspense fallback={<RouteLoadingSkeleton />}>
          <Routes>
            <Route path="/design-system" element={<DesignSystemPage />} />
            <Route path="*" element={<Navigate to="/design-system" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
