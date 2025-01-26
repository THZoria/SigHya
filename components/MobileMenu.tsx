import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { useI18n } from '../i18n/context';
import { mainNavItems, secondaryNavItems } from './navigation';
import LanguageSelector from './LanguageSelector';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Menu Panel */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-blue-500/10 shadow-xl z-50 max-h-[85vh] overflow-y-auto"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <Link to="/" onClick={onClose} className="flex items-center space-x-3">
                  <img src="/logo.png" alt="SigHya" className="h-12 w-auto" />
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-3">
                <div className="pb-4 mb-4 border-b border-gray-800">
                  <div className="px-4 py-3 mb-4">
                    <LanguageSelector />
                  </div>
                  {mainNavItems.map((item) => (
                    <motion.div key={item.path} variants={itemVariants}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                          isActive(item.path)
                            ? 'text-blue-400 bg-blue-500/15 shadow-lg shadow-blue-500/20 border border-blue-500/20'
                            : 'text-gray-100 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {t(`nav.${item.key}`)}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="pb-4">
                  {secondaryNavItems.map((item) => (
                    <motion.div key={item.path} variants={itemVariants}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                          isActive(item.path)
                            ? 'text-blue-400 bg-blue-500/15 shadow-lg shadow-blue-500/20 border border-blue-500/20'
                            : 'text-gray-100 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {t(`nav.${item.key}`)}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Download Button */}
                <motion.div variants={itemVariants}>
                  <a
                    href="https://pack.sighya.fr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 border border-blue-400/20"
                    onClick={onClose}
                  >
                    <Download className="w-5 h-5" />
                    Télécharger AtmoPack
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;