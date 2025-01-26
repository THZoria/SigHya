import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, AlertTriangle, Rocket, Timer } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useI18n } from '../i18n/context';

const NotFound = () => {
  const { t } = useI18n();
  const [countdown, setCountdown] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/');
    }
  }, [countdown, navigate]);

  const getCircleProgress = () => {
    return ((20 - countdown) / 20) * 100;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden px-4">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-12 sm:mb-12 flex items-center justify-center"
          >
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl" />
          </motion.div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-16">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Animated 404 Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{
                y: [-10, 10],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="relative mb-12 cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <Rocket className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 text-blue-400 transform -rotate-45" />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-blue-500/20 rounded-full filter blur-xl"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                    y: [0, -8, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-blue-400/10 rounded-full filter blur-xl"
                />
              </div>
            </motion.div>

            {/* Title and Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative"
            >
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-transparent bg-clip-text mb-4 sm:mb-6">
                404
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-blue-200 mb-8 sm:mb-12 max-w-2xl px-4"
            >
              {t('common.notFound.problem')}
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-8 sm:mb-12 flex items-center justify-center"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                <svg className="w-full h-full" viewBox="0 0 96 96">
                  {/* Cercle de fond */}
                  <circle
                    className="text-gray-800"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r="44"
                    cx="48"
                    cy="48"
                  />
                  {/* Cercle de progression */}
                  <motion.circle
                    className="text-blue-500"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r="44"
                    cx="48"
                    cy="48"
                    initial={{ pathLength: 0 }}
                    animate={{ 
                      pathLength: getCircleProgress() / 100,
                      transition: {
                        duration: 1,
                        ease: "linear"
                      }
                    }}
                    strokeDasharray="276.46"
                    strokeDashoffset="276.46"
                    strokeLinecap="round"
                    transform="rotate(-90 48 48)"
                  />
                </svg>
                {/* Conteneur de l'icône */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: [0.8, 1],
                      opacity: [0, 1]
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    className="relative"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [1, 0.8, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-blue-500/20 rounded-full blur-md"
                    />
                    <Timer className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-400 relative z-10" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/"
                className="group relative flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium overflow-hidden hover:scale-105 transition-transform duration-300 w-full sm:w-auto"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
                <span className="relative text-white flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  {t('common.notFound.returnHome')}
                </span>
              </Link>
            </motion.div>

            {/* Additional Info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8 sm:mt-8 text-sm sm:text-base text-blue-300 font-medium"
            >
              <motion.span
                key={countdown}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                {t('common.notFound.countdown').replace('{seconds}', countdown.toString())}
              </motion.span>
            </motion.p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;