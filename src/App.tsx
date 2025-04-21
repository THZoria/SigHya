import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NXChecker from './pages/NXChecker';
import NXDevice from './pages/NXDevice';
import PS5 from './pages/PS5';
import Tools from './pages/Tools';
import Legal from './pages/Legal';
import Roadmap from './pages/Roadmap';
import Partners from './pages/Partners';
import NotFound from './pages/NotFound';
import Planning from './pages/Planning';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import { I18nProvider } from './i18n/context';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Use the full pathname as the key to ensure uniqueness
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname + location.search}>
        <Route path="/" element={<Home />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/tools/*" element={<Tools />} />
        <Route path="/nxchecker" element={<NXChecker />} />
        <Route path="/nxdevice" element={<NXDevice />} />
        <Route path="/ps5" element={<PS5 />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <I18nProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <ScrollToTop />
          <Navbar />
          <AnimatedRoutes />
          <Footer />
        </div>
      </Router>
    </I18nProvider>
  );
}

export default App;