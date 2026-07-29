/**
 * Nintendo Switch Checker page
 * Allows users to verify if their Nintendo Switch console is compatible with modding
 * by analyzing the console's serial number against known patched/unpatched ranges
 */

import { motion } from 'framer-motion'
import { AlertCircle, ChevronRight, HelpCircle, Search } from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import { useNXChecker } from '../hooks/useNXChecker'
import { useI18n } from '../i18n/context'

const NXChecker = () => {
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const [serialNumber, setSerialNumber] = useState('')
  const { checkCompatibility, result } = useNXChecker()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const serial = searchParams.get('serial')
    if (serial) {
      setSerialNumber(serial)
      checkCompatibility(serial)
    }
    setIsInitialized(true)
  }, [checkCompatibility, searchParams])

  useEffect(() => {
    if (isInitialized) {
      const newParams = new URLSearchParams(searchParams)
      if (serialNumber) {
        newParams.set('serial', serialNumber)
      } else {
        newParams.delete('serial')
      }
      window.history.replaceState(null, '', `?${newParams.toString()}`)
    }
  }, [isInitialized, searchParams, serialNumber])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    checkCompatibility(serialNumber)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-32 pb-16 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-[url('/nx/console.jpg')] bg-cover bg-center bg-no-repeat opacity-40" />
        </motion.div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              <h1
                className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mb-4"
                data-testid="title"
              >
                {t('nxChecker.title')}
              </h1>
              <p className="text-xl text-blue-300 mb-4">{t('nxChecker.subtitle')}</p>
            </motion.div>
          </div>

          <motion.div
            className="bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-2xl p-6 mb-6 border border-blue-500/20"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-start space-x-4 mb-4">
              <div className="flex-shrink-0">
                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
                  <HelpCircle className="w-8 h-8 text-blue-400" />
                </motion.div>
              </div>
              <div>
                <h3 className="text-xl font-medium text-blue-300 mb-2">
                  {t('nxChecker.help.title')}
                </h3>
                <p className="text-gray-300">{t('nxChecker.help.description')}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="serialNumber"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t('nxChecker.serialNumber.label')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="serialNumber"
                    maxLength={14}
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="block w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                    placeholder={t('nxChecker.serialNumber.placeholder')}
                    aria-label={t('nxChecker.serialNumber.placeholder')}
                    aria-required="true"
                    aria-describedby="serialNumber-help"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                    aria-hidden="true"
                  >
                    <Search className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </div>

              <motion.button
                type="submit"
                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white ${'bg-gradient-to-r from-blue-600 to-blue-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 relative overflow-hidden shadow-lg shadow-blue-500/20`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={t('nxChecker.button')}
              >
                {t('nxChecker.button')}
                <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </motion.button>
            </form>
          </motion.div>

          {result && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className={`bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-2xl p-6 mb-6 border-2 ${
                result.status === 'success'
                  ? 'border-green-500'
                  : result.status === 'warning'
                    ? 'border-yellow-500'
                    : 'border-red-500'
              }`}
              role="alert"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0" aria-hidden="true">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <AlertCircle
                      className={`w-6 h-6 ${
                        result.status === 'success'
                          ? 'text-green-500'
                          : result.status === 'warning'
                            ? 'text-yellow-500'
                            : 'text-red-500'
                      }`}
                    />
                  </motion.div>
                </div>
                <div>
                  <h3
                    className={`text-lg font-medium mb-2 ${
                      result.status === 'success'
                        ? 'text-green-500'
                        : result.status === 'warning'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                    }`}
                  >
                    {t('nxChecker.results.title')}
                  </h3>
                  <p className="text-gray-300 whitespace-pre-line">
                    {t(`nxChecker.results.${result.status}`)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            className="bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-2xl p-6 mb-4 border border-blue-500/20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl font-medium text-blue-300 mb-4">
              {t('nxChecker.importantInfo.title')}
            </h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>{t('nxChecker.importantInfo.preJune2018')}</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>{t('nxChecker.importantInfo.incompatibleModels')}</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>{t('nxChecker.importantInfo.disclaimer')}</span>
              </li>
            </ul>
          </motion.div>

          {/* Prefix Reference Section */}
          <motion.div
            className="mt-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mb-2">
              {t('nxChecker.prefixes.title')}
            </h2>
            <p className="text-blue-200/80 mb-8">{t('nxChecker.prefixes.subtitle')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Legacy */}
              <motion.div
                className="bg-gray-800/90 backdrop-blur-xl rounded-xl p-6 border border-green-500/30 hover:border-green-500/50 hover:shadow-[0_0_25px_-5px_rgba(34,197,94,0.2)] transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30 mb-3">
                  {t('nxChecker.prefixes.legacy.label')}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{t('nxChecker.prefixes.legacy.title')}</h3>
                <p className="text-gray-300 text-sm mb-4">{t('nxChecker.prefixes.legacy.description')}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Préfixes concernés</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['XAW1', 'XAW4', 'XAW7', 'XAJ1', 'XAJ4', 'XAJ7'].map((prefix) => (
                    <span key={prefix} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-lg border border-blue-500/30 font-mono">
                      {prefix}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-400 italic">{t('nxChecker.prefixes.legacy.status')}</p>
              </motion.div>

              {/* Mariko */}
              <motion.div
                className="bg-gray-800/90 backdrop-blur-xl rounded-xl p-6 border border-amber-500/30 hover:border-amber-500/50 hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.2)] transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/30 mb-3">
                  {t('nxChecker.prefixes.mariko.label')}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{t('nxChecker.prefixes.mariko.title')}</h3>
                <p className="text-gray-300 text-sm mb-4">{t('nxChecker.prefixes.mariko.description')}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Préfixes concernés</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['XKJ', 'XKW'].map((prefix) => (
                    <span key={prefix} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-lg border border-blue-500/30 font-mono">
                      {prefix}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-400 italic">{t('nxChecker.prefixes.mariko.status')}</p>
              </motion.div>

              {/* Lite */}
              <motion.div
                className="bg-gray-800/90 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.2)] transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full border border-purple-500/30 mb-3">
                  {t('nxChecker.prefixes.lite.label')}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{t('nxChecker.prefixes.lite.title')}</h3>
                <p className="text-gray-300 text-sm mb-4">{t('nxChecker.prefixes.lite.description')}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Préfixes concernés</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['XJE', 'XJW'].map((prefix) => (
                    <span key={prefix} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-lg border border-blue-500/30 font-mono">
                      {prefix}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-400 italic">{t('nxChecker.prefixes.lite.status')}</p>
              </motion.div>

              {/* OLED */}
              <motion.div
                className="bg-gray-800/90 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.2)] transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/30 mb-3">
                  {t('nxChecker.prefixes.oled.label')}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{t('nxChecker.prefixes.oled.title')}</h3>
                <p className="text-gray-300 text-sm mb-4">{t('nxChecker.prefixes.oled.description')}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Préfixes concernés</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['XTW', 'XTJ'].map((prefix) => (
                    <span key={prefix} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-lg border border-blue-500/30 font-mono">
                      {prefix}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-400 italic">{t('nxChecker.prefixes.oled.status')}</p>
              </motion.div>

              {/* Switch 2 */}
              <motion.div
                className="bg-gray-800/90 backdrop-blur-xl rounded-xl p-6 border border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_25px_-5px_rgba(239,68,68,0.2)] transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/30 mb-3">
                  {t('nxChecker.prefixes.switch2.label')}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{t('nxChecker.prefixes.switch2.title')}</h3>
                <p className="text-gray-300 text-sm mb-4">{t('nxChecker.prefixes.switch2.description')}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Préfixes concernés</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['HAE', 'HAW'].map((prefix) => (
                    <span key={prefix} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-lg border border-blue-500/30 font-mono">
                      {prefix}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-400 italic">{t('nxChecker.prefixes.switch2.status')}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

export default NXChecker
