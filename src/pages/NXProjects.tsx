import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import NXProjectCard from '../components/nx/NXProjectCard';
import { useNXProjects } from '../hooks/useNXProjects';
import { useI18n } from '../i18n/context';

const NXProjects = () => {
  const { t } = useI18n();
  const { projects, loading, error } = useNXProjects();

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mb-4">
              {t('nxProjects.title')}
            </h1>
            <p className="text-xl text-blue-200/80 mb-6">
              {t('nxProjects.subtitle')}
            </p>
            
            {/* Warning Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-sm text-yellow-300 max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span>
                  {t('nxProjects.warning')}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-4" />
                <p className="text-blue-300">{t('common.loading')}</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <p className="text-red-400">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Projects Grid */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project, index) => (
                <NXProjectCard
                  key={project.name}
                  project={project}
                  index={index}
                />
              ))}
            </motion.div>
          )}

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 bg-gray-800/50 rounded-xl p-6 border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              {t('nxProjects.about.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h3 className="text-lg font-medium text-blue-400 mb-2">Atmosphere</h3>
                <p className="text-sm">
                  {t('nxProjects.about.atmosphere')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-400 mb-2">Hekate</h3>
                <p className="text-sm">
                  {t('nxProjects.about.hekate')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-400 mb-2">Lockpick_RCM</h3>
                <p className="text-sm">
                  {t('nxProjects.about.lockpick')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-400 mb-2">TegraExplorer</h3>
                <p className="text-sm">
                  {t('nxProjects.about.tegraExplorer')}
                </p>
              </div>
            </div>
          </motion.div>


        </div>
      </div>
    </PageTransition>
  );
};

export default NXProjects; 