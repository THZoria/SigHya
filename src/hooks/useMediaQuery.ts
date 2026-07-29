import { useState, useEffect } from 'react';

/**
 * Custom hook to handle media query matching
 * Provides reactive updates when media query conditions change
 * 
 * @param query - CSS media query string to match against
 * @returns boolean indicating if the media query matches
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    /**
     * Update matches state when media query changes
     * @param e - MediaQueryListEvent containing the new match state
     */
    const updateMatches = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Add event listener for media query changes
    mediaQuery.addEventListener('change', updateMatches);
    
    // Cleanup: remove event listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
};