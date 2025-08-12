import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import clsx from 'clsx';

const Select = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Seleccionar...', 
  searchable = false,
  multiple = false,
  label,
  error,
  className = '',
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find(option => option.value === value);
  const selectedOptions = multiple && Array.isArray(value) 
    ? options.filter(option => value.includes(option.value))
    : [];

  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValue = value ? [...value] : [];
      const index = newValue.indexOf(optionValue);
      
      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        newValue.push(optionValue);
      }
      
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const removeSelected = (optionValue) => {
    const newValue = value.filter(v => v !== optionValue);
    onChange(newValue);
  };

  const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 cursor-pointer';
  
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
    : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-secondary-800 dark:border-secondary-600';

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div
          className={clsx(baseClasses, stateClasses, className)}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1 min-h-6">
              {multiple && selectedOptions.length > 0 ? (
                selectedOptions.map(option => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-md"
                  >
                    {option.label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelected(option.value);
                      }}
                      className="hover:bg-primary-200 rounded-full p-0.5"
                    >
                      <Icon name="FiX" size="xs" />
                    </button>
                  </span>
                ))
              ) : (
                <span className={selectedOption ? 'text-secondary-900 dark:text-white' : 'text-secondary-500'}>
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              )}
            </div>
            <Icon 
              name="FiChevronDown"
              size="sm"
              className={clsx(
                'text-secondary-400 transition-transform duration-200',
                isOpen && 'rotate-180'
              )} 
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-secondary-200 dark:border-secondary-700">
                <div className="relative">
                  <Icon name="FiSearch" size="sm" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-3 py-2 text-sm border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={clsx(
                      'px-3 py-2 text-sm cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-150',
                      multiple && value?.includes(option.value) && 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
                      !multiple && value === option.value && 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    )}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-secondary-500 dark:text-secondary-400">
                  No se encontraron opciones
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select; 