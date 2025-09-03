import React, { useState, useRef } from "react";
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

  // Nuevos estados para la barra de progreso y control de subida
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle"); // 'idle', 'uploading', 'processing', 'success', 'error'
  const [uploadAbortController, setUploadAbortController] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage({ type: "", text: "" });
      setPreviewData(null);
      setValidationErrors([]);
      setCanImport(false);
      setUploadProgress(0);
      setUploadStatus("idle");

      // Procesar archivo para previsualización
      handleFilePreview(selectedFile);
    }
  };

  const handleFilePreview = async (selectedFile) => {
    setLoading(true);
    setUploadStatus("uploading");
    setUploadProgress(10);
    console.log("Iniciando subida - Estado:", "uploading", "Progreso:", 10);

    try {
      console.log("Previewing file:", selectedFile);

      // Crear un AbortController para poder cancelar la operación
      const abortController = new AbortController();
      setUploadAbortController(abortController);

      setUploadProgress(25);
      console.log("Progreso actualizado:", 25);

      const response = await importEndpoints.previewImportData(selectedFile);

      if (response.success) {
        setUploadProgress(75);
        console.log("Progreso actualizado:", 75);
        setPreviewData(response.data.preview);
        setValidationErrors(response.data.validation_errors || []);
        setCanImport(response.data.can_import);
        setUploadProgress(100);
        setUploadStatus("success");
        console.log("Subida completada - Estado:", "success", "Progreso:", 100);

        if (
          response.data.validation_errors &&
          response.data.validation_errors.length > 0
        ) {
          setMessage({
            type: "warning",
            text: `Archivo procesado correctamente. Se encontraron ${response.data.validation_errors.length} errores de validación. Revisa los datos antes de importar.`,
          });
        } else {
          setMessage({
            type: "success",
            text: `¡Archivo subido y procesado exitosamente! ${response.data.total_rows} productos encontrados y listos para importar.`,
          });
        }
      } else {
        setUploadStatus("error");
        setMessage({
          type: "error",
          text: response.error || "Error al procesar el archivo",
        });
      }
    } catch (error) {
      console.error("Error procesando archivo:", error);
      setUploadStatus("error");

      if (error.name === "AbortError") {
        setMessage({
          type: "info",
          text: "Subida cancelada por el usuario.",
        });
      } else {
        setMessage({
          type: "error",
          text:
            error.message ||
            "Error al procesar el archivo. Verifica que sea un archivo Excel válido.",
        });
      }
    } finally {
      setLoading(false);
      setUploadAbortController(null);
    }
  };

  const handleImport = async () => {
    if (!file || !canImport) return;

    setImporting(true);
    setUploadStatus("processing");
    setUploadProgress(0);

    try {
      setUploadProgress(25);
      setMessage({
        type: "info",
        text: "Procesando datos del archivo...",
      });

      const response = await importEndpoints.importSystemData(file);

      if (response.success) {
        const results = response.data;
        setUploadProgress(75);
        setUploadStatus("success");

        setMessage({
          type: "success",
          text: `¡Importación completada exitosamente! ${
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
        setUploadProgress(0);
        setUploadStatus("idle");

        // Recargar datos del sistema
        if (onRefresh) {
          onRefresh();
        }
      } else {
        setUploadStatus("error");
        setMessage({
          type: "error",
          text: response.error || "Error durante la importación",
        });
      }
    } catch (error) {
      console.error("Error importando datos:", error);
      setUploadStatus("error");
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

  const cancelUpload = () => {
    if (uploadAbortController) {
      uploadAbortController.abort();
    }

    // Limpiar estado
    setFile(null);
    setPreviewData(null);
    setValidationErrors([]);
    setCanImport(false);
    setUploadProgress(0);
    setUploadStatus("idle");
    setMessage({ type: "", text: "" });

    // Limpiar el input de archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreviewData(null);
    setValidationErrors([]);
    setCanImport(false);
    setUploadProgress(0);
    setUploadStatus("idle");
    setMessage({ type: "", text: "" });

    // Limpiar el input de archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <Button onClick={downloadTemplate} variant="outline">
            <Icon name="FiDownload" className="mr-2" />
            Descargar Plantilla
          </Button>

          <Button
            onClick={downloadCurrentData}
            disabled={exporting}
            className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700 hover:text-green-800"
          >
            {exporting ? (
              <>
                <Loader
                  size="sm"
                  variant="spinner"
                  className="mr-2"
                  text="Exportando..."
                />
              </>
            ) : (
              <>
                <Icon name="FiDatabase" className="mr-2" />
                Exportar base actual
              </>
            )}
          </Button>
        </div>

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
            accept=".xlsx"
            onChange={handleFileChange}
            label="Seleccionar archivo"
            helperText="Formato soportado: Excel (.xlsx)"
            ref={fileInputRef}
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

          {/* Barra de progreso y controles */}
          {uploadStatus !== "idle" && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="FiInfo" className="text-blue-500 flex-shrink-0" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Estado de la subida
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400 ml-auto">
                  {uploadStatus} - {uploadProgress}%
                </span>
              </div>

              <div className="space-y-4">
                {/* Barra de progreso visual mejorada */}
                <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 relative overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ease-out relative ${
                      uploadStatus === "uploading"
                        ? "bg-blue-600"
                        : uploadStatus === "processing"
                        ? "bg-green-600"
                        : uploadStatus === "success"
                        ? "bg-green-600"
                        : uploadStatus === "error"
                        ? "bg-red-600"
                        : "bg-gray-600"
                    }`}
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {/* Efecto de brillo animado para uploading */}
                    {uploadStatus === "uploading" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                    )}
                  </div>
                  {/* Texto de progreso superpuesto */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white drop-shadow-sm">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>

                {/* Estado y progreso */}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    {uploadStatus === "uploading" && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    )}
                    {uploadStatus === "processing" && (
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                    )}
                    {uploadStatus === "success" && (
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    )}
                    {uploadStatus === "error" && (
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    )}
                    <span
                      className={`font-medium ${
                        uploadStatus === "uploading"
                          ? "text-blue-600 dark:text-blue-400"
                          : uploadStatus === "processing"
                          ? "text-green-600 dark:text-green-400"
                          : uploadStatus === "success"
                          ? "text-green-600 dark:text-green-400"
                          : uploadStatus === "error"
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {uploadStatus === "uploading" && "Subiendo archivo..."}
                      {uploadStatus === "processing" && "Procesando datos..."}
                      {uploadStatus === "success" && "¡Completado!"}
                      {uploadStatus === "error" && "Error detectado"}
                    </span>
                  </div>
                  <span className="text-secondary-600 dark:text-secondary-400 font-mono">
                    {uploadProgress}%
                  </span>
                </div>

                {/* Botones de control */}
                {uploadStatus === "uploading" && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={cancelUpload}
                      disabled={importing}
                    >
                      <Icon name="FiX" className="mr-2" />
                      Cancelar Subida
                    </Button>
                    <Button onClick={resetUpload} disabled={importing}>
                      <Icon name="FiRefreshCw" className="mr-2" />
                      Reintentar
                    </Button>
                  </div>
                )}

                {uploadStatus === "error" && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={resetUpload}>
                      <Icon name="FiRefreshCw" className="mr-2" />
                      Reintentar
                    </Button>
                    <Button onClick={cancelUpload}>
                      <Icon name="FiX" className="mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
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
                <Loader
                  size="sm"
                  variant="spinner"
                  className="mr-2"
                  text="Importando datos..."
                />
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
