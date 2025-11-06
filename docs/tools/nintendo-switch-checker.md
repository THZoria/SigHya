# Nintendo Switch Checker

**Path**: `/nxchecker`

## Overview

The Nintendo Switch Checker allows you to verify if your Nintendo Switch console is compatible with modding by analyzing its serial number.

## How It Works

1. **Input**: Enter your Nintendo Switch serial number (found under the console)
2. **Analysis**: The tool checks the serial number against known patched/unpatched ranges
3. **Result**: Displays compatibility status with detailed information

## Serial Number Format

- Must start with: `XAW`, `XAJ`, `XKJ`, `XKW`, or `HAE`
- Example: `XAW10012345678`

## Compatibility Status

- ✅ **Unpatched Switch**: Compatible with modding (consoles before June 2018)
- ⚠️ **Indeterminate**: Serial number not recognized
- ❌ **Patched Switch**: Not compatible (Mariko, OLED, Lite, or Switch 2 models)

## Technical Details

### Implementation Files

- `src/hooks/useNXChecker.ts` - React hook for compatibility checking
- `src/api/nxchecker.ts` - Core compatibility logic
- `src/pages/NXChecker.tsx` - User interface

### Algorithm

1. **Serial Number Validation**: Checks format (XAW, XAJ, XKJ, XKW, HAE prefixes)
2. **Model Detection**: 
   - `XKJ` → Mariko (patched)
   - `XKW` → OLED Mariko (patched)
   - `XJE` → Lite Mariko (patched)
   - `HAE` → Switch 2 (patched)
3. **Range Checking**: For XAW/XAJ prefixes, extracts numeric portion and compares against known ranges:
   - **Success Range**: Consoles manufactured before June 2018 (unpatched)
   - **Warning Range**: Consoles in transition period (indeterminate)
   - **Error Range**: Consoles after patch date (patched)

### Serial Number Ranges

```typescript
XAW1: success ≤ 7999, warning ≤ 8999
XAW4: success ≤ 1100, warning ≤ 1200
XAW7: success ≤ 1799, warning ≤ 1899
XAJ1: success ≤ 2000, warning ≤ 3000
XAJ4: success ≤ 5299, warning ≤ 5399
XAJ7: success ≤ 4299, warning ≤ 4399
```

### Processing

- 100% client-side, no data sent to servers
- URL parameter support for sharing results

