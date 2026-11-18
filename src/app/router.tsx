import { createBrowserRouter } from 'react-router-dom'
import { MapRoute, ReportRoute, SightingRoute } from './lazyPages.tsx'
import { HelpPage } from '../pages/HelpPage.tsx'
import { HomePage } from '../pages/HomePage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/help',
    element: <HelpPage />,
  },
  {
    path: '/report/new',
    element: <ReportRoute />,
  },
  {
    path: '/map',
    element: <MapRoute />,
  },
  {
    path: '/map/sighting',
    element: <SightingRoute />,
  },
])
