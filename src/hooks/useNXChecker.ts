import { useState } from 'react';
import { checkNXCompatibility } from '../api/nxchecker';
import { useI18n } from '../i18n/context';

/**
 * Interface defining the structure of Nintendo Switch compatibility check results
 */
interface CheckResult {
  status: 'success' | 'warning' | 'error' | 'mariko' | 'oled' | 'lite' | 'unknown' | 'hae';
  message: string;
  color: string;
}

/**
 * Custom hook for checking Nintendo Switch compatibility based on serial numbers
 * Provides functionality to analyze Switch models and determine compatibility status
 * 
 * @returns Object containing checkCompatibility function and current result state
 * 
 * @example
 * const { checkCompatibility, result } = useNXChecker();
 * checkCompatibility('XAW10000000000');
 */
export const useNXChecker = () => {
  const [result, setResult] = useState<CheckResult | null>(null);
  const { t } = useI18n();

  /**
   * Checks the compatibility of a Nintendo Switch based on its serial number
   * Handles special cases like Switch 2 (HAE) and delegates to API for other models
   * 
   * @param serialNumber - The serial number to analyze
   */
  const checkCompatibility = (serialNumber: string) => {
    const serial = serialNumber.toUpperCase().trim();
    console.log('Analyzed serial number:', serial); // Debug log

    // Special case: Switch 2 detection (HAE prefix)
    if (serial.startsWith('HAE')) {
      setResult({
        status: 'hae', // Custom status for Switch 2
        message: t('nxChecker.results.hae'), // Displayed in UI
        color: 'red',
      });
      return;
    }

    // Check compatibility using the API function
    const result = checkNXCompatibility(serial);
    setResult(result);
  };

  return { checkCompatibility, result };
};
