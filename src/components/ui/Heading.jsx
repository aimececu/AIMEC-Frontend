import React from 'react';
import clsx from 'clsx';

const Heading = ({ 
  level = 1, 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-bold text-secondary-900 dark:text-white';
  
  const levelClasses = {
    1: 'text-4xl md:text-6xl',
    2: 'text-3xl md:text-4xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg',
  };

  const classes = clsx(baseClasses, levelClasses[level], className);

  const Tag = `h${level}`;

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

export default Heading; 