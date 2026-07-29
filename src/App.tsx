/**
 * Main application component
 * Sets up routing, internationalization, error boundaries, and global UI components
 */

import { lazy, Suspense, useEffect } from 'react'
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Footer from './components/Footer'
import InstallPWA from './components/InstallPWA'
import Navbar from './components/Navbar'
import ReadingProgressBar from './components/ReadingProgressBar'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopButton from './components/ScrollToTopButton'
import UpdateNotification from './components/UpdateNotification'
import { ToastProvider } from './components/ui/Toast'
import { I18nProvider } from './i18n/context'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const NXChecker = lazy(() => import('./pages/NXChecker'))
const NXDevice = lazy(() => import('./pages/NXDevice'))
const PS5 = lazy(() => import('./pages/PS5'))
const NSPForwarder = lazy(() => import('./pages/NSPForwarder'))
const Tools = lazy(() => import('./pages/Tools'))
const Legal = lazy(() => import('./pages/Legal'))
const Roadmap = lazy(() => import('./pages/Roadmap'))
const Partners = lazy(() => import('./pages/Partners'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Planning = lazy(() => import('./pages/Planning'))
const NXProjects = lazy(() => import('./pages/NXProjects'))
const Shop = lazy(() => import('./pages/Shop'))

const LocalXssPoc = () => {
  useEffect(() => {
    if (!import.meta.env.DEV) {
      return
    }

    const params = new URLSearchParams(window.location.search)
    if (params.get('xss-poc') !== '1') {
      return
    }

    const previousTitle = document.title
    const root = document.getElementById('root')
    const banner = document.createElement('div')

    document.title = 'PWNED - Local XSS PoC'
    document.body.style.filter = 'hue-rotate(140deg) saturate(1.3)'

    banner.setAttribute('data-local-xss-poc', 'true')
    banner.style.position = 'fixed'
    banner.style.inset = '0 auto auto 0'
    banner.style.width = '100%'
    banner.style.zIndex = '99999'
    banner.style.padding = '20px 16px'
    banner.style.background = 'linear-gradient(90deg, #7f1d1d, #dc2626)'
    banner.style.color = '#fff'
    banner.style.fontFamily = 'monospace'
    banner.style.fontSize = '18px'
    banner.style.fontWeight = '700'
    banner.style.textAlign = 'center'
    banner.style.boxShadow = '0 12px 32px rgba(0,0,0,0.35)'
    banner.textContent = 'Local XSS PoC active: arbitrary JavaScript can alter the homepage'

    if (root) {
      root.style.transform = 'translateY(72px)'
    }

    document.body.prepend(banner)

    return () => {
      document.title = previousTitle
      document.body.style.filter = ''
      if (root) {
        root.style.transform = ''
      }
      banner.remove()
    }
  }, [])

  return null
}

/**
 * AnimatedRoutes component handles route transitions with smooth animations
 * Uses AnimatePresence from framer-motion for page transition effects
 * Wraps routes in Suspense for lazy loading
 */
const AnimatedRoutesComponent = () => {
  const location = useLocation()

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
      }
    >
      <Routes location={location} key={location.pathname + location.search}>
        <Route path="/" element={<Home />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/tools/*" element={<Tools />} />
        <Route path="/nxchecker" element={<NXChecker />} />
        <Route path="/nxdevice" element={<NXDevice />} />
        <Route path="/ps5" element={<PS5 />} />
        <Route path="/nsp-forwarder" element={<NSPForwarder />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/nx-projects" element={<NXProjects />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

/**
 * Main App component that wraps the entire application
 * Provides internationalization context and routing setup
 * Includes error boundary and toast notifications for graceful error handling
 */
function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <I18nProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="min-h-screen bg-gray-900">
              <LocalXssPoc />
              <ReadingProgressBar />
              <ScrollToTop />
              <Navbar />
              <AnimatedRoutesComponent />
              <Footer />
              <InstallPWA />
              <UpdateNotification />
              <ScrollToTopButton
                threshold={200}
                position="bottom-right"
                size="md"
                showTooltip={true}
              />
            </div>
          </Router>
        </I18nProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
