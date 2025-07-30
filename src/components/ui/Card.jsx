import React from 'react';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'md',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
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

  const classes = clsx(
    'bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700',
    paddingClasses[padding],
    shadowClasses[shadow],
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card; 