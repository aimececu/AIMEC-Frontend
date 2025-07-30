import React from 'react';
import * as Icons from 'react-icons/fi';
import clsx from 'clsx';

const Icon = ({ 
  name, 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const classes = clsx(sizeClasses[size], className);

  return <IconComponent className={classes} {...props} />;
};

export default Icon; 