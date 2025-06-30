import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component automatically scrolls to the top of the page
 * when the route changes. This ensures users start at the top of each page.
 * 
 * This component doesn't render anything visible - it only handles scroll behavior.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Scroll to top whenever the pathname changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;