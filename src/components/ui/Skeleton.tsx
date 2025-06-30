import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animate?: boolean;
}

/**
 * Skeleton component for loading states
 * Provides animated placeholder content while data is loading
 * 
 * @param className - Additional CSS classes
 * @param width - Width of the skeleton (can be CSS value or number)
 * @param height - Height of the skeleton (can be CSS value or number)
 * @param rounded - Border radius variant
 * @param animate - Whether to show loading animation
 * 
 * @example
 * <Skeleton width="100%" height={200} rounded="lg" />
 * <Skeleton className="w-32 h-8" rounded="md" />
 */
const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = 'md',
  animate = true
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  const baseClasses = `bg-gray-700 ${roundedClasses[rounded]} ${className}`;

  if (!animate) {
    return <div className={baseClasses} style={style} />;
  }

  return (
    <motion.div
      className={baseClasses}
      style={style}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

/**
 * Skeleton variants for common use cases
 */
export const SkeletonText = ({ lines = 1, className = '' }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height={16}
        width={i === lines - 1 ? '75%' : '100%'}
        rounded="sm"
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`p-4 space-y-4 ${className}`}>
    <Skeleton height={200} rounded="lg" />
    <div className="space-y-2">
      <Skeleton height={20} width="60%" rounded="sm" />
      <Skeleton height={16} width="40%" rounded="sm" />
      <Skeleton height={16} width="80%" rounded="sm" />
    </div>
  </div>
);

export const SkeletonAvatar = ({ size = 40, className = '' }: { size?: number; className?: string }) => (
  <Skeleton
    width={size}
    height={size}
    rounded="full"
    className={className}
  />
);

export default Skeleton; 