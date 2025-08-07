# 📚 API Endpoints - Frontend

Esta documentación describe todos los endpoints disponibles en el frontend que se conectan con el backend AIMEC.

## 🔧 Configuración

### URL Base
```javascript
// Desarrollo
BASE_URL: 'http://localhost:3750/api'

// Producción
BASE_URL: process.env.VITE_API_URL
```

### Autenticación
El frontend usa session-based authentication con el header `X-Session-ID`.

## 🔐 Autenticación

### Login
```javascript
import { authEndpoints } from '@/api/endpoints/auth';

const response = await authEndpoints.login(email, password);
// Guarda automáticamente sessionId y user en localStorage
```

### Logout
```javascript
await authEndpoints.logout();
// Limpia automáticamente sessionId y user de localStorage
```

### Verificar Autenticación
```javascript
const isAuthenticated = await authEndpoints.verifyAuth();
```

### Perfil de Usuario
```javascript
// Obtener perfil
const profile = await authEndpoints.getProfile();

// Actualizar perfil
const updated = await authEndpoints.updateProfile({
  name: 'Nuevo Nombre',
  email: 'nuevo@email.com'
});
```

### Registro
```javascript
// Registrar primer administrador
await authEndpoints.registerInitial({
  name: 'Admin',
  email: 'admin@aimec.com',
  password: 'password123'
});

// Registrar usuario (solo admin)
await authEndpoints.register({
  name: 'Usuario',
  email: 'user@aimec.com',
  password: 'password123',
  role: 'user'
});
```

## 📦 Productos

### Operaciones Básicas
```javascript
import { productEndpoints } from '@/api/endpoints/products';

// Obtener todos los productos
const products = await productEndpoints.getProducts();

// Obtener producto por ID
const product = await productEndpoints.getProductById(1);

// Crear producto
const newProduct = await productEndpoints.createProduct({
  name: 'Producto Nuevo',
  description: 'Descripción',
  price: 100.00
});

// Actualizar producto
const updated = await productEndpoints.updateProduct(1, {
  name: 'Producto Actualizado'
});

// Eliminar producto
await productEndpoints.deleteProduct(1);
```

### Búsqueda y Filtros
```javascript
// Buscar productos
const results = await productEndpoints.searchProducts('término de búsqueda');

// Productos por categoría
const categoryProducts = await productEndpoints.getProductsByCategory(1);

// Productos por marca
const brandProducts = await productEndpoints.getProductsByBrand(1);

// Productos destacados
const featured = await productEndpoints.getFeaturedProducts(10);

// Producto por slug
const product = await productEndpoints.getProductBySlug('producto-slug');

// Estadísticas
const stats = await productEndpoints.getProductStats();
```

### Aplicaciones de Producto
```javascript
// Obtener aplicaciones de un producto
const applications = await productEndpoints.getProductApplications(1);

// Asignar aplicaciones a un producto
await productEndpoints.assignApplicationsToProduct(1, [1, 2, 3]);
```

### Características de Producto
```javascript
// Obtener características
const features = await productEndpoints.getProductFeatures(1);

// Agregar característica
await productEndpoints.addProductFeature(1, {
  name: 'Característica',
  value: 'Valor'
});

// Actualizar característica
await productEndpoints.updateProductFeature(1, 1, {
  name: 'Característica Actualizada'
});

// Eliminar característica
await productEndpoints.deleteProductFeature(1, 1);
```

### Productos Relacionados
```javascript
// Obtener productos relacionados
const related = await productEndpoints.getProductRelated(1);

// Agregar producto relacionado
await productEndpoints.addProductRelated(1, {
  related_product_id: 2
});

// Actualizar producto relacionado
await productEndpoints.updateProductRelated(1, 1, {
  related_product_id: 3
});

// Eliminar producto relacionado
await productEndpoints.deleteProductRelated(1, 1);
```

## 📁 Categorías

```javascript
import { categoryEndpoints } from '@/api/endpoints/categories';

// Obtener todas las categorías
const categories = await categoryEndpoints.getCategories();

// Obtener categoría por ID
const category = await categoryEndpoints.getCategoryById(1);

// Crear categoría
const newCategory = await categoryEndpoints.createCategory({
  name: 'Nueva Categoría',
  description: 'Descripción'
});

// Actualizar categoría
const updated = await categoryEndpoints.updateCategory(1, {
  name: 'Categoría Actualizada'
});

// Eliminar categoría
await categoryEndpoints.deleteCategory(1);
```

## 🔧 Especificaciones

```javascript
import { specificationEndpoints } from '@/api/endpoints/specifications';

// Obtener todas las especificaciones
const specifications = await specificationEndpoints.getSpecifications();

// Obtener especificación por ID
const spec = await specificationEndpoints.getSpecificationById(1);

// Crear especificación
const newSpec = await specificationEndpoints.createSpecification({
  product_id: 1,
  specification_type_id: 1,
  value: 'Valor',
  unit: 'kg'
});

// Actualizar especificación
const updated = await specificationEndpoints.updateSpecification(1, {
  value: 'Nuevo Valor'
});

// Eliminar especificación
await specificationEndpoints.deleteSpecification(1);
```

## 🎯 Aplicaciones

```javascript
import { applicationEndpoints } from '@/api/endpoints/applications';

// Obtener todas las aplicaciones
const applications = await applicationEndpoints.getApplications();

// Obtener aplicación por ID
const app = await applicationEndpoints.getApplicationById(1);

// Crear aplicación
const newApp = await applicationEndpoints.createApplication({
  name: 'Nueva Aplicación',
  description: 'Descripción',
  icon: 'icon-name'
});

// Actualizar aplicación
const updated = await applicationEndpoints.updateApplication(1, {
  name: 'Aplicación Actualizada'
});

// Eliminar aplicación
await applicationEndpoints.deleteApplication(1);
```

## 📄 Archivos

```javascript
import { fileEndpoints } from '@/api/endpoints/files';

// Subir archivo
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

const uploadResult = await fileEndpoints.uploadFile(file, {
  type: 'image',
  description: 'Descripción del archivo'
});

// Eliminar archivo
await fileEndpoints.deleteFile('uploads/user/123/file.jpg');

// Obtener URL firmada
const signedUrl = await fileEndpoints.getSignedUrl('uploads/user/123/file.jpg', 3600);
```

## ⚙️ Sistema

```javascript
import { systemEndpoints } from '@/api/endpoints/system';

// Health check
const health = await systemEndpoints.healthCheck();

// Información de la API
const info = await systemEndpoints.getApiInfo();

// Test CORS
const corsTest = await systemEndpoints.testCors();
```

## 🛠️ Utilidades

### Construir Query Strings
```javascript
import { buildEndpoint } from '@/api/client';

const endpoint = buildEndpoint('/products', {
  category_id: 1,
  limit: 10,
  page: 1
});
// Resultado: /products?category_id=1&limit=10&page=1
```

### Manejo de Errores
```javascript
import { ApiError } from '@/api/client';

try {
  const result = await productEndpoints.getProducts();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Error ${error.status}: ${error.message}`);
  }
}
```

## 🔄 Ejemplos de Uso Completo

### Autenticación Completa
```javascript
import { authEndpoints } from '@/api/endpoints/auth';

// Login
const loginResponse = await authEndpoints.login('user@example.com', 'password');
if (loginResponse.success) {
  console.log('Usuario autenticado:', loginResponse.data.user);
}

// Verificar si está autenticado
const isAuth = await authEndpoints.verifyAuth();
if (isAuth) {
  // Obtener perfil
  const profile = await authEndpoints.getProfile();
  console.log('Perfil:', profile.data);
}

// Logout
await authEndpoints.logout();
```

### Gestión de Productos Completa
```javascript
import { productEndpoints } from '@/api/endpoints/products';

// Crear producto
const newProduct = await productEndpoints.createProduct({
  name: 'Producto Industrial',
  description: 'Descripción del producto',
  price: 1500.00,
  category_id: 1
});

// Asignar aplicaciones
await productEndpoints.assignApplicationsToProduct(newProduct.data.id, [1, 2, 3]);

// Agregar características
await productEndpoints.addProductFeature(newProduct.data.id, {
  name: 'Peso',
  value: '50',
  unit: 'kg'
});

// Buscar productos similares
const searchResults = await productEndpoints.searchProducts('industrial');
```

## 📝 Notas Importantes

1. **Autenticación**: Todas las peticiones que requieren autenticación incluyen automáticamente el `X-Session-ID` header.

2. **Manejo de Errores**: Todos los endpoints lanzan `ApiError` en caso de error, con información detallada.

3. **FormData**: El endpoint de archivos usa `FormData` para subir archivos.

4. **Query Parameters**: Usa `buildEndpoint` para construir URLs con parámetros de consulta.

5. **LocalStorage**: La autenticación se maneja automáticamente en localStorage.

## 🏗️ Estructura de Archivos

### Importaciones Directas
Cada archivo de endpoints se importa directamente desde su ubicación específica:

```javascript
// ❌ Antes (redundante)
import { authEndpoints } from '@/api/endpoints';

// ✅ Ahora (directo)
import { authEndpoints } from '@/api/endpoints/auth';
import { productEndpoints } from '@/api/endpoints/products';
import { categoryEndpoints } from '@/api/endpoints/categories';
import { specificationEndpoints } from '@/api/endpoints/specifications';
import { applicationEndpoints } from '@/api/endpoints/applications';
import { fileEndpoints } from '@/api/endpoints/files';
import { systemEndpoints } from '@/api/endpoints/system';
```

### Configuración Centralizada
Todos los endpoints usan las variables de configuración desde `config/api.js`:

```javascript
import { ENDPOINTS } from '../../config/api';

// Ejemplo de uso
const response = await apiRequest(ENDPOINTS.AUTH.LOGIN, {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

### Ventajas de esta Estructura
1. **Sin redundancia**: No hay archivo `index.js` que duplique las exportaciones
2. **Configuración centralizada**: Todos los endpoints usan las mismas variables
3. **Fácil mantenimiento**: Cambios en URLs solo requieren modificar `config/api.js`
4. **Importaciones claras**: Cada import indica exactamente qué archivo se está usando
5. **Mejor tree-shaking**: Solo se importa lo que se necesita
