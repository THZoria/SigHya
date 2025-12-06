import React from 'react';
import { useI18n } from '../i18n/context';
import type { Language } from '../i18n/types';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' }
];

interface LanguageSelectorProps {
  variant?: 'desktop' | 'mobile';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant }) => {
  const { language, setLanguage } = useI18n();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const useMobileVariant = variant === 'mobile' || (variant === undefined && isMobile);
  const currentLanguage = languages.find(l => l.code === language);

  if (useMobileVariant) {
    return (
      <div className="flex items-center justify-center gap-2">
        {languages.map(({ code, label, flag }) => (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
              language === code
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 active:bg-gray-800/50 active:text-gray-300'
            }`}
          >
            <span className="text-lg">{flag}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors">
        <span>{currentLanguage?.flag}</span>
        <span>{currentLanguage?.label}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map(({ code, label, flag }) => (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-700 transition-colors ${
              language === code ? 'text-blue-400' : 'text-gray-300'
            }`}
          >
            <span>{flag}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;