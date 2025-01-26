import { useState, useEffect } from 'react';
import Parser from 'rss-parser/dist/rss-parser.min.js';
import { motion } from 'framer-motion';
import type { CustomItem } from '../types/rss-parser';
import { decodeHTMLEntities } from '../utils/htmlEntities';

const News = () => {
  const [news, setNews] = useState<CustomItem[]>([]);
  const [loading, setLoading] = useState(true);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const parser = new Parser({
          customFields: {
            item: ['enclosure', 'image', 'author']
          }
        });
        const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://hacktuality.com/rss.xml'));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const xmlText = await response.text();
        const feed = await parser.parseString(xmlText);
        
        // Process and clean the feed items
        const processedItems = feed.items.slice(0, 6).map(feedItem => ({
          ...feedItem,
          enclosure: feedItem.enclosure || null,
          image: feedItem.image || null,
          title: decodeHTMLEntities(feedItem.title || ''),
          description: decodeHTMLEntities(feedItem.description || ''),
          author: decodeHTMLEntities(feedItem.author || '')
        }));
        
        setNews(processedItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error instanceof Error ? error.message : 'Unknown error');
        setLoading(false);
        setNews([]); // Reset news state on error
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white text-center mb-12">
            Chargement des actualités...
          </h2>
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-900/50 rounded-lg p-6 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-800 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-6 bg-gray-800 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-gray-800 rounded w-1/4 mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-800 rounded w-full" />
                      <div className="h-4 bg-gray-800 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white text-center mb-12">
          Dernières Actualités
        </h2>
        {news.length === 0 ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <p className="text-center text-red-400">
              Impossible de charger les actualités. Veuillez réessayer plus tard.
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {news.map((newsItem) => (
              <motion.a
                variants={item}
                href={newsItem.link}
                target="_blank"
                rel="noopener noreferrer"
                key={newsItem.guid}
                className="block group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div 
                  className="h-full bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 hover:bg-gray-800/80"
                >
                  <div className="flex flex-col items-start gap-4">
                    <div className="w-full">
                      {newsItem.enclosure && (
                        <img 
                          src={newsItem.enclosure.url} 
                          alt={newsItem.title}
                          className="w-full h-40 object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-[1.02]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <div className="w-full">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                          {newsItem.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300 line-clamp-2 mb-3">
                        {newsItem.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {newsItem.author && (
                            <div className="flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
                              <img 
                                src={newsItem.image}
                                alt={newsItem.author}
                                className="w-6 h-6 rounded-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              <span className="text-sm text-gray-400">{newsItem.author}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-blue-400 whitespace-nowrap transition-transform duration-300 group-hover:translate-x-1">
                          {new Date(newsItem.pubDate || '').toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default News;
