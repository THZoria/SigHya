import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, AlertTriangle, CheckCircle2, XCircle, FileUp } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { extractInfoFromBin } from '../utils/binParser';
import { useI18n } from '../i18n/context';

const NXDevice = () => {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<{
    fileSize: number;
    startIndex: number;
    endIndex: number;
    rawData: string;
    deviceId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Vérifier l'extension du fichier
    if (!selectedFile.name.toLowerCase().endsWith('.bin')) {
      setError("Le fichier doit être au format .bin");
      setFile(null);
      setFileInfo(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setFileInfo(null);
    setIsProcessing(true);

    try {
      const info = await extractInfoFromBin(selectedFile);
      setFileInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'analyse du fichier");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const droppedFile = event.dataTransfer.files[0];
    if (!droppedFile) return;

    if (!droppedFile.name.toLowerCase().endsWith('.bin')) {
      setError("Le fichier doit être au format .bin");
      setFileInfo(null);
      return;
    }

    setFile(droppedFile);
    setError(null);
    setFileInfo(null);
    setIsProcessing(true);

    try {
      const info = await extractInfoFromBin(droppedFile);
      setFileInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'analyse du fichier");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mb-4">{t('nxDevice.title')}</h1>
            <p className="text-xl text-blue-200/80">{t('nxDevice.subtitle')}</p>
            <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300">
              <p>⚠️ {t('nxDevice.warning.local')}</p>
              <p>{t('nxDevice.warning.noServer')}</p>
            </div>
          </motion.div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-500/20 mb-8"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".bin"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-blue-500/30 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-blue-500/50"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-blue-500/10 rounded-full">
                  <Upload className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-white mb-2">
                    {t('nxDevice.upload.title')}
                  </p>
                  <p className="text-sm text-gray-400">
                    {t('nxDevice.upload.subtitle')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Status Section */}
          <AnimatePresence mode="wait">
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
                  <p className="text-blue-400">{t('nxDevice.processing')}</p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400">{error}</p>
                </div>
              </motion.div>
            )}

            {fileInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 space-y-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-green-400">{t('nxDevice.success')}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">{t('nxDevice.fileInfo.deviceId')}</h3>
                    <p className="text-xl font-mono text-white text-center select-all">
                      {fileInfo.deviceId}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">{t('nxDevice.fileInfo.fileSize')}</h3>
                      <p className="text-lg text-white">{fileInfo.fileSize} octets</p>
                    </div>

                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">{t('nxDevice.fileInfo.markers')}</h3>
                      <p className="text-lg text-white">
                        {t('nxDevice.fileInfo.start')}: {fileInfo.startIndex}<br />
                        {t('nxDevice.fileInfo.end')}: {fileInfo.endIndex}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">{t('nxDevice.fileInfo.rawData')}</h3>
                    <p className="text-sm font-mono text-white break-all">
                      {fileInfo.rawData}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-12 bg-gray-800/50 rounded-xl p-6 border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-4">{t('nxDevice.instructions.title')}</h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <FileUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t('nxDevice.instructions.selectFile')}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span>{t('nxDevice.instructions.format')}</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{t('nxDevice.instructions.warning')}</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NXDevice;