# PS5 UART Checker

**Path**: `/ps5`

## Overview

Analyze and troubleshoot PS5 UART error codes. This tool helps identify hardware and software issues based on error codes from the PlayStation 5 console.

## How It Works

1. **Search**: Enter a UART error code (e.g., `80050000`)
2. **Filter**: Results are filtered in real-time as you type
3. **Details**: View error description, status, priority, and suggested solutions

## Error Code Format

- **Format**: Hexadecimal (e.g., `80050000`)
- **Search**: Case-insensitive, partial matches supported

## Features

- **Real-time Search**: Instant filtering as you type
- **Pagination**: Navigate through results efficiently
- **Priority Levels**: Critical, High, Medium, Low
- **Caching**: Results cached locally for 7 days

## Technical Details

### Implementation Files

- `src/pages/PS5.tsx` - Main component with search and pagination
- Data source: `https://raw.githubusercontent.com/amoamare/Console-Service-Tool/master/Resources/ErrorCodes.json`

### Data Structure

```typescript
interface ErrorCode {
  ID: string;           // Error code (e.g., "80050000")
  Message: string;     // Error description
  Status: number;       // Status code
  Priority: number;     // 1=Critical, 2=High, 3=Medium, 4=Low
}
```

### Caching Strategy

- **Storage**: `localStorage` with key `ps5-error-codes`
- **Duration**: 7 days (604,800,000 ms)
- **Structure**: `{ data: {...}, timestamp: number }`
- **Cache Validation**: Checks timestamp before using cached data
- **Fallback**: Fetches fresh data if cache expired or invalid

### Search Algorithm

1. **Real-time Filtering**: Filters as user types (debounced 500ms)
2. **Case-insensitive**: Converts both search term and error codes to lowercase
3. **Multi-field Search**: Searches in both `ID` and `Message` fields
4. **Partial Matching**: Uses `includes()` for substring matching

### Pagination

- **Items per page**: 5 results
- **URL Parameters**: `?q=searchterm&page=2`
- **Navigation**: Previous/Next buttons with page numbers
- **State Management**: Syncs with URL for shareable links

### Error Handling

- Network errors: Displays user-friendly error message
- Invalid data: Validates JSON structure before processing
- Cache errors: Falls back to fresh fetch if cache parsing fails

