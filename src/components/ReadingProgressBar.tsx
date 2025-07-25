import React, { useState, useEffect, useCallback } from 'react';

interface ReadingProgressBarProps {
  color?: string;
  height?: number;
  showPercentage?: boolean;
  smooth?: boolean;
}

const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  color = 'from-blue-500 to-blue-600',
  height = 1,
  showPercentage = false,
  smooth = true
}) => {
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (docHeight <= 0) return;
    
    const scrollPercent = (scrollTop / docHeight) * 100;
    const clampedProgress = Math.min(Math.max(scrollPercent, 0), 100);
    
    setProgress(clampedProgress);
  }, []);

  useEffect(() => {
    // Throttle scroll events for better performance
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    updateProgress();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateProgress]);

  // Always show the bar when there's progress, even if small
  if (progress <= 0) {
    return null;
  }

  return (
    <div 
      className="fixed top-0 left-0 w-full bg-transparent z-40"
      style={{ height: `${height}px` }}
    >
      <div 
        className={`h-full bg-gradient-to-r ${color} transition-all duration-150 ease-out relative`}
        style={{ 
          width: `${progress}%`,
          transition: smooth ? 'width 150ms ease-out' : 'none'
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            animation: 'shimmer 2s infinite'
          }}
        />
      </div>
      
      {/* Optional percentage display */}
      {showPercentage && (
        <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-75">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default ReadingProgressBar; 