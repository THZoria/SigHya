import { useState, useEffect } from 'react';
import { Menu, Download } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useI18n } from '../i18n/context';
import MobileMenu from './MobileMenu';
import LanguageSelector from './LanguageSelector';
import { mainNavItems, secondaryNavItems } from './navigation';

/**
 * Main navigation bar component
 * Handles responsive navigation with mobile menu and scroll effects
 */
const Navbar = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const isLargeScreen = useMediaQuery('(min-width: 1536px)');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-xl' : 'bg-transparent'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      role="navigation"
      aria-label={t('nav.ariaLabel')}
    >
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and main navigation items */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex-shrink-0 group" aria-label={t('nav.homeAria')}>
              <motion.img 
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                className="h-16 w-auto" 
                src="/logo.png" 
                alt="SigHya - Logo" 
              />
            </Link>
            
            {/* Main navigation items on the left */}
            <div className="hidden md:flex md:space-x-2">
              {mainNavItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`px-5 py-3 rounded-xl text-base font-medium transition-all duration-300 flex items-center gap-2.5 group ${
                      isActive(item.path)
                        ? 'text-blue-400 bg-blue-500/15 shadow-lg shadow-blue-500/20 border border-blue-500/20'
                        : 'text-gray-100 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent'
                    }`}
                    aria-label={t(`nav.${item.key}`)}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    <item.icon className={`w-4 h-4 ${!isLargeScreen ? 'md:w-5 md:h-5' : ''} ${
                      isActive(item.path) ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                    }`} aria-hidden="true" />
                    {isLargeScreen && <span>{t(`nav.${item.key}`)}</span>}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Secondary navigation items and download button on the right */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <LanguageSelector />
            {secondaryNavItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`px-5 py-3 rounded-xl text-base font-medium transition-all duration-300 flex items-center gap-2.5 group ${
                    isActive(item.path)
                      ? 'text-blue-400 bg-blue-500/15 shadow-lg shadow-blue-500/20 border border-blue-500/20'
                      : 'text-gray-100 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${!isLargeScreen ? 'md:w-5 md:h-5' : ''} ${
                    isActive(item.path) ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                  }`} />
                  {isLargeScreen && <span>{t(`nav.${item.key}`)}</span>}
                </Link>
              </motion.div>
            ))}
            
            {/* Download button for AtmoPack */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://pack.sighya.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 px-6 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2.5 shadow-lg shadow-blue-500/20 border border-blue-400/20"
              aria-label={t('common.downloadAtmoPackAria')}
            >
              <Download className="w-5 h-5" aria-hidden="true" />
              {isLargeScreen && <span>AtmoPack</span>}
            </motion.a>
          </div>

          {/* Mobile menu toggle button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-blue-500/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-300"
              aria-label={isOpen ? t('common.closeMenu') : t('common.openMenu')}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu component */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  );
};

export default Navbar;