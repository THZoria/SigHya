import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, HelpCircle, ChevronRight, ZapIcon, ShieldIcon } from 'lucide-react';
import { useNXChecker } from '../hooks/useNXChecker';
import PageTransition from '../components/PageTransition';
import { useI18n } from '../i18n/context';

const NXChecker = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [serialNumber, setSerialNumber] = useState('');
  const { checkCompatibility, result } = useNXChecker();
  const [isInitialized, setIsInitialized] = useState(false);
  const [metaDescription, setMetaDescription] = useState(
    'Vérifiez la compatibilité de votre Nintendo Switch avec le modding. Un outil simple et rapide pour savoir si votre console est compatible.'
  );

  useEffect(() => {
    const serial = searchParams.get('serial');
    if (serial) {
      setSerialNumber(serial);
      checkCompatibility(serial);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && serialNumber) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('serial', serialNumber);
      window.history.replaceState(null, '', `?${newParams.toString()}`);
    }
  }, [serialNumber, isInitialized]);

  useEffect(() => {
    if (result) {
      const statusText = {
        success: 'Compatible',
        warning: 'Indéterminé',
        error: 'Non compatible',
        mariko: 'Non compatible (Mariko)',
        oled: 'Non compatible (OLED)',
        lite: 'Non compatible (Lite)',
        unknown: 'Numéro de série inconnu'
      }[result.status];

      setMetaDescription(
        `Nintendo Switch ${serialNumber}: ${statusText}. ${result.message.replace(/\n/g, ' ')}`
      );
    } else {
      setMetaDescription(
        'Vérifiez la compatibilité de votre Nintendo Switch avec le modding. Un outil simple et rapide pour savoir si votre console est compatible.'
      );
    }
  }, [result, serialNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkCompatibility(serialNumber);
  };

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
              transition={{ duration: 0.8, type: "spring" }}
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mb-4" data-testid="title">
                {t('nxChecker.title')}
              </h1>
              <p className="text-xl text-blue-300 mb-4">
                {t('nxChecker.subtitle')}
              </p>
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
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                >
                  <HelpCircle className="w-8 h-8 text-blue-400" />
                </motion.div>
              </div>
              <div>
                <h3 className="text-xl font-medium text-blue-300 mb-2">{t('nxChecker.help.title')}</h3>
                <p className="text-gray-300">
                  {t('nxChecker.help.description')}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  Numéro de série
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
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Search className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </div>

              <motion.button
                type="submit"
                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white ${
                  'bg-gradient-to-r from-blue-600 to-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 relative overflow-hidden shadow-lg shadow-blue-500/20`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <>
                  {t('nxChecker.button')}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              </motion.button>
            </form>
          </motion.div>

          {result && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className={`bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-2xl p-6 mb-6 border-2 ${
              result.status === 'success' ? 'border-green-500' :
              result.status === 'warning' ? 'border-yellow-500' :
              'border-red-500'
            }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                  >
                    <AlertCircle className={`w-6 h-6 ${
                    result.status === 'success' ? 'text-green-500' :
                    result.status === 'warning' ? 'text-yellow-500' :
                    'text-red-500'
                    }`} />
                  </motion.div>
                </div>
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${
                    result.status === 'success' ? 'text-green-500' :
                    result.status === 'warning' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
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
            <h3 className="text-xl font-medium text-blue-300 mb-4">{t('nxChecker.importantInfo.title')}</h3>
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
        </div>
      </div>
    </PageTransition>
  );
};

export default NXChecker;