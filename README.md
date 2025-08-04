# ⚛️ AIMEC Frontend - React + Vite

Aplicación web moderna para gestión de productos industriales con autenticación basada en sesiones y arquitectura modular.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Integration](#-api-integration)
- [Autenticación](#-autenticación)
- [Componentes](#-componentes)
- [Desarrollo](#-desarrollo)
- [Despliegue](#-despliegue)

## ✨ Características

- ✅ **Autenticación por SessionID**: Sistema seguro sin JWT
- ✅ **Arquitectura Modular**: Componentes reutilizables
- ✅ **Context API**: Gestión de estado global
- ✅ **React Router**: Navegación SPA
- ✅ **Tailwind CSS**: Estilos modernos y responsive
- ✅ **API Integration**: Cliente HTTP organizado
- ✅ **Manejo de Errores**: Centralizado y consistente
- ✅ **Responsive Design**: Optimizado para móviles
- ✅ **TypeScript Ready**: Preparado para migración
- ✅ **Vite**: Build tool rápido y moderno

## 🛠️ Tecnologías

### Core
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router** - Navegación SPA
- **Context API** - Gestión de estado

### UI & Estilos
- **Tailwind CSS** - Framework de CSS
- **Headless UI** - Componentes accesibles
- **Heroicons** - Iconos SVG
- **React Hook Form** - Formularios

### Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **PostCSS** - Procesamiento CSS
- **Autoprefixer** - Compatibilidad CSS

## 🏗️ Arquitectura

```
AIMEC/
├── public/                 # Archivos estáticos
├── src/
│   ├── api/               # Cliente HTTP y endpoints
│   │   ├── client.js      # Cliente base
│   │   ├── index.js       # Exportaciones
│   │   └── endpoints/     # Endpoints por dominio
│   ├── components/        # Componentes reutilizables
│   │   ├── ui/           # Componentes base
│   │   ├── Auth/         # Componentes de auth
│   │   ├── Cart/         # Componentes del carrito
│   │   └── Navigation/   # Componentes de navegación
│   ├── context/          # Contextos React
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/            # Páginas de la aplicación
│   │   ├── Home/
│   │   ├── Auth/
│   │   ├── Catalog/
│   │   ├── Admin/
│   │   └── ProductDetail/
│   ├── services/         # Servicios (legacy)
│   ├── config/           # Configuraciones
│   ├── utils/            # Utilidades
│   ├── assets/           # Recursos estáticos
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── package.json          # Dependencias y scripts
├── vite.config.js        # Configuración de Vite
├── tailwind.config.js    # Configuración de Tailwind
└── README.md             # Esta documentación
```

## 🚀 Instalación

### Prerrequisitos
- Node.js v18 o superior
- npm o yarn
- Backend AIMEC corriendo

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd AIMEC
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Crear archivo .env
cp .env.example .env

# Editar configuración
nano .env
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# =====================================================
# CONFIGURACIÓN DE LA API
# =====================================================
VITE_API_URL=http://localhost:3750/api

# =====================================================
# CONFIGURACIÓN DE LA APLICACIÓN
# =====================================================
VITE_APP_NAME=AIMEC
VITE_APP_VERSION=1.0.0

# =====================================================
# CONFIGURACIÓN DE DESARROLLO
# =====================================================
VITE_DEV_MODE=true
VITE_DEBUG_LEVEL=info
```

### Configuración de Vite (vite.config.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### Configuración de Tailwind (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
}
```

## 🎯 Uso

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

### Scripts Disponibles

```bash
npm run dev              # Desarrollo
npm run build            # Construir para producción
npm run preview          # Vista previa de producción
npm run lint             # Linting de código
npm run lint:fix         # Linting con auto-fix
```

### URLs de Desarrollo

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3750
- **API Docs**: http://localhost:3750/api-docs

## 📁 Estructura del Proyecto

### API Client (`src/api/`)

Sistema organizado de comunicación con el backend:

```javascript
// Cliente base
import { apiRequest } from '../api';

// Endpoints específicos
import { authEndpoints, productEndpoints } from '../api';

// API completa
import api from '../api';
```

#### Estructura de API

```
src/api/
├── client.js              # Cliente HTTP base
├── index.js               # Exportaciones centralizadas
├── endpoints/             # Endpoints por dominio
│   ├── auth.js           # Autenticación
│   ├── products.js       # Productos
│   ├── categories.js     # Categorías
│   ├── specifications.js # Especificaciones
│   └── system.js         # Sistema
└── README.md             # Documentación de API
```

### Componentes (`src/components/`)

#### UI Components (`src/components/ui/`)

Componentes base reutilizables:

- **Button.jsx** - Botones con variantes
- **Input.jsx** - Campos de entrada
- **Card.jsx** - Contenedores de tarjetas
- **Modal.jsx** - Ventanas modales
- **Loading.jsx** - Indicadores de carga

#### Feature Components

- **Auth/** - Componentes de autenticación
- **Cart/** - Componentes del carrito
- **Navigation/** - Componentes de navegación

### Contextos (`src/context/`)

Gestión de estado global:

```javascript
// AuthContext - Autenticación
import { useAuth } from '../context/AuthContext';

// CartContext - Carrito de compras
import { useCart } from '../context/CartContext';

// ThemeContext - Tema de la aplicación
import { useTheme } from '../context/ThemeContext';
```

### Páginas (`src/pages/`)

Páginas principales de la aplicación:

- **Home/** - Página principal
- **Auth/** - Login y registro
- **Catalog/** - Catálogo de productos
- **ProductDetail/** - Detalle de producto
- **Admin/** - Panel de administración
- **Quotation/** - Cotizaciones

## 🌐 API Integration

### Cliente HTTP Base

```javascript
// src/api/client.js
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Configuración por defecto
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  // Agregar sessionID si existe
  const sessionId = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
  if (sessionId) {
    config.headers['X-Session-ID'] = sessionId;
  }

  // Realizar petición
  const response = await fetch(url, config);
  return response.json();
};
```

### Endpoints Organizados

```javascript
// Autenticación
const loginResult = await authEndpoints.login('admin@aimec.com', 'admin123');

// Productos
const products = await productEndpoints.getProducts({ limit: 10 });

// Categorías
const categories = await categoryEndpoints.getCategories();

// API completa
const data = await api.products.getProducts();
```

### Manejo de Errores

```javascript
try {
  const products = await productEndpoints.getProducts();
  console.log('Productos:', products);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('Error de API:', error.message, error.status);
  } else {
    console.error('Error inesperado:', error);
  }
}
```

## 🔐 Autenticación

### Sistema de Sesiones

El frontend utiliza un sistema de autenticación basado en **SessionID**:

1. **Login**: Usuario envía credenciales → Backend retorna SessionID
2. **Almacenamiento**: SessionID se guarda en localStorage
3. **Requests**: SessionID se envía automáticamente en headers
4. **Verificación**: Backend valida SessionID en cada request
5. **Logout**: SessionID se elimina del localStorage

### Flujo de Autenticación

```javascript
// 1. Login
const { login } = useAuth();
const result = await login('admin@aimec.com', 'admin123');

if (result.success) {
  // Usuario autenticado
  console.log('Login exitoso:', result.data.user);
}

// 2. Verificar autenticación
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log('Usuario autenticado:', user);
}

// 3. Logout
const { logout } = useAuth();
await logout();
```

### Context de Autenticación

```javascript
// src/context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  const login = async (email, password) => {
    // Lógica de login
  };

  const logout = async () => {
    // Lógica de logout
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Rutas Protegidas

```javascript
// src/components/Auth/ProtectedRoute.jsx
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};
```

## 🧩 Componentes

### Componentes Base

#### Button Component

```javascript
import { Button } from '../components/ui/Button';

// Uso
<Button variant="primary" size="lg" onClick={handleClick}>
  Guardar
</Button>

// Variantes disponibles
<Button variant="primary">Primario</Button>
<Button variant="secondary">Secundario</Button>
<Button variant="danger">Peligro</Button>
<Button variant="ghost">Fantasma</Button>
```

#### Input Component

```javascript
import { Input } from '../components/ui/Input';

// Uso
<Input
  type="email"
  placeholder="Ingresa tu email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

#### Card Component

```javascript
import { Card } from '../components/ui/Card';

// Uso
<Card>
  <Card.Header>
    <Card.Title>Título de la tarjeta</Card.Title>
  </Card.Header>
  <Card.Body>
    Contenido de la tarjeta
  </Card.Body>
  <Card.Footer>
    <Button>Acción</Button>
  </Card.Footer>
</Card>
```

### Componentes de Página

#### ProductCard

```javascript
import { ProductCard } from '../components/ui/ProductCard';

// Uso
<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
  onViewDetails={handleViewDetails}
/>
```

#### CartWidget

```javascript
import { CartWidget } from '../components/Cart/CartWidget';

// Uso
<CartWidget
  itemCount={cartItems.length}
  total={cartTotal}
  onCheckout={handleCheckout}
/>
```

## 💻 Desarrollo

### Estructura de Desarrollo

#### 1. Crear Nuevo Componente

```javascript
// src/components/NewComponent.jsx
import React from 'react';
import { Button } from './ui/Button';

export const NewComponent = ({ title, onAction }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Button onClick={onAction}>Acción</Button>
    </div>
  );
};
```

#### 2. Crear Nueva Página

```javascript
// src/pages/NewPage/NewPage.jsx
import React, { useState, useEffect } from 'react';
import { productEndpoints } from '../../api';

export const NewPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await productEndpoints.getProducts();
        setData(result.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Nueva Página</h1>
      {/* Contenido */}
    </div>
  );
};
```

#### 3. Agregar Nueva Ruta

```javascript
// src/App.jsx
import { NewPage } from './pages/NewPage/NewPage';

// En el router
<Route path="/new-page" element={<NewPage />} />
```

### Debugging

#### React DevTools

Instalar React DevTools para debugging:
- **Chrome**: React Developer Tools extension
- **Firefox**: React Developer Tools addon

#### Console Logging

```javascript
// Logs de desarrollo
console.log('Estado actual:', state);
console.error('Error:', error);

// Logs condicionales
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', debugData);
}
```

#### Network Tab

Verificar peticiones HTTP en las herramientas de desarrollador:
- **URLs**: Verificar que apunten al backend correcto
- **Headers**: Verificar SessionID en requests autenticados
- **Responses**: Verificar formato de respuestas

### Testing

```bash
# Ejecutar tests (cuando se implementen)
npm test

# Tests de componentes
npm run test:components

# Tests de integración
npm run test:integration

# Coverage
npm run test:coverage
```

## 🚀 Despliegue

### Construcción para Producción

```bash
# Construir aplicación
npm run build

# Vista previa de producción
npm run preview
```

### Despliegue en Netlify

```bash
# Configurar Netlify
netlify deploy --prod --dir=dist

# O con GitHub integration
# 1. Conectar repositorio en Netlify
# 2. Configurar build command: npm run build
# 3. Configurar publish directory: dist
```

### Despliegue en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno
vercel env add VITE_API_URL
```

### Variables de Entorno en Producción

```env
# Producción
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=AIMEC
VITE_DEV_MODE=false
```

### Optimización de Build

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

## 🔧 Configuración Avanzada

### Configuración de ESLint

```javascript
// .eslintrc.cjs
module.exports = {
  extends: [
    'eslint:recommended',
    '@react-app',
    '@react-app/jest'
  ],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn'
  }
};
```

### Configuración de Prettier

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Configuración de PostCSS

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## 🐛 Solución de Problemas

### Errores Comunes

#### 1. Error de Conexión a API

```bash
# Verificar que el backend esté corriendo
curl http://localhost:3750/health

# Verificar variables de entorno
echo $VITE_API_URL

# Verificar CORS en el backend
```

#### 2. Error de Build

```bash
# Limpiar cache
npm run clean

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar versiones de Node.js
node --version
npm --version
```

#### 3. Error de Rutas

```bash
# Verificar configuración de React Router
# Verificar que las rutas estén correctamente definidas
# Verificar que los componentes existan
```

### Performance

#### Optimización de Bundle

```bash
# Analizar bundle
npm run build
npx vite-bundle-analyzer dist

# Optimizar imports
import { Button } from './ui/Button'; // ✅
import Button from './ui/Button';     // ❌
```

#### Lazy Loading

```javascript
// Cargar componentes bajo demanda
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Con Suspense
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

## 📞 Soporte

### Recursos Adicionales

- **Documentación React**: https://react.dev/
- **Documentación Vite**: https://vitejs.dev/
- **Documentación Tailwind**: https://tailwindcss.com/
- **Backend API**: http://localhost:3750/api-docs

### Contacto

Para soporte técnico o preguntas:
- **Email**: soporte@aimec.com
- **Documentación**: Ver README del backend
- **Issues**: Crear issue en el repositorio

---

**¡El frontend está listo para desarrollo y producción!** 🚀
