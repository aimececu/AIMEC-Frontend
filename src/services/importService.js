// =====================================================
// SERVICIO DE IMPORTACIÓN SIMPLIFICADO
// =====================================================
// Esta es una versión temporal que simula la importación
// hasta que se configuren las dependencias de Excel/CSV

import { productService, importService as dbImportService } from './database.js';

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// =====================================================
// SERVICIO DE IMPORTACIÓN CSV/EXCEL
// =====================================================

export class ProductImportService {
  constructor() {
    this.supportedFormats = ['.csv', '.xlsx', '.xls'];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
  }

  // Validar archivo
  validateFile(file) {
    const errors = [];

    // Verificar formato
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!this.supportedFormats.includes(fileExtension)) {
      errors.push(`Formato no soportado. Formatos válidos: ${this.supportedFormats.join(', ')}`);
    }

    // Verificar tamaño
    if (file.size > this.maxFileSize) {
      errors.push(`Archivo demasiado grande. Máximo: ${this.maxFileSize / 1024 / 1024}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Leer archivo (simulado por ahora)
  async readFile(file) {
    await delay(1000); // Simular tiempo de lectura
    
    // Simular datos de ejemplo
    const mockData = [
      {
        sku: 'PROD-001',
        name: 'Producto de Ejemplo 1',
        description: 'Descripción del producto 1',
        price: '100.00',
        stock_quantity: '50',
        brand: 'Siemens',
        category: 'Controladores',
        cpu: 'CPU 1214C',
        memory: '100 KB',
        power: '24V DC'
      },
      {
        sku: 'PROD-002',
        name: 'Producto de Ejemplo 2',
        description: 'Descripción del producto 2',
        price: '200.00',
        stock_quantity: '25',
        brand: 'Siemens',
        category: 'Sensores',
        range: '20-2000 mm',
        accuracy: '±1%',
        response_time: '< 50 ms'
      }
    ];

    return mockData;
  }

  // Validar datos del producto
  validateProductData(row, templateConfig) {
    const errors = [];
    const warnings = [];

    // Validar campos requeridos
    for (const field of templateConfig.requiredFields || []) {
      if (!row[field] || row[field].toString().trim() === '') {
        errors.push(`Campo requerido faltante: ${field}`);
      }
    }

    // Validar SKU único
    if (row.sku) {
      if (row.sku.toString().trim() === '') {
        errors.push('SKU no puede estar vacío');
      }
    }

    // Validar precio
    if (row.price) {
      const price = parseFloat(row.price);
      if (isNaN(price) || price < 0) {
        errors.push('Precio debe ser un número válido mayor o igual a 0');
      }
    }

    // Validar stock
    if (row.stock_quantity) {
      const stock = parseInt(row.stock_quantity);
      if (isNaN(stock) || stock < 0) {
        errors.push('Stock debe ser un número entero mayor o igual a 0');
      }
    }

    return { errors, warnings };
  }

  // Convertir fila de datos a objeto de producto
  convertRowToProduct(row, templateConfig) {
    const product = {
      sku: row.sku?.toString().trim(),
      name: row.name?.toString().trim(),
      description: row.description?.toString().trim(),
      price: parseFloat(row.price) || 0,
      stock_quantity: parseInt(row.stock_quantity) || 0,
      brand: row.brand?.toString().trim(),
      category: row.category?.toString().trim(),
      main_image: row.main_image?.toString().trim() || 'producto-default.jpg',
      is_active: row.is_active !== 'false'
    };

    // Procesar especificaciones dinámicas
    if (templateConfig.specificationFields) {
      product.specifications = [];
      for (const specField of templateConfig.specificationFields) {
        if (row[specField.name] && row[specField.name].toString().trim() !== '') {
          const specValue = {
            specification_type_id: specField.specification_type_id || 1,
            value_text: row[specField.name].toString().trim(),
            value_number: null,
            value_boolean: null,
            value_json: null
          };

          // Determinar el tipo de valor basado en el tipo de especificación
          switch (specField.data_type) {
            case 'number':
              specValue.value_number = parseFloat(row[specField.name]);
              specValue.value_text = null;
              break;
            case 'boolean':
              specValue.value_boolean = row[specField.name].toLowerCase() === 'true';
              specValue.value_text = null;
              break;
            case 'text':
            default:
              specValue.value_text = row[specField.name].toString().trim();
              break;
          }

          product.specifications.push(specValue);
        }
      }
    }

    return product;
  }

  // Procesar importación completa
  async processImport(file, templateId, userId) {
    try {
      // 1. Crear registro de importación
      const importRecord = await dbImportService.createImportHistory({
        template_id: templateId,
        filename: file.name,
        total_rows: 0,
        status: 'processing',
        created_by: userId
      });

      // 2. Leer archivo
      const rawData = await this.readFile(file);
      
      // 3. Obtener configuración de plantilla
      const templates = await dbImportService.getImportTemplates();
      const template = templates.find(t => t.id === templateId);
      
      if (!template) {
        throw new Error('Plantilla de importación no encontrada');
      }

      const templateConfig = template.template_config;

      // 4. Procesar cada fila
      const results = {
        successful: [],
        failed: [],
        total: rawData.length
      };

      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        const rowNumber = i + 2; // +2 porque Excel/CSV empieza en 1 y tiene headers

        try {
          // Validar datos
          const validation = this.validateProductData(row, templateConfig);
          
          if (validation.errors.length > 0) {
            results.failed.push({
              row: rowNumber,
              data: row,
              errors: validation.errors,
              warnings: validation.warnings
            });
            continue;
          }

          // Convertir a producto
          const productData = this.convertRowToProduct(row, templateConfig);

          // Crear producto en base de datos
          const productId = await productService.createProduct(productData);

          results.successful.push({
            row: rowNumber,
            product_id: productId,
            data: productData,
            warnings: validation.warnings
          });

        } catch (error) {
          results.failed.push({
            row: rowNumber,
            data: row,
            errors: [error.message],
            warnings: []
          });
        }
      }

      // 5. Actualizar registro de importación
      await dbImportService.updateImportHistory(importRecord.id, {
        successful_rows: results.successful.length,
        failed_rows: results.failed.length,
        error_log: results.failed.length > 0 ? results.failed : null,
        status: results.failed.length === 0 ? 'completed' : 'completed_with_errors'
      });

      return {
        import_id: importRecord.id,
        results,
        template: template
      };

    } catch (error) {
      console.error('Error en importación:', error);
      throw error;
    }
  }

  // Generar plantilla de ejemplo
  generateTemplateExample(templateConfig) {
    const headers = [
      'sku', 'name', 'description', 'price', 'stock_quantity',
      'brand', 'category', 'main_image', 'is_active'
    ];

    // Agregar campos de especificaciones
    if (templateConfig.specificationFields) {
      templateConfig.specificationFields.forEach(field => {
        headers.push(field.name);
      });
    }

    const exampleRow = {
      sku: 'PROD-001',
      name: 'Producto de Ejemplo',
      description: 'Descripción completa del producto',
      price: '100.00',
      stock_quantity: '50',
      brand: 'Siemens',
      category: 'Controladores',
      main_image: 'producto-ejemplo.jpg',
      is_active: 'true'
    };

    // Agregar ejemplos de especificaciones
    if (templateConfig.specificationFields) {
      templateConfig.specificationFields.forEach(field => {
        switch (field.name) {
          case 'cpu':
            exampleRow[field.name] = 'CPU 1214C';
            break;
          case 'memory':
            exampleRow[field.name] = '100 KB';
            break;
          case 'power':
            exampleRow[field.name] = '24V DC';
            break;
          case 'range':
            exampleRow[field.name] = '20-2000 mm';
            break;
          case 'accuracy':
            exampleRow[field.name] = '±1%';
            break;
          default:
            exampleRow[field.name] = 'Valor de ejemplo';
        }
      });
    }

    return {
      headers,
      exampleRow
    };
  }

  // Exportar plantilla como CSV
  exportTemplateAsCSV(templateConfig) {
    const { headers, exampleRow } = this.generateTemplateExample(templateConfig);
    
    // Crear CSV
    const csvContent = [
      headers.join(','),
      headers.map(header => exampleRow[header] || '').join(',')
    ].join('\n');

    return csvContent;
  }

  // Exportar plantilla como Excel (simulado)
  exportTemplateAsExcel(templateConfig) {
    const { headers, exampleRow } = this.generateTemplateExample(templateConfig);
    
    // Simular generación de Excel
    console.log('Generando archivo Excel (simulado)...');
    
    // Crear un blob con contenido CSV como fallback
    const csvContent = this.exportTemplateAsCSV(templateConfig);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    
    return blob;
  }
}

// Instancia singleton
export const productImportService = new ProductImportService();

// =====================================================
// UTILIDADES DE VALIDACIÓN
// =====================================================

export const validationUtils = {
  // Validar formato de email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validar formato de URL
  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Validar formato de SKU
  isValidSKU(sku) {
    return /^[A-Z0-9\-_]+$/i.test(sku);
  },

  // Validar formato de precio
  isValidPrice(price) {
    const num = parseFloat(price);
    return !isNaN(num) && num >= 0;
  },

  // Validar formato de stock
  isValidStock(stock) {
    const num = parseInt(stock);
    return !isNaN(num) && num >= 0;
  },

  // Sanitizar texto
  sanitizeText(text) {
    if (!text) return '';
    return text.toString().trim().replace(/[<>]/g, '');
  },

  // Sanitizar HTML
  sanitizeHTML(html) {
    if (!html) return '';
    return html.toString().trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  }
};

// =====================================================
// CONFIGURACIONES DE PLANTILLAS PREDEFINIDAS
// =====================================================

export const defaultTemplates = {
  // Plantilla básica para productos simples
  basic: {
    name: 'Plantilla Básica',
    description: 'Plantilla para productos con información básica',
    requiredFields: ['sku', 'name', 'price'],
    optionalFields: [
      'description', 'stock_quantity', 'brand', 'category', 
      'main_image', 'is_active'
    ]
  },

  // Plantilla completa para productos industriales
  industrial: {
    name: 'Plantilla Industrial Completa',
    description: 'Plantilla completa para productos industriales con especificaciones técnicas',
    requiredFields: ['sku', 'name', 'price', 'category', 'brand'],
    optionalFields: [
      'description', 'stock_quantity', 'main_image', 'is_active'
    ],
    specificationFields: [
      { name: 'cpu', display_name: 'CPU', data_type: 'text' },
      { name: 'memory', display_name: 'Memoria', data_type: 'text' },
      { name: 'power', display_name: 'Potencia', data_type: 'text' },
      { name: 'voltage', display_name: 'Voltaje', data_type: 'text' },
      { name: 'temperature', display_name: 'Temperatura', data_type: 'text' },
      { name: 'protection', display_name: 'Protección', data_type: 'text' }
    ]
  },

  // Plantilla para sensores
  sensors: {
    name: 'Plantilla Sensores',
    description: 'Plantilla específica para sensores industriales',
    requiredFields: ['sku', 'name', 'price', 'brand'],
    optionalFields: [
      'description', 'stock_quantity', 'main_image', 'is_active'
    ],
    specificationFields: [
      { name: 'range', display_name: 'Rango', data_type: 'text' },
      { name: 'accuracy', display_name: 'Precisión', data_type: 'text' },
      { name: 'response_time', display_name: 'Tiempo de Respuesta', data_type: 'text' },
      { name: 'output', display_name: 'Tipo de Salida', data_type: 'text' },
      { name: 'power_supply', display_name: 'Alimentación', data_type: 'text' },
      { name: 'protection', display_name: 'Protección', data_type: 'text' }
    ]
  }
};

export default productImportService; 