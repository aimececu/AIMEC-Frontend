import React, { createContext, useContext, useState, useEffect } from 'react';

// Credenciales del admin (en producción esto debería estar en una base de datos)
const ADMIN_CREDENTIALS = {
  email: 'admin@aimec.com',
  password: 'admin123'
};

// Estado inicial
const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true
};

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  // Verificar si hay una sesión guardada al cargar
  useEffect(() => {
    const checkAuth = () => {
      const savedAuth = localStorage.getItem('adminAuth');
      if (savedAuth) {
        try {
          const authData = JSON.parse(savedAuth);
          // Verificar si la sesión no ha expirado (24 horas)
          const now = new Date().getTime();
          if (authData.expiresAt && now < authData.expiresAt) {
            setState({
              isAuthenticated: true,
              user: authData.user,
              isLoading: false
            });
            return;
          }
        } catch (error) {
          console.error('Error al cargar la autenticación:', error);
        }
      }
      setState(prev => ({ ...prev, isLoading: false }));
    };

    checkAuth();
  }, []);

  // Función de login
  const login = async (email, password) => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar credenciales
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const user = {
          id: 1,
          email: email,
          name: 'Administrador',
          role: 'admin'
        };

        // Crear sesión con expiración (24 horas)
        const expiresAt = new Date().getTime() + (24 * 60 * 60 * 1000);
        const authData = {
          user,
          expiresAt
        };

        // Guardar en localStorage
        localStorage.setItem('adminAuth', JSON.stringify(authData));

        // Actualizar estado
        setState({
          isAuthenticated: true,
          user,
          isLoading: false
        });

        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Error al iniciar sesión. Por favor, intenta nuevamente.' 
      };
    }
  };

  // Función de logout
  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('adminAuth');
    
    // Actualizar estado
    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  };

  // Verificar si la sesión está activa
  const checkSession = () => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        const now = new Date().getTime();
        if (authData.expiresAt && now < authData.expiresAt) {
          return true;
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
      }
    }
    return false;
  };

  const value = {
    // Estado
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: state.isLoading,
    
    // Funciones
    login,
    logout,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 