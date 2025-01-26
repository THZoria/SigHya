import { useState, useEffect } from 'react';
import { Menu, Download } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n/context';
import MobileMenu from './MobileMenu';
import LanguageSelector from './LanguageSelector';
import { mainNavItems, secondaryNavItems } from './navigation';

const Navbar = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Gérer le scroll pour l'effet de fond
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-xl' : 'bg-transparent'
    }`}>
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex-shrink-0 group">
                <img 
                  className="h-16 w-auto transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" 
                  src="/logo.png" 
                  alt="SigHya" 
                />
              </Link>
            </motion.div>
            
            {/* Pages principales à gauche */}
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
                  >
                    <item.icon className={`w-4 h-4 ${
                      isActive(item.path) ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                    }`} />
                    {t(`nav.${item.key}`)}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pages secondaires et bouton de téléchargement à droite */}
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
                  <item.icon className={`w-4 h-4 ${
                    isActive(item.path) ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                  }`} />
                  {t(`nav.${item.key}`)}
                </Link>
              </motion.div>
            ))}
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://pack.sighya.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 px-6 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2.5 shadow-lg shadow-blue-500/20 border border-blue-400/20"
            >
              <Download className="w-5 h-5" />
              AtmoPack
            </motion.a>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-blue-500/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-300"
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Menu mobile component */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  );
};

export default Navbar;