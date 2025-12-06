/**
 * Main application component
 * Sets up routing, internationalization, error boundaries, and global UI components
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import { I18nProvider } from './i18n/context';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';
import InstallPWA from './components/InstallPWA';
import UpdateNotification from './components/UpdateNotification';
import ReadingProgressBar from './components/ReadingProgressBar';
import ScrollToTopButton from './components/ScrollToTopButton';
import { SkeletonCard } from './components/ui/Skeleton';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const NXChecker = lazy(() => import('./pages/NXChecker'));
const NXDevice = lazy(() => import('./pages/NXDevice'));
const PS5 = lazy(() => import('./pages/PS5'));
const NSPForwarder = lazy(() => import('./pages/NSPForwarder'));
const Tools = lazy(() => import('./pages/Tools'));
const Legal = lazy(() => import('./pages/Legal'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Partners = lazy(() => import('./pages/Partners'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Planning = lazy(() => import('./pages/Planning'));
const NXProjects = lazy(() => import('./pages/NXProjects'));

/**
 * Loading fallback component for lazy-loaded pages
 */
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-32 pb-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  </div>
);

/**
 * AnimatedRoutes component handles route transitions with smooth animations
 * Uses AnimatePresence from framer-motion for page transition effects
 * Wraps routes in Suspense for lazy loading
 */
const AnimatedRoutesComponent = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoadingFallback />}>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

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
          <Router>
            <div className="min-h-screen bg-gray-900">
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
  );
}

export default App;