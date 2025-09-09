import React, { useState, useRef } from "react";
import Card from "../ui/Card";
import Heading from "../ui/Heading";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Input from "../ui/Input";
import Loader from "../ui/Loader";
import { importEndpoints } from "../../api/endpoints/import";
import { productEndpoints } from "../../api/endpoints/products";
import Modal from "../ui/Modal";
import { useToast } from "../../context/ToastContext";

const ImportData = ({ onRefresh }) => {
  const { showToast } = useToast();
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
  const [clearing, setClearing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
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

    try {
      // Crear un AbortController para poder cancelar la operación
      const abortController = new AbortController();
      setUploadAbortController(abortController);

      setUploadProgress(25);

      const response = await importEndpoints.previewImportData(selectedFile);

      if (response.success) {
        setUploadProgress(75);
        setPreviewData(response.data.preview);
        setValidationErrors(response.data.validation_errors || []);
        setCanImport(response.data.can_import);
        setUploadProgress(100);
        setUploadStatus("success");

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
        showToast(response.error || "Error al procesar el archivo", "error");
      }
    } catch (error) {
      setUploadStatus("error");

      if (error.name === "AbortError") {
        showToast("Subida cancelada por el usuario.", "info");
      } else {
        // Mensaje de error más específico
        let errorMessage = "Error al procesar el archivo. ";

        if (
          error.message &&
          error.message.includes("No se encontró ninguna hoja")
        ) {
          errorMessage +=
            "El archivo Excel no tiene hojas de trabajo. Asegúrate de que el archivo tenga al menos una hoja con datos.";
        } else if (
          error.message &&
          error.message.includes("vacío o corrupto")
        ) {
          errorMessage +=
            "El archivo está vacío o corrupto. Verifica que el archivo no esté dañado.";
        } else if (
          error.message &&
          error.message.includes("no contiene hojas")
        ) {
          errorMessage +=
            "El archivo Excel no contiene hojas de trabajo. Asegúrate de que el archivo tenga al menos una hoja con datos.";
        } else if (error.message && error.message.includes("está vacía")) {
          errorMessage +=
            "La hoja de trabajo está vacía. Asegúrate de que tenga al menos una fila de encabezados y datos.";
        } else {
          errorMessage +=
            "Verifica que sea un archivo Excel válido (.xlsx) y que no esté protegido por contraseña.";
        }

        showToast(errorMessage, "error");
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
        const results = response.results;
        setUploadProgress(75);
        setMessage({
          type: "info",
          text: "Finalizando importación...",
        });

        // Simular un pequeño delay para mostrar el progreso completo
        setTimeout(() => {
          setUploadProgress(100);
          setUploadStatus("success");

          // Mostrar toast de éxito
          showToast(
            `¡Importación completada! ${
              results.products_created
            } productos creados, ${results.products_updated} actualizados. ${
              results.features_created || 0
            } características, ${
              results.applications_created || 0
            } aplicaciones, ${results.accessories_created || 0} accesorios y ${
              results.related_products_created || 0
            } productos relacionados procesados.`,
            "success",
            8000
          );

          // Limpiar estado después de un delay para que se vea el 100%
          setTimeout(() => {
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

            // Actualizar los datos del admin (productos, estadísticas, etc.)
            if (onRefresh) {
              onRefresh();
            }
          }, 2000); // 2 segundos para mostrar el éxito
        }, 500); // 500ms para mostrar el 75% -> 100%
      } else {
        setUploadStatus("error");
        showToast(response.error || "Error durante la importación", "error");
      }
    } catch (error) {
      setUploadStatus("error");
      showToast(
        error.message ||
          "Error durante la importación. Verifica la conexión y vuelve a intentar.",
        "error"
      );
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

  // Limpiar todos los productos
  const handleClearAllProducts = () => {
    setShowConfirmModal(true);
    setConfirmText("");
  };

  const handleConfirmClear = async () => {
    if (confirmText !== "ELIMINAR PRODUCTOS") {
      showToast(
        "Debes escribir exactamente 'ELIMINAR PRODUCTOS' para confirmar la operación.",
        "error"
      );
      return;
    }

    setShowConfirmModal(false);
    setClearing(true);
    setMessage({ type: "info", text: "Eliminando todos los productos..." });

    try {
      const response = await productEndpoints.clearAllProducts();

      if (response.success) {
        // Mostrar toast de éxito
        showToast(
          `✅ ${response.message}. Se eliminaron ${response.data.deleted_count} productos del sistema.`,
          "success",
          6000
        );

        // Actualizar los datos del admin (productos, estadísticas, etc.)
        if (onRefresh) {
          onRefresh();
        }
      } else {
        showToast(response.error || "Error al limpiar productos", "error");
      }
    } catch (error) {
      showToast(
        "Error al limpiar productos. Verifica la conexión y vuelve a intentar.",
        "error"
      );
    } finally {
      setClearing(false);
    }
  };

  const handleCancelClear = () => {
    setShowConfirmModal(false);
    setConfirmText("");
    showToast("Operación de limpieza cancelada.", "info");
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
      console.log(response.data);
      

      if (response.success && response.data) {
        const products = response.data;

        setMessage({
          type: "info",
          text: `Procesando ${products.length} productos para exportación...`,
        });

        // Importar ExcelJS dinámicamente
        const ExcelJS = await import("exceljs");

        // Crear un nuevo workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Productos");

        // Definir las columnas
        worksheet.columns = [
          { header: "SKU", key: "sku", width: 20 },
          { header: "SKU EC", key: "sku_ec", width: 20 },
          { header: "Nombre", key: "nombre", width: 30 },
          { header: "Descripción", key: "descripcion", width: 40 },
          { header: "Marca", key: "marca", width: 15 },
          { header: "Categoria", key: "categoria", width: 20 },
          { header: "Subcategoria", key: "subcategoria", width: 20 },
          { header: "Precio", key: "precio", width: 12 },
          { header: "Stock", key: "stock", width: 10 },
          { header: "Stock Mínimo", key: "stock_minimo", width: 12 },
          { header: "Peso", key: "peso", width: 10 },
          { header: "Dimensiones", key: "dimensiones", width: 15 },
          { header: "Potencia (kW)", key: "potencia_kw", width: 15 },
          { header: "Voltaje", key: "voltaje", width: 15 },
          { header: "Frame Size", key: "frame_size", width: 15 },
          { header: "Corriente", key: "corriente", width: 15 },
          { header: "Comunicación", key: "comunicacion", width: 15 },
          { header: "Alimentación", key: "alimentacion", width: 15 },
          { header: "Imagen", key: "main_image", width: 30 },
          { header: "Características", key: "caracteristicas", width: 50 },
          { header: "Aplicaciones", key: "aplicaciones", width: 50 },
          { header: "Accesorios", key: "accesorios", width: 30 },
          {
            header: "Productos relacionados",
            key: "productos_relacionados",
            width: 40,
          },
        ];

        // Estilizar la fila de encabezados
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE6F3FF" },
        };

        // Agregar los datos
        products.forEach((product) => {
          worksheet.addRow({
            sku: product.sku || "",
            sku_ec: product.sku_ec || "",
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
            potencia_kw: product.potencia_kw || "",
            voltaje: product.voltaje || "",
            frame_size: product.frame_size || "",
            corriente: product.corriente || "",
            comunicacion: product.comunicacion || "",
            alimentacion: product.alimentacion || "",
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
          });
        });

        // Aplicar bordes a todas las celdas con datos
        const rowCount = worksheet.rowCount;
        const colCount = worksheet.columnCount;

        for (let row = 1; row <= rowCount; row++) {
          for (let col = 1; col <= colCount; col++) {
            const cell = worksheet.getCell(row, col);
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          }
        }

        // Generar el archivo Excel
        const buffer = await workbook.xlsx.writeBuffer();

        // Crear y descargar el archivo
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `productos_sistema_${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);

        // Contar productos con datos adicionales
        const productsWithFeatures = products.filter(
          (p) => Array.isArray(p.features) && p.features.length > 0
        ).length;
        const productsWithApplications = products.filter(
          (p) => Array.isArray(p.applications) && p.applications.length > 0
        ).length;
        const productsWithAccessories = products.filter(
          (p) => Array.isArray(p.accessories) && p.accessories.length > 0
        ).length;
        const productsWithRelated = products.filter(
          (p) =>
            Array.isArray(p.related_products) && p.related_products.length > 0
        ).length;

        showToast(
          `Exportación completada exitosamente. ${products.length} productos exportados en formato Excel con todas sus relaciones.`,
          "success",
          6000
        );
      } else {
        setMessage({
          type: "error",
          text: "No se pudieron obtener los productos del sistema.",
        });
      }
    } catch (error) {
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

        setMessage({
          type: "info",
          text: `Exportando datos básicos de ${products.length} productos...`,
        });

        // Preparar datos para CSV (solo información básica)
        const csvData = products.map((product) => {
          return {
            sku: product.sku || "",
            sku_ec: product.sku_ec || "",
            nombre: product.name || "",
            descripcion: product.description || "",
            marca: product.brand?.name || "",
            categoria: product.category?.name || "",
            subcategoria: product.subcategory?.name || "",
            precio: product.price || "",
            stock: product.stock_quantity || "",
            stock_minimo: product.min_stock || "",
            potencia_kw: product.potencia_kw || "",
            corriente: product.corriente || "",
            voltaje: product.voltaje || "",
            frame_size: product.frame_size || "",
            comunicacion: product.comunicacion || "",
            alimentacion: product.alimentacion || "",
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

        showToast(
          `Exportación básica completada. ${csvData.length} productos exportados con información básica.`,
          "success",
          5000
        );
      } else {
        setMessage({
          type: "error",
          text: "No se pudieron obtener los productos del sistema.",
        });
      }
    } catch (error) {
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

      {/* Acciones principales */}
      <Card className="p-6">
        <Heading level={3} className="mb-4">
          Acciones del Sistema
        </Heading>
        <p className="text-secondary-600 dark:text-secondary-400 mb-4">
          Gestiona los datos del sistema: exporta la base actual o limpia todos
          los productos.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={downloadCurrentData}
            disabled={exporting}
            variant="outline"
            mainColor="#10b981"
            textColor="#ffffff"
            className="hover:bg-green-100"
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

          <Button
            onClick={handleClearAllProducts}
            disabled={clearing}
            variant="outline"
            mainColor="#ef4444"
            textColor="#ffffff"
            className="hover:bg-red-100"
          >
            {clearing ? (
              <>
                <Loader
                  size="sm"
                  variant="spinner"
                  className="mr-2"
                  text="Limpiando..."
                />
              </>
            ) : (
              <>
                <Icon name="FiTrash2" className="mr-2" />
                Limpiar productos
              </>
            )}
          </Button>

          <Button onClick={downloadTemplate} variant="outline">
            <Icon name="FiDownload" className="mr-2" />
            Descargar Plantilla
          </Button>
        </div>
      </Card>

      {/* Información de formato */}
      <Card className="p-6">
        <Heading level={3} className="mb-4">
          Formato de Archivo
        </Heading>

        <div className="space-y-4">
          {/* Información básica */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Icon
                name="FiInfo"
                className="text-blue-500 mt-1 flex-shrink-0"
              />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  📋 Requisitos del archivo
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>
                    • <strong>Campos obligatorios:</strong> Solo SKU y Nombre
                  </li>
                  <li>
                    • <strong>Campos opcionales:</strong> Marca, categoría,
                    precio, stock, peso, dimensiones, imagen, etc.
                  </li>
                  <li>
                    • <strong>Creación automática:</strong> Marcas, categorías y
                    subcategorías se crean automáticamente
                  </li>
                  <li>
                    • <strong>Formato:</strong> Archivo Excel (.xlsx) con
                    encabezados en la primera fila
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Formato de campos especiales */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <Icon
                name="FiCheckCircle"
                className="text-green-600 mt-1 flex-shrink-0"
              />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  ✅ Formato de campos especiales
                </h4>
                <div className="text-sm text-green-700 dark:text-green-300 space-y-3">
                  <div>
                    <strong>Características y Aplicaciones:</strong>
                    <p className="text-xs mt-1">Separar con punto y coma (;)</p>
                    <code className="block bg-white dark:bg-secondary-800 px-2 py-1 rounded text-xs mt-1">
                      "Tensión 24V DC;Corriente 10A;Temperatura -25°C a +70°C"
                    </code>
                  </div>

                  <div>
                    <strong>Accesorios:</strong>
                    <p className="text-xs mt-1">
                      Solo SKUs separados por punto y coma (;)
                    </p>
                    <code className="block bg-white dark:bg-secondary-800 px-2 py-1 rounded text-xs mt-1">
                      "SIEMENS-3RT1015-1BB42;SIEMENS-3RT1015-1BB43"
                    </code>
                  </div>

                  <div>
                    <strong>Productos Relacionados:</strong>
                    <p className="text-xs mt-1">
                      Formato "SKU:Tipo" separados por punto y coma (;)
                    </p>
                    <code className="block bg-white dark:bg-secondary-800 px-2 py-1 rounded text-xs mt-1">
                      "SIEMENS-3RT1015-1BB44:Complementario;SIEMENS-3RT1015-1BB45:Alternativo"
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Subida de archivo */}
      <Card className="p-6">
        <Heading level={3} className="mb-4">
          Subir Archivo
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="FiFile" className="text-primary-500" />
                  <span className="font-medium">{file.name}</span>
                  <span className="text-sm text-secondary-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetUpload}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Icon name="FiX" className="mr-1" size="sm" />
                  Eliminar
                </Button>
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
            Previsualización y Validación
          </Heading>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            Revisa los datos antes de importar. El sistema validará y creará
            automáticamente las entidades necesarias.
          </p>

          <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
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

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Icon
                name="FiInfo"
                className="text-blue-500 mt-1 flex-shrink-0"
              />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  📍 ¿Cómo continuar?
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Para importar los datos, busca el botón{" "}
                  <strong>"Importar Datos"</strong> en la
                  <strong>
                    {" "}
                    barra de progreso fija en la parte inferior de la pantalla
                  </strong>
                  . El botón aparecerá cuando el archivo esté listo para
                  importar.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Modal de confirmación para limpiar productos */}
      <Modal
        isOpen={showConfirmModal}
        onClose={handleCancelClear}
        title="🚨 CONFIRMACIÓN FINAL - LIMPIAR PRODUCTOS"
        size="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              onClick={handleCancelClear}
              variant="outline"
              disabled={clearing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmClear}
              variant="danger"
              disabled={clearing || confirmText !== "ELIMINAR PRODUCTOS"}
            >
              {clearing ? (
                <>
                  <Loader
                    size="sm"
                    variant="spinner"
                    className="mr-2"
                    text="Eliminando..."
                  />
                </>
              ) : (
                <>
                  <Icon name="FiTrash2" className="mr-2" />
                  Eliminar Todos los Productos
                </>
              )}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Advertencia principal */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon
                name="FiAlertTriangle"
                className="text-red-500 mt-1 flex-shrink-0"
              />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  ⚠️ ADVERTENCIA CRÍTICA
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Esta acción eliminará <strong>TODOS los productos</strong> del
                  sistema de forma permanente. Esta operación{" "}
                  <strong>NO se puede deshacer</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Información detallada */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-secondary-900 dark:text-white mb-2">
                ¿Qué se eliminará?
              </h4>
              <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1 ml-4">
                <li>• Todos los productos activos del sistema</li>
                <li>• Sus características y aplicaciones</li>
                <li>
                  • Sus relaciones con accesorios y productos relacionados
                </li>
                <li>• Toda la información de inventario</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-secondary-900 dark:text-white mb-2">
                ¿Qué NO se eliminará?
              </h4>
              <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1 ml-4">
                <li>• Marcas, categorías y subcategorías</li>
                <li>• Usuarios y configuraciones del sistema</li>
                <li>• Cotizaciones y órdenes existentes</li>
              </ul>
            </div>
          </div>

          {/* Campo de confirmación */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Para confirmar esta operación, escribe exactamente:
              </label>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
                <code className="text-lg font-mono font-bold text-yellow-800 dark:text-yellow-200">
                  ELIMINAR PRODUCTOS
                </code>
              </div>
            </div>

            <Input
              value={confirmText}
              onChange={(value) => setConfirmText(value)}
              placeholder="Escribe 'ELIMINAR PRODUCTOS' aquí"
              className="text-center font-mono text-lg"
            />

            {confirmText && confirmText !== "ELIMINAR PRODUCTOS" && (
              <p className="text-sm text-red-600 dark:text-red-400">
                ❌ El texto no coincide. Debes escribir exactamente "ELIMINAR
                PRODUCTOS"
              </p>
            )}

            {confirmText === "ELIMINAR PRODUCTOS" && (
              <p className="text-sm text-green-600 dark:text-green-400">
                ✅ Texto correcto. Puedes proceder con la eliminación.
              </p>
            )}
          </div>

          {/* Recomendación final */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon
                name="FiInfo"
                className="text-blue-500 mt-1 flex-shrink-0"
              />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  💡 Recomendación
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Si no estás seguro, cancela esta operación y exporta primero
                  los datos actuales para tener una copia de respaldo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Barra de progreso fija en la parte inferior */}
      {uploadStatus !== "idle" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Información del estado */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {uploadStatus === "uploading" && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                  {uploadStatus === "processing" && (
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  )}
                  {uploadStatus === "success" && (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                  {uploadStatus === "error" && (
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  )}

                  <span
                    className={`text-sm font-medium whitespace-nowrap ${
                      uploadStatus === "uploading"
                        ? "text-blue-600 dark:text-blue-400"
                        : uploadStatus === "processing"
                        ? "text-yellow-600 dark:text-yellow-400"
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

                {/* Barra de progreso animada */}
                <div className="flex-1 min-w-0">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ease-out relative ${
                        uploadStatus === "uploading"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : uploadStatus === "processing"
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                          : uploadStatus === "success"
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : uploadStatus === "error"
                          ? "bg-gradient-to-r from-red-500 to-red-600"
                          : "bg-gray-500"
                      }`}
                      style={{ width: `${uploadProgress}%` }}
                    >
                      {/* Efecto de brillo animado para estados activos */}
                      {(uploadStatus === "uploading" ||
                        uploadStatus === "processing") && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-pulse"></div>
                      )}

                      {/* Efecto de ondas para uploading */}
                      {uploadStatus === "uploading" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-60 animate-pulse"></div>
                      )}

                      {/* Efecto de ondas para processing */}
                      {uploadStatus === "processing" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-60 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Porcentaje */}
                <span className="text-sm font-mono font-medium text-secondary-600 dark:text-secondary-400 whitespace-nowrap">
                  {uploadProgress}%
                </span>
              </div>

              {/* Botones de control */}
              <div className="flex items-center gap-2">
                {uploadStatus === "uploading" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelUpload}
                      disabled={importing}
                      className="text-xs px-3 py-1"
                    >
                      <Icon name="FiX" className="mr-1" size="sm" />
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={resetUpload}
                      disabled={importing}
                      className="text-xs px-3 py-1"
                    >
                      <Icon name="FiRefreshCw" className="mr-1" size="sm" />
                      Reintentar
                    </Button>
                  </>
                )}

                {uploadStatus === "error" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetUpload}
                      className="text-xs px-3 py-1"
                    >
                      <Icon name="FiRefreshCw" className="mr-1" size="sm" />
                      Reintentar
                    </Button>
                    <Button
                      size="sm"
                      onClick={cancelUpload}
                      className="text-xs px-3 py-1"
                    >
                      <Icon name="FiX" className="mr-1" size="sm" />
                      Cerrar
                    </Button>
                  </>
                )}

                {uploadStatus === "success" && (
                  <>
                    {previewData && canImport && (
                      <Button
                        size="sm"
                        onClick={handleImport}
                        disabled={importing}
                        className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {importing ? (
                          <>
                            <Loader
                              size="sm"
                              variant="spinner"
                              className="mr-1"
                              text="Importando..."
                            />
                          </>
                        ) : (
                          <>
                            <Icon name="FiUpload" className="mr-1" size="sm" />
                            Importar Datos
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}

                {uploadStatus === "processing" && (
                  <Button size="sm" disabled className="text-xs px-3 py-1">
                    <Loader
                      size="sm"
                      variant="spinner"
                      className="mr-1"
                      text="Procesando..."
                    />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportData;
