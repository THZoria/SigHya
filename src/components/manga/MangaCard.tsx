import React from 'react';
import { motion } from 'framer-motion';
import { Download, ShoppingCart, Calendar, Tag, Building, Grid, List } from 'lucide-react';
import TiltImage from './TiltImage';
import { generateICS, getICSFilename } from '../../utils/icsGenerator';
import type { Manga } from '../../types/manga';
import { useI18n } from '../../i18n/context';

interface MangaCardProps {
  manga: Manga;
  index: number;
  viewMode: 'grid' | 'list';
}

const MobileGridCard: React.FC<MangaCardProps> = ({ manga }) => {
  const { t } = useI18n();
  const handleDownloadICS = () => {
    const icsContent = generateICS([manga]);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const filename = getICSFilename(manga);
    
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-500/20">
      <div className="relative h-80">
        <img
          src={manga.image.replace('/imagesmin/', '/images/')}
          alt={manga.nom_manga}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
            {manga.nom_manga}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex items-center bg-blue-500/20 rounded-full px-3 py-1">
              <Calendar className="w-4 h-4 text-blue-400 mr-1.5" />
              <span className="text-sm text-blue-100">{manga.date_sortie}</span>
            </div>
            <div className="flex items-center bg-blue-500/20 rounded-full px-3 py-1">
              <Tag className="w-4 h-4 text-blue-400 mr-1.5" />
              <span className="text-sm text-blue-100">{manga.prix}</span>
            </div>
            {manga.editeur && (
              <div className="flex items-center bg-blue-500/20 rounded-full px-3 py-1">
                <Building className="w-4 h-4 text-blue-400 mr-1.5" />
                <span className="text-sm text-blue-100">{manga.editeur}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadICS}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-700/80 text-blue-400 rounded-lg text-sm font-medium"
            >
              <Download className="w-4 h-4 mr-1.5" />
              ICS
            </button>
            {manga.lien_acheter && (
              <a
                href={manga.lien_acheter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
              >
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                {t('planning.actions.buy')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileListCard: React.FC<MangaCardProps> = ({ manga }) => {
  const { t } = useI18n();
  const handleDownloadICS = () => {
    const icsContent = generateICS([manga]);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const filename = getICSFilename(manga);
    
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-500/20 p-4">
      <div className="flex gap-4">
        <div className="w-24 h-36 flex-shrink-0">
          <img
            src={manga.image.replace('/imagesmin/', '/images/')}
            alt={manga.nom_manga}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop';
            }}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">
            {manga.nom_manga}
          </h3>
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-gray-300">
              <Calendar className="w-4 h-4 text-blue-400 mr-2" />
              {manga.date_sortie}
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Tag className="w-4 h-4 text-blue-400 mr-2" />
              {manga.prix}
            </div>
            {manga.editeur && (
              <div className="flex items-center text-sm text-gray-300">
                <Building className="w-4 h-4 text-blue-400 mr-2" />
                {manga.editeur}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadICS}
              className="flex-1 flex items-center justify-center px-3 py-1.5 bg-gray-700/80 text-blue-400 rounded-lg text-sm font-medium"
            >
              <Download className="w-4 h-4 mr-1.5" />
              ICS
            </button>
            {manga.lien_acheter && (
              <a
                href={manga.lien_acheter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium"
              >
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                {t('planning.actions.buy')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DesktopCard: React.FC<MangaCardProps> = ({ manga }) => {
  const { t } = useI18n();
  const handleDownloadICS = () => {
    const icsContent = generateICS([manga]);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const filename = getICSFilename(manga);
    
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-4 hover:text-blue-400 transition-colors duration-300">
          {manga.nom_manga}
        </h3>
        
        <div className="flex gap-6">
          <div className="w-48 h-72 relative overflow-hidden rounded-lg">
            <TiltImage
              src={manga.image.replace('/imagesmin/', '/images/')}
              alt={manga.nom_manga}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop';
              }}
            />
          </div>

          <div className="flex-1">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">{manga.date_sortie}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">{manga.prix}</span>
              </div>
              {manga.editeur && (
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">{manga.editeur}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6 flex items-center space-x-4">
        <button
          onClick={handleDownloadICS}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-700 text-blue-400 rounded-lg font-medium hover:bg-gray-600 transition-all duration-300"
        >
          <Download className="w-4 h-4 mr-2" />
          {t('planning.actions.downloadIcs')}
        </button>
        
        {manga.lien_acheter && (
          <a
            href={manga.lien_acheter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {t('planning.actions.buy')}
          </a>
        )}
      </div>
    </div>
  );
};

const MangaCard: React.FC<MangaCardProps> = ({ manga, index, viewMode }) => {
  const cardVariants = {
    initial: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
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
  );
};

export default MangaCard;