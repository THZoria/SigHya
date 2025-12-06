import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const menuVariants = {
    closed: {
      y: '-100%',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    },
    open: {
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: 0.2
      }
    },
    open: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-40"
          />

          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-gray-900/98 backdrop-blur-xl z-50 flex flex-col"
            style={{
              height: '100dvh',
              maxHeight: '100dvh',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div 
              className="flex-shrink-0"
              style={{
                paddingTop: 'env(safe-area-inset-top, 0px)'
              }}
            />
            
            <div 
              className="flex-1 flex flex-col overflow-y-auto overscroll-contain min-h-0"
              style={{
                paddingBottom: 'env(safe-area-inset-bottom, 0px)'
              }}
            >
              <motion.div 
                variants={itemVariants}
                className="flex-shrink-0 flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-800/50"
              >
                <Link 
                  to="/" 
                  onClick={onClose} 
                  className="flex items-center space-x-3 active:opacity-70 transition-opacity"
                >
                  <img src="/logo.png" alt="SigHya" className="h-10 w-auto" />
                </Link>
                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 -mr-2 rounded-full text-gray-400 active:bg-gray-800/50 active:text-white transition-colors touch-manipulation"
                  aria-label={t('common.closeMenu')}
                >
                  <X className="w-6 h-5" />
                </motion.button>
              </motion.div>

              <div className="flex-shrink-0 px-2 py-2">
                {mainNavItems.map((item, index) => (
                  <motion.div 
                    key={item.path} 
                    variants={itemVariants}
                    custom={index}
                  >
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className="mx-2 my-1"
                    >
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 touch-manipulation ${
                          isActive(item.path)
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'text-gray-100 active:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={`w-5 h-5 flex-shrink-0 ${
                            isActive(item.path) ? 'text-blue-400' : 'text-gray-400'
                          }`} />
                          <span>{t(`nav.${item.key}`)}</span>
                        </div>
                        {isActive(item.path) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-blue-400"
                          />
                        )}
                      </Link>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <div className="h-px bg-gray-800/50 mx-4 my-2" />

              <div className="flex-shrink-0 px-2 py-2">
                {secondaryNavItems.map((item, index) => (
                  <motion.div 
                    key={item.path} 
                    variants={itemVariants}
                    custom={index + mainNavItems.length}
                  >
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className="mx-2 my-1"
                    >
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 touch-manipulation ${
                          isActive(item.path)
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'text-gray-100 active:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={`w-5 h-5 flex-shrink-0 ${
                            isActive(item.path) ? 'text-blue-400' : 'text-gray-400'
                          }`} />
                          <span>{t(`nav.${item.key}`)}</span>
                        </div>
                        {isActive(item.path) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-blue-400"
                          />
                        )}
                      </Link>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <div className="h-px bg-gray-800/50 mx-4 my-2" />

              <motion.div 
                variants={itemVariants}
                className="flex-shrink-0 px-4 py-2"
              >
                <motion.a
                  href="https://pack.sighya.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white active:from-blue-600 active:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 touch-manipulation"
                >
                  <Download className="w-5 h-5" />
                  <span>{t('common.downloadAtmoPack')}</span>
                </motion.a>
              </motion.div>

              <div className="h-px bg-gray-800/50 mx-4 my-3" />

              <div className="flex-1 min-h-[1rem]" />

              <motion.div 
                variants={itemVariants}
                className="flex-shrink-0 px-4 py-3"
              >
                <LanguageSelector variant="mobile" />
              </motion.div>

              <div 
                className="flex-shrink-0"
                style={{
                  height: 'max(1rem, env(safe-area-inset-bottom, 0px))'
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;