import { useState } from 'react';
import { checkNXCompatibility } from '../api/nxchecker';
import { useI18n } from '../i18n/context';

interface CheckResult {
  status: 'success' | 'warning' | 'error' | 'mariko' | 'oled' | 'lite' | 'unknown' | 'hae';
  message: string;
  color: string;
}

export const useNXChecker = () => {
  const [result, setResult] = useState<CheckResult | null>(null);
  const { t } = useI18n();

  const checkCompatibility = (serialNumber: string) => {
    const serial = serialNumber.toUpperCase().trim();
    console.log('Numéro analysé :', serial); // Debug

    // Switch 2 détectée (HAE)
    if (serial.startsWith('HAE')) {
      setResult({
        status: 'hae', // status personnalisé
        message: t('nxChecker.results.hae'), // affiché dans la UI
        color: 'red',
      });
      return;
    }

    // check
    const result = checkNXCompatibility(serial);
    setResult(result);
  };

  return { checkCompatibility, result };
};
