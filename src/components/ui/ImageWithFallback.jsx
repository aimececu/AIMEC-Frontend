import React, { useState } from 'react';
import clsx from 'clsx';
import { getImageUrl, getPlaceholderUrl } from '../../utils/imageService';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className = '', 
  fallbackClassName = '',
  fallbackSrc = null,
  size = '300x300',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(() => {
    // Procesar la URL inicial usando el servicio
    if (src) {
      return getImageUrl(src, size);
    }
    return null;
  });
  const [hasError, setHasError] = useState(false);
  
  // Reiniciar estados cuando cambie la prop src
  React.useEffect(() => {
    if (src) {
      const newSrc = getImageUrl(src, size);
      setImgSrc(newSrc);
      setHasError(false);
    } else {
      setImgSrc(null);
      setHasError(false);
    }
  }, [src, size]);

  // Fallback local - un SVG simple con un ícono de imagen
  const defaultFallback = (
    <div className={clsx(
      'flex items-center justify-center bg-secondary-100 dark:bg-secondary-700 text-secondary-400 dark:text-secondary-500',
      fallbackClassName || className
    )}>
      <svg 
        className="w-12 h-12" 
        fill="currentColor" 
        viewBox="0 0 24 24"
        aria-label={alt || 'Imagen no disponible'}
      >
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    </div>
  );

  const handleError = () => {
    setHasError(true);
    
    // Intentar con el fallback personalizado primero
    if (fallbackSrc && fallbackSrc !== imgSrc) {
      setImgSrc(fallbackSrc);
      return;
    }
    
    // Si no hay fallback personalizado, mostrar directamente el ícono de galería
    setImgSrc(null);
  };

  // Si no hay src inicial, imgSrc es null, o hubo un error, mostrar el fallback local
  if (!src || !imgSrc || hasError) {
    return defaultFallback;
  }

  // Filtrar props que no deben ir al elemento img  
  const { ...imgProps } = props;
  
  return (
    <img
      src={imgSrc}
      alt={alt || 'Imagen del producto'}
      className={className}
      onError={handleError}
      onLoad={() => {
        setHasError(false);
      }}
      {...imgProps}
    />
  );
};

export default ImageWithFallback; 