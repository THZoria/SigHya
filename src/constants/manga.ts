/**
 * Number of manga items to display per page in pagination
 */
export const ITEMS_PER_PAGE = 9;

/**
 * Available sorting options for manga lists
 * Used in manga filtering and display components
 */
export const SORT_OPTIONS = [
  { value: 'date', label: 'Date de sortie' },
  { value: 'price', label: 'Prix' },
  { value: 'name', label: 'Nom' }
];

/**
 * Maximum number of retry attempts for API calls
 * Used for error handling and resilience in data fetching
 */
export const MAX_RETRIES = 3;