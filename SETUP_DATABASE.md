# 🗄️ Configuración de Base de Datos Real

## 📋 Estado Actual

Actualmente la aplicación está funcionando con **datos locales simulados** para que puedas probar todas las funcionalidades sin necesidad de configurar PostgreSQL.

## 🚀 Para Activar la Base de Datos Real

### 1. Instalar PostgreSQL
```bash
# Windows: Descargar desde https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql postgresql-contrib
```

### 2. Instalar Dependencias de Base de Datos
```bash
npm install pg xlsx papaparse
npm install --save-dev @types/pg @types/papaparse
```

### 3. Configurar Base de Datos
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE aimec_products;

# Conectar a la base de datos
\c aimec_products

# Ejecutar el script de esquema
\i database_schema.sql
```

### 4. Configurar Variables de Entorno
Crear archivo `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aimec_products
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
```

### 5. Cambiar a Base de Datos Real

Reemplazar el contenido de `src/services/database.js` con la versión completa que incluye PostgreSQL.

## 🔄 Migración de Datos

### Opción 1: Importación Manual
1. Ir a **Administración > Importar**
2. Usar las plantillas predefinidas
3. Subir archivos CSV con tus productos

### Opción 2: Script de Migración
```javascript
// Crear script para migrar datos locales a PostgreSQL
import { siemensProducts } from './src/data/siemensProducts.js';
import { productService } from './src/services/database.js';

for (const product of siemensProducts) {
  await productService.createProduct(product);
}
```

## 📊 Ventajas de la Base de Datos Real

### ✅ Funcionalidades Completas
- **Búsqueda avanzada** con índices PostgreSQL
- **Filtros dinámicos** por cualquier campo
- **Paginación eficiente** para miles de productos
- **Búsqueda de texto completo** en español

### ✅ Gestión Avanzada
- **Especificaciones dinámicas** sin límite
- **Importación masiva** de archivos CSV/Excel
- **Historial de cambios** y auditoría
- **Backup automático** y recuperación

### ✅ Escalabilidad
- **Hasta 100,000 productos** sin problemas
- **Múltiples usuarios** simultáneos
- **Optimización automática** de consultas
- **Caché inteligente** para mejor rendimiento

## 🛠️ Mantenimiento

### Backup Automático
```bash
# Crear backup diario
pg_dump -U postgres aimec_products > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U postgres aimec_products < backup_20241201.sql
```

### Optimización
```sql
-- Analizar estadísticas
ANALYZE products;
ANALYZE product_specifications;

-- Reindexar tablas
REINDEX TABLE products;
```

## 🔧 Configuración de Producción

### Variables de Entorno Recomendadas
```env
# Base de Datos
DB_HOST=tu-servidor-postgresql.com
DB_PORT=5432
DB_NAME=aimec_products
DB_USER=aimec_user
DB_PASSWORD=password_seguro_y_complejo

# Pool de Conexiones
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# Seguridad
NODE_ENV=production
JWT_SECRET=tu_jwt_secret_muy_seguro
```

### Configuración de PostgreSQL
```sql
-- Crear usuario específico
CREATE USER aimec_user WITH PASSWORD 'password_seguro';

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE aimec_products TO aimec_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO aimec_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO aimec_user;
```

## 📈 Monitoreo

### Métricas Importantes
- **Tiempo de respuesta** de consultas
- **Uso de memoria** de PostgreSQL
- **Número de conexiones** activas
- **Tamaño de la base de datos**

### Herramientas de Monitoreo
- **pgAdmin**: Interfaz gráfica para administración
- **pg_stat_statements**: Estadísticas de consultas
- **pgBadger**: Análisis de logs de PostgreSQL

## 🚨 Solución de Problemas

### Error de Conexión
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql

# Verificar configuración
psql -U postgres -h localhost -p 5432 -d aimec_products
```

### Error de Permisos
```sql
-- Verificar permisos del usuario
\du aimec_user

-- Dar permisos si es necesario
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO aimec_user;
```

### Error de Memoria
```sql
-- Ajustar configuración de memoria
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
SELECT pg_reload_conf();
```

---

## 📞 Soporte

Cuando estés listo para configurar la base de datos real:

1. **Instalar PostgreSQL** siguiendo las instrucciones oficiales
2. **Ejecutar el script** `database_schema.sql`
3. **Instalar dependencias** adicionales
4. **Configurar variables** de entorno
5. **Migrar datos** locales a PostgreSQL

¡La aplicación funcionará perfectamente con datos locales hasta que estés listo para la migración! 