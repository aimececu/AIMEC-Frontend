// =====================================================
// UTILIDAD PARA PROBAR CONEXIÓN CON EL BACKEND
// =====================================================

import { API_CONFIG } from '../config/api';

export const testBackendConnection = async () => {
  try {
    console.log('🔍 Probando conexión con el backend...');
    console.log(`📍 URL: ${API_CONFIG.BASE_URL}`);
    
    const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/health`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Conexión exitosa con el backend');
      console.log('📊 Estado del servidor:', data);
      return true;
    } else {
      console.error('❌ Error en la respuesta del backend:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error de conexión con el backend:', error.message);
    console.log('💡 Verifica que:');
    console.log('   1. El backend esté ejecutándose en http://localhost:3750');
    console.log('   2. La base de datos esté configurada correctamente');
    console.log('   3. No haya errores en la consola del backend');
    return false;
  }
};

export const testApiEndpoints = async () => {
  const endpoints = [
    '/health',
    '/',
    '/categories',
    '/products'
  ];
  
  console.log('🧪 Probando endpoints de la API...');
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${endpoint}: OK`);
      } else {
        console.log(`❌ ${endpoint}: Error ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: Error de conexión`);
    }
  }
};

// Función para ejecutar todas las pruebas
export const runConnectionTests = async () => {
  console.log('🚀 Iniciando pruebas de conexión...\n');
  
  const backendOk = await testBackendConnection();
  
  if (backendOk) {
    console.log('\n📡 Probando endpoints específicos...\n');
    await testApiEndpoints();
  }
  
  console.log('\n✨ Pruebas completadas');
}; 