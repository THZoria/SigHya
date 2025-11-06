import React from 'react';
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../../i18n/context';

interface MangaPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const MangaPagination: React.FC<MangaPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const { t } = useI18n();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="mt-8 flex justify-center items-center gap-2">
      {/* First page button */}
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg transition-all duration-300 disabled:opacity-50 hover:bg-gray-700"
        title={t('planning.filters.page')}
      >
        <ChevronsLeft className="w-5 h-5 text-blue-400" />
      </button>

      {/* Previous page button */}
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg transition-all duration-300 disabled:opacity-50 hover:bg-gray-700"
        title={t('planning.filters.page')}
      >
        <ChevronLeft className="w-5 h-5 text-blue-400" />
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2 text-gray-500">•••</span>
            ) : (
              <button
                onClick={() => setCurrentPage(page as number)}
                className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-400 hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Bouton page suivante */}
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg transition-all duration-300 disabled:opacity-50 hover:bg-gray-700"
        title={t('planning.filters.page')}
      >
        <ChevronRight className="w-5 h-5 text-blue-400" />
      </button>

      {/* Last page button */}
      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg transition-all duration-300 disabled:opacity-50 hover:bg-gray-700"
        title={t('planning.filters.page')}
      >
        <ChevronsRight className="w-5 h-5 text-blue-400" />
      </button>
    </div>
  );
};

export default MangaPagination;