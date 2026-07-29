/**
 * NSP Forwarder Generator page
 * Allows users to create NSP forwarder files for Nintendo Switch homebrews and RetroArch games
 * Supports NRO forwarders, RetroArch forwarders, and advanced configuration options
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Upload, Info, AlertCircle, Shuffle, FileCode, Gamepad, Settings, Check } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useI18n } from '../i18n/context';
import { generateNSP, generateRandomTitleId } from '../utils/nspGenerator';
import { extractNACP, extractIcon, isNRO } from '../utils/nro';

type ForwarderMode = 'nro' | 'retroarch' | 'advanced';

const NSPForwarder = () => {
  const { t } = useI18n();
  const [mode, setMode] = useState<ForwarderMode>('nro');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const [nroFile, setNroFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [prodKeysFile, setProdKeysFile] = useState<File | null>(null);

  const [appTitle, setAppTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [nroPath, setNroPath] = useState('/switch/appstore/appstore.nro');

  const [gameTitle, setGameTitle] = useState('');
  const [retroPublisher, setRetroPublisher] = useState('');
  const [corePath, setCorePath] = useState('/retroarch/cores/snes9x_libretro_libnx.nro');
  const [romPath, setRomPath] = useState('/ROMs/SNES/Super Mario World.smc');

  const [advancedMode, setAdvancedMode] = useState(false);
  const [version, setVersion] = useState('1.0.0');
  const [titleId, setTitleId] = useState('01' + '0' + '0'.repeat(14));
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [animationFile, setAnimationFile] = useState<File | null>(null);
  const [enableScreenshots, setEnableScreenshots] = useState(true);
  const [enableVideoCapture, setEnableVideoCapture] = useState(false);
  const [enableProfileSelector, setEnableProfileSelector] = useState(false);
  const [enableSvcDebug, setEnableSvcDebug] = useState(false);
  const [logoType, setLogoType] = useState<number>(2);

  const nroInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const prodKeysInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const animationInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError(t('nspForwarder.errors.invalidImageFormat'));
        return;
      }
      setImageFile(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNroFile(file);
      setError('');
      
      if (await isNRO(file)) {
        try {
          const nacp = await extractNACP(file);
          setAppTitle(nacp.title);
          setPublisher(nacp.author);
          setVersion(nacp.version);
          
          const icon = await extractIcon(file);
          if (icon) {
            setImageFile(new File([icon], 'icon.jpg', { type: 'image/jpeg' }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(icon);
          }
          
          setTitleId(generateRandomTitleId());
        } catch (err) {
          console.error('Failed to extract NRO metadata:', err);
        }
      }
    }
  };

  const handleProdKeysUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProdKeysFile(file);
      setError('');
    }
  };

  const handleGenerateRandomTitleId = () => {
    setTitleId(generateRandomTitleId());
  };

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);

    try {
      let options;

      if (mode === 'nro') {
        if (!appTitle || !publisher || !nroPath || !prodKeysFile) {
          setError(t('nspForwarder.errors.missingFields'));
          return;
        }
        options = {
          mode: 'nro' as const,
          appTitle,
          publisher,
          nroPath,
          nroFile,
          imageFile,
          prodKeysFile,
          titleId: advancedMode ? titleId : undefined,
          version: advancedMode ? version : undefined,
          logoFile: advancedMode ? logoFile : undefined,
          animationFile: advancedMode ? animationFile : undefined,
          logoType: advancedMode ? logoType : undefined,
          enableScreenshots: advancedMode ? enableScreenshots : true,
          enableVideoCapture: advancedMode ? enableVideoCapture : false,
          enableProfileSelector: advancedMode ? enableProfileSelector : false,
          enableSvcDebug: advancedMode ? enableSvcDebug : false,
        };
      } else if (mode === 'retroarch') {
        if (!gameTitle || !retroPublisher || !corePath || !romPath || !prodKeysFile) {
          setError(t('nspForwarder.errors.missingFields'));
          return;
        }
        options = {
          mode: 'retroarch' as const,
          gameTitle,
          publisher: retroPublisher,
          corePath,
          romPath,
          imageFile,
          prodKeysFile,
          titleId: advancedMode ? titleId : undefined,
          version: advancedMode ? version : undefined,
          logoFile: advancedMode ? logoFile : undefined,
          animationFile: advancedMode ? animationFile : undefined,
          logoType: advancedMode ? logoType : undefined,
          enableScreenshots: advancedMode ? enableScreenshots : true,
          enableVideoCapture: advancedMode ? enableVideoCapture : false,
          enableProfileSelector: advancedMode ? enableProfileSelector : false,
          enableSvcDebug: advancedMode ? enableSvcDebug : false,
        };
      } else {
        setError(t('nspForwarder.errors.invalidMode'));
        return;
      }

      const nspBlob = await generateNSP(options);

      const url = URL.createObjectURL(nspBlob);
      const a = document.createElement('a');
      a.href = url;
      const filename = mode === 'nro' ? appTitle : gameTitle;
      a.download = `${filename.replace(/[^a-z0-9]/gi, '_')}.nsp`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('nspForwarder.errors.generationFailed'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mb-4">
                {t('nspForwarder.title')}
              </h1>
              <p className="text-xl text-blue-300 mb-4">
                {t('nspForwarder.subtitle')}
              </p>
            </motion.div>
          </motion.div>

          {/* Warning Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="bg-gray-800/90 backdrop-blur-xl rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-blue-200/80">{t('nspForwarder.warning.local')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('nspForwarder.credit')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Two-column layout on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left column - Upload + Advanced */}
            <div className="lg:col-span-1 space-y-5">
              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/90 backdrop-blur-xl rounded-xl p-2 border border-blue-500/20 shadow-xl"
              >
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setMode('nro')}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                      mode === 'nro'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FileCode className="w-5 h-5" />
                      <span>{t('nspForwarder.tabs.nro')}</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setMode('retroarch')}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                      mode === 'retroarch'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Gamepad className="w-5 h-5" />
                      <span>{t('nspForwarder.tabs.retroarch')}</span>
                    </div>
                  </button>
                  
                  <label className="cursor-pointer">
                    <div className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                      advancedMode
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                    }`}>
                      <input
                        type="checkbox"
                        checked={advancedMode}
                        onChange={(e) => setAdvancedMode(e.target.checked)}
                        className="hidden"
                      />
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">{t('nspForwarder.tabs.advanced')}</span>
                      {advancedMode && <Check className="w-4 h-4" />}
                    </div>
                  </label>
                </div>
              </motion.div>

              {/* Upload Zone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/90 backdrop-blur-xl rounded-xl border border-blue-500/20 shadow-xl"
              >
                <div
                  onClick={() => {
                    if (mode === 'nro') {
                      if (nroFile) {
                        imageInputRef.current?.click();
                      } else {
                        nroInputRef.current?.click();
                      }
                    } else {
                      imageInputRef.current?.click();
                    }
                  }}
                  className="relative group border-2 border-dashed border-blue-500/30 hover:border-blue-500/60 rounded-xl p-6 transition-all cursor-pointer bg-gray-900/30"
                >
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {imagePreview ? (
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex flex-col items-center"
                        >
                          <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-lg shadow-lg ring-2 ring-blue-500/20" />
                          <p className="text-sm text-gray-400 mt-3 text-center">{t('nspForwarder.upload.clickToChangeImage')}</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="upload"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex flex-col items-center text-center"
                        >
                          <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
                            <Upload className="w-8 h-8 text-blue-400" />
                          </div>
                          <p className="text-sm text-gray-300 font-medium mb-1">
                            {mode === 'nro'
                              ? (nroFile ? t('nspForwarder.upload.selectImage') : t('nspForwarder.upload.selectNro'))
                              : t('nspForwarder.upload.selectBoxArt')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {mode === 'nro' && !nroFile && t('nspForwarder.upload.nroOrImage')}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <input ref={nroInputRef} type="file" accept=".nro" onChange={handleNroUpload} className="hidden" />
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </motion.div>

              {/* Advanced Mode Fields */}
              <AnimatePresence>
                {advancedMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-blue-500/20 space-y-4">
                      <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-400" />
                        <h3 className="text-base font-semibold text-blue-300">Options avancées</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {t('nspForwarder.form.logoType.label')}
                          </label>
                          <select
                            value={logoType}
                            onChange={(e) => setLogoType(Number(e.target.value))}
                            className="w-full px-3 py-2 text-sm bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                          >
                            <option value="0">{t('nspForwarder.form.logoType.textAbove')}</option>
                            <option value="2">{t('nspForwarder.form.logoType.custom')}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {t('nspForwarder.form.version.label')}
                          </label>
                          <input
                            type="text"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            placeholder="1.0.0"
                            className="w-full px-3 py-2 text-sm bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          {t('nspForwarder.form.titleId.label')}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={titleId}
                            onChange={(e) => setTitleId(e.target.value.toUpperCase())}
                            maxLength={16}
                            className="flex-1 px-3 py-2 text-sm bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                          />
                          <button
                            onClick={handleGenerateRandomTitleId}
                            className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 transition-all"
                          >
                            <Shuffle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {logoType === 2 && (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => logoInputRef.current?.click()}
                            className="px-3 py-2 text-sm bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl text-gray-300 hover:border-blue-500/50 transition-all text-left truncate"
                          >
                            {logoFile ? logoFile.name : t('nspForwarder.form.logo.select')}
                          </button>
                          <button
                            onClick={() => animationInputRef.current?.click()}
                            className="px-3 py-2 text-sm bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl text-gray-300 hover:border-blue-500/50 transition-all text-left truncate"
                          >
                            {animationFile ? animationFile.name : t('nspForwarder.form.animation.select')}
                          </button>
                          <input ref={logoInputRef} type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="hidden" />
                          <input ref={animationInputRef} type="file" accept="video/*,.gif" onChange={(e) => setAnimationFile(e.target.files?.[0] || null)} className="hidden" />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-blue-500/20">
                        {[
                          { checked: enableScreenshots, setter: setEnableScreenshots, label: t('nspForwarder.form.options.screenshots') },
                          { checked: enableVideoCapture, setter: setEnableVideoCapture, label: t('nspForwarder.form.options.videoCapture') },
                          { checked: enableProfileSelector, setter: setEnableProfileSelector, label: t('nspForwarder.form.options.profileSelector') },
                          { checked: enableSvcDebug, setter: setEnableSvcDebug, label: t('nspForwarder.form.options.svcDebug') },
                        ].map((option, idx) => (
                          <label
                            key={idx}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all text-sm ${
                              option.checked ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-gray-900/30 border border-gray-700/30'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={option.checked}
                              onChange={(e) => option.setter(e.target.checked)}
                              className="w-4 h-4 rounded"
                            />
                            <span className="text-gray-300">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Colonne droite - Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800/90 backdrop-blur-xl rounded-xl border border-blue-500/20 p-6 shadow-xl"
              >
                <div className="space-y-5">
                  {/* Mode-specific fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mode === 'nro' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {t('nspForwarder.form.appTitle.label')}
                          </label>
                          <input
                            type="text"
                            value={appTitle}
                            onChange={(e) => setAppTitle(e.target.value)}
                            placeholder={t('nspForwarder.form.appTitle.placeholder')}
                            className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {t('nspForwarder.form.publisher.label')}
                          </label>
                          <input
                            type="text"
                            value={publisher}
                            onChange={(e) => setPublisher(e.target.value)}
                            placeholder={t('nspForwarder.form.publisher.placeholder')}
                            className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {t('nspForwarder.form.nroPath.label')}
                          </label>
                          <input
                            type="text"
                            value={nroPath}
                            onChange={(e) => setNroPath(e.target.value)}
                            placeholder="/switch/appstore/appstore.nro"
                            className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 font-mono text-sm"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {t('nspForwarder.form.gameTitle.label')}
                          </label>
                          <input
                            type="text"
                            value={gameTitle}
                            onChange={(e) => setGameTitle(e.target.value)}
                            placeholder={t('nspForwarder.form.gameTitle.placeholder')}
                            className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {t('nspForwarder.form.publisher.label')}
                          </label>
                          <input
                            type="text"
                            value={retroPublisher}
                            onChange={(e) => setRetroPublisher(e.target.value)}
                            placeholder={t('nspForwarder.form.publisher.placeholder')}
                            className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {t('nspForwarder.form.corePath.label')}
                          </label>
                          <input
                            type="text"
                            value={corePath}
                            onChange={(e) => setCorePath(e.target.value)}
                            placeholder="/retroarch/cores/snes9x_libretro_libnx.nro"
                            className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 font-mono text-sm"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {t('nspForwarder.form.romPath.label')}
                          </label>
                          <input
                            type="text"
                            value={romPath}
                            onChange={(e) => setRomPath(e.target.value)}
                            placeholder="/ROMs/SNES/Super Mario World.smc"
                            className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 font-mono text-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Prod Keys */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      {t('nspForwarder.form.prodKeys.label')}
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <button
                      onClick={() => prodKeysInputRef.current?.click()}
                      className={`w-full px-4 py-3 rounded-xl transition-all text-left flex items-center justify-between ${
                        prodKeysFile
                          ? 'bg-green-500/10 border-2 border-green-500/30 text-green-300'
                          : 'bg-gray-700/50 backdrop-blur-sm border-2 border-blue-500/30 text-gray-300 hover:border-blue-500/50'
                      }`}
                    >
                      <span className="truncate text-sm">{prodKeysFile ? prodKeysFile.name : t('nspForwarder.form.prodKeys.select')}</span>
                      {prodKeysFile && <Check className="w-5 h-5 text-green-400 flex-shrink-0" />}
                    </button>
                    <input ref={prodKeysInputRef} type="file" accept=".keys" onChange={handleProdKeysUpload} className="hidden" />
                    <p className="text-xs text-gray-500 mt-1">{t('nspForwarder.form.prodKeys.help')}</p>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-200">{error}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Generate Button */}
                  <motion.button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label={isGenerating ? t('nspForwarder.buttons.generating') : t('nspForwarder.buttons.generate')}
                    aria-busy={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                        <span>{t('nspForwarder.buttons.generating')}</span>
                      </>
                    ) : (
                      <>
                        <Package className="w-5 h-5" aria-hidden="true" />
                        <span>{t('nspForwarder.buttons.generate')}</span>
                      </>
                    )}
                  </motion.button>

                  {/* Instructions - Inline */}
                  <div className="pt-4 border-t border-blue-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="w-4 h-4 text-blue-400" />
                      <h3 className="text-sm font-semibold text-blue-300">
                        {t('nspForwarder.instructions.title')}
                      </h3>
                    </div>
                    <ul className="space-y-2 text-gray-300">
                      {[1, 2, 3, 4].map((step) => (
                        <li key={step} className="flex gap-2.5 text-sm">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                            {step}
                          </span>
                          <span>{t(`nspForwarder.instructions.step${step}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NSPForwarder;
