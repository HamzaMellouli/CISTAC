import React, { Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'

const WelcomePage = React.lazy(() => import('./pages/WelcomePage'))
const OnboardingPage = React.lazy(() => import('./pages/OnboardingPage'))
const AssessmentHubPage = React.lazy(() => import('./pages/AssessmentHubPage'))
const TaskRunnerPage = React.lazy(() => import('./pages/TaskRunnerPage'))
const ProfileRevealPage = React.lazy(() => import('./pages/ProfileRevealPage'))
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'))
const DimensionDetailPage = React.lazy(
  () => import('./pages/DimensionDetailPage'),
)
const PlanPage = React.lazy(() => import('./pages/PlanPage'))
const BrainTwinPage = React.lazy(() => import('./pages/BrainTwinPage'))
const AiCoachPage = React.lazy(() => import('./pages/AiCoachPage'))
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
            <Route path="/" element={<WelcomePage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/assessment" element={<AssessmentHubPage />} />
            <Route
              path="/task"
              element={
                <Navigate to="/task/episodic_pattern_separation" replace />
              }
            />
            <Route path="/task/:dimId" element={<TaskRunnerPage />} />
            <Route path="/profile-reveal" element={<ProfileRevealPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/dimensions"
              element={<Navigate to="/dimensions/working_memory" replace />}
            />
            <Route
              path="/dimensions/:dimId"
              element={<DimensionDetailPage />}
            />
            <Route path="/plan" element={<PlanPage />} />
            <Route path="/brain-twin" element={<BrainTwinPage />} />
            <Route path="/coach" element={<AiCoachPage />} />
            <Route path="/design-system" element={<DesignSystemPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
