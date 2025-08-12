import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Heading from '../../../components/ui/Heading';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import Input from '../../../components/ui/Input';
import Loader from '../../../components/ui/Loader';
import { importEndpoints } from '../../../api/endpoints/import';

const ImportData = ({ onRefresh }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [validationErrors, setValidationErrors] = useState([]);
  const [canImport, setCanImport] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage({ type: '', text: '' });
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
      const response = await importEndpoints.previewImportData(selectedFile);
      
      if (response.success) {
        setPreviewData(response.data.preview);
        setValidationErrors(response.data.validation_errors || []);
        setCanImport(response.data.can_import);
        
        if (response.data.validation_errors && response.data.validation_errors.length > 0) {
          setMessage({ 
            type: 'error', 
            text: `Se encontraron ${response.data.validation_errors.length} errores de validación. Revisa los datos antes de importar.` 
          });
        } else {
          setMessage({ 
            type: 'success', 
            text: `Archivo procesado correctamente. ${response.data.total_rows} filas encontradas.` 
          });
        }
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al procesar el archivo' });
      }
    } catch (error) {
      console.error('Error procesando archivo:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al procesar el archivo. Verifica que sea un archivo CSV válido.' 
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
          type: 'success', 
          text: `Importación completada exitosamente. ${results.products_created} productos creados, ${results.products_updated} actualizados.` 
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
        setMessage({ type: 'error', text: response.error || 'Error durante la importación' });
      }
    } catch (error) {
      console.error('Error importando datos:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error durante la importación. Verifica la conexión y vuelve a intentar.' 
      });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    // CSV simplificado con nombres intuitivos
    const csvContent = `sku,nombre,descripcion,marca,categoria,subcategoria,precio,stock,stock_minimo,peso,dimensiones,imagen
SIEMENS-3RT1015-1BB41,Contacto auxiliar 3RT1015-1BB41,Contacto auxiliar normalmente abierto para contactores Siemens,Siemens,Contactores,Contactos auxiliares,25.50,100,10,0.5,50x30x20,https://example.com/siemens-contact.jpg
ABB-1SBL123001R1000,Interruptor automático ABB 1SBL123001R1000,Interruptor automático de 1000A para distribución,ABB,Interruptores,Interruptores automáticos,1250.00,25,5,15.2,200x150x100,https://example.com/abb-breaker.jpg`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_productos_simplificada.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>Importar Datos</Heading>
          <p className="text-secondary-600 dark:text-secondary-400">
            Importa productos, marcas, categorías y subcategorías desde un archivo Excel o CSV
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
              <li>• <strong>Un solo archivo</strong> para todo el sistema</li>
              <li>• <strong>Nombres intuitivos</strong> en lugar de IDs técnicos</li>
              <li>• <strong>Creación automática</strong> de marcas, categorías y subcategorías</li>
              <li>• <strong>Campos opcionales</strong> como peso, dimensiones e imagen</li>
              <li>• <strong>Validación automática</strong> de datos antes de importar</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Descarga de plantilla */}
      <Card className="p-6">
        <Heading level={3} className="mb-4">Paso 1: Descargar Plantilla</Heading>
        <p className="text-secondary-600 dark:text-secondary-400 mb-4">
          Descarga la plantilla simplificada. Solo necesitas llenar los campos básicos y el sistema se encargará del resto.
        </p>
        <Button onClick={downloadTemplate} variant="outline">
          <Icon name="FiDownload" className="mr-2" />
          Descargar Plantilla Simplificada
        </Button>
      </Card>

      {/* Subida de archivo */}
      <Card className="p-6">
        <Heading level={3} className="mb-4">Paso 2: Subir Archivo</Heading>
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
              <div key={index} className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                <Icon name="FiAlertCircle" className="text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            Corrige estos errores en tu archivo y vuelve a subirlo para continuar.
          </p>
        </Card>
      )}

      {/* Previsualización de datos */}
      {previewData && (
        <Card className="p-6">
          <Heading level={3} className="mb-4">Paso 3: Previsualización y Validación</Heading>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            Revisa los datos antes de importar. El sistema validará y creará automáticamente las entidades necesarias.
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
                        {value || '-'}
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
                <strong>{previewData.length} productos</strong> listos para importar. 
                El sistema creará automáticamente <strong>marcas</strong>, <strong>categorías</strong> y <strong>subcategorías</strong> según sea necesario.
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Mensajes */}
      {message.text && (
        <Card className={`p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2">
            <Icon 
              name={message.type === 'success' ? 'FiCheckCircle' : 'FiAlertCircle'} 
              className={message.type === 'success' ? 'text-green-500' : 'text-red-500'} 
            />
            <span className={`text-sm ${
              message.type === 'success' 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-red-700 dark:text-red-300'
            }`}>
              {message.text}
            </span>
          </div>
        </Card>
      )}

      {/* Botón de importación */}
      {previewData && canImport && (
        <Card className="p-6">
          <Heading level={3} className="mb-4">Paso 4: Importar Datos</Heading>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            Una vez que hayas revisado los datos, haz clic en el botón para comenzar la importación inteligente.
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
