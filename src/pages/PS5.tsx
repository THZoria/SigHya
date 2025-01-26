import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  AlertCircle, 
  Terminal, 
  ChevronsLeft, 
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useI18n } from '../i18n/context';

interface ErrorCode {
  ID: string;
  Message: string;
  Status: number;
  Priority: number;
}

const ITEMS_PER_PAGE = 5;

const PS5 = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorCodes, setErrorCodes] = useState<ErrorCode[]>([]);
  const [filteredResults, setFilteredResults] = useState<ErrorCode[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [cacheTimestamp, setCacheTimestamp] = useState<number | null>(null);
  const CACHE_KEY = 'ps5-error-codes';
  const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
  const searchTimeoutRef = useRef<number>();

  // Filter results when query changes
  const filterResults = useCallback((searchQuery: string, codes: ErrorCode[] = errorCodes) => {
    const filtered = codes.filter(error => 
      error.ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      error.Message.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [errorCodes]);

  // Get query parameters
  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Update URL with search params
  const updateUrlParams = (newSearchTerm: string, page: number) => {
    const params = new URLSearchParams(searchParams);
    if (newSearchTerm) params.set('q', newSearchTerm);
    if (page > 1) params.set('page', page.toString());
    setSearchParams(params, { replace: true });
  };

  // Sync search term with URL query
  useEffect(() => {
    if (query !== searchTerm) {
      setSearchTerm(query);
      if (errorCodes.length > 0) {
        filterResults(query);
      }
    }
  }, [query, errorCodes, filterResults]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Fetch error codes on mount
  useEffect(() => {
    const fetchErrorCodes = async () => {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setCacheTimestamp(timestamp);
            setErrorCodes(data.PlayStation5.ErrorCodes);
            setIsInitialized(true);
            setLoading(false);
            filterResults(query, data.PlayStation5.ErrorCodes);
            return;
          }
        } catch (error) {
          console.error('Error parsing cached data:', error);
        }
      }

      try {
        const response = await fetch('https://raw.githubusercontent.com/amoamare/Console-Service-Tool/master/Resources/ErrorCodes.json');
        const data = await response.json();
        if (!response.ok) throw new Error('Failed to fetch error codes');
        
        if (data?.PlayStation5?.ErrorCodes) {
          const timestamp = Date.now();
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp }));
          setCacheTimestamp(timestamp);
          setErrorCodes(data.PlayStation5.ErrorCodes);
          filterResults(query, data.PlayStation5.ErrorCodes);
          setIsInitialized(true);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (error) {
        console.error('Error fetching error codes:', error);
        setError('Erreur lors du chargement des codes d\'erreur. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    if (shouldFetch) {
      setShouldFetch(false);
      fetchErrorCodes();
    }
  }, [shouldFetch, query, filterResults]);

  // Handle search input
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterResults(value);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout to update URL params after user stops typing
    searchTimeoutRef.current = window.setTimeout(() => {
      updateUrlParams(value, 1);
    }, 500);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    updateUrlParams(searchTerm, page);
  };

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots: (number | string)[] = [];
    let lastNumber;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (lastNumber) {
        if (i - lastNumber === 2) {
          rangeWithDots.push(lastNumber + 1);
        } else if (i - lastNumber !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      lastNumber = i;
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  // Get status information
  const getStatusInfo = (_status: number, priority: number) => {
    const baseClasses = {
      3: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        text: 'text-red-400',
        label: 'critical'
      },
      2: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        text: 'text-orange-400',
        label: 'high'
      },
      1: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        text: 'text-yellow-400',
        label: 'medium'
      },
      0: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        text: 'text-blue-400',
        label: 'low'
      }
    };

    return baseClasses[priority as keyof typeof baseClasses] || baseClasses[0];
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-32 pb-16 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mb-4">{t('ps5.title')}</h1>
            <p className="text-xl text-blue-200/80">
              {t('ps5.subtitle')}
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-500/20 mb-8"
          >
            <div className="flex items-start space-x-4 mb-6">
              <Terminal className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-white mb-2">{t('ps5.search.title')}</h3>
                <p className="text-gray-300">
                  {t('ps5.search.description')}
                </p>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t('ps5.search.placeholder')}
                className="w-full px-5 py-4 bg-gray-900/50 border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400">{t('ps5.results.error')}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                  <span className="text-blue-300">{t('ps5.results.loading')}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          {!loading && query && (
            <motion.div
              initial={false}
            >
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-gray-300">
                  {filteredResults.length} {t(`ps5.results.${filteredResults.length === 1 ? 'found' : 'found_plural'}`)}
                </div>
                {totalPages > 1 && (
                  <div className="text-gray-400 text-sm">
                    {t('ps5.results.page')} {currentPage} {t('ps5.results.of')} {totalPages}
                  </div>
                )}
              </div>

              {/* Results List */}
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {paginatedResults.length > 0 ? (
                    paginatedResults.map((result, index) => {
                      const statusInfo = getStatusInfo(result.Status, result.Priority);
                      return (
                        <div
                          key={result.ID}
                          className={`bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border ${statusInfo.border} hover:scale-[1.01] transition-transform duration-200`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg ${statusInfo.bg}`}>
                              {result.Priority === 3 ? (
                                <XCircle className={statusInfo.text} />
                              ) : result.Priority === 2 ? (
                                <AlertTriangle className={statusInfo.text} />
                              ) : result.Priority === 1 ? (
                                <AlertCircle className={statusInfo.text} />
                              ) : (
                                <Info className={statusInfo.text} />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <h3 className="text-xl font-semibold text-white mb-2">
                                  {result.ID}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.bg} ${statusInfo.text}`}>
                                  {t(`ps5.results.priority.${statusInfo.label.toLowerCase()}`)}
                                </span>
                              </div>
                              <p className="text-gray-300">{result.Message}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-center py-8"
                    >
                      <p className="text-gray-400">{t('ps5.results.noResults').replace('{query}', query)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        currentPage === 1
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-blue-500/20'
                      }`}
                    >
                      <ChevronsLeft className="w-5 h-5 text-blue-400" />
                    </button>
                    
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        currentPage === 1
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-blue-500/20'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5 text-blue-400" />
                    </button>

                    <div className="flex items-center space-x-1">
                      {pageNumbers.map((page, index) => (
                        <React.Fragment key={index}>
                          {page === '...' ? (
                            <span className="px-2 text-gray-500">•••</span>
                          ) : (
                            <button
                              onClick={() => handlePageChange(page as number)}
                              className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                                currentPage === page
                                  ? 'bg-blue-500 text-white'
                                  : 'text-blue-400 hover:bg-blue-500/20'
                              }`}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        currentPage === totalPages
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-blue-500/20'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5 text-blue-400" />
                    </button>

                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        currentPage === totalPages
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-blue-500/20'
                      }`}
                    >
                      <ChevronsRight className="w-5 h-5 text-blue-400" />
                    </button>
                  </nav>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default PS5;