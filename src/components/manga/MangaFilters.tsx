import React from 'react';
import { Search, ArrowUpDown, Grid, List, Calendar } from 'lucide-react';
import { SORT_OPTIONS } from '../../constants/manga';
import { useI18n } from '../../i18n/context';

interface MangaFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPublisher: string;
  setSelectedPublisher: (publisher: string) => void;
  publishers: string[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  setCurrentPage: (page: number) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const MangaFilters: React.FC<MangaFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedPublisher,
  setSelectedPublisher,
  publishers,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  setCurrentPage,
  viewMode,
  setViewMode,
  selectedDate,
  setSelectedDate,
}) => {
  const { t } = useI18n();

  return (
    <div className="mb-4 sm:mb-6 md:mb-8 space-y-3 sm:space-y-4">
      {/* Mobile View Mode Toggle */}
      <div className="sm:hidden flex justify-center gap-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg ${
            viewMode === 'grid'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800 text-gray-400'
          }`}
        >
          <Grid className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg ${
            viewMode === 'list'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800 text-gray-400'
          }`}
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
        {/* Search */}
        <div className="w-full sm:flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t('planning.filters.search')}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-gray-800 border border-blue-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Publisher Filter */}
        <div className="w-full sm:w-48 md:w-56">
          <select
            value={selectedPublisher}
            onChange={(e) => {
              setSelectedPublisher(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-gray-800 border border-blue-500/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">{t('planning.filters.publisher')}</option>
            {publishers.map(publisher => (
              <option key={publisher} value={publisher}>{publisher}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="w-full sm:w-48 md:w-56">
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-gray-800 border border-blue-500/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Sort */}
        <div className="w-full sm:w-48 md:w-56 flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-gray-800 border border-blue-500/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {t(`planning.filters.sort.${option.value}`)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="px-2.5 sm:px-3 py-2.5 sm:py-2 bg-gray-800 border border-blue-500/20 rounded-lg text-white hover:bg-gray-700"
          >
            <ArrowUpDown className={`w-5 h-5 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MangaFilters;