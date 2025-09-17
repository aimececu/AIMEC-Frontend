import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import CartWidget from '../Cart/CartWidget';
import clsx from 'clsx';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/productos', label: 'Productos' },
    { path: '/servicios', label: 'Servicios' },
  ];


  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-secondary-800 shadow-md border-b border-secondary-200 dark:border-secondary-700">
      <div className="max-w-6xl mx-auto px-4">
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

          {/* Desktop: Theme Toggle, Login/User Menu & Cart */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Widget */}
            <CartWidget />
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Icon name="FiSun" /> : <Icon name="FiMoon" />}
            </button>

            {/* Login/User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-600 dark:text-secondary-300">
                  {user?.name}
                </span>
                <Link
                  to="/admin"
                  className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors duration-200"
                  title="Panel de Administración"
                >
                  <Icon name="FiSettings" size="sm" />
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
                title="Iniciar Sesión"
              >
                <Icon name="FiLogIn" size="sm" />
              </Link>
            )}
          </div>

          {/* Mobile: Only Cart & Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Cart Widget */}
            <CartWidget />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <Icon name="FiX" /> : <Icon name="FiMenu" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200 dark:border-secondary-700">
            <div className="flex flex-col space-y-2">
              {/* Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={clsx(
                    'text-sm font-medium px-4 py-3 rounded-lg transition-colors duration-200',
                    isActive(item.path)
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                      : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Theme Toggle */}
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                className="text-sm font-medium px-4 py-3 rounded-lg transition-colors duration-200 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 flex items-center gap-3"
              >
                <Icon name={isDark ? "FiSun" : "FiMoon"} size="sm" />
                {isDark ? 'Modo Claro' : 'Modo Oscuro'}
              </button>
              
              {/* Login/Admin */}
              {isAuthenticated ? (
                <div className="px-4 py-2">
                  <div className="text-xs text-secondary-500 dark:text-secondary-400 mb-2">
                    Conectado como: {user?.name}
                  </div>
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium px-4 py-3 rounded-lg transition-colors duration-200 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center gap-3"
                  >
                    <Icon name="FiSettings" size="sm" />
                    Panel de Administración
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium px-4 py-3 rounded-lg transition-colors duration-200 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 flex items-center gap-3"
                >
                  <Icon name="FiLogIn" size="sm" />
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 