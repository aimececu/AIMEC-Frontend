import React from 'react';
import Icon from './Icon';
import Button from './Button';
import Select from './Select';
import clsx from 'clsx';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 12,
  itemsPerPageOptions = [6, 12, 24, 48],
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  showInfo = true,
  className = ""
}) => {
  // Calcular información de paginación
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  // Generar números de página a mostrar (máximo 6 botones)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 6; // Máximo 6 botones de página
    
    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si son 6 o menos
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar máximo 6 páginas con elipsis
      let startPage, endPage;
      
      if (currentPage <= 3) {
        // Si estamos en las primeras 3 páginas, mostrar 1-5 + última
        startPage = 1;
        endPage = 5;
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Si estamos en las últimas 3 páginas, mostrar primera + ... + últimas 5
        startPage = totalPages - 4;
        endPage = totalPages;
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Si estamos en el medio, mostrar primera + ... + actual-1, actual, actual+1 + ... + última
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1 && !showItemsPerPage) {
    return null;
  }

  return (
    <div className={clsx("flex flex-col sm:flex-row justify-between items-center gap-4", className)}>
      {/* Información de paginación */}
      {showInfo && (
        <div className="text-sm text-secondary-600 dark:text-secondary-300">
          Mostrando {startItem}-{endItem} de {totalItems} productos
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Selector de elementos por página */}
        {showItemsPerPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary-600 dark:text-secondary-300 whitespace-nowrap">
              Mostrar:
            </span>
            <Select
              options={itemsPerPageOptions.map(option => ({
                value: option,
                label: `${option} por página`
              }))}
              value={itemsPerPage}
              onChange={onItemsPerPageChange}
              className="w-32"
            />
          </div>
        )}

        {/* Navegación de páginas */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* Botón anterior */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 p-0 flex items-center justify-center"
              title="Página anterior"
            >
              <Icon name="FiChevronLeft" size="sm" />
            </Button>

            {/* Números de página */}
            <div className="flex items-center gap-1">
              {pageNumbers.map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="w-10 h-10 flex items-center justify-center text-secondary-500 dark:text-secondary-400">
                      ...
                    </span>
                  ) : (
                    <Button
                      variant={currentPage === page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className={clsx(
                        "w-10 h-10 p-0 flex items-center justify-center",
                        currentPage === page && "bg-primary-600 text-white hover:bg-primary-700"
                      )}
                    >
                      {page}
                    </Button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Botón siguiente */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 p-0 flex items-center justify-center"
              title="Página siguiente"
            >
              <Icon name="FiChevronRight" size="sm" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
