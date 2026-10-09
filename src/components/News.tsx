import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { fetchFeed } from '../api/feeds'

/** RSS item shape returned by `/api/feeds/news`. */
interface CustomItem {
  title: string
  description: string
  link: string
  guid: string
  pubDate: string
  author?: string
  enclosure?: {
    url: string
    type: string
  }
  image?: string
}

/** Latest news from the server-side RSS cache. */
const News = () => {
  const [news, setNews] = useState<CustomItem[]>([])
  const [loading, setLoading] = useState(true)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    const controller = new AbortController()

    const loadNews = async () => {
      try {
        const feed = await fetchFeed<CustomItem[]>('news', controller.signal)
        if (Array.isArray(feed.data) && feed.data.length > 0) {
          setNews(feed.data)
        } else {
          setNews([])
        }
      } catch {
        if (!controller.signal.aborted) {
          setNews([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadNews()
    return () => controller.abort()
  }, [])

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
    )
  }

  return (
    <div className="py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white text-center mb-12">
          Dernières Actualités
        </h2>

        {/* Error state */}
        {news.length === 0 ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <p className="text-center text-red-400">
              Impossible de charger les actualités. Veuillez réessayer plus tard.
            </p>
          </div>
        ) : (
          /* News grid with animations */
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {news
              .filter((newsItem) => newsItem.link)
              .map((newsItem) => (
                <motion.a
                  variants={item}
                  href={newsItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={newsItem.guid}
                  className="block group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <div className="h-full bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 hover:bg-gray-800/80">
                    <div className="flex flex-col items-start gap-4">
                      {/* News image */}
                      <div className="w-full">
                        {newsItem.enclosure && (
                          <img
                            src={newsItem.enclosure.url}
                            alt={newsItem.title}
                            className="w-full h-40 object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-[1.02]"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        )}
                      </div>

                      {/* News content */}
                      <div className="w-full">
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                            {newsItem.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300 line-clamp-2 mb-3">
                          {newsItem.description}
                        </p>

                        {/* News metadata */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {newsItem.author && (
                              <div className="flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
                                {/* Author icon/image */}
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                  {newsItem.image ? (
                                    <img
                                      src={newsItem.image}
                                      alt={newsItem.author}
                                      className="w-6 h-6 rounded-full object-cover"
                                      onError={(e) => {
                                        ;(e.target as HTMLImageElement).style.display = 'none'
                                      }}
                                    />
                                  ) : (
                                    // Default user icon when no image is available
                                    <svg
                                      className="w-4 h-4 text-blue-400"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                      aria-hidden="true"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  )}
                                </div>
                                <span className="text-sm text-gray-400">{newsItem.author}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-blue-400 whitespace-nowrap transition-transform duration-300 group-hover:translate-x-1">
                            {new Date(newsItem.pubDate || '').toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
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
  )
}

export default News
