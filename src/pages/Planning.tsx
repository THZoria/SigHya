/**
 * Manga Planning page
 * Displays upcoming manga releases with filtering, sorting, and calendar integration
 * Data is fetched from Nautiljon with fallback to local JSON
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import MangaCard from '../components/manga/MangaCard';
import MangaFilters from '../components/manga/MangaFilters';
import MangaPagination from '../components/manga/MangaPagination';
import { useMangaPlanning } from '../hooks/useMangaPlanning';
import { useI18n } from '../i18n/context';
import { generateICS, getICSFilename } from '../utils/icsGenerator';
import { ITEMS_PER_PAGE } from '../constants/manga';

const Planning = () => {
  const { t } = useI18n();
  const { mangas, loading, error } = useMangaPlanning();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPublisher, setSelectedPublisher] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('all');

  const publishers = [...new Set(mangas.map(manga => manga.editeur).filter(Boolean))];

  const today = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const getWeekDates = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return {
      start: startOfWeek,
      end: endOfWeek
    };
  };

  const isDateInCurrentWeek = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const week = getWeekDates();
    return date >= week.start && date <= week.end;
  };

  const filteredMangas = mangas
    .filter(manga => {
      const matchesSearch = manga.nom_manga.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPublisher = !selectedPublisher || manga.editeur === selectedPublisher;
      
      let matchesDate = true;
      if (selectedDate) {
        const [year, month, day] = selectedDate.split('-');
        const formattedSelectedDate = `${day}/${month}/${year}`;
        matchesDate = manga.date_sortie === formattedSelectedDate;
      }

      let matchesTimeFilter = true;
      switch (timeFilter) {
        case 'today':
          matchesTimeFilter = manga.date_sortie === today;
          break;
        case 'week':
          matchesTimeFilter = isDateInCurrentWeek(manga.date_sortie);
          break;
        default:
          matchesTimeFilter = true;
      }
      
      return matchesSearch && matchesPublisher && matchesTimeFilter && matchesDate;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date_sortie.split('/').reverse().join('-')).getTime() -
                      new Date(b.date_sortie.split('/').reverse().join('-')).getTime();
          break;
        case 'price':
          comparison = parseFloat(a.prix) - parseFloat(b.prix);
          break;
        case 'name':
          comparison = a.nom_manga.localeCompare(b.nom_manga);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredMangas.length / ITEMS_PER_PAGE);
  const paginatedMangas = filteredMangas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const downloadICS = () => {
    const icsContent = generateICS(mangas);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const filename = 'planning_manga.ics';
    
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-12 md:pb-16 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-8 md:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mb-2 sm:mb-3 md:mb-4 pb-2.5">
              {t('planning.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-200/80 mb-4 sm:mb-6 md:mb-8">
              {t('planning.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4">
              <motion.button
                onClick={downloadICS}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-blue-500 text-white rounded-lg sm:rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all duration-300"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {t('planning.actions.downloadCalendar')}
              </motion.button>

              <motion.button
                onClick={() => {
                  setTimeFilter(timeFilter === 'today' ? 'all' : 'today');
                  setCurrentPage(1);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl font-medium shadow-lg transition-all duration-300 ${
                  timeFilter === 'today'
                    ? 'bg-blue-500 text-white shadow-blue-500/20 hover:bg-blue-600'
                    : 'bg-gray-800 text-blue-400 shadow-gray-900/20 hover:bg-gray-700'
                }`}
              >
                <Calendar className="w-5 h-5 mr-2" />
                {timeFilter === 'today' ? t('planning.actions.showAll') : t('planning.actions.todayReleases')}
              </motion.button>

              <motion.button
                onClick={() => {
                  setTimeFilter(timeFilter === 'week' ? 'all' : 'week');
                  setCurrentPage(1);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl font-medium shadow-lg transition-all duration-300 ${
                  timeFilter === 'week'
                    ? 'bg-blue-500 text-white shadow-blue-500/20 hover:bg-blue-600'
                    : 'bg-gray-800 text-blue-400 shadow-gray-900/20 hover:bg-gray-700'
                }`}
              >
                <Calendar className="w-5 h-5 mr-2" />
                {timeFilter === 'week' ? t('planning.actions.showAll') : t('planning.actions.weekReleases')}
              </motion.button>
            </div>
          </motion.div>

          {/* Filters */}
          <MangaFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedPublisher={selectedPublisher}
            setSelectedPublisher={setSelectedPublisher}
            publishers={publishers}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            setCurrentPage={setCurrentPage}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
                <p className="text-blue-300">{t('planning.loading')}</p>
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
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400">{t('planning.error')}</p>
              </div>
            </motion.div>
          )}

          {/* Manga Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
            layout
          >
            <AnimatePresence mode="wait">
              {paginatedMangas.map((manga, index) => (
                <MangaCard
                  key={`${manga.id}-${manga.nom_manga}-${index}`}
                  manga={manga}
                  index={index}
                  viewMode={viewMode}
                />
              ))}
            </AnimatePresence>
          </motion.div>
          
          {/* Empty State */}
          {!loading && paginatedMangas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">{t('planning.empty')}</p>
            </div>
          )}

          {/* Results Count */}
          {filteredMangas.length > 0 && (
            <div className="mt-4 text-center text-gray-400">
              {filteredMangas.length} {t(`planning.filters.${filteredMangas.length === 1 ? 'results' : 'results_plural'}`)}
            </div>
          )}
          
          {/* Pagination */}
          <MangaPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default Planning;