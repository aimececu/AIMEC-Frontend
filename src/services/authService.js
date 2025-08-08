import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://169.254.31.130:3750/api';

// Configurar axios con interceptores para manejo automático de sessionId
const authAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Para enviar cookies automáticamente
});

// Interceptor para agregar sessionId a las peticiones
authAxios.interceptors.request.use(
  (config) => {
    // Obtener sessionId del localStorage
    const sessionId = localStorage.getItem('sessionId');

    // Agregar header de sessionId
    if (sessionId) {
      config.headers['X-Session-ID'] = sessionId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
authAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Si el error es 401, limpiar sessionId y redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
      
      // Redirigir al login
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    this.checkAuthStatus();
  }

  // Verificar estado de autenticación al inicializar
  async checkAuthStatus() {
    const sessionId = localStorage.getItem('sessionId');

    if (sessionId) {
      try {
        const response = await authAxios.get('/auth/verify');
        if (response.data.success) {
          this.isAuthenticated = true;
          this.user = response.data.data.user;
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
      } catch (error) {
        this.logout();
      }
    }
  }

  // Login
  async login(email, password) {
    try {
      const response = await authAxios.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { sessionId, user } = response.data.data;
        
        // Guardar sessionId en localStorage
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('user', JSON.stringify(user));
        
        this.isAuthenticated = true;
        this.user = user;
        
        return { success: true, user };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error en el login'
      };
    }
  }

  // Logout
  async logout() {
    try {
      await authAxios.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar localStorage
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
      
      this.isAuthenticated = false;
      this.user = null;
    }
  }

  // Verificar autenticación
  async verifyAuth() {
    try {
      const response = await authAxios.get('/auth/verify');
      if (response.data.success) {
        this.isAuthenticated = true;
        this.user = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        return { success: true, user: response.data.data.user };
      }
    } catch (error) {
      this.logout();
      return { success: false, error: 'No autenticado' };
    }
  }

  // Obtener usuario actual
  getCurrentUser() {
    if (!this.user) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.user = JSON.parse(userStr);
      }
    }
    return this.user;
  }

  // Verificar si está autenticado
  isLoggedIn() {
    return this.isAuthenticated && !!this.user;
  }

  // Verificar si es admin
  isAdmin() {
    return this.user?.role === 'admin';
  }

  // Renovar sesión manualmente
  async renewSession() {
    try {
      const response = await authAxios.post('/auth/renew-session');
      return { success: true };
    } catch (error) {
      this.logout();
      return { success: false, error: 'Error al renovar sesión' };
    }
  }

  // Obtener sesiones del usuario
  async getUserSessions() {
    try {
      const response = await authAxios.get('/auth/sessions');
      return { success: true, sessions: response.data.data };
    } catch (error) {
      return { success: false, error: 'Error al obtener sesiones' };
    }
  }

  // Cerrar todas las sesiones
  async logoutAllSessions() {
    try {
      await authAxios.post('/auth/logout-all');
      this.logout();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al cerrar sesiones' };
    }
  }

  // Actualizar perfil
  async updateProfile(profileData) {
    try {
      const response = await authAxios.put('/auth/profile', profileData);
      if (response.data.success) {
        this.user = response.data.data;
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return { success: true, user: response.data.data };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al actualizar perfil'
      };
    }
  }

  // Registrar usuario (solo admin)
  async registerUser(userData) {
    try {
      const response = await authAxios.post('/auth/register', userData);
      return { success: true, user: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al registrar usuario'
      };
    }
  }
}

// Crear instancia singleton
const authService = new AuthService();

export default authService;
export { authAxios };
