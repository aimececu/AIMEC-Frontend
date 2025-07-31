import React from 'react';
import clsx from 'clsx';

const Section = ({ 
  children, 
  padding = 'lg',
  background = 'default',
  className = '', 
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
  };

  const backgroundClasses = {
    default: 'bg-white dark:bg-secondary-900',
    light: 'bg-secondary-50 dark:bg-secondary-800',
    primary: 'bg-primary-600 text-white',
    dark: 'bg-secondary-900 text-white',
  };

  const classes = clsx(
    paddingClasses[padding],
    backgroundClasses[background],
    className
  );

  return (
    <section className={classes} {...props}>
      {children}
    </section>
  );
};

export default Section; 