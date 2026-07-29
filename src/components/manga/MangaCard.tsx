import { motion } from 'framer-motion'
import { Building, Calendar, Download, ShoppingCart, Tag } from 'lucide-react'
import type React from 'react'
import { memo } from 'react'
import { useI18n } from '../../i18n/context'
import type { Manga } from '../../types/manga'
import { downloadICSFile } from '../../utils/icsGenerator'
import TiltImage from './TiltImage'

interface MangaCardProps {
  manga: Manga
  index: number
  viewMode: 'grid' | 'list'
}

const MobileGridCard: React.FC<MangaCardProps> = ({ manga }) => {
  const { t } = useI18n()

  const handleDownloadICS = () => {
    downloadICSFile([manga])
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-500/20 shadow-lg shadow-black/20 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.25)] hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-1">
      <div className="relative aspect-[3/4]">
        <img
          src={manga.image}
          alt={manga.nom_manga}
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
          loading="lazy"
          draggable={false}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src =
              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 drop-shadow-lg">
            {manga.nom_manga}
          </h3>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="inline-flex items-center gap-1 bg-blue-500/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs text-blue-100">
              <Calendar className="w-3 h-3" />
              {manga.date_sortie}
            </span>
            <span className="inline-flex items-center gap-1 bg-blue-500/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs text-blue-100">
              <Tag className="w-3 h-3" />
              {manga.prix}
            </span>
            {manga.editeur && (
              <span className="inline-flex items-center gap-1 bg-blue-500/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs text-blue-100">
                <Building className="w-3 h-3" />
                {manga.editeur}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadICS}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-700/80 backdrop-blur-sm text-blue-400 rounded-lg text-sm font-medium hover:bg-gray-600/80 transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-1.5" />
              ICS
            </button>
            {manga.lien_acheter && (
              <a
                href={manga.lien_acheter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 shadow-md shadow-blue-500/20"
              >
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                {t('planning.actions.buy')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const MobileListCard: React.FC<MangaCardProps> = ({ manga }) => {
  const { t } = useI18n()

  const handleDownloadICS = () => {
    downloadICSFile([manga])
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-500/20 p-4 shadow-lg shadow-black/20 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.25)] hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-1">
      <div className="flex gap-4">
        <div className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
          <img
            src={manga.image}
            alt={manga.nom_manga}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
            loading="lazy"
            draggable={false}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src =
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop'
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white mb-1.5 line-clamp-2">{manga.nom_manga}</h3>

          <div className="space-y-1 mb-2.5">
            <div className="flex items-center text-xs text-gray-300">
              <Calendar className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
              {manga.date_sortie}
            </div>
            <div className="flex items-center text-xs text-gray-300">
              <Tag className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
              {manga.prix}
            </div>
            {manga.editeur && (
              <div className="flex items-center text-xs text-gray-300">
                <Building className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                {manga.editeur}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadICS}
              className="flex-1 flex items-center justify-center px-2.5 py-1.5 bg-gray-700/80 text-blue-400 rounded-lg text-xs font-medium hover:bg-gray-600/80 transition-colors duration-200"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              ICS
            </button>
            {manga.lien_acheter && (
              <a
                href={manga.lien_acheter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center px-2.5 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors duration-200"
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                {t('planning.actions.buy')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const DesktopCard: React.FC<MangaCardProps> = ({ manga }) => {
  const { t } = useI18n()

  const handleDownloadICS = () => {
    downloadICSFile([manga])
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-500/20 hover:border-blue-500/50 transition-all duration-500 group shadow-lg shadow-black/20 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.25)] hover:-translate-y-1">
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
          {manga.nom_manga}
        </h3>

        <div className="flex gap-4">
          <div className="w-32 h-48 relative overflow-hidden rounded-lg shadow-md flex-shrink-0">
            <TiltImage
              src={manga.image}
              alt={manga.nom_manga}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src =
                  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop'
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">{manga.date_sortie}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">{manga.prix}</span>
              </div>
              {manga.editeur && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{manga.editeur}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 flex items-center gap-3">
        <button
          onClick={handleDownloadICS}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-700 text-blue-400 rounded-lg text-sm font-medium hover:bg-gray-600 transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-1.5" />
          {t('planning.actions.downloadIcs')}
        </button>

        {manga.lien_acheter && (
          <a
            href={manga.lien_acheter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-all duration-200"
          >
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            {t('planning.actions.buy')}
          </a>
        )}
      </div>
    </div>
  )
}

const MangaCard: React.FC<MangaCardProps> = memo(({ manga, index, viewMode }) => {
  const cardVariants = {
    initial: {
      opacity: 0,
      y: 16,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        delay: index * 0.06,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -12,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  }

  return (
    <motion.div variants={cardVariants} initial="initial" animate="animate" exit="exit" layout>
      <div className="block sm:hidden">
        {viewMode === 'grid' ? (
          <MobileGridCard manga={manga} index={index} viewMode={viewMode} />
        ) : (
          <MobileListCard manga={manga} index={index} viewMode={viewMode} />
        )}
      </div>

      <div className="hidden sm:block">
        <DesktopCard manga={manga} index={index} viewMode={viewMode} />
      </div>
    </motion.div>
  )
})

export default MangaCard
