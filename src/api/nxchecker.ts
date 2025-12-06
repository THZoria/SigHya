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
 * // Returns: { status: 'success', message: '✅ Unpatched Switch...', color: 'green' }
 */
export const checkNXCompatibility = (serialNumber: string): CheckResult => {
    // Validate input
    if (!serialNumber) {
      return {
        status: 'error',
        message: 'Please enter a valid serial number.',
        color: 'red'
      };
    }
  
    const cleanSerial = serialNumber.trim().toUpperCase();
  
    // Check for always patched models first (Mariko chipsets and newer models)
    // XKW1, XKJ1, XJW1, XWW1 are always patched (100% unhackable via RCM)
    if (cleanSerial.startsWith('XKW1') || cleanSerial.startsWith('XKJ1') || 
        cleanSerial.startsWith('XJW1') || cleanSerial.startsWith('XWW1')) {
      return {
        status: 'oled',
        message: 'Patched console (Mariko/OLED)',
        color: 'red'
      };
    }
  
    // OLED model (XTW prefix) - always patched
    if (cleanSerial.startsWith('XTW')) {
      return {
        status: 'oled',
        message: 'Not compatible - OLED Mariko console',
        color: 'red'
      };
    }
  
    // Legacy Mariko checks (XKJ, XKW without specific prefix)
    if (cleanSerial.startsWith('XKJ')) {
      return {
        status: 'mariko',
        message: 'Patched Switch - Mariko console',
        color: 'red'
      };
    }
  
    if (cleanSerial.startsWith('XKW')) {
      return {
        status: 'oled',
        message: 'Not compatible - OLED Mariko console',
        color: 'red'
      };
    }
  
    // Switch Lite (XJE and XJW prefixes) - always patched
    if (cleanSerial.startsWith('XJE') || cleanSerial.startsWith('XJW')) {
      return {
        status: 'lite',
        message: 'Not compatible - Lite Mariko console',
        color: 'red'
      };
    }
  
    // Extract serial prefix and number for range checking
    // Format: XAW1XXXXX where XAW1 is prefix, XXXXX is numeric portion
    // Serial numbers are typically 14 characters: XAW1 + 10 digits
    if (cleanSerial.length < 14) {
      return {
        status: 'unknown',
        message: 'Invalid serial number format - too short',
        color: 'red'
      };
    }

    const serialPrefix = cleanSerial.substring(0, 4);
    const numberStr = cleanSerial.substring(4, 10);
    const number = parseInt(numberStr, 10);
    
    // Validate that we extracted a valid number
    if (isNaN(number) || numberStr.length !== 6) {
      return {
        status: 'unknown',
        message: 'Invalid serial number format - cannot parse numeric portion',
        color: 'red'
      };
    }
  
    // Updated compatibility ranges based on official serial number database and community sources:
    // - success (unpatched): 100% hackable via RCM vulnerability
    // - warning (potentially patched): might be hackable via RCM, but likely not
    // - error (patched): 100% unhackable via RCM
    // 
    // Ranges are based on manufacturing dates and RCM vulnerability patching:
    // - Consoles manufactured before June 2018 are unpatched
    // - Transition period consoles (June 2018) are potentially patched
    // - Consoles manufactured after June 2018 are patched
    //
    // Note: The upper bound of "unpatched" is exclusive (not included in unpatched range)
    // Serial number format: XAW1 + 6 digits (from position 4-9) = range value
    const ranges = {
      // XAW1: Unpatched <7400, Potentially 7400-12000, Patched >12000
      // Source: XAW10000000000-XAW10074000000 (unpatched), XAW10074000000-XAW10120000000 (potentially), XAW10120000000+ (patched)
      XAW1: { success: 7400, warning: 12000 },
      
      // XAW4: Unpatched <1100, Potentially 1100-1200, Patched >1200
      // Source: XAW40000000000-XAW40011000000 (unpatched), XAW40011000000-XAW40012000000 (potentially), XAW40012000000+ (patched)
      XAW4: { success: 1100, warning: 1200 },
      
      // XAW7: Unpatched <1780, Potentially 1780-3000, Patched >3000
      // Source: XAW70000000000-XAW70017800000 (unpatched), XAW70017800000-XAW70030000000 (potentially), XAW70030000000+ (patched)
      XAW7: { success: 1780, warning: 3000 },
      
      // XAJ1: Unpatched <2000, Potentially 2000-3000, Patched >3000
      // Source: XAJ10000000000-XAJ10020000000 (unpatched), XAJ10020000000-XAJ10030000000 (potentially), XAJ10030000000+ (patched)
      XAJ1: { success: 2000, warning: 3000 },
      
      // XAJ4: Unpatched <4600, Potentially 4600-6000, Patched >6000
      // Source: XAJ40000000000-XAJ40046000000 (unpatched), XAJ40046000000-XAJ40060000000 (potentially), XAJ40060000000+ (patched)
      XAJ4: { success: 4600, warning: 6000 },
      
      // XAJ7: Unpatched <4000, Potentially 4000-5000, Patched >5000
      // Source: XAJ70000000000-XAJ70040000000 (unpatched), XAJ70040000000-XAJ70050000000 (potentially), XAJ70050000000+ (patched)
      XAJ7: { success: 4000, warning: 5000 }
    };

    const range = ranges[serialPrefix as keyof typeof ranges];
    
    // Unknown serial prefix
    if (!range) {
      return {
        status: 'unknown',
        message: 'Unknown serial number',
        color: 'red'
      };
    }

    // Check if serial number falls within unpatched range (100% hackable via RCM)
    // Upper bound is exclusive: numbers equal to success threshold are potentially patched
    if (number < range.success) {
      return {
        status: 'success',
        message: 'Unpatched Switch - 100% hackable via RCM',
        color: 'green'
      };
    }

    // Check if serial number falls within potentially patched range (might be hackable, but likely not)
    // Upper bound of potentially patched is inclusive at the exact threshold, exclusive beyond
    // We need to compare the full serial number string for precise boundary checking
    const fullNumericStr = cleanSerial.substring(4);
    
    // Define the exact upper bound serial numbers for potentially patched range
    const warningThresholds: Record<string, string> = {
      XAW1: '0120000000',  // XAW10120000000 is the last potentially patched
      XAW4: '0012000000',  // XAW40012000000 is the last potentially patched
      XAW7: '0030000000',  // XAW70030000000 is the last potentially patched
      XAJ1: '0030000000',  // XAJ10030000000 is the last potentially patched
      XAJ4: '0060000000',  // XAJ40060000000 is the last potentially patched
      XAJ7: '0050000000'   // XAJ70050000000 is the last potentially patched
    };
    
    const warningThreshold = warningThresholds[serialPrefix];
    
    // If number is less than warning threshold, it's potentially patched
    if (number < range.warning) {
      return {
        status: 'warning',
        message: 'Potentially patched - might be hackable, but likely not',
        color: 'yellow'
      };
    }
    
    // If number equals warning threshold, compare full numeric string to determine if we're at exact limit
    if (number === range.warning && warningThreshold) {
      // Compare string lexicographically to handle exact boundary
      if (fullNumericStr <= warningThreshold) {
        return {
          status: 'warning',
          message: 'Potentially patched - might be hackable, but likely not',
          color: 'yellow'
        };
      }
      // If fullNumericStr > warningThreshold, it's patched (falls through to error case)
    }
  
    // Serial number indicates patched console (100% unhackable via RCM)
    return {
      status: 'error',
      message: 'Patched Switch - 100% unhackable via RCM',
      color: 'red'
    };
  };