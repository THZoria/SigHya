/**
 * Main application component
 * Sets up routing, internationalization, error boundaries, and global UI components
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NXChecker from './pages/NXChecker';
import NXDevice from './pages/NXDevice';
import PS5 from './pages/PS5';
import NSPForwarder from './pages/NSPForwarder';
import Tools from './pages/Tools';
import Legal from './pages/Legal';
import Roadmap from './pages/Roadmap';
import Partners from './pages/Partners';
import NotFound from './pages/NotFound';
import Planning from './pages/Planning';
import NXProjects from './pages/NXProjects';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import { I18nProvider } from './i18n/context';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';
import InstallPWA from './components/InstallPWA';
import UpdateNotification from './components/UpdateNotification';
import ReadingProgressBar from './components/ReadingProgressBar';
import ScrollToTopButton from './components/ScrollToTopButton';

/**
 * AnimatedRoutes component handles route transitions with smooth animations
 * Uses AnimatePresence from framer-motion for page transition effects
 */
const AnimatedRoutesComponent = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
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