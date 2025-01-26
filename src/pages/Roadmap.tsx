import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Rocket, RefreshCw, Server, Calendar } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useI18n } from '../i18n/context';

const Roadmap = () => {
  const { t } = useI18n();
  const { scrollY } = useScroll();

  const backgroundY = useTransform(scrollY, [0, 1000], ['0%', '50%']);
  const backgroundOpacity = useTransform(scrollY, [0, 300], [0.03, 0.05]);

  const projects = [
    {
      icon: RefreshCw,
      title: t('roadmap.projects.website.title'),
      description: t('roadmap.projects.website.description'),
      timeline: "Q1 2025",
      status: t('roadmap.projects.website.status')
    },
    {
      icon: Server,
      title: t('roadmap.projects.infrastructure.title'),
      description: t('roadmap.projects.infrastructure.description'),
      timeline: "Q2 2025",
      status: t('roadmap.projects.infrastructure.status')
    },
    {
      icon: Rocket,
      title: t('roadmap.projects.lanplay.title'),
      description: t('roadmap.projects.lanplay.description'),
      timeline: "Q3 2025",
      status: t('roadmap.projects.lanplay.status')
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-32 pb-16 relative overflow-hidden px-4 sm:px-6">
        <motion.div 
          className="absolute inset-0 bg-grid-pattern"
          style={{ 
            opacity: backgroundOpacity,
            y: backgroundY
          }}
        />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut"
            }}
            className="text-center mb-10 sm:mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mb-4 sm:mb-6">
              {t('roadmap.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              {t('roadmap.description')}
            </p>
          </motion.div>

          <div className="relative">
            <motion.div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500/20 rounded-full" />
            
            <div className="space-y-8 sm:space-y-16">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, x: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: index * 0.15,
                    type: "spring",
                    bounce: 0.3
                  }}
                  onTap={() => setSelectedProject(selectedProject === index ? null : index)}
                  className={`relative flex ${
                    index % 2 === 0 
                      ? 'sm:justify-start justify-center' 
                      : 'sm:justify-end justify-center'
                  }`}
                >
                  <div className="w-full sm:w-[calc(50%-2rem)] relative">
                    <div className={`hidden sm:flex absolute top-0 ${
                      index % 2 === 0 ? '-right-12' : '-left-12'
                    } w-12 h-12 items-center justify-center`}>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                    </div>
                    <motion.div 
                      className="bg-gray-800/80 backdrop-blur-sm p-5 sm:p-6 lg:p-8 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 shadow-xl group"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut"
                      }}
                    > 
                      <div className="flex items-center gap-3 sm:gap-4 mb-4">
                        <div className="p-2.5 sm:p-3 bg-blue-500/10 rounded-lg">
                          <project.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-white">
                            {project.title}
                          </h3>
                          <motion.div
                            className="flex items-center gap-2 mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              delay: 0.3,
                              duration: 0.3
                            }}
                          >
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                            <span className="text-xs sm:text-sm text-blue-300">{project.timeline}</span>
                          </motion.div>
                        </div>
                      </div>

                      <motion.p 
                        className="text-sm sm:text-base text-gray-300 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          delay: 0.4,
                          duration: 0.3
                        }}>
                          {project.description}
                      </motion.p>
                      
                      <motion.div 
                        className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-500/10 text-blue-400"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                          duration: 0.3
                        }} 
                      >
                        {project.status}
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Roadmap;