import React from 'react';
import clsx from 'clsx';

const Input = ({ 
  label, 
  error, 
  helperText, 
  leftIcon, 
  rightIcon, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
  
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
    : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-secondary-800 dark:border-secondary-600';

  const classes = clsx(baseClasses, stateClasses, className);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
            {leftIcon}
          </div>
        )}
        
        <input
          className={clsx(
            classes,
            leftIcon && 'pl-10',
            rightIcon && 'pr-10'
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={clsx(
          'mt-1 text-sm',
          error 
            ? 'text-red-600 dark:text-red-400' 
            : 'text-secondary-500 dark:text-secondary-400'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input; 