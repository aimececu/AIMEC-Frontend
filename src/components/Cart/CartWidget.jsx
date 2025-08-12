import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import { useCart } from '../../context/CartContext';
import clsx from 'clsx';

const CartWidget = ({ className = '' }) => {
  const { itemCount } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to="/cotizacion"
      className={clsx(
        'relative inline-flex items-center justify-center p-2 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon 
        name="FiShoppingCart" 
        size="lg"
        className={clsx(
          'transition-transform duration-200',
          isHovered && 'scale-110'
        )}
      />
      
      {/* Badge con contador */}
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] animate-pulse">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
      
      {/* Tooltip */}
      <div className={clsx(
        'absolute top-full right-0 mt-2 px-3 py-2 bg-secondary-900 text-white text-sm rounded-lg shadow-lg opacity-0 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap',
        isHovered && 'opacity-100'
      )}>
        {itemCount === 0 
          ? 'Carrito vacío' 
          : `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'} en cotización`
        }
        <div className="absolute -top-1 right-3 w-2 h-2 bg-secondary-900 transform rotate-45"></div>
      </div>
    </Link>
  );
};

export default CartWidget; 