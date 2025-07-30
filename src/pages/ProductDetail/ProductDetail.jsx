import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiArrowLeft } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import clsx from 'clsx';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Datos de ejemplo - en una app real esto vendría de una API
  const product = {
    id: parseInt(id),
    name: 'Controlador PLC Siemens S7-1200',
    description: 'Controlador lógico programable de alta precisión para automatización industrial. Este PLC ofrece un rendimiento excepcional con procesamiento rápido y múltiples interfaces de comunicación.',
    longDescription: `
      El Siemens S7-1200 es un controlador lógico programable compacto y potente diseñado para aplicaciones de automatización industrial. 
      
      Características principales:
      • CPU con procesador de 32 bits
      • Memoria de programa de hasta 100 KB
      • Hasta 8 módulos de expansión
      • Interfaces de comunicación: PROFINET, RS485
      • Compatible con software TIA Portal
      • Certificaciones de seguridad industrial
      
      Aplicaciones típicas:
      • Control de máquinas industriales
      • Automatización de procesos
      • Sistemas de monitoreo
      • Control de motores y actuadores
    `,
    price: 1299.99,
    originalPrice: 1499.99,
    images: [
      'https://via.placeholder.com/600x400?text=PLC+Front',
      'https://via.placeholder.com/600x400?text=PLC+Side',
      'https://via.placeholder.com/600x400?text=PLC+Back',
      'https://via.placeholder.com/600x400?text=PLC+Connections'
    ],
    category: 'Controladores',
    brand: 'Siemens',
    rating: 4.8,
    reviews: 127,
    stock: 15,
    sku: 'S7-1200-001',
    weight: '0.5 kg',
    dimensions: '120 x 100 x 75 mm',
    warranty: '2 años',
    specifications: {
      'Procesador': '32-bit ARM Cortex-M4',
      'Memoria de Programa': '100 KB',
      'Memoria de Datos': '4 KB',
      'Entradas Digitales': '14',
      'Salidas Digitales': '10',
      'Entradas Analógicas': '2',
      'Salidas Analógicas': '2',
      'Comunicación': 'PROFINET, RS485',
      'Temperatura de Operación': '-20°C a +60°C',
      'Voltaje de Alimentación': '24V DC'
    },
    features: [
      'Procesamiento rápido y eficiente',
      'Interfaces de comunicación múltiples',
      'Programación intuitiva con TIA Portal',
      'Alta confiabilidad industrial',
      'Fácil instalación y configuración',
      'Soporte técnico especializado'
    ]
  };

  const relatedProducts = [
    {
      id: 2,
      name: 'HMI Touch Screen 7"',
      price: 599.99,
      image: 'https://via.placeholder.com/300x300?text=HMI+7inch',
      rating: 4.5
    },
    {
      id: 3,
      name: 'Sensor de Temperatura RTD PT100',
      price: 89.99,
      image: 'https://via.placeholder.com/300x300?text=RTD+PT100',
      rating: 4.6
    },
    {
      id: 4,
      name: 'Servomotor AC 1kW',
      price: 899.99,
      image: 'https://via.placeholder.com/300x300?text=Servo+1kW',
      rating: 4.7
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar 
        key={i} 
        className={clsx(
          'w-4 h-4',
          i < rating ? 'text-yellow-400 fill-current' : 'text-secondary-300'
        )} 
      />
    ));
  };

  const handleAddToCart = () => {
    console.log('Agregar al carrito:', { product, quantity });
  };

  const handleAddToWishlist = () => {
    console.log('Agregar a favoritos:', product);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
            <li>
              <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/catalogo" className="hover:text-primary-600 dark:hover:text-primary-400">
                Catálogo
              </Link>
            </li>
            <li>/</li>
            <li className="text-secondary-900 dark:text-white">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg bg-white dark:bg-secondary-800"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=Producto';
                }}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={clsx(
                    'w-full h-20 rounded-lg overflow-hidden border-2 transition-all duration-200',
                    selectedImage === index
                      ? 'border-primary-500'
                      : 'border-secondary-200 dark:border-secondary-700 hover:border-primary-300'
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x100?text=Producto';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              {renderStars(product.rating)}
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                ({product.rating}) • {product.reviews} reseñas
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-secondary-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.originalPrice > product.price && (
                <span className="text-sm text-green-600 dark:text-green-400">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% de descuento
                </span>
              )}
            </div>

            <p className="text-secondary-600 dark:text-secondary-300 mb-6">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-6">
              <span className={clsx(
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                product.stock > 10
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : product.stock > 0
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              )}>
                {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Sin stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Cantidad
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-secondary-300 dark:border-secondary-600 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-16 h-10 text-center border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center border border-secondary-300 dark:border-secondary-600 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                icon={<FiShoppingCart />}
                className="flex-1"
                disabled={product.stock === 0}
              >
                Agregar al Carrito
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
                icon={<FiHeart />}
                iconOnly
              />
              <Button
                variant="outline"
                onClick={handleShare}
                icon={<FiShare2 />}
                iconOnly
              />
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                <FiTruck className="w-4 h-4" />
                <span>Envío gratis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                <FiShield className="w-4 h-4" />
                <span>{product.warranty} garantía</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                <FiStar className="w-4 h-4" />
                <span>Calidad premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md">
            <div className="border-b border-secondary-200 dark:border-secondary-700">
              <nav className="flex space-x-8 px-6">
                <button className="py-4 px-1 border-b-2 border-primary-500 text-primary-600 dark:text-primary-400 font-medium">
                  Descripción
                </button>
                <button className="py-4 px-1 border-b-2 border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300">
                  Especificaciones
                </button>
                <button className="py-4 px-1 border-b-2 border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300">
                  Reseñas
                </button>
              </nav>
            </div>
            <div className="p-6">
              <div className="prose prose-secondary dark:prose-invert max-w-none">
                <p className="text-secondary-600 dark:text-secondary-300 whitespace-pre-line">
                  {product.longDescription}
                </p>
                
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mt-6 mb-3">
                  Características Destacadas
                </h3>
                <ul className="list-disc list-inside space-y-1 text-secondary-600 dark:text-secondary-300">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
            Productos Relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/producto/${relatedProduct.id}`}
                className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=Producto';
                  }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-secondary-900 dark:text-white mb-2 line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      ${relatedProduct.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1">
                      {renderStars(relatedProduct.rating)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 