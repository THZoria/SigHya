import React from 'react';
import { useI18n } from '../i18n/context';
import type { Language } from '../i18n/types';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' }
];

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors">
        <span>{languages.find(l => l.code === language)?.flag}</span>
        <span>{languages.find(l => l.code === language)?.label}</span>
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