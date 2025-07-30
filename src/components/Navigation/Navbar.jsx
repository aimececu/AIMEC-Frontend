import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/catalogo', label: 'Catálogo' },
    { path: '/admin', label: 'Administración' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-secondary-800 shadow-md border-b border-secondary-200 dark:border-secondary-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-secondary-900 dark:text-white">
              AIMEC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'text-sm font-medium transition-colors duration-200',
                  isActive(item.path)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200 dark:border-secondary-700">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={clsx(
                    'text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200',
                    isActive(item.path)
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                      : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 