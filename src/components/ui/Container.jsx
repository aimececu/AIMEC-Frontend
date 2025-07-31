import React from 'react';
import clsx from 'clsx';

const Container = ({ 
  children, 
  size = 'lg',
  className = '', 
  ...props 
}) => {
  const sizeClasses = {
    sm: 'max-w-4xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  const classes = clsx(
    'mx-auto px-4',
    sizeClasses[size],
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Container; 