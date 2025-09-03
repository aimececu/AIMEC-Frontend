import React, { useState, useEffect } from "react";
import Icon from "./Icon";

const ProductCarousel = ({ 
  children, 
  title, 
  subtitle, 
  icon, 
  className = "",
  itemsPerView = 4,
  showNavigation = true 
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [responsiveItemsPerView, setResponsiveItemsPerView] = useState(itemsPerView);

  // Detectar el número de columnas basado en el tamaño de pantalla
  const getResponsiveItemsPerView = () => {
    if (typeof window === 'undefined') return itemsPerView;
    
    const width = window.innerWidth;
    
    if (width < 475) return 1;      // Mobile: 1 columna
    if (width < 640) return 2;      // XS: 2 columnas
    if (width < 768) return 2;      // SM: 2 columnas
    if (width < 1024) return 3;     // MD: 3 columnas
    if (width < 1280) return 3;     // LG: 3 columnas
    return 4;                       // XL+: 4 columnas
  };

  // Actualizar itemsPerView cuando cambie el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerView = getResponsiveItemsPerView();
      setResponsiveItemsPerView(newItemsPerView);
    };

    // Establecer el valor inicial
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcular páginas y items actuales
  useEffect(() => {
    const childrenArray = React.Children.toArray(children);
    const total = childrenArray.length;
    const pages = Math.ceil(total / responsiveItemsPerView);
    
    setTotalPages(pages);
    
    // Obtener los items de la página actual
    const startIndex = currentPage * responsiveItemsPerView;
    const endIndex = startIndex + responsiveItemsPerView;
    const pageItems = childrenArray.slice(startIndex, endIndex);
    
    setCurrentItems(pageItems);
  }, [children, currentPage, responsiveItemsPerView]);

  // Resetear página cuando cambie el número de items por vista
  useEffect(() => {
    setCurrentPage(0);
  }, [responsiveItemsPerView]);

  // Navegar a la página anterior
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navegar a la página siguiente
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Ir a una página específica
  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {icon && (
          <Icon 
            name={icon} 
            className="text-primary-600 dark:text-primary-400 text-2xl" 
          />
        )}
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <span className="text-sm text-secondary-500 dark:text-secondary-400">
            {subtitle}
          </span>
        )}
      </div>

      {/* Contenedor del grid con navegación */}
      <div className="relative group">
        {/* Botón de navegación izquierda */}
        {showNavigation && canGoPrevious && (
          <button
            onClick={goToPreviousPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-full shadow-lg flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Página anterior"
          >
            <Icon name="FiChevronLeft" size="sm" />
          </button>
        )}

        {/* Grid de productos responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 md:gap-6 px-4">
          {currentItems}
        </div>

        {/* Botón de navegación derecha */}
        {showNavigation && canGoNext && (
          <button
            onClick={goToNextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-full shadow-lg flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Página siguiente"
          >
            <Icon name="FiChevronRight" size="sm" />
          </button>
        )}

        {/* Indicadores de páginas */}
        {showNavigation && totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentPage 
                      ? 'bg-primary-600 dark:bg-primary-400' 
                      : 'bg-secondary-300 dark:bg-secondary-600 hover:bg-secondary-400 dark:hover:bg-secondary-500'
                  }`}
                  aria-label={`Ir a página ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Información de página */}
        {showNavigation && totalPages > 1 && (
          <div className="text-center mt-4 text-sm text-secondary-500 dark:text-secondary-400">
            Página {currentPage + 1} de {totalPages}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
