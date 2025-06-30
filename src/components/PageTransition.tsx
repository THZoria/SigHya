import React from 'react';
import { motion } from 'framer-motion';

/**
 * Props interface for PageTransition component
 */
interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition component provides smooth animations for page transitions
 * Uses Framer Motion to create fade-in/fade-out effects with subtle scaling
 * 
 * @param children - React nodes to be wrapped with transition animations
 * @returns Motion div with transition effects applied to children
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  // Animation variants for different states (initial, animate, exit)
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98
    }
  };

  // Transition configuration for smooth animations
  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;