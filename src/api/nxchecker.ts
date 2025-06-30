/**
 * Interface defining the structure of Nintendo Switch compatibility check results
 */
interface CheckResult {
    status: 'success' | 'warning' | 'error' | 'mariko' | 'oled' | 'lite' | 'unknown';
    message: string;
    color: string;
  }
  
/**
 * Checks Nintendo Switch compatibility based on serial number analysis
 * Determines if a Switch can be hacked based on manufacturing date and model
 * 
 * @param serialNumber - The Switch serial number to analyze
 * @returns CheckResult object containing status, message, and color
 * 
 * @example
 * const result = checkNXCompatibility('XAW10000000000');
 * // Returns: { status: 'success', message: '✅ Switch Non-Patchée...', color: 'green' }
 */
export const checkNXCompatibility = (serialNumber: string): CheckResult => {
    // Validate input
    if (!serialNumber) {
      return {
        status: 'error',
        message: 'Veuillez entrer un numéro de série valide.',
        color: 'red'
      };
    }
  
    const cleanSerial = serialNumber.trim().toUpperCase();
  
    // Check for patched models first (Mariko chipsets)
    if (cleanSerial.startsWith('XKJ')) {
      return {
        status: 'mariko',
        message: '❌ Switch Patchée\nRaison: Console Mariko',
        color: 'red'
      };
    }
  
    if (cleanSerial.startsWith('XKW')) {
      return {
        status: 'oled',
        message: '❌ Non compatible\nRaison: Console OLED Mariko',
        color: 'red'
      };
    }
  
    if (cleanSerial.startsWith('XJE')) {
      return {
        status: 'lite',
        message: '❌ Non compatible\nRaison: Console Lite Mariko',
        color: 'red'
      };
    }
  
    // Extract serial prefix and number for range checking
    const serialPrefix = cleanSerial.substring(0, 4);
    const number = parseInt(cleanSerial.substring(4, 10));
  
    // Define compatibility ranges for different serial prefixes
    // Based on manufacturing dates and vulnerability windows
    const ranges = {
      XAW1: { success: 7999, warning: 8999 },
      XAW4: { success: 1100, warning: 1200 },
      XAW7: { success: 1799, warning: 1899 },
      XAJ1: { success: 2000, warning: 3000 },
      XAJ4: { success: 5299, warning: 5399 },
      XAJ7: { success: 4299, warning: 4399 }
    };
  
    const range = ranges[serialPrefix as keyof typeof ranges];
    
    // Unknown serial prefix
    if (!range) {
      return {
        status: 'unknown',
        message: '❌ Erreur\nRaison: Numéro de série inconnu',
        color: 'red'
      };
    }
  
    // Check if serial number falls within safe range
    if (number <= range.success) {
      return {
        status: 'success',
        message: '✅ Switch Non-Patchée\nVous pouvez installer le hack',
        color: 'green'
      };
    }
  
    // Check if serial number falls within warning range
    if (number <= range.warning) {
      return {
        status: 'warning',
        message: '⚠️ Indéterminé',
        color: 'yellow'
      };
    }
  
    // Serial number indicates patched console
    return {
      status: 'error',
      message: '❌ Switch Patchée\nRaison: Console post Juin 2018',
      color: 'red'
    };
  };