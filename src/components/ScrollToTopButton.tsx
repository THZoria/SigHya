import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollToTopButtonProps {
  threshold?: number;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  threshold = 300,
  position = 'bottom-right',
  size = 'md',
  showTooltip = true
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getPositionClass = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-center':
        return 'bottom-6 left-1/2 transform -translate-x-1/2';
      default:
        return 'bottom-6 right-20';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'p-2';
      case 'lg':
        return 'p-4';
      default:
        return 'p-3';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={scrollToTop}
          className={`fixed z-50 bg-gray-800/90 hover:bg-gray-700/90 text-gray-300 hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 ${getPositionClass()} ${getSizeClass()}`}
          aria-label="Remonter en haut de la page"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronUp className={getIconSize()} />
          
          {/* Tooltip */}
          {showTooltip && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap pointer-events-none"
            >
              Remonter en haut
            </motion.div>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton; 