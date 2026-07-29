/**
 * Manga Planning page
 * Displays upcoming manga releases with filtering, sorting, and calendar integration
 * Data is fetched from Nautiljon with fallback to local JSON
 */

import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Calendar } from 'lucide-react'
import { useState } from 'react'
import MangaCard from '../components/manga/MangaCard'
import MangaFilters from '../components/manga/MangaFilters'
import MangaPagination from '../components/manga/MangaPagination'
import PageTransition from '../components/PageTransition'
import { SkeletonCard } from '../components/ui/Skeleton'
import { ITEMS_PER_PAGE } from '../constants/manga'
import { useMangaPlanning } from '../hooks/useMangaPlanning'
import { useI18n } from '../i18n/context'
import { generateICS } from '../utils/icsGenerator'
import {
  doesMangaMatchIsoDate,
  getMangaSortTime,
  isMangaInDateWindow,
  parseEuroPrice,
} from '../utils/mangaDates'

const Planning = () => {
  const { t } = useI18n()
  const { mangas, loading, error } = useMangaPlanning()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedDate, setSelectedDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPublisher, setSelectedPublisher] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('all')

  const publishers = [...new Set(mangas.map((manga) => manga.editeur).filter(Boolean))]

  const getWeekDates = () => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    return {
      start: startOfWeek,
      end: endOfWeek,
    }
  }

  const isDateInCurrentWeek = (dateStr: string) => {
    const week = getWeekDates()
    const weekEndExclusive = new Date(
      week.end.getFullYear(),
      week.end.getMonth(),
      week.end.getDate() + 1,
    )
    return isMangaInDateWindow(
      {
        id: '',
        nom_manga: '',
        date_sortie: dateStr,
        prix: '',
        editeur: null,
        lien_acheter: null,
        image: '',
      },
      week.start,
      weekEndExclusive,
    )
  }

  const filteredMangas = mangas
    .filter((manga) => {
      const matchesSearch = manga.nom_manga.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPublisher = !selectedPublisher || manga.editeur === selectedPublisher

      let matchesDate = true
      if (selectedDate) {
        matchesDate = doesMangaMatchIsoDate(manga, selectedDate)
      }

      let matchesTimeFilter = true
      switch (timeFilter) {
        case 'today':
          matchesTimeFilter = doesMangaMatchIsoDate(manga, new Date().toISOString().slice(0, 10))
          break
        case 'week':
          matchesTimeFilter = isDateInCurrentWeek(manga.date_sortie)
          break
        default:
          matchesTimeFilter = true
      }

      return matchesSearch && matchesPublisher && matchesTimeFilter && matchesDate
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'date':
          comparison = getMangaSortTime(a.date_sortie) - getMangaSortTime(b.date_sortie)
          break
        case 'price':
          comparison = parseEuroPrice(a.prix) - parseEuroPrice(b.prix)
          break
        case 'name':
          comparison = a.nom_manga.localeCompare(b.nom_manga)
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

  const totalPages = Math.ceil(filteredMangas.length / ITEMS_PER_PAGE)
  const paginatedMangas = filteredMangas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const downloadICS = () => {
    const icsContent = generateICS(mangas)
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const filename = 'planning_manga.ics'

    const link = document.createElement('a')
    const url = window.URL.createObjectURL(blob)
    link.href = url
    link.setAttribute('download', filename)
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()

    // Clean up
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

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
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-blue-500 text-white rounded-lg sm:rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-600 hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.4)] transition-all duration-500"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {t('planning.actions.downloadCalendar')}
              </motion.button>

              <motion.button
                onClick={() => {
                  setTimeFilter(timeFilter === 'today' ? 'all' : 'today')
                  setCurrentPage(1)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl font-medium shadow-lg transition-all duration-500 ${
                  timeFilter === 'today'
                    ? 'bg-blue-500 text-white shadow-blue-500/30 hover:bg-blue-600 hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.4)]'
                    : 'bg-gray-800 text-blue-400 shadow-gray-900/20 hover:bg-gray-700 hover:border-blue-500/30 border border-gray-700/50'
                }`}
              >
                <Calendar className="w-5 h-5 mr-2" />
                {timeFilter === 'today'
                  ? t('planning.actions.showAll')
                  : t('planning.actions.todayReleases')}
                {timeFilter === 'today' && (
                  <span className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </motion.button>

              <motion.button
                onClick={() => {
                  setTimeFilter(timeFilter === 'week' ? 'all' : 'week')
                  setCurrentPage(1)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl font-medium shadow-lg transition-all duration-500 ${
                  timeFilter === 'week'
                    ? 'bg-blue-500 text-white shadow-blue-500/30 hover:bg-blue-600 hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.4)]'
                    : 'bg-gray-800 text-blue-400 shadow-gray-900/20 hover:bg-gray-700 hover:border-blue-500/30 border border-gray-700/50'
                }`}
              >
                <Calendar className="w-5 h-5 mr-2" />
                {timeFilter === 'week'
                  ? t('planning.actions.showAll')
                  : t('planning.actions.weekReleases')}
                {timeFilter === 'week' && (
                  <span className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
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
            <AnimatePresence mode="popLayout">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center p-4 bg-gray-800/50 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
              {timeFilter === 'today' ? (
                <>
                  <p className="text-gray-400 text-lg mb-2">
                    {t('planning.emptyToday') || 'Aucune sortie prévue pour aujourd\'hui'}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    {filteredMangas.length === 0
                      ? t('planning.emptyTodayHint') || 'Vous pouvez consulter les prochaines sorties en désactivant le filtre'
                      : ''}
                  </p>
                </>
              ) : timeFilter === 'week' ? (
                <>
                  <p className="text-gray-400 text-lg mb-2">
                    {t('planning.emptyWeek') || 'Aucune sortie prévue cette semaine'}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    {t('planning.emptyWeekHint') || 'Revenez plus tard ou consultez tout le planning'}
                  </p>
                </>
              ) : (
                <p className="text-gray-400 text-lg">{t('planning.empty')}</p>
              )}
              {(timeFilter !== 'all' || selectedDate || selectedPublisher || searchTerm) && (
                <motion.button
                  onClick={() => {
                    setTimeFilter('all')
                    setSelectedDate('')
                    setSelectedPublisher('')
                    setSearchTerm('')
                    setCurrentPage(1)
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-6 py-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-500"
                >
                  {t('planning.filters.clearAllFilters') || 'Effacer tous les filtres'}
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Results Count */}
          {filteredMangas.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full text-sm text-gray-400 border border-gray-700/50">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                {filteredMangas.length}{' '}
                {t(`planning.filters.${filteredMangas.length === 1 ? 'results' : 'results_plural'}`)}
                {timeFilter !== 'all' && (
                  <span className="text-blue-400">
                    — {timeFilter === 'today'
                      ? (t('planning.actions.todayReleases') || 'Sorties du jour')
                      : (t('planning.actions.weekReleases') || 'Sorties de la semaine')}
                  </span>
                )}
              </span>
            </motion.div>
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
  )
}

export default Planning
