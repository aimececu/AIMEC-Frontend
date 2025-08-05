// =====================================================
// SERVICIO DE TRANSFORMACIÓN DE DATOS
// =====================================================

// Transformar producto del backend al formato del frontend
export const transformProduct = (product) => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    short_description: product.short_description,
    price: parseFloat(product.price),
    originalPrice: product.original_price ? parseFloat(product.original_price) : null,
    stock: product.stock_quantity || 0,
    image: product.main_image || product.additional_images?.[0] || null,
    rating: 4.5, // Por defecto, ya que no tenemos rating en el backend
    
    // Extraer datos de las relaciones
    category: product.category?.name || '',
    category_id: product.category_id,
    subcategory: product.subcategory?.name || '',
    subcategory_id: product.subcategory_id,
    brand: product.brand?.name || '',
    brand_id: product.brand_id,
    series: product.series?.name || '',
    series_id: product.series_id,
    
    // Especificaciones transformadas
    specifications: transformSpecifications(product.specifications),
    
    // Información adicional
    is_featured: product.is_featured || false,
    is_active: product.is_active !== false,
    sku: product.sku,
    weight: product.weight,
    dimensions: product.dimensions,
    warranty_months: product.warranty_months,
    lead_time_days: product.lead_time_days,
    
    // Imágenes adicionales
    additional_images: product.additional_images || [],
    
    // Meta información
    meta_title: product.meta_title,
    meta_description: product.meta_description,
    meta_keywords: product.meta_keywords
  };
};

// Transformar especificaciones del backend al formato del frontend
export const transformSpecifications = (specifications = []) => {
  if (!Array.isArray(specifications)) return {};
  
  const transformed = {};
  
  specifications.forEach(spec => {
    const specType = spec.specificationType;
    if (!specType) return;
    
    const key = specType.name;
    let value = null;
    
    // Obtener el valor según el tipo de dato
    if (spec.value_text) value = spec.value_text;
    else if (spec.value_number !== null) value = parseFloat(spec.value_number);
    else if (spec.value_boolean !== null) value = spec.value_boolean;
    else if (spec.value_json) value = spec.value_json;
    
    // Agregar unidad si existe
    if (specType.unit && value !== null) {
      value = `${value} ${specType.unit}`;
    }
    
    transformed[key] = value;
  });
  
  return transformed;
};

// Transformar categoría del backend al formato del frontend
export const transformCategory = (category) => {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    image: category.image,
    icon: category.icon,
    color: category.color,
    sort_order: category.sort_order,
    is_active: category.is_active !== false,
    
    // Subcategorías transformadas
    subcategories: (category.subcategories || []).map(transformSubcategory),
    
    // Productos transformados (si se incluyen)
    products: (category.products || []).map(transformProduct)
  };
};

// Transformar subcategoría del backend al formato del frontend
export const transformSubcategory = (subcategory) => {
  return {
    id: subcategory.id,
    name: subcategory.name,
    description: subcategory.description,
    image: subcategory.image,
    category_id: subcategory.category_id,
    sort_order: subcategory.sort_order,
    is_active: subcategory.is_active !== false
  };
};

// Transformar marca del backend al formato del frontend
export const transformBrand = (brand) => {
  return {
    id: brand.id,
    name: brand.name,
    description: brand.description,
    logo_url: brand.logo_url,
    website: brand.website,
    country: brand.country,
    founded_year: brand.founded_year,
    sort_order: brand.sort_order,
    is_active: brand.is_active !== false,
    
    // Productos transformados (si se incluyen)
    products: (brand.products || []).map(transformProduct)
  };
};

// Transformar lista de productos
export const transformProductsList = (response) => {
  if (!response.success) return { products: [], total: 0 };
  
  const products = Array.isArray(response.data) 
    ? response.data.map(transformProduct)
    : response.data.products?.map(transformProduct) || [];
  
  return {
    products,
    total: response.data.total || products.length,
    limit: response.data.limit,
    offset: response.data.offset
  };
};

// Transformar lista de categorías
export const transformCategoriesList = (response) => {
  if (!response.success) return [];
  
  const categories = Array.isArray(response.data) 
    ? response.data.map(transformCategory)
    : [];
  
  return categories;
};

// Transformar lista de marcas
export const transformBrandsList = (response) => {
  if (!response.success) return [];
  
  const brands = Array.isArray(response.data) 
    ? response.data.map(transformBrand)
    : [];
  
  return brands;
}; 