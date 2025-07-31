import React from 'react';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'md',
  variant = 'default',
  hover = false,
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const variantClasses = {
    default: 'bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700',
    light: 'bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700',
    primary: 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800',
    success: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800',
    danger: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer' : '';

  const classes = clsx(
    'rounded-lg transition-all duration-200',
    variantClasses[variant],
    paddingClasses[padding],
    shadowClasses[shadow],
    hoverClasses,
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card; 