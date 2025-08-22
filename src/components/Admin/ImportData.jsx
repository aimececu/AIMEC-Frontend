import React, { useState } from "react";
import Card from "../ui/Card";
import Heading from "../ui/Heading";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Input from "../ui/Input";
import Loader from "../ui/Loader";
import { importEndpoints } from "../../api/endpoints/import";
import { productEndpoints } from "../../api/endpoints/products";
import { getAccessoriesByProduct } from "../../api/endpoints/accessories";
import { productFeatureEndpoints } from "../../api/endpoints/productFeatures";
import { productApplicationEndpoints } from "../../api/endpoints/productApplications";
import { relatedProductsEndpoints } from "../../api/endpoints/relatedProducts";

const ImportData = ({ onRefresh }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [validationErrors, setValidationErrors] = useState([]);
  const [canImport, setCanImport] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage({ type: "", text: "" });
      setPreviewData(null);
      setValidationErrors([]);
      setCanImport(false);
      // Procesar archivo para previsualización
      handleFilePreview(selectedFile);
    }
  };

  const handleFilePreview = async (selectedFile) => {
    setLoading(true);
    try {
      console.log('Previewing file:', selectedFile);
      const response = await importEndpoints.previewImportData(selectedFile);

      if (response.success) {
        setPreviewData(response.data.preview);
        setValidationErrors(response.data.validation_errors || []);
        setCanImport(response.data.can_import);

        if (
          response.data.validation_errors &&
          response.data.validation_errors.length > 0
        ) {
          setMessage({
            type: "error",
            text: `Se encontraron ${response.data.validation_errors.length} errores de validación. Revisa los datos antes de importar.`,
          });
        } else {
          setMessage({
            type: "success",
            text: `Archivo procesado correctamente. ${response.data.total_rows} filas encontradas.`,
          });
        }
      } else {
        setMessage({
          type: "error",
          text: response.error || "Error al procesar el archivo",
        });
      }
    } catch (error) {
      console.error("Error procesando archivo:", error);
      setMessage({
        type: "error",
        text:
          error.message ||
          "Error al procesar el archivo. Verifica que sea un archivo CSV válido.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file || !canImport) return;

    setImporting(true);
    try {
      const response = await importEndpoints.importSystemData(file);

      if (response.success) {
        const results = response.data;
        setMessage({
          type: "success",
          text: `Importación completada exitosamente. ${
            results.products_created
          } productos creados, ${results.products_updated} actualizados. ${
            results.features_created || 0
          } características, ${
            results.applications_created || 0
          } aplicaciones, ${results.accessories_created || 0} accesorios y ${
            results.related_products_created || 0
          } productos relacionados procesados.`,
        });

        // Limpiar estado
        setFile(null);
        setPreviewData(null);
        setValidationErrors([]);
        setCanImport(false);

        // Recargar datos del sistema
        if (onRefresh) {
          onRefresh();
        }
      } else {
        setMessage({
          type: "error",
          text: response.error || "Error durante la importación",
        });
      }
    } catch (error) {
      console.error("Error importando datos:", error);
      setMessage({
        type: "error",
        text:
          error.message ||
          "Error durante la importación. Verifica la conexión y vuelve a intentar.",
      });
    } finally {
      setImporting(false);
    }
  };

    const downloadTemplate = () => {
    // CSV simplificado con nombres intuitivos incluyendo características, aplicaciones, accesorios y productos relacionados
    const csvContent = `sku,nombre,descripcion,marca,categoria,subcategoria,precio,stock,stock_minimo,peso,dimensiones,imagen,caracteristicas,aplicaciones,accesorios,productos_relacionados
 SIEMENS-3RT1015-1BB41,Contacto auxiliar 3RT1015-1BB41,Contacto auxiliar normalmente abierto para contactores Siemens,Siemens,Contactores,Contactos auxiliares,25.50,100,10,0.5,50x30x20,https://example.com/siemens-contact.jpg,"Contacto NO;Tensión 24V DC;Corriente 10A;Temperatura -25°C a +70°C","Control de iluminación;Sistemas de seguridad;Automatización industrial","SIEMENS-3RT1015-1BB42;SIEMENS-3RT1015-1BB43","SIEMENS-3RT1015-1BB44:Complementario;SIEMENS-3RT1015-1BB45:Alternativo"
 ABB-1SBL123001R1000,Interruptor automático ABB 1SBL123001R1000,Interruptor automático de 1000A para distribución,ABB,Interruptores,Interruptores automáticos,1250.00,25,5,15.2,200x150x100,https://example.com/abb-breaker.jpg,"Corriente nominal 1000A;Tensión 690V;Poder de corte 50kA;Protección térmica y magnética","Distribución eléctrica;Centros de transformación;Subestaciones eléctricas","ABB-1SBL123001R1001;ABB-1SBL123001R1002","ABB-1SBL123001R1003:Similar;ABB-1SBL123001R1004:Reemplazo"
 SCHNEIDER-EZC100F,Interruptor diferencial EZC100F,Interruptor diferencial de alta sensibilidad para protección personal,Schneider,Protección,Interruptores diferenciales,45.80,75,8,0.8,80x40x30,https://example.com/schneider-diff.jpg,"Sensibilidad 30mA;Tensión 230V;Corriente 63A;Tiempo de desconexión <40ms","Instalaciones residenciales;Oficinas comerciales;Locales públicos","SCHNEIDER-EZC100G;SCHNEIDER-EZC100H","SCHNEIDER-EZC100I:Compatible;SCHNEIDER-EZC100J:Alternativo"
 PHOENIX-CONTACT-QUINT-PS,Fuente de alimentación QUINT-PS,Fuente de alimentación conmutada para aplicaciones industriales,Phoenix Contact,Fuentes de Alimentación,Fuentes industriales,89.90,120,15,1.2,120x60x40,https://example.com/phoenix-ps.jpg,"Potencia 24W;Tensión de entrada 85-264V AC;Tensión de salida 24V DC;Eficiencia 94%","Automatización industrial;Sistemas de control;Equipos de medición","PHOENIX-CONTACT-QUINT-PS-48;PHOENIX-CONTACT-QUINT-PS-12","PHOENIX-CONTACT-QUINT-PS-96:Potencia superior;PHOENIX-CONTACT-QUINT-PS-6:Potencia inferior"`;

    // Agregar BOM UTF-8 para caracteres especiales
    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csvContent;

    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_productos_completa.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadCurrentData = async () => {
    setExporting(true);
    try {
      setMessage({
        type: "info",
        text: "Obteniendo productos con todas sus relaciones...",
      });

      // Usar el nuevo endpoint que obtiene todo en una sola llamada
      const response = await productEndpoints.exportProductsWithRelations();

      if (response.success && response.data) {
        const products = response.data;

        console.log("Productos con relaciones recibidos:", products);

        setMessage({
          type: "info",
          text: `Procesando ${products.length} productos para exportación...`,
        });

        // Preparar datos para CSV
        const csvData = products.map((product) => {
          return {
            sku: product.sku || "",
            nombre: product.name || "",
            descripcion: product.description || "",
            marca: product.brand || "",
            categoria: product.category || "",
            subcategoria: product.subcategory || "",
            precio: product.price || "",
            stock: product.stock_quantity || "",
            stock_minimo: product.min_stock_level || "",
            peso: product.weight || "",
            dimensiones: product.dimensions || "",
            imagen: product.main_image || "",
            caracteristicas: Array.isArray(product.features)
              ? product.features.join(";")
              : "",
            aplicaciones: Array.isArray(product.applications)
              ? product.applications.join(";")
              : "",
            accesorios: Array.isArray(product.accessories)
              ? product.accessories.join(";")
              : "",
            productos_relacionados: Array.isArray(product.related_products)
              ? product.related_products
                  .map((rp) => `${rp.sku}:${rp.type}`)
                  .join(";")
              : "",
          };
        });

        // Convertir a CSV
        const headers = Object.keys(csvData[0] || {});
        const csvContent = [
          headers.join(","),
          ...csvData.map((row) =>
            headers
              .map((header) => {
                const value = row[header] || "";
                // Convertir a string y escapar comillas
                const stringValue = String(value);
                const escapedValue = stringValue.replace(/"/g, '""');
                // Envolver en comillas si contiene comas o punto y coma
                return stringValue.includes(",") || stringValue.includes(";")
                  ? `"${escapedValue}"`
                  : escapedValue;
              })
              .join(",")
          ),
        ].join("\n");

        // Agregar BOM UTF-8 para caracteres especiales
        const BOM = "\uFEFF";
        const csvWithBOM = BOM + csvContent;

        // Descargar archivo
        const blob = new Blob([csvWithBOM], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `productos_sistema_${
          new Date().toISOString().split("T")[0]
        }.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        // Contar productos con datos adicionales
        const productsWithFeatures = csvData.filter(
          (p) => p.caracteristicas
        ).length;
        const productsWithApplications = csvData.filter(
          (p) => p.aplicaciones
        ).length;
        const productsWithAccessories = csvData.filter(
          (p) => p.accesorios
        ).length;
        const productsWithRelated = csvData.filter(
          (p) => p.productos_relacionados
        ).length;

        console.log("=== RESUMEN DE EXPORTACIÓN ===");
        console.log(`Total productos: ${csvData.length}`);
        console.log(`Con características: ${productsWithFeatures}`);
        console.log(`Con aplicaciones: ${productsWithApplications}`);
        console.log(`Con accesorios: ${productsWithAccessories}`);
        console.log(`Con productos relacionados: ${productsWithRelated}`);
        console.log("===============================");

        setMessage({
          type: "success",
          text: `Exportación completada exitosamente. ${csvData.length} productos exportados con todas sus relaciones en una sola operación.`,
        });
      } else {
        setMessage({
          type: "error",
          text: "No se pudieron obtener los productos del sistema.",
        });
      }
    } catch (error) {
      console.error("Error exportando datos:", error);
      setMessage({
        type: "error",
        text: "Error al exportar los datos del sistema. Verifica la conexión y vuelve a intentar.",
      });
    } finally {
      setExporting(false);
    }
  };

  const downloadCurrentDataBasic = async () => {
    setExporting(true);
    try {
      // Obtener todos los productos del sistema
      const response = await productEndpoints.getProducts();

      if (response.success && response.data) {
        const products = response.data.products || response.data || [];

        console.log("Estructura de productos recibida:", products[0]);

        setMessage({
          type: "info",
          text: `Exportando datos básicos de ${products.length} productos...`,
        });

        // Preparar datos para CSV (solo información básica)
        const csvData = products.map((product) => {
          return {
            sku: product.sku || "",
            nombre: product.name || "",
            descripcion: product.description || "",
            marca: product.brand?.name || "",
            categoria: product.category?.name || "",
            subcategoria: product.subcategory?.name || "",
            precio: product.price || "",
            stock: product.stock_quantity || "",
            stock_minimo: product.min_stock || "",
            peso: product.weight || "",
            dimensiones: product.dimensions || "",
            imagen: product.main_image || "",
            caracteristicas: "",
            aplicaciones: "",
            accesorios: "",
            productos_relacionados: "",
          };
        });

        // Convertir a CSV
        const headers = Object.keys(csvData[0] || {});
        const csvContent = [
          headers.join(","),
          ...csvData.map((row) =>
            headers
              .map((header) => {
                const value = row[header] || "";
                // Convertir a string y escapar comillas
                const stringValue = String(value);
                const escapedValue = stringValue.replace(/"/g, '""');
                // Envolver en comillas si contiene comas o punto y coma
                return stringValue.includes(",") || stringValue.includes(";")
                  ? `"${escapedValue}"`
                  : escapedValue;
              })
              .join(",")
          ),
        ].join("\n");

        // Agregar BOM UTF-8 para caracteres especiales
        const BOM = "\uFEFF";
        const csvWithBOM = BOM + csvContent;

        // Descargar archivo
        const blob = new Blob([csvWithBOM], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `productos_basicos_${
          new Date().toISOString().split("T")[0]
        }.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        setMessage({
          type: "success",
          text: `Exportación básica completada. ${csvData.length} productos exportados con información básica.`,
        });
      } else {
        setMessage({
          type: "error",
          text: "No se pudieron obtener los productos del sistema.",
        });
      }
    } catch (error) {
      console.error("Error exportando datos básicos:", error);
      setMessage({
        type: "error",
        text: "Error al exportar los datos básicos del sistema. Verifica la conexión y vuelve a intentar.",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>Importar Datos</Heading>
          <p className="text-secondary-600 dark:text-secondary-400">
            Importa productos, marcas, categorías y subcategorías desde un
            archivo Excel o CSV
          </p>
        </div>
      </div>

      {/* Información del sistema */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="FiInfo" className="text-blue-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              ¿Cómo funciona la importación?
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>
                • <strong>Un solo archivo</strong> para todo el sistema
              </li>
              <li>
                • <strong>Nombres intuitivos</strong> en lugar de IDs técnicos
              </li>
              <li>
                • <strong>Creación automática</strong> de marcas, categorías y
                subcategorías
              </li>
              <li>
                • <strong>Campos opcionales</strong> como peso, dimensiones e
                imagen
              </li>
              <li>
                • <strong>Características y aplicaciones</strong> separadas por
                punto y coma (;)
              </li>
              <li>
                • <strong>Accesorios</strong> separados por punto y coma (;) -
                SKUs de productos accesorios
              </li>
              <li>
                • <strong>Productos relacionados</strong> separados por punto y
                coma (;) - SKUs con tipos de relación
              </li>
              <li>
                • <strong>Validación automática</strong> de datos antes de
                importar
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Descarga de plantilla */}
      <Card className="p-6">
        <Heading level={3} className="mb-4">
          Paso 1: Descargar Plantilla
        </Heading>
        <p className="text-secondary-600 dark:text-secondary-400 mb-4">
          Descarga la plantilla simplificada o exporta los productos actuales
          del sistema. Solo necesitas llenar los campos básicos y el sistema se
          encargará del resto.
          <strong>
            Las características y aplicaciones se separan con punto y coma (;)
          </strong>
          . Los <strong>accesorios</strong> son SKUs de productos que
          complementan el producto principal, y los{" "}
          <strong>productos relacionados</strong> se especifican como "SKU:Tipo"
          separados por punto y coma.
        </p>

        {/* Nota sobre accesorios y productos relacionados */}
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <Icon
              name="FiInfo"
              className="text-yellow-600 mt-1 flex-shrink-0"
            />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-2">
                📋 Formato para Accesorios y Productos Relacionados:
              </p>
              <ul className="space-y-1">
                <li>
                  • <strong>Accesorios:</strong> Solo SKUs (ej:
                  "SKU1;SKU2;SKU3")
                </li>
                <li>
                  • <strong>Productos Relacionados:</strong> Formato "SKU:Tipo"
                  separados por punto y coma (ej:
                  "SKU1:Complementario;SKU2:Alternativo")
                </li>
                <li>
                  • Los productos referenciados deben existir en el sistema o
                  ser creados en la misma importación
                </li>
                <li>
                  • <strong>Tipos comunes:</strong> Complementario, Alternativo,
                  Similar, Reemplazo, Compatible, Potencia superior, Potencia
                  inferior
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={downloadTemplate} variant="outline">
            <Icon name="FiDownload" className="mr-2" />
            Descargar Plantilla con Accesorios y Relacionados
          </Button>

          <Button
            onClick={downloadCurrentData}
            variant="outline"
            disabled={exporting}
            className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700 hover:text-green-800"
          >
            {exporting ? (
              <>
                <Loader size="sm" variant="spinner" className="mr-2" />
                Exportando...
              </>
            ) : (
              <>
                <Icon name="FiDatabase" className="mr-2" />
                Exportar Completo (1 Llamada)
              </>
            )}
          </Button>

          <Button
            onClick={() => downloadCurrentDataBasic()}
            variant="outline"
            disabled={exporting}
            className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 hover:text-blue-800"
          >
            <Icon name="FiDatabase" className="mr-2" />
            Solo Datos Básicos
          </Button>
        </div>

        {/* Nota sobre la exportación completa */}
        <div className="mt-2 text-xs text-secondary-600 dark:text-secondary-400">
          ⚡ <strong>Data Actual:</strong> Incluye características,
          aplicaciones, accesorios y productos relacionados (muy eficiente - una
          sola llamada).
          <br />⚡ <strong>Solo Datos Básicos:</strong> Solo información básica
          de productos (más rápido).
        </div>

        {/* Nota sobre cuándo usar cada botón */}
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Icon name="FiInfo" className="text-blue-600 mt-1 flex-shrink-0" />
            <div className="text-xs text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">💡 ¿Cuándo usar cada botón?</p>
              <ul className="space-y-1">
                <li>
                  • <strong>Plantilla:</strong> Para crear nuevos productos
                  desde cero
                </li>
                <li>
                  • <strong>Data Actual:</strong> Para ver productos existentes
                  con características, aplicaciones, accesorios y relacionados
                </li>
                <li>
                  • <strong>Solo Datos Básicos:</strong> Para respaldos rápidos
                  o cuando los endpoints de características no funcionen
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ejemplos de formato */}
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-2">
            <Icon
              name="FiCheckCircle"
              className="text-green-600 mt-1 flex-shrink-0"
            />
            <div className="text-sm text-green-800 dark:text-green-200">
              <p className="font-medium mb-2">
                ✅ Ejemplos de formato correcto:
              </p>
              <div className="space-y-2">
                <div>
                  <strong>Accesorios:</strong>
                  <code className="block bg-white dark:bg-secondary-800 px-2 py-1 rounded text-xs mt-1">
                    SIEMENS-3RT1015-1BB42;SIEMENS-3RT1015-1BB43
                  </code>
                </div>
                <div>
                  <strong>Productos Relacionados:</strong>
                  <code className="block bg-white dark:bg-secondary-800 px-2 py-1 rounded text-xs mt-1">
                    SIEMENS-3RT1015-1BB44:Complementario;SIEMENS-3RT1015-1BB45:Alternativo
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Subida de archivo */}
      <Card className="p-6">
        <Heading level={3} className="mb-4">
          Paso 2: Subir Archivo
        </Heading>
        <div className="space-y-4">
          <Input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            label="Seleccionar archivo"
            helperText="Formatos soportados: CSV, Excel (.xlsx, .xls)"
          />

          {file && (
            <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="FiFile" className="text-primary-500" />
                <span className="font-medium">{file.name}</span>
                <span className="text-sm text-secondary-500">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Previsualización */}
      {loading && (
        <Card className="p-6">
          <div className="text-center">
            <Loader size="lg" variant="spinner" text="Procesando archivo..." />
          </div>
        </Card>
      )}

      {/* Errores de validación */}
      {validationErrors.length > 0 && (
        <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <Heading level={3} className="mb-4 text-red-800 dark:text-red-200">
            Errores de Validación ({validationErrors.length})
          </Heading>
          <div className="space-y-2">
            {validationErrors.map((error, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300"
              >
                <Icon
                  name="FiAlertCircle"
                  className="text-red-500 flex-shrink-0"
                />
                <span>{error}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            Corrige estos errores en tu archivo y vuelve a subirlo para
            continuar.
          </p>
        </Card>
      )}

      {/* Previsualización de datos */}
      {previewData && (
        <Card className="p-6">
          <Heading level={3} className="mb-4">
            Paso 3: Previsualización y Validación
          </Heading>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            Revisa los datos antes de importar. El sistema validará y creará
            automáticamente las entidades necesarias.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead className="bg-secondary-50 dark:bg-secondary-800">
                <tr>
                  {Object.keys(previewData[0]).map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-700">
                {previewData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white break-words"
                      >
                        {value || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="FiCheckCircle" className="text-green-500" />
              <span className="text-sm text-green-700 dark:text-green-300">
                <strong>{previewData.length} productos</strong> listos para
                importar. El sistema creará automáticamente{" "}
                <strong>marcas</strong>, <strong>categorías</strong>,{" "}
                <strong>subcategorías</strong>, <strong>características</strong>
                , <strong>aplicaciones</strong>, <strong>accesorios</strong> y{" "}
                <strong>productos relacionados</strong> según sea necesario.
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Mensajes */}
      {message.text && (
        <Card
          className={`p-4 ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              name={
                message.type === "success" ? "FiCheckCircle" : "FiAlertCircle"
              }
              className={
                message.type === "success" ? "text-green-500" : "text-red-500"
              }
            />
            <span
              className={`text-sm ${
                message.type === "success"
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              {message.text}
            </span>
          </div>
        </Card>
      )}

      {/* Botón de importación */}
      {previewData && canImport && (
        <Card className="p-6">
          <Heading level={3} className="mb-4">
            Paso 4: Importar Datos
          </Heading>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            Una vez que hayas revisado los datos, haz clic en el botón para
            comenzar la importación inteligente.
          </p>

          <Button
            onClick={handleImport}
            disabled={importing}
            className="w-full md:w-auto"
            size="lg"
          >
            {importing ? (
              <>
                <Loader size="sm" variant="spinner" className="mr-2" />
                Importando datos...
              </>
            ) : (
              <>
                <Icon name="FiUpload" className="mr-2" />
                Importar Datos del Sistema
              </>
            )}
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ImportData;
