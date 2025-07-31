# 🗄️ Configuración de Base de Datos y Sistema de Importación

## 📋 Requisitos Previos

### 1. PostgreSQL
- **Versión**: 12 o superior
- **Descarga**: [PostgreSQL Downloads](https://www.postgresql.org/download/)
- **Instalación**: Sigue las instrucciones oficiales para tu sistema operativo

### 2. Node.js
- **Versión**: 16 o superior
- **Descarga**: [Node.js Downloads](https://nodejs.org/)

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Base de Datos

#### Opción A: Usando el script SQL
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

#### Opción B: Usando pgAdmin
1. Abrir pgAdmin
2. Crear nueva base de datos llamada `aimec_products`
3. Abrir Query Tool
4. Copiar y pegar el contenido de `database_schema.sql`
5. Ejecutar el script

### 3. Configurar Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:

```env
# Configuración de Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aimec_products
DB_USER=postgres
DB_PASSWORD=tu_password_aqui

# Configuración de la Aplicación
VITE_APP_NAME=AIMEC
VITE_APP_VERSION=1.0.0
```

### 4. Verificar Conexión
```bash
# Ejecutar el proyecto
npm run dev

# Verificar en la consola del navegador que no hay errores de conexión
```

## 📊 Estructura de la Base de Datos

### Tablas Principales
- **`products`**: Productos principales
- **`brands`**: Marcas de productos
- **`categories`**: Categorías principales
- **`subcategories`**: Subcategorías
- **`product_series`**: Series de productos

### Sistema Dinámico de Especificaciones
- **`specification_types`**: Tipos de especificaciones
- **`product_specifications`**: Valores de especificaciones por producto

### Relaciones y Características
- **`accessories`**: Accesorios de productos
- **`related_products`**: Productos relacionados
- **`features`**: Características de productos
- **`applications`**: Aplicaciones de productos
- **`certifications`**: Certificaciones

### Sistema de Importación
- **`import_templates`**: Plantillas de importación
- **`import_history`**: Historial de importaciones

## 📁 Sistema de Importación CSV/Excel

### Formatos Soportados
- **CSV** (.csv)
- **Excel** (.xlsx, .xls)
- **Tamaño máximo**: 10MB

### Plantillas Predefinidas

#### 1. Plantilla Básica
```csv
sku,name,description,price,stock_quantity,brand,category,main_image,is_active
PROD-001,Producto Ejemplo,Descripción del producto,100.00,50,Siemens,Controladores,producto.jpg,true
```

#### 2. Plantilla Industrial Completa
```csv
sku,name,description,price,stock_quantity,brand,category,cpu,memory,power,voltage,temperature,protection,accessories,features,applications,certifications
PROD-001,PLC S7-1200,Controlador lógico programable,1299.99,25,Siemens,Controladores,CPU 1214C,100 KB,24V DC,24V DC,-20°C a +60°C,IP20,"[{""name"":""Módulo Expansión"",""price"":299.99}]","[{""feature_id"":1}]","[{""application_id"":1}]","[{""certification_id"":1}]"
```

#### 3. Plantilla Sensores
```csv
sku,name,description,price,stock_quantity,brand,range,accuracy,response_time,output,power_supply,protection
SENS-001,Sensor Ultrasónico,Sensor de proximidad,299.99,75,Siemens,20-2000 mm,±1%,< 50 ms,PNP/NPN,10-30V DC,IP67
```

### Proceso de Importación

1. **Preparar archivo**: Usar una de las plantillas predefinidas
2. **Seleccionar archivo**: Subir CSV o Excel
3. **Elegir plantilla**: Seleccionar la plantilla correspondiente
4. **Validar datos**: El sistema valida automáticamente
5. **Procesar**: Importar productos a la base de datos
6. **Revisar resultados**: Ver productos exitosos y errores

## 🔧 Gestión de Especificaciones Dinámicas

### Tipos de Especificaciones
- **text**: Texto libre
- **number**: Números decimales
- **boolean**: Verdadero/Falso
- **select**: Lista de opciones
- **range**: Rango de valores

### Agregar Nuevas Especificaciones

1. Ir a **Administración > Especificaciones**
2. Hacer clic en **"Agregar Especificación"**
3. Completar:
   - **Nombre**: Identificador único (ej: `cpu`)
   - **Nombre de Visualización**: Nombre para mostrar (ej: `CPU`)
   - **Tipo de Dato**: text, number, boolean, etc.
   - **Unidad**: opcional (ej: `mm`, `kg`, `V`)
   - **Categoría**: Categoría de productos
   - **Requerido**: Si es obligatorio

### Ejemplo de Especificaciones por Categoría

#### Controladores
- `cpu`: CPU del controlador
- `memory`: Memoria de trabajo
- `digital_inputs`: Número de entradas digitales
- `digital_outputs`: Número de salidas digitales
- `analog_inputs`: Número de entradas analógicas
- `communication`: Tipos de comunicación
- `power_supply`: Alimentación eléctrica
- `operating_temperature`: Temperatura de operación
- `protection`: Nivel de protección

#### Sensores
- `range`: Rango de medición
- `accuracy`: Precisión
- `response_time`: Tiempo de respuesta
- `output`: Tipo de salida
- `power_supply`: Alimentación
- `protection`: Protección ambiental

#### Variadores
- `power`: Potencia nominal
- `input_voltage`: Voltaje de entrada
- `output_voltage`: Voltaje de salida
- `frequency`: Rango de frecuencia
- `control_type`: Tipo de control

## 📈 Gestión de Productos

### Agregar Producto Manualmente

1. Ir a **Administración > Productos**
2. Hacer clic en **"Agregar Producto"**
3. Completar información básica:
   - SKU único
   - Nombre del producto
   - Descripción
   - Precio
   - Stock
   - Categoría y marca

4. **Especificaciones**: Agregar especificaciones según la categoría
5. **Accesorios**: Listar accesorios disponibles
6. **Productos Relacionados**: Vincular productos similares
7. **Características**: Marcar características destacadas
8. **Aplicaciones**: Especificar usos típicos
9. **Certificaciones**: Listar certificaciones

### Editar Producto

1. En la lista de productos, hacer clic en **"Editar"**
2. Modificar cualquier campo
3. Guardar cambios

### Eliminar Producto

1. En la lista de productos, hacer clic en **"Eliminar"**
2. Confirmar eliminación
3. El producto se marca como inactivo (soft delete)

## 🔍 Búsqueda y Filtros

### Filtros Disponibles
- **Búsqueda por texto**: Nombre o SKU
- **Categoría**: Filtrar por categoría principal
- **Marca**: Filtrar por marca
- **Stock**: En stock / Sin stock

### Ordenamiento
- Por nombre (A-Z, Z-A)
- Por precio (menor a mayor, mayor a menor)
- Por stock (mayor a menor)
- Por fecha de creación

## 📊 Dashboard y Estadísticas

### Métricas Disponibles
- **Total de productos**: Número total de productos activos
- **En stock**: Productos con stock > 0
- **Sin stock**: Productos con stock = 0
- **Stock bajo**: Productos con stock ≤ nivel mínimo
- **Precio promedio**: Precio promedio de todos los productos
- **Stock total**: Suma total de unidades en stock

## 🛠️ Mantenimiento

### Backup de Base de Datos
```bash
# Crear backup
pg_dump -U postgres aimec_products > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
psql -U postgres aimec_products < backup_file.sql
```

### Limpieza de Datos
```sql
-- Eliminar productos inactivos (opcional)
DELETE FROM products WHERE is_active = false;

-- Limpiar especificaciones huérfanas
DELETE FROM product_specifications 
WHERE product_id NOT IN (SELECT id FROM products WHERE is_active = true);
```

### Optimización
```sql
-- Analizar estadísticas de tablas
ANALYZE products;
ANALYZE product_specifications;
ANALYZE accessories;

-- Reindexar tablas
REINDEX TABLE products;
REINDEX TABLE product_specifications;
```

## 🚨 Solución de Problemas

### Error de Conexión a Base de Datos
1. Verificar que PostgreSQL esté ejecutándose
2. Confirmar credenciales en `.env`
3. Verificar que la base de datos existe
4. Comprobar permisos del usuario

### Error en Importación
1. Verificar formato del archivo
2. Confirmar que las columnas coinciden con la plantilla
3. Revisar datos requeridos
4. Verificar codificación del archivo (UTF-8)

### Productos No Se Muestran
1. Verificar que `is_active = true`
2. Comprobar filtros aplicados
3. Verificar relaciones con categorías/marcas

## 📞 Soporte

Para problemas técnicos o preguntas sobre la configuración:
- Revisar logs de la aplicación
- Verificar configuración de base de datos
- Consultar documentación de PostgreSQL
- Contactar al equipo de desarrollo

---

**Nota**: Este sistema está diseñado para manejar hasta 10,000 productos de manera eficiente. Para volúmenes mayores, considerar optimizaciones adicionales como particionamiento de tablas o implementación de caché. 