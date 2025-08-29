import React, { useState, useRef, useEffect } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

  // Verificar si se puede hacer scroll en ambas direcciones
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      
      // Actualizar el índice actual basado en la posición del scroll
      const firstChild = scrollContainerRef.current.firstElementChild;
      if (firstChild) {
        const itemWidth = firstChild.offsetWidth + 24; // 24px es el gap (gap-6)
        const newIndex = Math.round(scrollLeft / itemWidth);
        setCurrentIndex(Math.max(0, newIndex));
      }
    }
  };

  // Verificar scroll al montar y cuando cambien los children
  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [children]);

  // Scroll hacia la izquierda (de 1 en 1)
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstChild = container.firstElementChild;
      if (firstChild) {
        const itemWidth = firstChild.offsetWidth + 24; // 24px es el gap (gap-6)
        container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
      }
    }
  };

  // Scroll hacia la derecha (de 1 en 1)
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstChild = container.firstElementChild;
      if (firstChild) {
        const itemWidth = firstChild.offsetWidth + 24; // 24px es el gap (gap-6)
        container.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }
    }
  };

  // Ir a un índice específico
  const goToIndex = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstChild = container.firstElementChild;
      if (firstChild) {
        const itemWidth = firstChild.offsetWidth + 24; // 24px es el gap
        const scrollAmount = itemWidth * index;
        container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        setCurrentIndex(index);
      }
    }
  };

  // Manejar scroll del contenedor
  const handleScroll = () => {
    checkScrollButtons();
  };

  const totalItems = React.Children.count(children);
  const totalPages = Math.ceil(totalItems / itemsPerView);

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

      {/* Contenedor del carrusel con navegación */}
      <div className="relative group">
        {/* Botón de navegación izquierda */}
        {showNavigation && canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-full shadow-lg flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Ver productos anteriores"
          >
            <Icon name="FiChevronLeft" size="sm" />
          </button>
        )}

        {/* Contenedor scrollable con padding para evitar corte */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {children}
        </div>

        {/* Botón de navegación derecha */}
        {showNavigation && canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-full shadow-lg flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Ver más productos"
          >
            <Icon name="FiChevronRight" size="sm" />
          </button>
        )}

        {/* Indicadores de scroll */}
        {showNavigation && totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentIndex 
                      ? 'bg-primary-600 dark:bg-primary-400' 
                      : 'bg-secondary-300 dark:bg-secondary-600 hover:bg-secondary-400 dark:hover:bg-secondary-500'
                  }`}
                  aria-label={`Ir a página ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
