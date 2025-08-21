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
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  
  // Reiniciar estados cuando cambie la prop src
  React.useEffect(() => {
    // Limpiar timeout anterior si existe
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    if (src) {
      const newSrc = getImageUrl(src, size);
      setImgSrc(newSrc);
      setHasError(false);
      setIsLoading(true); // Activar loader

      // Establecer timeout de 3 segundos para mostrar fallback si no carga
      const id = setTimeout(() => {
        setHasError(true);
        setIsLoading(false);
        setTimeoutId(null);
      }, 3000);
      
      setTimeoutId(id);
    } else {
      setImgSrc(null);
      setHasError(false);
      setIsLoading(false);
    }

    // Cleanup function para limpiar el timeout
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [src, size]);

  // Loader mientras carga la imagen
  const loadingSpinner = (
    <div className={clsx(
      'flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500',
      fallbackClassName || className
    )}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
    </div>
  );

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
    setIsLoading(false); // Desactivar loader
    
    // Limpiar el timeout ya que hubo un error
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    
    // Intentar con el fallback personalizado primero
    if (fallbackSrc && fallbackSrc !== imgSrc) {
      setImgSrc(fallbackSrc);
      return;
    }
    
    // Si no hay fallback personalizado, mostrar directamente el ícono de galería
    setImgSrc(null);
  };

  // Si está cargando, mostrar el loader
  if (isLoading && imgSrc && !hasError) {
    return loadingSpinner;
  }

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
        setIsLoading(false); // Desactivar loader
        // Limpiar el timeout ya que la imagen se cargó
        if (timeoutId) {
          clearTimeout(timeoutId);
          setTimeoutId(null);
        }
      }}
      {...imgProps}
    />
  );
};

export default ImageWithFallback; 