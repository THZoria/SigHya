import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import NXProjectCard from '../components/nx/NXProjectCard';
import { useNXProjects } from '../hooks/useNXProjects';
import { useI18n } from '../i18n/context';

const NXProjects = () => {
  const { t } = useI18n();
  const { 
    projects, 
    loading, 
    error, 
    searchTerm, 
    setSearchTerm, 
    totalProjects,
    selectedLanguage,
    setSelectedLanguage,
    selectedFirmware,
    setSelectedFirmware,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    languages,
    firmwareVersions
  } = useNXProjects();

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('');
    setSelectedFirmware('');
  };

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
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mb-8"
          >
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('nxProjects.filters.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
              {/* Language Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50"
                >
                  <option value="">{t('nxProjects.filters.allLanguages')}</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Firmware Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedFirmware}
                  onChange={(e) => setSelectedFirmware(e.target.value)}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50"
                >
                  <option value="">{t('nxProjects.filters.allFirmware')}</option>
                  {firmwareVersions.map(fw => (
                    <option key={fw} value={fw}>{fw}</option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50"
                >
                  <option value="stars">{t('nxProjects.sort.stars')}</option>
                  <option value="forks">{t('nxProjects.sort.forks')}</option>
                  <option value="name">{t('nxProjects.sort.name')}</option>
                  <option value="author">{t('nxProjects.sort.author')}</option>
                  <option value="latestReleaseDate">{t('nxProjects.sort.latestRelease')}</option>
                  <option value="lastUpdated">{t('nxProjects.sort.lastUpdated')}</option>
                </select>
                <button
                  onClick={toggleSortDirection}
                  className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-blue-500/50 transition-colors duration-200"
                >
                  {sortDirection === 'asc' ? (
                    <SortAsc className="w-4 h-4 text-gray-400" />
                  ) : (
                    <SortDesc className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedLanguage || selectedFirmware) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 text-sm hover:bg-gray-600/50 transition-colors duration-200"
                >
                  {t('nxProjects.filters.clearFilters')}
                </button>
              )}
            </div>

            {/* Results Counter */}
            {(searchTerm || selectedLanguage || selectedFirmware) && (
              <div className="text-center text-sm text-gray-400">
                {t('nxProjects.filters.showingResults').replace('{count}', projects.length.toString()).replace('{total}', totalProjects.toString())}
              </div>
            )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <NXProjectCard
                  key={project.name}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && projects.length === 0 && (searchTerm || selectedLanguage || selectedFirmware) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400 text-lg">{t('nxProjects.filters.noResults')}</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                {t('nxProjects.filters.clearAllFilters')}
              </button>
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