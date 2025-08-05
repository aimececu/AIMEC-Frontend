import React, { createContext, useContext, useState, useEffect } from 'react';
import { authEndpoints } from '../api/endpoints/auth.js';
import { authUtils } from '../api/client.js';

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
    const checkAuth = async () => {
      try {
        const sessionId = authUtils.getSessionId();
        const user = authUtils.getCurrentUser();
        
        console.log('🔍 Verificando sesión:', { sessionId: !!sessionId, user: !!user });
        
        if (sessionId && user) {
          // Verificar si el token sigue siendo válido
          const isValid = await authEndpoints.verifyAuth();
          console.log('🔍 Resultado de verificación:', isValid);
          
          if (isValid) {
            setState({
              isAuthenticated: true,
              user: user,
              isLoading: false
            });
            console.log('✅ Sesión válida, usuario autenticado');
            return;
          } else {
            // Token inválido, limpiar datos
            console.log('❌ Sesión inválida, limpiando datos');
            authUtils.clearAuth();
          }
        } else {
          console.log('❌ No hay sesión guardada');
        }
      } catch (error) {
        console.error('❌ Error al verificar autenticación:', error);
        authUtils.clearAuth();
      }
      
      setState(prev => ({ 
        isAuthenticated: false, 
        user: null, 
        isLoading: false 
      }));
    };

    checkAuth();
  }, []);

  // Función de login
  const login = async (email, password) => {
    try {
      console.log('🔐 Intentando login con:', email);
      const response = await authEndpoints.login(email, password);
      
      console.log('🔐 Respuesta de login:', response);
      
      if (response.success) {
        setState({
          isAuthenticated: true,
          user: response.data.user,
          isLoading: false
        });
        console.log('✅ Login exitoso, usuario autenticado');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { 
        success: false, 
        error: error.message || 'Error al iniciar sesión. Por favor, intenta nuevamente.' 
      };
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      console.log('🚪 Iniciando logout...');
      await authEndpoints.logout();
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('❌ Error en logout:', error);
    } finally {
      // Actualizar estado
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
      console.log('🔄 Estado actualizado después del logout');
    }
  };

  // Verificar si la sesión está activa
  const checkSession = async () => {
    try {
      return await authEndpoints.verifyAuth();
    } catch (error) {
      console.error('Error al verificar la sesión:', error);
      return false;
    }
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