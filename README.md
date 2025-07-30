# AIMEC - Componentes Industriales

Sitio web para empresa especializada en instalación y programación de componentes industriales.

## 🚀 Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de CSS utility-first
- **React Router DOM** - Enrutamiento del lado del cliente
- **React Icons** - Biblioteca de iconos
- **clsx** - Utilidad para combinar clases CSS condicionalmente

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Navigation/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Select.jsx
│       ├── Icon.jsx
│       ├── Card.jsx
│       └── ProductCard.jsx
├── context/
│   └── ThemeContext.jsx
├── pages/
│   ├── Home/
│   │   └── Home.jsx
│   ├── Catalog/
│   │   └── Catalog.jsx
│   ├── Admin/
│   │   └── Admin.jsx
│   └── ProductDetail/
│       └── ProductDetail.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 🎨 Características

- **Diseño Responsivo** - Optimizado para móviles, tablets y desktop
- **Tema Oscuro/Claro** - Cambio dinámico de tema con persistencia
- **Componentes Reutilizables** - Biblioteca de UI components
- **Navegación Intuitiva** - Menú responsive con React Router
- **Catálogo de Productos** - Vista de productos con filtros
- **Panel de Administración** - Gestión de productos CRUD
- **Páginas de Detalle** - Información detallada de productos

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd AIMEC
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Construir para producción**
   ```bash
   npm run build
   ```

## 🎯 Componentes UI

### Button
```jsx
<Button variant="primary" size="md" icon={<FiPlus />}>
  Agregar Producto
</Button>
```

### Input
```jsx
<Input 
  label="Nombre del producto" 
  placeholder="Ingrese el nombre"
  leftIcon={<FiSearch />}
/>
```

### Select
```jsx
<Select
  options={[
    { value: 'electronics', label: 'Electrónicos' },
    { value: 'mechanical', label: 'Mecánicos' }
  ]}
  searchable
  multiple
/>
```

### Card
```jsx
<Card padding="lg" shadow="md">
  <h3>Contenido de la tarjeta</h3>
</Card>
```

### ProductCard
```jsx
<ProductCard 
  product={productData}
  showActions={true}
/>
```

## 🌙 Sistema de Temas

El proyecto incluye un sistema de temas que permite cambiar entre modo claro y oscuro:

```jsx
import { useTheme } from './context/ThemeContext';

const { isDark, toggleTheme } = useTheme();
```

## 📱 Responsive Design

- **Mobile First** - Diseño optimizado para dispositivos móviles
- **Breakpoints** - Adaptación automática a diferentes tamaños de pantalla
- **Grid System** - Layout flexible con CSS Grid y Flexbox

## 🎨 Tailwind CSS

El proyecto utiliza Tailwind CSS para el estilado:

- **Utility Classes** - Clases CSS predefinidas para desarrollo rápido
- **Custom Colors** - Paleta de colores personalizada
- **Dark Mode** - Soporte nativo para modo oscuro
- **Responsive** - Clases responsive integradas

## 📦 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run preview` - Vista previa de la construcción
- `npm run lint` - Linting del código

## 🔧 Configuración

### Tailwind CSS
El archivo `tailwind.config.js` contiene la configuración personalizada:
- Colores del tema
- Fuentes personalizadas
- Espaciado personalizado
- Modo oscuro

### Vite
Configuración optimizada en `vite.config.js` para:
- React Fast Refresh
- Optimización de build
- Soporte para JSX

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
