import React from 'react';
import clsx from 'clsx';

const Loader = ({ 
  size = 'md', 
  variant = 'spinner', 
  className = '',
  text = 'Cargando...',
  showText = true 
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const renderSpinner = () => (
    <div className={clsx(
      'animate-spin rounded-full border-2 border-secondary-200 dark:border-secondary-700',
      'border-t-primary-600 dark:border-t-primary-400',
      sizeClasses[size],
      className
    )} />
  );

  const renderDots = () => (
    <div className={clsx('flex space-x-1', className)}>
      <div className={clsx(
        'bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce',
        size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
      )} style={{ animationDelay: '0ms' }} />
      <div className={clsx(
        'bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce',
        size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
      )} style={{ animationDelay: '150ms' }} />
      <div className={clsx(
        'bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce',
        size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
      )} style={{ animationDelay: '300ms' }} />
    </div>
  );

  const renderPulse = () => (
    <div className={clsx(
      'bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse',
      sizeClasses[size],
      className
    )} />
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  if (!showText) {
    return renderLoader();
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderLoader()}
      {text && (
        <p className={clsx(
          'text-secondary-600 dark:text-secondary-300 font-medium',
          textSizes[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader; 