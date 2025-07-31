// Servicio para manejar imágenes con fallbacks confiables
export const getImageUrl = (imageName, size = '300x300') => {
  // Si ya es una URL completa, la devolvemos tal como está
  if (imageName && (imageName.startsWith('http://') || imageName.startsWith('https://'))) {
    return imageName;
  }

  // Si no hay imagen, usamos un fallback local
  if (!imageName) {
    return null; // Esto activará el fallback del componente ImageWithFallback
  }

  // Para desarrollo, usamos un servicio más confiable
  // Puedes cambiar esto por tu propio CDN o servicio de imágenes
  const baseUrl = 'https://picsum.photos';
  const seed = imageName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  return `${baseUrl}/${size}?random=${seed}`;
};

// Función para generar imágenes de placeholder más confiables
export const getPlaceholderUrl = (text, size = '300x300') => {
  const encodedText = encodeURIComponent(text || 'Producto');
  return `https://dummyimage.com/${size}/f0f0f0/666666.png&text=${encodedText}`;
};

// Función para validar si una URL de imagen es válida
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}; 