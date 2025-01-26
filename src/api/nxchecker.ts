interface CheckResult {
    status: 'success' | 'warning' | 'error' | 'mariko' | 'oled' | 'lite' | 'unknown';
    message: string;
    color: string;
  }
  
  export const checkNXCompatibility = (serialNumber: string): CheckResult => {
    if (!serialNumber) {
      return {
        status: 'error',
        message: 'Veuillez entrer un numéro de série valide.',
        color: 'red'
      };
    }
  
    const cleanSerial = serialNumber.trim().toUpperCase();
  
    // Check special prefixes first
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
  
    // Algorithm logic
    const serialPrefix = cleanSerial.substring(0, 4);
    const number = parseInt(cleanSerial.substring(4, 10));
  
    const ranges = {
      XAW1: { success: 7999, warning: 8999 },
      XAW4: { success: 1100, warning: 1200 },
      XAW7: { success: 1799, warning: 1899 },
      XAJ1: { success: 2000, warning: 3000 },
      XAJ4: { success: 5299, warning: 5399 },
      XAJ7: { success: 4299, warning: 4399 }
    };
  
    const range = ranges[serialPrefix as keyof typeof ranges];
    
    if (!range) {
      return {
        status: 'unknown',
        message: '❌ Erreur\nRaison: Numéro de série inconnu',
        color: 'red'
      };
    }
  
    if (number <= range.success) {
      return {
        status: 'success',
        message: '✅ Switch Non-Patchée\nVous pouvez installer le hack',
        color: 'green'
      };
    }
  
    if (number <= range.warning) {
      return {
        status: 'warning',
        message: '⚠️ Indéterminé',
        color: 'yellow'
      };
    }
  
    return {
      status: 'error',
      message: '❌ Switch Patchée\nRaison: Console post Juin 2018',
      color: 'red'
    };
  };