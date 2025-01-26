import { useState } from 'react';
import { checkNXCompatibility } from '../api/nxchecker';

interface CheckResult {
  status: 'success' | 'warning' | 'error' | 'mariko' | 'oled' | 'lite' | 'unknown';
  message: string;
  color: string;
}

export const useNXChecker = () => {
  const [result, setResult] = useState<CheckResult | null>(null);

  const checkCompatibility = (serialNumber: string) => {
    const result = checkNXCompatibility(serialNumber);
    setResult(result);
  };

  return { checkCompatibility, result };
};