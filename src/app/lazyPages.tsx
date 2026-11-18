import { lazy, Suspense } from 'react'
import { useAppSelector } from './hooks.ts'
import { dictionary } from '../i18n/dictionary.ts'

const MapPage = lazy(() =>
  import('../pages/MapPage.tsx').then((module) => ({ default: module.MapPage })),
)
const SightingPage = lazy(() =>
  import('../pages/SightingPage.tsx').then((module) => ({ default: module.SightingPage })),
)
const ReportPage = lazy(() =>
  import('../pages/ReportPage.tsx').then((module) => ({ default: module.ReportPage })),
)

function RouteFallback() {
  const language = useAppSelector((state) => state.language.current)

  return <p className="route-fallback">{dictionary[language].loading}</p>
}

export function MapRoute() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <MapPage />
    </Suspense>
  )
}

export function ReportRoute() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <ReportPage />
    </Suspense>
  )
}

export function SightingRoute() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <SightingPage />
    </Suspense>
  )
}
