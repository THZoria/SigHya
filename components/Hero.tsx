import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap as ZapIcon } from 'lucide-react';
import { useI18n } from '../i18n/context';

const Hero = () => {
  const { t } = useI18n();

  return (
    <div className="relative min-h-[100vh] flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center flex flex-col items-center"
        >
          <div className="flex flex-col items-center space-y-8">
            <motion.img
              src="/logo.png"
              alt="SigHya"
              className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />

            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight"
            >
              <span className="block bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-transparent bg-clip-text animate-pulse text-[90%] leading-tight">
                {t('home.hero.title')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mx-auto text-xl text-blue-100 leading-relaxed"
            >
              {t('home.hero.subtitle')}
            </motion.p>
          </div>

          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://discord.sighya.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group transition-all duration-300"
              >
                <span>{t('home.hero.joinDiscord')}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/nxchecker"
                className="w-full sm:w-auto px-10 py-4 bg-gray-800/50 text-blue-300 font-medium rounded-xl border-2 border-blue-500/20 hover:border-blue-500/40 flex items-center justify-center gap-2 group transition-all duration-300"
              >
                <span>{t('home.hero.checkSwitch')}</span>
                <ZapIcon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};

export default Hero;