import React from 'react';
import clsx from 'clsx';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconOnly = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-200 text-secondary-800 hover:bg-secondary-300 focus:ring-secondary-500 dark:bg-secondary-700 dark:text-white dark:hover:bg-secondary-600',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500',
    ghost: 'text-secondary-600 hover:bg-secondary-100 focus:ring-secondary-500 dark:text-secondary-300 dark:hover:bg-secondary-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  };

  const iconOnlyClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    iconOnly ? iconOnlyClasses[size] : sizeClasses[size],
    className
  );

  return (
    <button 
      className={classes}
      disabled={disabled}
      {...props}
    >
      {icon && !iconOnly && (
        <span className={clsx('mr-2', iconOnly && 'mr-0')}>
          {icon}
        </span>
      )}
      {iconOnly ? icon : children}
    </button>
  );
};

export default Button; 